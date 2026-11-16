(() => {
  const resourceUrl = new URL('./resources.html', document.currentScript.src).href;
  const skill = window.CANNLearningSkills?.learningPathPlanner;
  const SEARCH_TERMS = ['CANN 基础', 'Ascend C', '算子开发', '算子', 'NPU', 'Qwen3', '推理', '部署', '模型训练', '训练', '微调', '推荐系统', '推荐', 'RAG', '知识库', '教师', '教学大纲', '高校', '竞赛', 'CANNLab', 'Notebook', '性能调优', 'Profiling', 'AI 应用', '社区共建'];
  const roleNames = {
    beginner: '新手开发者', llm: '大模型开发者', operator: '算子开发工程师',
    application: '应用开发工程师', aiapp: 'AI 应用开发者', recommender: '推荐算法工程师',
    teacher: '高校老师', competition: '竞赛选手', community: '社区开发者',
  };
  let resourceIndexPromise;
  let lastTrigger = null;
  let searchRenderVersion = 0;

  const dialog = document.createElement('div');
  dialog.className = 'hub-search-overlay';
  dialog.id = 'hub-search-overlay';
  dialog.hidden = true;
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <section class="hub-search-dialog" role="dialog" aria-modal="true" aria-labelledby="hub-dialog-title">
      <header class="hub-search-dialog-head">
        <div><span class="eyebrow">CANN LEARNING HUB</span><h2 id="hub-dialog-title">搜索课程，或规划学习路径</h2></div>
        <button class="hub-search-close" type="button" data-hub-close aria-label="关闭搜索">×</button>
      </header>
      <div class="hub-search-tabs" role="tablist" aria-label="选择搜索或智能规划">
        <button type="button" role="tab" aria-selected="true" aria-controls="hub-search-panel-search" data-hub-tab="search">课程搜索</button>
        <button type="button" role="tab" aria-selected="false" aria-controls="hub-search-panel-planner" data-hub-tab="planner">智能规划</button>
      </div>
      <section class="hub-search-panel" id="hub-search-panel-search" data-hub-panel="search" role="tabpanel">
        <form class="hub-search-form" id="hub-search-form">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.6" cy="8.6" r="5.6"></circle><path d="m13 13 4 4"></path></svg>
          <input id="hub-search-query" type="search" autocomplete="off" placeholder="搜索课程、技术主题、实践或教学资料" aria-label="搜索学习资料">
          <button type="submit">搜索</button>
        </form>
        <div class="hub-search-results" id="hub-search-results" aria-live="polite"></div>
      </section>
      <section class="hub-search-panel" id="hub-search-panel-planner" data-hub-panel="planner" role="tabpanel" hidden>
        <p class="hub-planner-intro">告诉我你想做什么、目前的基础和学习偏好；智能规划会从学习中心现有课程中组织下一步。</p>
        <form class="hub-planner-form" id="hub-planner-form">
          <label class="hub-field hub-field-wide"><span>学习目标</span><input id="hub-plan-goal" required maxlength="240" placeholder="例如：从零开始开发一个 Ascend C 自定义算子"></label>
          <label class="hub-field"><span>学习角色</span><select id="hub-plan-role"><option value="">帮我判断</option>${Object.entries(roleNames).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}</select></label>
          <label class="hub-field"><span>当前基础</span><select id="hub-plan-level"><option>刚开始接触昇腾</option><option>会 Python 和 NumPy</option><option>有 C / C++ 基础</option><option>有模型训练或推理经验</option><option>熟悉 CANN，想学进阶实践</option></select></label>
          <label class="hub-field hub-field-wide"><span>偏好的学习方式</span><select id="hub-plan-format"><option>课程与在线实践结合</option><option>先看课程和文档</option><option>优先选择 Notebook / CANNLab 实践</option><option>按课程状态安排，建设中的内容放到后续</option></select></label>
          <div class="hub-planner-actions hub-field-wide"><p>目标、角色与基础信息会发送给规划服务；课程只从本资料库选择。</p><button type="submit" id="hub-plan-submit">生成学习路径 <span aria-hidden="true">→</span></button></div>
        </form>
        <div class="hub-plan-result" id="hub-plan-result" aria-live="polite"></div>
      </section>
      <footer class="hub-search-foot"><span>站内搜索检索课程与资料库内容</span><kbd>ESC</kbd><span>关闭</span></footer>
    </section>`;
  document.body.append(dialog);

  const searchInput = dialog.querySelector('#hub-search-query');
  const searchResults = dialog.querySelector('#hub-search-results');
  const plannerForm = dialog.querySelector('#hub-planner-form');
  const planGoal = dialog.querySelector('#hub-plan-goal');
  const planResult = dialog.querySelector('#hub-plan-result');
  const planButton = dialog.querySelector('#hub-plan-submit');
  const roleSelect = dialog.querySelector('#hub-plan-role');

  function clean(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }
  function normalized(text) { return clean(text).toLocaleLowerCase().replace(/[\s\-_/·，,。]+/g, ''); }

  function buildResourceIndex() {
    if (resourceIndexPromise) return resourceIndexPromise;
    resourceIndexPromise = fetch(resourceUrl).then((response) => {
      if (!response.ok) throw new Error('无法读取资料库');
      return response.text();
    }).then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const entries = [];
      const seen = new Set();
      let nextId = 1;
      const titleOf = (root) => clean(root?.querySelector('.resource-section-head h3')?.textContent || root?.closest('.resource-section')?.querySelector(':scope > .resource-section-head h3')?.textContent || '学习资源');
      const add = ({ title, description, category, href, status = '' }) => {
        title = clean(title);
        description = clean(description);
        if (title.length < 2 || /^(查看详情|在线体验|建设中|更多|详情|›|↗)$/.test(title)) return null;
        let finalHref = href || '';
        if (finalHref.startsWith('#')) finalHref = `./resources.html${finalHref}`;
        if (!finalHref || (!/^https:\/\//i.test(finalHref) && !finalHref.startsWith('./') && !finalHref.startsWith('../'))) finalHref = './resources.html#resource-preparation';
        const key = `${normalized(title)}|${finalHref}`;
        if (seen.has(key)) return null;
        seen.add(key);
        const entry = { id: `R${String(nextId++).padStart(4, '0')}`, title, description: description.slice(0, 260), category: clean(category) || '学习资源', href: finalHref, status: clean(status) };
        entries.push(entry);
        return entry;
      };

      doc.querySelectorAll('.resource-card[data-kind]').forEach((card) => {
        const summary = card.querySelector(':scope > .resource-summary');
        if (!summary) return;
        const heading = clean(summary.querySelector('.resource-title')?.textContent);
        if (!heading) return;
        const section = card.closest('.resource-section');
        add({ title: heading, description: summary.querySelector('.resource-description')?.textContent, category: titleOf(section), href: card.id ? `./resources.html#${encodeURIComponent(card.id)}` : `./resources.html#${section?.id || 'resource-preparation'}` });
      });

      doc.querySelectorAll('.course-row').forEach((row) => {
        const title = clean(row.querySelector('.course-name')?.textContent);
        const description = clean(row.querySelector('.course-desc')?.textContent);
        const nameLink = row.querySelector('.course-name a[href]');
        const actionLink = row.querySelector('.course-action a[href]');
        const parentCard = row.closest('.resource-card');
        const section = row.closest('.resource-section');
        add({ title, description, category: parentCard?.querySelector('.resource-title')?.textContent || titleOf(section), href: nameLink?.getAttribute('href') || actionLink?.getAttribute('href') || (parentCard?.id ? `./resources.html#${encodeURIComponent(parentCard.id)}` : `./resources.html#${section?.id || 'resource-preparation'}`), status: row.querySelector('.course-action')?.textContent });
      });

      doc.querySelectorAll('#resource-course-index tbody tr').forEach((row) => {
        const rowText = clean(row.textContent);
        const category = clean(row.cells?.[0]?.textContent) || '课程索引';
        const anchors = [...row.querySelectorAll('a[href]')];
        if (anchors.length) anchors.forEach((anchor) => add({ title: anchor.textContent, description: rowText, category, href: anchor.getAttribute('href') }));
        else if (rowText.length > 5) add({ title: rowText.slice(0, 100), description: rowText, category, href: './resources.html#resource-course-index' });
      });

      doc.querySelectorAll('#resource-teaching-card h2, #resource-teaching-card h3, #resource-teaching-card h4, #resource-community-card h2, #resource-community-card h3, #resource-community-card h4').forEach((heading) => {
        const title = clean(heading.textContent);
        const section = heading.closest('.resource-card');
        add({ title, description: clean(heading.parentElement?.nextElementSibling?.textContent || section?.querySelector('.resource-description')?.textContent), category: titleOf(section?.closest('.resource-section')), href: heading.id ? `./resources.html#${encodeURIComponent(heading.id)}` : `./resources.html#${section?.id || 'resource-teaching-card'}` });
      });

      return entries;
    }).catch((error) => {
      resourceIndexPromise = null;
      throw error;
    });
    return resourceIndexPromise;
  }

  function score(entry, query) {
    const q = normalized(query);
    if (!q) return 0;
    const title = normalized(entry.title);
    const category = normalized(entry.category);
    const description = normalized(entry.description);
    let result = 0;
    if (title === q) result += 30;
    else if (title.includes(q)) result += 18;
    if (category.includes(q)) result += 8;
    if (description.includes(q)) result += 5;
    const words = new Set([
      ...clean(query).toLocaleLowerCase().split(/[\s、，,；;]+/).filter((word) => word.length > 1),
      ...SEARCH_TERMS.filter((term) => normalized(query).includes(normalized(term))),
      ...(clean(query).match(/[a-z0-9]+/gi) || []),
    ]);
    for (const word of words) {
      const term = normalized(word);
      if (title.includes(term)) result += 8;
      if (category.includes(term)) result += 4;
      if (description.includes(term)) result += 2;
    }
    return result;
  }

  function makeResult(entry) {
    const link = document.createElement('a');
    link.className = 'hub-search-result';
    link.href = entry.href;
    if (/^https:\/\//i.test(entry.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    const body = document.createElement('span');
    body.className = 'hub-search-result-body';
    const label = document.createElement('small');
    label.className = 'hub-search-result-category';
    label.textContent = entry.category;
    const title = document.createElement('strong');
    title.textContent = entry.title;
    const description = document.createElement('span');
    description.className = 'hub-search-result-description';
    description.textContent = entry.description || '打开查看相关学习资源。';
    body.append(label, title, description);
    if (entry.status) {
      const status = document.createElement('small');
      status.className = 'hub-search-result-status';
      status.textContent = entry.status;
      body.append(status);
    }
    const arrow = document.createElement('span');
    arrow.className = 'hub-search-result-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    link.append(body, arrow);
    return link;
  }

  async function renderSearch(query) {
    const renderVersion = ++searchRenderVersion;
    if (!query) {
      searchResults.replaceChildren();
      const hint = document.createElement('p');
      hint.className = 'hub-search-hint';
      hint.textContent = '常用搜索';
      const suggestions = document.createElement('div');
      suggestions.className = 'hub-search-suggestions';
      ['CANN 基础', 'Ascend C 算子开发', 'Qwen3 推理', '推荐系统', '高校教学大纲'].forEach((term) => {
        const chip = document.createElement('button');
        chip.type = 'button'; chip.className = 'hub-search-chip'; chip.textContent = term;
        chip.addEventListener('click', () => { searchInput.value = term; renderSearch(term); });
        suggestions.append(chip);
      });
      searchResults.append(hint, suggestions);
      return;
    }
    searchResults.innerHTML = '<p class="hub-search-hint">正在检索课程和资料…</p>';
    try {
      const entries = await buildResourceIndex();
      if (renderVersion !== searchRenderVersion) return;
      const ranked = entries.map((entry) => ({ entry, score: score(entry, query) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
      const results = ranked.slice(0, 12);
      searchResults.replaceChildren();
      if (!results.length) {
        const empty = document.createElement('div');
        empty.className = 'hub-search-empty';
        empty.innerHTML = '<strong>没有找到匹配资料</strong><span>可以换个关键词，或让智能规划根据你的目标推荐课程顺序。</span>';
        const planner = document.createElement('button');
        planner.type = 'button'; planner.className = 'hub-search-empty-action'; planner.textContent = '转到智能规划 →';
        planner.addEventListener('click', () => { planGoal.value = searchInput.value.trim(); setMode('planner'); });
        empty.append(planner); searchResults.append(empty); return;
      }
      const count = document.createElement('p');
      count.className = 'hub-search-count';
      count.textContent = ranked.length > results.length ? `找到 ${ranked.length} 条相关资料，显示前 ${results.length} 条` : `找到 ${results.length} 条相关资料`;
      searchResults.append(count, ...results.map(({ entry }) => makeResult(entry)));
    } catch (error) {
      if (renderVersion !== searchRenderVersion) return;
      searchResults.innerHTML = '<div class="hub-search-empty"><strong>暂时无法读取资料库索引</strong><span>你仍可以打开完整资料库浏览课程。</span><a href="./resources.html#resource-preparation">打开课程与资料库 →</a></div>';
    }
  }

  function setMode(mode) {
    dialog.querySelectorAll('[data-hub-tab]').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.hubTab === mode)));
    dialog.querySelectorAll('[data-hub-panel]').forEach((panel) => { panel.hidden = panel.dataset.hubPanel !== mode; });
    if (mode === 'search') window.setTimeout(() => searchInput.focus(), 30);
    else window.setTimeout(() => planGoal.focus(), 30);
  }

  function openDialog(mode = 'search', query = '', trigger = null) {
    lastTrigger = trigger || document.activeElement;
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('hub-search-open');
    setMode(mode);
    if (query) { searchInput.value = query; renderSearch(query); }
    else if (mode === 'search') renderSearch('');
    const selectedRole = new URLSearchParams(location.search).get('role');
    if (selectedRole && roleNames[selectedRole]) roleSelect.value = selectedRole;
  }

  function closeDialog() {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('hub-search-open');
    lastTrigger?.focus?.();
  }

  function rankForPlan(entries, query, role) {
    const queryText = `${query} ${roleNames[role] || ''}`;
    const top = entries.map((entry) => ({ entry, score: score(entry, queryText) })).sort((a, b) => b.score - a.score).slice(0, 28).map((item) => item.entry);
    const core = entries.filter((entry) => /CANN 基础第一课|大模型训练|大模型推理|算子开发|应用开发|推荐系统/.test(entry.title)).slice(0, 10);
    const merged = new Map([...core, ...top].map((entry) => [entry.id, entry]));
    return [...merged.values()].slice(0, 34);
  }

  function renderPlan(plan) {
    planResult.replaceChildren();
    const article = document.createElement('article');
    article.className = 'hub-generated-plan';
    const top = document.createElement('div'); top.className = 'hub-generated-plan-head';
    const label = document.createElement('small'); label.textContent = 'LEARNING PATH';
    const title = document.createElement('h3'); title.textContent = plan.title;
    const summary = document.createElement('p'); summary.textContent = plan.summary || '按先修关系和当前课程资源整理的学习顺序。';
    top.append(label, title, summary); article.append(top);
    const list = document.createElement('ol'); list.className = 'hub-generated-steps';
    plan.steps.forEach(({ resource, reason }, index) => {
      const item = document.createElement('li');
      const number = document.createElement('span'); number.className = 'hub-generated-step-number'; number.textContent = String(index + 1).padStart(2, '0');
      const content = document.createElement('span'); content.className = 'hub-generated-step-content';
      const titleText = document.createElement('strong'); titleText.textContent = resource.title;
      const meta = document.createElement('small'); meta.textContent = `${resource.category}${resource.status ? ` · ${resource.status}` : ''}`;
      const why = document.createElement('span'); why.textContent = reason || resource.description;
      content.append(titleText, meta, why);
      const link = document.createElement('a'); link.href = resource.href; link.textContent = '查看 →';
      if (/^https:\/\//i.test(resource.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      item.append(number, content, link); list.append(item);
    });
    article.append(list);
    const note = document.createElement('p'); note.className = 'hub-generated-plan-note'; note.textContent = '路线由学习路径规划能力根据当前课程目录生成；打开课程可核对内容与实践状态。';
    article.append(note); planResult.append(article);
  }

  async function generatePlan(event) {
    event.preventDefault();
    if (!skill) { planResult.textContent = '智能规划模块暂不可用，请使用课程搜索。'; return; }
    const goal = clean(planGoal.value);
    if (!goal) { planGoal.focus(); return; }
    planButton.disabled = true;
    planButton.textContent = '正在匹配课程…';
    planResult.innerHTML = '<div class="hub-planner-loading"><span></span><span></span><span></span><p>正在读取课程目录并编排学习顺序</p></div>';
    try {
      const entries = await buildResourceIndex();
      const role = roleSelect.value;
      const catalog = rankForPlan(entries, goal, role);
      const request = skill.buildRequest({ goal, role: roleNames[role], level: dialog.querySelector('#hub-plan-level').value, format: dialog.querySelector('#hub-plan-format').value, resources: catalog });
      if (!catalog.length) throw new Error('课程目录暂不可用');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 45000);
      let response;
      try {
        response = await fetch(request.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: request.system, user: request.user, max_tokens: request.max_tokens }), signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`规划服务返回 ${response.status}`);
      const payload = await response.json();
      const plan = skill.parseResponse(payload.text || payload.output || payload.content, catalog);
      renderPlan(plan);
    } catch (error) {
      planResult.replaceChildren();
      const message = document.createElement('div'); message.className = 'hub-search-empty';
      const title = document.createElement('strong'); title.textContent = '暂时无法生成智能路径';
      const copy = document.createElement('span'); copy.textContent = '课程搜索仍可使用；也可以打开对应角色路线，按资料库中的课程顺序开始。';
      const browse = document.createElement('a'); browse.href = './resources.html#resource-path-details'; browse.textContent = '浏览五条学习主线 →';
      message.append(title, copy, browse); planResult.append(message);
    } finally {
      planButton.disabled = false;
      planButton.innerHTML = '生成学习路径 <span aria-hidden="true">→</span>';
    }
  }

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-hub-search-open]');
    if (opener) { openDialog(opener.dataset.hubSearchMode || 'search', '', opener); return; }
    if (event.target.closest('[data-hub-close]') || event.target === dialog) closeDialog();
    const tab = event.target.closest('[data-hub-tab]');
    if (tab) setMode(tab.dataset.hubTab);
  });
  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-hub-search-inline]')) {
      event.preventDefault(); const input = event.target.querySelector('input'); openDialog('search', input.value.trim(), event.submitter || input); return;
    }
    if (event.target.id === 'hub-search-form') { event.preventDefault(); renderSearch(searchInput.value.trim()); return; }
    if (event.target === plannerForm) generatePlan(event);
  });
  searchInput.addEventListener('input', () => renderSearch(searchInput.value.trim()));
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openDialog('search'); }
    if (event.key === 'Escape' && !dialog.hidden) closeDialog();
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const activeTab = event.target.closest?.('[data-hub-tab]');
      if (activeTab) { event.preventDefault(); const mode = activeTab.dataset.hubTab === 'search' ? 'planner' : 'search'; setMode(mode); dialog.querySelector(`[data-hub-tab="${mode}"]`)?.focus(); }
    }
    if (event.key === 'Tab' && !dialog.hidden) {
      const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]')].filter((node) => !node.closest('[hidden]'));
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
})();
