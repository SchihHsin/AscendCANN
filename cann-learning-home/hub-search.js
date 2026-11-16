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
  let isBusy = false;
  let requestVersion = 0;
  let closeTimer = 0;
  let lastTrigger = null;
  let lastOutputScrollTop = 0;

  const pageMount = document.querySelector('[data-hub-assistant-mount]');
  const isHome = Boolean(pageMount);
  const assistantHost = isHome ? pageMount : document.createElement('section');
  if (!isHome) {
    assistantHost.className = 'hub-assistant-dock';
    assistantHost.hidden = true;
    document.querySelector('.topbar')?.insertAdjacentElement('afterend', assistantHost);
  }

  const panel = document.createElement('aside');
  panel.className = 'hub-assistant-panel';
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('aria-label', 'CANN 学习助手');
  panel.innerHTML = `
    <header class="hub-assistant-panel-head">
      <strong>学习助手</strong>
      <button class="hub-assistant-close" type="button" data-hub-assistant-close aria-label="关闭学习助手" title="关闭"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg></button>
    </header>`;
  document.body.append(panel);

  const widget = document.createElement('div');
  widget.className = 'hub-assistant-widget';
  widget.innerHTML = `
    <section class="hub-assistant-output" data-hub-assistant-output hidden aria-live="polite" aria-label="学习助手回复">
      <div class="hub-assistant-welcome">
        <p>搜索一门课程，或说出你想完成的学习目标。</p>
        <div class="hub-assistant-examples">
          <button type="button" data-hub-example="找 CANN 基础课程">找 CANN 基础课程 <span aria-hidden="true">↗</span></button>
          <button type="button" data-hub-example="我想从零开始开发 Ascend C 算子">从零学 Ascend C 算子 <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
    <form class="hub-chat-composer" id="hub-chat-form">
      <label class="hub-sr-only" for="hub-chat-input">搜索课程，或描述你的学习目标</label>
      <textarea id="hub-chat-input" rows="2" maxlength="600" placeholder="搜索课程，或描述你想学会什么…" aria-label="搜索课程，或描述学习目标"></textarea>
      <div class="hub-skill-suggestions" data-hub-skill-suggestions hidden>
        <button type="button" data-hub-skill-select>
          <span class="hub-skill-mark" aria-hidden="true">/</span>
          <span><strong>规划学习路径</strong><small>根据目标，从现有课程中编排学习顺序</small></span>
          <kbd>Enter</kbd>
        </button>
      </div>
      <p class="hub-chat-feedback" data-hub-chat-feedback role="status" hidden></p>
      <div class="hub-chat-toolbar">
        <span class="hub-chat-hint"><kbd>Enter</kbd> 发送 <i>·</i> <kbd>Shift + Enter</kbd> 换行 <i>·</i> 输入 <kbd>/</kbd> 调用路径 Skill</span>
        <button class="hub-chat-send" type="submit" aria-label="发送" title="发送">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
      </div>
    </form>
    <p class="hub-assistant-helper">直接输入目标会自动选择课程检索或学习路径规划。</p>`;
  assistantHost.append(widget);

  const output = widget.querySelector('[data-hub-assistant-output]');
  const chatForm = widget.querySelector('#hub-chat-form');
  const chatInput = widget.querySelector('#hub-chat-input');
  const sendButton = widget.querySelector('.hub-chat-send');
  const skillSuggestions = widget.querySelector('[data-hub-skill-suggestions]');
  const skillSelect = widget.querySelector('[data-hub-skill-select]');
  const feedback = widget.querySelector('[data-hub-chat-feedback]');

  function clean(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }
  function normalized(text) { return clean(text).toLocaleLowerCase().replace(/[\s\-_/·，,。]+/g, ''); }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function scrollConversationToEnd() {
    requestAnimationFrame(() => { output.scrollTop = output.scrollHeight; });
  }
  function scrollConversationToStart(target) {
    const conversation = target.closest('.hub-conversation');
    requestAnimationFrame(() => {
      if (!conversation) { output.scrollTop = output.scrollHeight; return; }
      output.scrollTop = Math.max(0, output.scrollTop + conversation.getBoundingClientRect().top - output.getBoundingClientRect().top - 10);
    });
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
    if (title === q) result += 34;
    else if (title.includes(q)) result += 22;
    if (category.includes(q)) result += 9;
    if (description.includes(q)) result += 5;
    const phrases = SEARCH_TERMS.map(normalized).filter((term) => term.length > 2 && q.includes(term));
    for (const phrase of phrases) {
      if (title.includes(phrase)) result += 22;
      else if (category.includes(phrase)) result += 10;
      else if (description.includes(phrase)) result += 4;
    }
    const stopWords = new Set(['找', '搜', '搜索', '查找', '课程', '教程', '资源', '资料', '学习', '帮我', '一下', '看看']);
    const words = new Set([
      ...clean(query).toLocaleLowerCase().split(/[\s、，,；;]+/).filter((word) => word.length > 1 && !stopWords.has(word)),
      ...(clean(query).match(/[a-z0-9]+/gi) || []),
    ]);
    for (const word of words) {
      const term = normalized(word);
      if (term.length <= 4 && phrases.some((phrase) => phrase.includes(term))) continue;
      if (title.includes(term)) result += 7;
      if (category.includes(term)) result += 3;
      if (description.includes(term)) result += 1;
    }
    return result;
  }

  function searchQueryText(query) {
    const prepared = clean(query)
      .replace(/^(?:请)?(?:搜索|搜一下|查找|找(?:一下|下)?|看看(?:有哪些)?|有哪些)\s*/u, '')
      .replace(/(?:相关)?(?:课程|教程|资源|资料)$/u, '')
      .trim();
    return prepared || clean(query);
  }

  function classifyPrompt(raw) {
    const text = clean(raw);
    const command = text.match(/^\/(?:规划学习路径|学习路径规划|path)(?:\s+|$)/i);
    if (command) {
      return { intent: 'planner', query: text.slice(command[0].length).trim(), explicitSkill: true };
    }
    const searchRequest = /^(?:请)?(?:搜索|搜一下|查找|找(?:一下|下)?(?:课程|教程|资料|资源)|看看(?:有哪些)?|有哪些(?:课程|资料|资源)|(?:课程|资料|资源)(?:在哪里|在哪|链接))/u.test(text);
    if (searchRequest) return { intent: 'search', query: text.replace(/^(?:请)?(?:搜索|搜一下|查找|找(?:一下|下)?|看看(?:有哪些)?|有哪些)\s*/u, '').trim() || text };
    const planRequest = /(?:帮我|为我|请)?(?:规划|制定|编排|安排).{0,18}(?:学习|路径|路线|计划|课程)|(?:生成|创建).{0,14}(?:学习)?(?:路径|路线|计划)|从零(?:开始)?(?:学习|学|入门|开发|完成)|从头(?:开始)?(?:学习|学|开发|完成)|系统(?:地)?学习|我想学会|我想学习|我要学会|带我学习|教我(?:学习|学会)|(?:如何|怎么)学习|学习顺序/u.test(text);
    return { intent: planRequest ? 'planner' : 'search', query: text };
  }

  function openAssistant({ focus = true } = {}) {
    if (closeTimer) window.clearTimeout(closeTimer);
    if (!isHome) assistantHost.hidden = false;
    if (widget.parentElement !== panel) panel.append(widget);
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    if (output.children.length === 0) {
      const welcome = element('div', 'hub-assistant-welcome');
      welcome.append(element('p', '', '搜索一门课程，或说出你想完成的学习目标。'));
      const examples = element('div', 'hub-assistant-examples');
      [['找 CANN 基础课程', '找 CANN 基础课程'], ['从零学 Ascend C 算子', '我想从零开始开发 Ascend C 算子']].forEach(([label, prompt]) => {
        const button = element('button', '', label);
        button.type = 'button';
        button.dataset.hubExample = prompt;
        button.append(element('span', '', '↗'));
        examples.append(button);
      });
      welcome.append(examples);
      output.append(welcome);
    }
    output.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      output.scrollTop = lastOutputScrollTop;
    });
    if (focus) window.setTimeout(() => chatInput.focus(), 60);
  }

  function closeAssistant() {
    if (panel.hidden || !panel.classList.contains('is-open')) return;
    lastOutputScrollTop = output.scrollTop;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      if (panel.classList.contains('is-open')) return;
      assistantHost.append(widget);
      output.hidden = true;
      panel.hidden = true;
      if (!isHome) assistantHost.hidden = true;
      if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
      else chatInput.focus({ preventScroll: true });
    }, 240);
  }

  function setBusy(busy) {
    isBusy = busy;
    chatInput.disabled = busy;
    sendButton.disabled = busy;
    sendButton.setAttribute('aria-busy', String(busy));
    widget.classList.toggle('is-busy', busy);
  }

  function createConversation(prompt) {
    output.hidden = false;
    widget.querySelector('.hub-assistant-welcome')?.remove();
    const thread = element('div', 'hub-conversation');
    const userMessage = element('div', 'hub-message hub-message-user');
    userMessage.append(element('span', 'hub-message-label', '你'), element('p', '', prompt));
    const assistantMessage = element('div', 'hub-message hub-message-assistant');
    assistantMessage.append(element('span', 'hub-message-label', 'CANN 学习助手'));
    const body = element('div', 'hub-message-body');
    assistantMessage.append(body);
    thread.append(userMessage, assistantMessage);
    output.append(thread);
    scrollConversationToEnd();
    return body;
  }

  function renderLoading(target, label) {
    const loading = element('div', 'hub-assistant-loading');
    loading.append(element('span'), element('span'), element('span'), element('p', '', label));
    target.replaceChildren(loading);
    scrollConversationToEnd();
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
    const action = element('button', 'hub-inline-action', '根据这个目标规划学习路径');
    action.type = 'button';
    action.append(element('span', '', '→'));
    action.addEventListener('click', () => sendPrompt(prompt, { intent: 'planner', query: prompt, display: '请根据刚才找到的内容规划学习路径' }));
    target.append(action);
  }

  async function runSearch(prompt, version, displayPrompt) {
    const answer = createConversation(displayPrompt);
    renderLoading(answer, '正在搜索课程与资料…');
    try {
      const entries = await buildResourceIndex();
      if (version !== requestVersion) return;
      const queryForSearch = searchQueryText(prompt);
      const ranked = entries.map((entry) => ({ entry, score: score(entry, queryForSearch) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
      answer.replaceChildren();
      if (!ranked.length) {
        answer.append(element('p', 'hub-answer-copy', '没有找到直接匹配的课程或资料。你可以换个关键词，也可以告诉我想完成什么，我会帮你整理学习顺序。'));
        showPlannerAction(answer, prompt);
        const library = element('a', 'hub-inline-action', '浏览完整课程与资料库');
        library.href = './resources.html#resource-course-index';
        library.append(element('span', '', '↗'));
        answer.append(library);
        scrollConversationToEnd();
        return;
      }
      const results = ranked.slice(0, 5);
      answer.append(element('p', 'hub-answer-copy', ranked.length > results.length ? `找到 ${ranked.length} 条相关资料，先展示最相关的 ${results.length} 项。` : `找到 ${results.length} 条相关资料。`));
      const list = element('div', 'hub-search-results');
      results.forEach(({ entry }) => list.append(makeResult(entry)));
      answer.append(list);
      showPlannerAction(answer, prompt);
      scrollConversationToEnd();
    } catch (error) {
      if (version !== requestVersion) return;
      answer.replaceChildren(element('p', 'hub-answer-copy', '暂时无法读取课程索引，请直接浏览完整课程与资料库。'));
      const link = element('a', 'hub-inline-action', '打开课程与资料库');
      link.href = './resources.html#resource-preparation';
      link.append(element('span', '', '↗'));
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

  function buildCatalogFallback(entries, prompt) {
    const query = clean(prompt);
    const fromZero = /从零|零基础|从头|初学|入门/u.test(query);
    const available = entries.filter((entry) => !/建设中|待建设/u.test(entry.status));
    const find = (pattern) => available.find((entry) => pattern.test(entry.title));
    const steps = [];
    const used = new Set();
    const add = (entry, reason) => {
      if (!entry || used.has(entry.id)) return;
      used.add(entry.id);
      steps.push({ resource: entry, reason });
    };
    const basics = find(/CANN 基础第一课|CANN 基础（第一课）/u);
    const operator = /算子|Ascend\s*C|Kernel/iu.test(query);
    const training = /训练|微调|SFT|强化学习|\bRL\b/iu.test(query);
    const inference = /推理|部署|量化|Profiling/iu.test(query);
    const recommender = /推荐系统|推荐|CTR|召回/iu.test(query);
    const application = /应用开发|ATC|ACL|离线推理/iu.test(query);
    const aiApplication = /RAG|知识库|AI 应用|问答/u.test(query);

    if (fromZero && basics) add(basics, '先建立人工智能、NPU 与 CANN 的共同基础，再进入目标方向。');
    if (operator) {
      add(find(/10 分钟体验自定义算子/u), '先完成第一个自定义算子的编写与编译，认识开发闭环。');
      add(find(/Ascend C 算子开发系列（Kernel 直调版）/u), '系统学习 Ascend C 编程范式、Vector/Cube 与调试调优。');
      add(find(/Ascend C 算子开发系列（算子工程版）/u), '继续掌握工程化开发流程与社区贡献规范。');
    } else if (training) {
      add(find(/SFT 训练系列（初阶）/u), '从可运行的 SFT 案例理解训练流程与性能分析。');
      add(find(/RL 训练系列（初阶）/u), '再实践强化学习训练流程与训练指标观察。');
    } else if (inference) {
      add(find(/Baseline 推理/u), '先在 NPU 上跑通推理，建立可对照的基线。');
      add(find(/Profiling 分析/u), '观察执行过程并定位主要算子瓶颈。');
      add(find(/Dense RMSNorm NPU 融合优化/u), '通过融合优化实践比较调整前后的执行表现。');
    } else if (recommender) {
      add(find(/QuickStart：CTR 预测（DeepFM）/u), '先跑通 CTR 预测的基础推荐流程。');
      add(find(/序列兴趣建模：DIN/u), '继续学习用户历史行为序列与兴趣建模。');
      add(find(/匹配\/召回：DSSM/u), '再进入双塔召回与向量检索。');
      add(find(/DIN 多进程控核推理/u), '最后了解推荐模型在 NPU 上的推理优化。');
    } else if (application) {
      add(find(/环境准备与模型转换/u), '先导出模型并通过 ATC 生成可部署模型。');
      add(find(/ACL 离线推理/u), '用 ACL C++ 程序加载模型并完成推理。');
      add(find(/结果处理与性能调优/u), '最后处理推理结果并调整性能参数。');
    } else if (aiApplication) {
      add(find(/RAG 知识库问答|知识库问答/u), '先搭建检索增强问答的基本链路。');
      add(find(/AI 应用开发/u), '再按 AI 应用开发主线补充相关实践。');
    }

    if (!steps.length && basics) add(basics, '先从 CANN 公共基础课程开始。');
    if (steps.length < 2) {
      const ranked = available.map((entry) => ({ entry, score: score(entry, query) }))
        .sort((a, b) => b.score - a.score)
        .filter(({ entry, score: value }) => value > 0 && !used.has(entry.id));
      ranked.slice(0, Math.max(0, 4 - steps.length)).forEach(({ entry }, index) => {
        add(entry, index === 0 ? '这是当前课程目录中与目标最相关的学习入口。' : '完成前一步后，可继续查看这项相关课程或实践。');
      });
    }
    if (steps.length < 2) return null;

    const title = operator ? '从基础到 Ascend C 算子开发'
      : training ? '大模型训练学习路线'
        : inference ? '大模型推理与优化路线'
          : recommender ? '推荐系统学习路线'
            : application ? '昇腾应用开发路线'
              : aiApplication ? 'AI 应用开发路线' : '根据课程资料整理的学习路线';
    return {
      title,
      summary: '按当前资料库中的先修与实践顺序整理，适合从目标方向继续学习。',
      steps,
      source: 'catalog-fallback',
      retryPrompt: query,
    };
  }

  function renderPlan(target, plan) {
    const article = element('article', 'hub-generated-plan');
    const head = element('div', 'hub-generated-plan-head');
    head.append(element('small', '', `学习路径 · ${plan.steps.length} 个学习节点`), element('h3', '', plan.title), element('p', '', plan.summary || '按目标和课程先后关系整理的学习顺序。'));
    const list = element('ol', 'hub-generated-steps');
    plan.steps.forEach(({ resource, reason }, index) => {
      const item = element('li');
      const number = element('span', 'hub-generated-step-number', String(index + 1).padStart(2, '0'));
      const content = element('span', 'hub-generated-step-content');
      content.append(element('strong', '', resource.title), element('small', '', `${resource.category}${resource.status ? ` · ${resource.status}` : ''}`), element('span', '', reason || resource.description));
      const link = element('a', 'hub-generated-step-link', '查看课程');
      link.href = resource.href;
      if (/^https:\/\//i.test(resource.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      link.append(element('span', '', '↗'));
      item.append(number, content, link);
      list.append(item);
    });
    const note = element('p', 'hub-generated-plan-note', plan.source === 'catalog-fallback'
      ? '智能规划暂时不可用；这是按当前课程目录匹配整理的备用路线。'
      : '路线中的课程均来自当前资料库，可打开原始内容核对详情。');
    article.append(head, list, note);
    if (plan.source === 'catalog-fallback' && plan.retryPrompt) {
      const retry = element('button', 'hub-plan-retry', '重试智能规划');
      retry.type = 'button';
      retry.addEventListener('click', () => sendPrompt(plan.retryPrompt, { intent: 'planner', query: plan.retryPrompt, display: '重新规划学习路径' }));
      article.append(retry);
    }
    target.replaceChildren(article);
    scrollConversationToStart(target);
  }

  function recentContext() {
    return [...output.querySelectorAll('.hub-message-user p')].map((item) => clean(item.textContent)).slice(-4).join('\n');
  }

  async function runPlanner(prompt, version, displayPrompt) {
    const answer = createConversation(displayPrompt);
    renderLoading(answer, '正在匹配现有课程并编排学习顺序…');
    let entries = [];
    let catalog = [];
    try {
      if (!skill) throw new Error('规划模块暂不可用');
      entries = await buildResourceIndex();
      if (version !== requestVersion) return;
      const role = new URLSearchParams(location.search).get('role') || '';
      const context = recentContext();
      catalog = rankForPlan(entries, `${context}\n${prompt}`, role);
      if (!catalog.length) throw new Error('课程目录暂不可用');
      const request = skill.buildRequest({
        goal: `${context}\n当前目标：${prompt}`,
        role: roleNames[role] || '尚未说明，请根据目标判断',
        level: '用户未说明；请先给出适合常见基础的路线',
        format: '用户未指定',
        resources: catalog,
      });
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
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
      const fallback = buildCatalogFallback(catalog.length ? catalog : entries, prompt);
      if (fallback) renderPlan(answer, fallback);
      else {
        answer.replaceChildren(element('p', 'hub-answer-copy', '智能规划暂时不可用，当前资料目录里也没有足够内容整理路线。你可以浏览已有学习主线，或搜索具体课程。'));
        const link = element('a', 'hub-inline-action', '浏览五条学习主线');
        link.href = './resources.html#resource-path-details';
        link.append(element('span', '', '↗'));
        answer.append(link);
        scrollConversationToEnd();
      }
    } finally {
      if (version === requestVersion) setBusy(false);
    }
  }

  function updateSkillSuggestions() {
    const value = chatInput.value;
    const show = /^\/[^\s]*$/u.test(value) && !/^\/(?:规划学习路径|学习路径规划|path)$/iu.test(value);
    skillSuggestions.hidden = !show;
    chatInput.setAttribute('aria-expanded', String(show));
  }

  function choosePlannerSkill() {
    const rest = chatInput.value.replace(/^\/[^\s]*/u, '').trimStart();
    chatInput.value = `/规划学习路径${rest ? ` ${rest}` : ' '}`;
    updateSkillSuggestions();
    feedback.hidden = true;
    chatInput.focus();
    chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
  }

  function resizeInput() {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 132)}px`;
  }

  async function sendPrompt(raw, override = null) {
    if (isBusy) return;
    const parsed = override || classifyPrompt(raw);
    const prompt = clean(parsed.query || '');
    if (!prompt) {
      feedback.textContent = parsed.intent === 'planner' ? '请在路径规划 Skill 后补充你的学习目标。' : '先输入课程名称或学习目标。';
      feedback.hidden = false;
      chatInput.focus();
      return;
    }
    feedback.hidden = true;
    skillSuggestions.hidden = true;
    lastTrigger = chatInput;
    openAssistant({ focus: false });
    const displayPrompt = clean(parsed.display || prompt);
    const version = ++requestVersion;
    setBusy(true);
    chatInput.value = '';
    resizeInput();
    chatInput.focus();
    if (parsed.intent === 'planner') await runPlanner(prompt, version, displayPrompt);
    else await runSearch(prompt, version, displayPrompt);
  }

  function openFromTrigger(event) {
    lastTrigger = event.currentTarget;
    openAssistant({ focus: true });
  }

  panel.querySelector('[data-hub-assistant-close]').addEventListener('click', closeAssistant);
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendPrompt(chatInput.value);
  });
  skillSelect.addEventListener('click', choosePlannerSkill);
  chatInput.addEventListener('input', () => {
    resizeInput();
    updateSkillSuggestions();
    feedback.hidden = true;
  });
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && !skillSuggestions.hidden) {
      event.preventDefault();
      skillSelect.focus();
      return;
    }
    if (event.key === 'Escape' && !skillSuggestions.hidden) {
      skillSuggestions.hidden = true;
      chatInput.setAttribute('aria-expanded', 'false');
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!skillSuggestions.hidden) choosePlannerSkill();
      else chatForm.requestSubmit();
    }
  });
  skillSelect.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { skillSuggestions.hidden = true; chatInput.focus(); }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choosePlannerSkill(); }
  });
  widget.addEventListener('click', (event) => {
    const example = event.target.closest('[data-hub-example]');
    if (example) sendPrompt(example.dataset.hubExample);
  });
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-hub-search-open]');
    if (opener) openFromTrigger({ currentTarget: opener });
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      lastTrigger = document.activeElement;
      openAssistant({ focus: true });
    } else if (event.key === 'Escape' && !panel.hidden && panel.classList.contains('is-open')) {
      closeAssistant();
    }
  });
})();
