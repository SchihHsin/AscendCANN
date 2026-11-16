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
  let currentMode = 'search';
  let isBusy = false;
  let requestVersion = 0;

  const pageMount = document.querySelector('[data-hub-assistant-mount]');
  const isHome = Boolean(pageMount);
  const assistantHost = isHome ? pageMount : document.createElement('section');
  if (!isHome) {
    assistantHost.className = 'hub-assistant-dock';
    assistantHost.hidden = true;
    document.querySelector('.topbar')?.insertAdjacentElement('afterend', assistantHost);
  }

  const widget = document.createElement('div');
  widget.className = 'hub-assistant-widget';
  widget.innerHTML = `
    <form class="hub-chat-composer" id="hub-chat-form">
      <label class="hub-sr-only" for="hub-chat-input">搜索课程，或描述你的学习目标</label>
      <textarea id="hub-chat-input" rows="2" maxlength="600" placeholder="搜索课程名称，或描述你要完成的学习目标…"></textarea>
      <div class="hub-chat-toolbar">
        <div class="hub-chat-modes" role="group" aria-label="选择学习助手功能">
          <button type="button" data-hub-mode="search" aria-pressed="true">查找课程</button>
          <button type="button" data-hub-mode="planner" aria-pressed="false">规划路径</button>
        </div>
        <span class="hub-chat-hint"><kbd>Enter</kbd> 发送 · <kbd>Shift + Enter</kbd> 换行</span>
        <button class="hub-chat-send" type="submit" aria-label="发送" title="发送">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V4M5.5 8.5 10 4l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
      </div>
    </form>
    <p class="hub-assistant-helper">可以直接搜课程名称，也可以说“从零开始开发 Ascend C 算子”来生成学习路线。</p>`;
  assistantHost.append(widget);

  const output = document.createElement('section');
  output.className = 'hub-assistant-output';
  output.hidden = true;
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-label', '学习助手回复');
  if (isHome) {
    const hero = pageMount.closest('.hero');
    hero?.insertAdjacentElement('afterend', output);
  } else {
    assistantHost.append(output);
  }

  const chatForm = widget.querySelector('#hub-chat-form');
  const chatInput = widget.querySelector('#hub-chat-input');
  const sendButton = widget.querySelector('.hub-chat-send');

  function clean(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }
  function normalized(text) { return clean(text).toLocaleLowerCase().replace(/[\s\-_/·，,。]+/g, ''); }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

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

  function setMode(mode) {
    currentMode = mode === 'planner' ? 'planner' : 'search';
    widget.querySelectorAll('[data-hub-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.hubMode === currentMode)));
    chatInput.placeholder = currentMode === 'planner'
      ? '告诉我你想学什么、想完成什么，我会从课程资料中为你规划路径…'
      : '搜索课程、技术主题或实践资料…';
    chatInput.setAttribute('aria-label', currentMode === 'planner' ? '描述学习目标' : '搜索课程或学习资料');
  }

  function openAssistant(mode = 'search') {
    lastTrigger = trigger || document.activeElement;
    if (!isHome) {
      assistantHost.hidden = false;
      assistantHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMode(mode);
    window.setTimeout(() => chatInput.focus(), 40);
  }

  function setBusy(busy) {
    isBusy = busy;
    chatInput.disabled = busy;
    sendButton.disabled = busy;
    sendButton.setAttribute('aria-busy', String(busy));
    widget.querySelectorAll('[data-hub-mode]').forEach((button) => { button.disabled = busy; });
    widget.classList.toggle('is-busy', busy);
  }

  function createConversation(prompt) {
    output.replaceChildren();
    output.hidden = false;
    const thread = element('div', 'hub-conversation');
    const userMessage = element('div', 'hub-message hub-message-user');
    userMessage.append(element('span', 'hub-message-label', '你'), element('p', '', prompt));
    const assistantMessage = element('div', 'hub-message hub-message-assistant');
    assistantMessage.append(element('span', 'hub-message-label', 'CANN 学习助手'));
    const body = element('div', 'hub-message-body');
    assistantMessage.append(body);
    thread.append(userMessage, assistantMessage);
    output.append(thread);
    window.setTimeout(() => output.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
    return body;
  }

  function renderLoading(target, label) {
    const loading = element('div', 'hub-assistant-loading');
    loading.append(element('span'), element('span'), element('span'), element('p', '', label));
    target.replaceChildren(loading);
  }

  function makeResult(entry) {
    const link = element('a', 'hub-search-result');
    link.href = entry.href;
    if (/^https:\/\//i.test(entry.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    const body = element('span', 'hub-search-result-body');
    body.append(element('small', 'hub-search-result-category', entry.category), element('strong', '', entry.title), element('span', 'hub-search-result-description', entry.description || '打开查看相关学习资源。'));
    if (entry.status) body.append(element('small', 'hub-search-result-status', entry.status));
    link.append(body, element('span', 'hub-search-result-arrow', '↗'));
    link.querySelector('.hub-search-result-arrow').setAttribute('aria-hidden', 'true');
    return link;
  }

  function showPlannerAction(target, prompt) {
    const action = element('button', 'hub-inline-action', '用智能规划整理学习路径 →');
    action.type = 'button';
    action.addEventListener('click', () => {
      chatInput.value = prompt;
      setMode('planner');
      chatInput.focus();
      chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    target.append(action);
  }

  async function runSearch(prompt, version) {
    const answer = createConversation(prompt);
    renderLoading(answer, '正在搜索课程与资料…');
    try {
      const entries = await buildResourceIndex();
      if (version !== requestVersion) return;
      const ranked = entries.map((entry) => ({ entry, score: score(entry, prompt) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
      answer.replaceChildren();
      if (!ranked.length) {
        answer.append(element('p', 'hub-answer-copy', '没有找到直接匹配的课程。你可以换个说法，或告诉我你的目标，我会从资料库中帮你规划学习顺序。'));
        showPlannerAction(answer, prompt);
        return;
      }
      const results = ranked.slice(0, 8);
      answer.append(element('p', 'hub-answer-copy', ranked.length > results.length ? `找到 ${ranked.length} 条相关资料，先列出最相关的 ${results.length} 条。` : `找到 ${results.length} 条相关资料。`));
      const list = element('div', 'hub-search-results');
      results.forEach(({ entry }) => list.append(makeResult(entry)));
      answer.append(list);
      showPlannerAction(answer, prompt);
    } catch (error) {
      if (version !== requestVersion) return;
      answer.replaceChildren(element('p', 'hub-answer-copy', '暂时无法读取课程索引，请直接浏览完整课程与资料库。'));
      const link = element('a', 'hub-inline-action', '打开课程与资料库 →');
      link.href = './resources.html#resource-preparation';
      answer.append(link);
    } finally {
      if (version === requestVersion) setBusy(false);
    }
  }

  function rankForPlan(entries, query, role) {
    const queryText = `${query} ${roleNames[role] || ''}`;
    const ranked = entries.map((entry) => ({ entry, score: score(entry, queryText) })).sort((a, b) => b.score - a.score).filter((item) => item.score > 0).slice(0, 24).map((item) => item.entry);
    const core = entries.filter((entry) => /CANN 基础第一课|大模型训练|大模型推理|算子开发|应用开发|推荐系统/.test(entry.title)).slice(0, 8);
    return [...new Map([...core, ...ranked].map((entry) => [entry.id, entry])).values()].slice(0, 32);
  }

  function renderPlan(target, plan) {
    const article = element('article', 'hub-generated-plan');
    const head = element('div', 'hub-generated-plan-head');
    head.append(element('small', '', '为你整理的学习路线'), element('h3', '', plan.title), element('p', '', plan.summary || '按目标和课程先后关系整理的学习顺序。'));
    const list = element('ol', 'hub-generated-steps');
    plan.steps.forEach(({ resource, reason }, index) => {
      const item = element('li');
      const number = element('span', 'hub-generated-step-number', String(index + 1).padStart(2, '0'));
      const content = element('span', 'hub-generated-step-content');
      content.append(element('strong', '', resource.title), element('small', '', `${resource.category}${resource.status ? ` · ${resource.status}` : ''}`), element('span', '', reason || resource.description));
      const link = element('a', '', '查看 →');
      link.href = resource.href;
      if (/^https:\/\//i.test(resource.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      item.append(number, content, link);
      list.append(item);
    });
    article.append(head, list, element('p', 'hub-generated-plan-note', '路线只引用当前资料库中的课程；打开课程可核对原始内容与实践状态。'));
    target.replaceChildren(article);
  }

  async function runPlanner(prompt, version) {
    const answer = createConversation(prompt);
    renderLoading(answer, '正在匹配课程并编排学习顺序…');
    try {
      if (!skill) throw new Error('规划模块暂不可用');
      const entries = await buildResourceIndex();
      if (version !== requestVersion) return;
      const role = new URLSearchParams(location.search).get('role') || '';
      const catalog = rankForPlan(entries, prompt, role);
      if (!catalog.length) throw new Error('课程目录暂不可用');
      const request = skill.buildRequest({
        goal: prompt,
        role: roleNames[role] || '尚未说明，请根据目标判断',
        level: '用户未说明；请先给出适合常见基础的路线',
        format: '用户未指定',
        resources: catalog,
      });
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 45000);
      let response;
      try {
        response = await fetch(request.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system: request.system, user: request.user, max_tokens: request.max_tokens }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`规划服务返回 ${response.status}`);
      const payload = await response.json();
      const plan = skill.parseResponse(payload.text || payload.output || payload.content, catalog);
      if (version !== requestVersion) return;
      renderPlan(answer, plan);
    } catch (error) {
      if (version !== requestVersion) return;
      answer.replaceChildren(element('p', 'hub-answer-copy', '智能规划暂时没有连上。你可以继续搜索课程，或从现有学习主线开始。'));
      const link = element('a', 'hub-inline-action', '浏览五条学习主线 →');
      link.href = './resources.html#resource-path-details';
      answer.append(link);
    } finally {
      if (version === requestVersion) setBusy(false);
    }
  }

  async function submitPrompt(event) {
    event.preventDefault();
    if (isBusy) return;
    const prompt = clean(chatInput.value);
    if (!prompt) { chatInput.focus(); return; }
    const version = ++requestVersion;
    setBusy(true);
    if (currentMode === 'planner') await runPlanner(prompt, version);
    else await runSearch(prompt, version);
  }

  function openAssistant(mode = 'search') {
    if (!isHome) {
      assistantHost.hidden = false;
      assistantHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMode(mode);
    window.setTimeout(() => chatInput.focus(), 40);
  }

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-hub-search-open]');
    if (opener) {
      openAssistant(opener.dataset.hubSearchMode || 'search');
      return;
    }
    const modeButton = event.target.closest('[data-hub-mode]');
    if (modeButton) { setMode(modeButton.dataset.hubMode); chatInput.focus(); return; }
  });

  chatForm.addEventListener('submit', submitPrompt);
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 132)}px`;
  });
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openAssistant('search');
    }
  });

})();
