  const AI_WORKER_URL = 'https://ascend-cann.10xinyu0901.workers.dev';

  // Canonical list of all 11 knowledge nodes shared by both pages
  const NODE_LIST = [
    { title: '昇腾硬件体系',      category: 'beginner',    desc: '达芬奇核、HBM、AI Core 架构概览',
      topics: ['达芬奇核架构与 Cube/Vector/Scalar 单元', 'Atlas 系列芯片规格对比', 'AI Core 流水线与内存层次', 'NPU vs GPU 计算模型差异'],
      duration: '1.5h', difficulty: 1 },
    { title: 'CANN 软件栈概览',   category: 'beginner',    desc: 'CANN 整体分层架构与组件关系',
      topics: ['CANN 各层组件职责与调用关系', 'AscendCL / GE / FE / TBE 定位', '算子库与图引擎的协作方式', '与 PyTorch/MindSpore 框架的集成点'],
      duration: '1h', difficulty: 1 },
    { title: '环境安装与配置',    category: 'beginner',    desc: 'Toolkit 安装、环境变量与 NPU 验证',
      topics: ['Driver / Firmware / CANN Toolkit 安装顺序', '环境变量 set_env.sh 配置', 'npu-smi 验证 NPU 可用状态', '常见安装报错与修复'],
      duration: '1h', difficulty: 1 },
    { title: 'AscendCL 编程基础', category: 'developer',   desc: 'ACL 初始化、Device / Context / Stream',
      topics: ['ACL 初始化与资源释放生命周期', 'Device / Context / Stream 三层模型', '内存分配：Host ↔ Device 数据搬运', '同步执行与异步流水的区别'],
      duration: '3h', difficulty: 2 },
    { title: '模型推理部署',      category: 'developer',   desc: 'ATC 转换、.om 加载与离线推理执行',
      topics: ['ATC 工具将 ONNX/TF/Caffe 转 .om 模型', '模型加载与输入/输出 Buffer 管理', '离线推理执行与结果后处理', '动态 Shape 与批量推理配置'],
      duration: '4h', difficulty: 2 },
    { title: '数据预处理 (DVPP)', category: 'developer',   desc: '图像/视频硬件解码与缩放加速',
      topics: ['DVPP 硬件解码 JPEG / H.264 / H.265', '图像缩放、抠图、格式转换 API', 'DVPP 与推理流水线的拼接方式', 'CPU 预处理 vs DVPP 性能对比'],
      duration: '2.5h', difficulty: 2 },
    { title: '性能调优实战',      category: 'developer',   desc: 'Profiling 工具链与 NPU 瓶颈分析',
      topics: ['Profiling 采集 Timeline / 算子耗时', 'MindStudio 可视化分析 Bottleneck', 'AICPU / AICORE 调度优化策略', '内存带宽与流水线 Overlap 优化'],
      duration: '4h', difficulty: 3 },
    { title: 'TBE DSL 算子开发',  category: 'operator',    desc: 'TBE DSL 自定义算子开发全流程',
      topics: ['TBE DSL 张量表达式语法', 'Schedule 调度原语（split/reorder/bind）', '算子注册与 OpProto 定义', '用 msopgen 生成算子工程框架'],
      duration: '5h', difficulty: 3 },
    { title: 'TIK 底层算子开发',  category: 'operator',    desc: 'TIK C++ 底层核函数与内存管理',
      topics: ['TIK C++ 核函数编程模型', 'GM / L1 / L0 多级缓存数据搬运', 'Pipeline 双缓冲与流水并行', '精度调试与 dump 数据对比'],
      duration: '6h', difficulty: 3 },
    { title: 'HCCL 分布式通信',   category: 'distributed', desc: 'AllReduce 等集合通信原语与多卡同步',
      topics: ['HCCL 集合通信：AllReduce / Broadcast / Scatter', 'rank / 通信域 / 拓扑配置', '多机多卡环境初始化', '通信性能分析与带宽瓶颈排查'],
      duration: '3h', difficulty: 3 },
    { title: '大模型训练实战',    category: 'distributed', desc: 'DeepSpeed + HCCL 大模型分布式训练',
      topics: ['DeepSpeed ZeRO Stage 1/2/3 配置', 'Pipeline / Tensor 并行与昇腾适配', '混合精度 BF16 训练与梯度缩放', '千卡训练故障诊断与稳定性优化'],
      duration: '8h', difficulty: 3 },
  ];
  const CAT_META = {
    beginner:    { label: '基础入门', color: '#10B981' },
    developer:   { label: '应用开发', color: '#2e53fa' },
    operator:    { label: '算子开发', color: '#8B5CF6' },
    distributed: { label: '分布式',  color: '#F59E0B' },
  };
  let _lastFlrPath = null; // stores last homepage-generated path for CTA

  // Page navigation
  const _PAGE_URLS = { home: 'index.html', docs: 'docs.html', learn: 'learn.html', api: 'api.html' };

  function showPage(name) {
    const url = _PAGE_URLS[name];
    if (!url) return false;
    // Same page? just scroll top and re-init
    const currentPage = document.querySelector('.page');
    if (currentPage && currentPage.id === 'page-' + name) {
      window.scrollTo(0, 0);
      if (name === 'docs') { const fn = window.showDoc; if (fn) fn('home'); }
      return false;
    }
    window.location.href = url;
    return false;
  }

  // Called on learn.html load to apply any pending path from homepage
  function _applyPendingLearnPath() {
    const raw = sessionStorage.getItem('_pendingLearnPath');
    if (!raw) return;
    try {
      const { query, nodes } = JSON.parse(raw);
      sessionStorage.removeItem('_pendingLearnPath');
      document.querySelectorAll('.top-tab').forEach(btn => {
        if (btn.textContent.trim() === '自定义') switchTopTab('custom', btn);
      });
      setTimeout(() => renderLearnPagePath(query, nodes), 200);
    } catch(e) { sessionStorage.removeItem('_pendingLearnPath'); }
  }

  // Dropdown toggle
  function toggleDropdown(event) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const dropdown = btn.closest('.dropdown');
    
    // Close other open dropdowns
    document.querySelectorAll('.dropdown.open').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });
    
    dropdown.classList.toggle('open');
  }

  // Close dropdown when clicking outside
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  });

  // AI Chat Toggle
  function toggleAiChat() {
    const sidebar = document.getElementById('ai-sidebar');
    if (sidebar.classList.contains('open')) _closeSidebar();
    else _openSidebar();
  }

  // ── AI Sidebar Layout Modes ──
  let _aiLayout = 'embed'; // embed | left | right | float
  let _aiFloatX = null, _aiFloatY = null;
  let _aiDragging = false, _aiDragOffX = 0, _aiDragOffY = 0;

  function _openSidebar() {
    document.getElementById('ai-sidebar').classList.add('open');
    _applySidebarBodyClass(true);
  }

  function _closeSidebar() {
    document.getElementById('ai-sidebar').classList.remove('open');
    _applySidebarBodyClass(false);
  }

  function _applySidebarBodyClass(isOpen) {
    document.body.classList.remove('sidebar-embed-open');
    if (isOpen && _aiLayout === 'embed') document.body.classList.add('sidebar-embed-open');
  }

  function setAiLayout(mode) {
    _aiLayout = mode;
    const sidebar = document.getElementById('ai-sidebar');
    const isOpen  = sidebar.classList.contains('open');
    sidebar.classList.remove('layout-left', 'layout-float');
    sidebar.style.cssText = '';
    document.body.classList.remove('sidebar-embed-open');

    if (mode === 'left') {
      sidebar.classList.add('layout-left');
    } else if (mode === 'float') {
      sidebar.classList.add('layout-float');
      if (_aiFloatX !== null) {
        sidebar.style.left = _aiFloatX + 'px';
        sidebar.style.top  = _aiFloatY + 'px';
      } else {
        sidebar.style.right  = '20px';
        sidebar.style.bottom = '20px';
      }
    } else if (mode === 'embed' && isOpen) {
      document.body.classList.add('sidebar-embed-open');
    }
    // mode === 'right': no extra class, default fixed right overlay

    document.querySelectorAll('.ai-layout-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === mode)
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    const handle = document.getElementById('ai-drag-handle');
    if (!handle) return;
    handle.addEventListener('mousedown', e => {
      if (_aiLayout !== 'float') return;
      e.preventDefault();
      _aiDragging = true;
      const sidebar = document.getElementById('ai-sidebar');
      const cr = sidebar.getBoundingClientRect();
      if (!_aiFloatX) {
        sidebar.style.left = cr.left + 'px';
        sidebar.style.top  = cr.top  + 'px';
        sidebar.style.right = ''; sidebar.style.bottom = '';
      }
      _aiDragOffX = e.clientX - cr.left;
      _aiDragOffY = e.clientY - cr.top;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!_aiDragging) return;
      const sidebar = document.getElementById('ai-sidebar');
      const w = sidebar.offsetWidth, h = sidebar.offsetHeight;
      let x = e.clientX - _aiDragOffX;
      let y = e.clientY - _aiDragOffY;
      x = Math.max(0, Math.min(x, window.innerWidth  - w));
      y = Math.max(0, Math.min(y, window.innerHeight - h));
      sidebar.style.left = x + 'px'; sidebar.style.top = y + 'px';
      _aiFloatX = x; _aiFloatY = y;
    });
    document.addEventListener('mouseup', () => {
      if (_aiDragging) { _aiDragging = false; document.body.style.userSelect = ''; }
    });
  });

  function openAiSidebarAndSend(message) {
    const sidebar = document.getElementById('ai-sidebar');
    if (!sidebar.classList.contains('open')) _openSidebar();
    sendAiMessage(message);
  }

  // ── AI Path Generation (conversation mode) ──
  let _aiPathMode  = false;
  let _aiPathState = 'idle'; // idle | clarifying | generating | editing
  let _aiPathQuery = '';
  let _aiPathName  = '';

  const AI_PATH_CLARIFY = [
    { keys: ['算子','TBE','TIK','Ascend C','operator'], q: '你的算子开发基础是？', opts: ['零基础', '会 Python/C++', '有深度学习经验'] },
    { keys: ['推理','部署','inference'],                  q: '你偏好哪种编程语言？', opts: ['Python', 'C++', '两者都行'] },
    { keys: ['分布式','训练','大模型'],                   q: '你熟悉的训练框架是？', opts: ['PyTorch', 'MindSpore', '都不熟'] },
    { keys: ['入门','基础','初学'],                        q: '你每周能投入多少学习时间？', opts: ['1–3 小时', '5–10 小时', '全职投入'] },
  ];

  function _aiPathStart(query) {
    _aiPathMode  = true;
    _aiPathState = 'idle';
    _aiPathQuery = query;
    _aiPathName  = query.length > 22 ? query.slice(0, 22) + '…' : query;
    // Open sidebar
    if (!document.getElementById('ai-sidebar').classList.contains('open')) _openSidebar();
    document.getElementById('ai-title-text').textContent = 'AI 路径规划';
    document.getElementById('ai-messages').innerHTML = '';
    document.getElementById('ai-chips').innerHTML = '';
    // AI proactively asks the clarifying question
    setTimeout(() => _aiPathHandleFirst(query), 300);
  }

  function _aiPathHandleFirst(query) {
    _aiPathState = 'clarifying';
    const match = AI_PATH_CLARIFY.find(c => c.keys.some(k => query.includes(k)));
    _aiTyping(() => {
      if (match) {
        _aiAddBot(match.q);
        _aiShowChips(match.opts, ans => { _aiAddUser(ans); document.getElementById('ai-chips').innerHTML = ''; _aiPathHandleClarify(ans); });
      } else {
        _aiAddBot('你的主要学习目标是？');
        _aiShowChips(['工程实践', '科研探索', '找工作 / 提升技能'], ans => { _aiAddUser(ans); document.getElementById('ai-chips').innerHTML = ''; _aiPathHandleClarify(ans); });
      }
    });
  }

  function _aiPathHandleClarify(answer) {
    _aiPathState = 'generating';
    _aiTyping(() => {
      _aiAddBot('好的，正在为你规划路径…');
      _aiPathGenerate(_aiPathQuery, answer);
    }, 700);
  }

  async function _aiPathGenerate(query, context) {
    const nodeListStr = NODE_LIST.map((n, i) => `${i}|${n.title}|${n.category}|${n.desc}`).join('\n');
    let nodes = null;
    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `你是 CANN 学习路径规划专家。从节点库中选4-6个最相关节点按学习顺序排列。\n节点库（序号|名称|方向|描述）：\n${nodeListStr}\n\n输出格式：JSON数组，每项含 nodeIndex 和 reason（不超过12字）。只输出JSON。`,
          user: `学习目标：${query}。背景：${context}`,
          max_tokens: 400,
        })
      });
      const data = await resp.json();
      let picks = [];
      try { picks = JSON.parse((data.text || '[]').replace(/```json|```/g, '').trim()); } catch(e) {}
      if (picks.length > 0) nodes = picks.map((p, i) => { const n = NODE_LIST[p.nodeIndex] || NODE_LIST[i] || NODE_LIST[0]; return { ...n, step: i+1, reason: p.reason || n.desc }; });
    } catch(e) {}
    if (!nodes) nodes = keywordFallbackNodes(query).map((n, i) => ({ ...n, step: i+1 }));
    _ipNodes = nodes.map(n => ({ ...n, known: false, collapsed: false }));
    _ipName  = _aiPathName;
    _ipQuery = query;
    _aiPathState = 'editing';
    _aiTyping(() => {
      _aiAddBot(`已为你规划 <strong>${_ipNodes.length}</strong> 个节点！可在页面中拖拽排序、删除或插入节点，满意后保存。`);
      _ipeShowAndHideRoadmap();
    }, 1200);
  }

  function _ipeShowAndHideRoadmap() {
    // Hide existing roadmap content
    document.getElementById('page-learn').classList.add('ipe-active');
    // Show inline path editor
    const wrap = document.getElementById('ipe-wrap');
    wrap.classList.remove('hidden');
    document.getElementById('ipe-name').textContent = _ipName;
    document.getElementById('ipe-meta').textContent = `${_ipNodes.length} 个节点 · 刚刚生成`;
    document.getElementById('ipe-save-btn').textContent = '保存路径';
    document.getElementById('ipe-save-btn').style.background = '';
    document.getElementById('ipe-save-hint').textContent = '保存后可在学习档案中查看';
    ipeRenderNodes();
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── AI Glow + Cursor ──
  function _activateGlow(on) {
    document.getElementById('ai-glow-frame').classList.toggle('active', on);
  }

  function _showAiCursor(nodeIdx, label) {
    const rows = document.querySelectorAll('#ipe-nodes .pg-node-row');
    const target = rows[nodeIdx];
    if (target) _showAiCursorAtEl(target, label || 'AI 正在编辑');
  }

  function _hideAiCursor() {
    document.getElementById('ai-edit-cursor').classList.add('hidden');
  }

  function _aiTouchNode(nodeIdx) {
    const rows = document.querySelectorAll('#ipe-nodes .pg-node-row');
    const row = rows[nodeIdx];
    if (!row) return;
    row.classList.remove('ai-touching');
    void row.offsetWidth; // reflow to restart animation
    row.classList.add('ai-touching');
    setTimeout(() => row.classList.remove('ai-touching'), 800);
  }

  // ── AI Path Editing Mode ──
  async function _aiPathEditMode(instruction) {
    _activateGlow(true);
    _showAiCursor(0, 'AI 正在思考…');

    const currentList = _ipNodes.map((n, i) => `${i}. ${n.title}`).join('\n');
    const nodePoolStr = NODE_LIST.map((n, i) => `${i}|${n.title}|${n.desc}`).join('\n');

    let result = null;
    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `你是 CANN 学习路径编辑助手。当前路径节点（序号. 标题）：\n${currentList}\n\n节点资源库（序号|标题|描述）：\n${nodePoolStr}\n\n根据用户指令返回JSON，格式：{"reply":"回复文本","ops":[...]}。ops每项是以下之一：\n{"type":"remove","index":N} 删除第N个节点\n{"type":"move","from":N,"to":N} 移动位置\n{"type":"add","poolIndex":N,"after":N} 从资源库插入节点，after是插在哪个节点后（-1=最前）\n{"type":"update","index":N,"reason":"新描述"} 更新节点说明\n{"type":"none"} 纯回复不修改路径\n如无需修改路径则ops:[]。只输出JSON。`,
          user: instruction,
          max_tokens: 500,
        })
      });
      const data = await resp.json();
      try { result = JSON.parse((data.text || '{}').replace(/```json|```/g, '').trim()); } catch(e) {}
    } catch(e) {}

    if (!result) result = { reply: '好的，收到你的意见！', ops: [] };

    // Apply operations with animations
    const ops = result.ops || [];
    if (ops.length > 0) {
      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        await _aiApplyOp(op);
        await _sleep(400);
      }
    }

    _aiAddBot(result.reply || '已完成修改。');
    _activateGlow(false);
    _hideAiCursor();
  }

  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function _aiApplyOp(op) {
    if (op.type === 'remove') {
      const idx = op.index;
      if (idx < 0 || idx >= _ipNodes.length) return;
      _showAiCursor(idx, 'AI 正在移除…');
      _aiTouchNode(idx);
      await _sleep(600);
      const rows = document.querySelectorAll('#ipe-nodes .pg-node-row');
      if (rows[idx]) {
        rows[idx].classList.add('ai-removing');
        await _sleep(500);
      }
      _ipNodes.splice(idx, 1);
      ipeRenderNodes();

    } else if (op.type === 'move') {
      const from = op.from, to = op.to;
      if (from === to || from < 0 || to < 0 || from >= _ipNodes.length || to >= _ipNodes.length) return;
      _showAiCursor(from, 'AI 正在移动…');
      _aiTouchNode(from);
      await _sleep(700);
      const moved = _ipNodes.splice(from, 1)[0];
      _ipNodes.splice(to, 0, moved);
      ipeRenderNodes();
      _showAiCursor(to, 'AI 已移动');

    } else if (op.type === 'add') {
      const poolIdx = op.poolIndex;
      const after   = op.after !== undefined ? op.after : _ipNodes.length - 1;
      if (poolIdx < 0 || poolIdx >= NODE_LIST.length) return;
      const pos = Math.min(after + 1, _ipNodes.length);
      const newNode = { ...NODE_LIST[poolIdx], known: false, collapsed: false };
      _ipNodes.splice(pos, 0, newNode);
      ipeRenderNodes();
      _showAiCursor(pos, 'AI 已添加');
      const rows = document.querySelectorAll('#ipe-nodes .pg-node-row');
      if (rows[pos]) rows[pos].classList.add('ai-added');

    } else if (op.type === 'update') {
      const idx = op.index;
      if (idx < 0 || idx >= _ipNodes.length) return;
      _showAiCursor(idx, 'AI 正在更新…');
      _aiTouchNode(idx);
      await _sleep(600);
      if (op.reason) _ipNodes[idx].reason = op.reason;
      ipeRenderNodes();
    }
  }

  function openAiForPath(prefill) {
    showPage('learn');
    setTimeout(() => {
      document.querySelectorAll('.top-tab').forEach(b => {
        if (b.textContent.trim() === '自定义') b.click();
      });
      const input = document.getElementById('path-generator-input');
      if (input) { input.value = prefill || ''; input.focus(); }
    }, 200);
  }

  function _aiAddBot(html) {
    const wrap = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg bot';
    div.innerHTML = html;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function _aiAddUser(text) {
    const wrap = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg user';
    div.textContent = text;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function _aiShowChips(opts, cb) {
    const el = document.getElementById('ai-chips');
    el.innerHTML = '';
    opts.forEach(o => {
      const btn = document.createElement('button');
      btn.className = 'ai-chip'; btn.textContent = o;
      btn.onclick = () => {
        el.querySelectorAll('.ai-chip').forEach(b => b.classList.add('sent'));
        if (cb) { cb(o); } else {
          document.getElementById('ai-sidebar-input').value = o;
          sendAiMessage();
        }
      };
      el.appendChild(btn);
    });
  }

  function _aiTyping(cb, delay) {
    delay = delay || 900;
    const wrap = document.getElementById('ai-messages');
    const el = document.createElement('div');
    el.className = 'ai-msg bot';
    el.innerHTML = '<div style="display:flex;gap:4px;align-items:center;padding:2px 0"><span style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation:pgDot 1.2s infinite;display:inline-block"></span><span style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation:pgDot 1.2s .2s infinite;display:inline-block"></span><span style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation:pgDot 1.2s .4s infinite;display:inline-block"></span></div>';
    wrap.appendChild(el);
    wrap.scrollTop = wrap.scrollHeight;
    setTimeout(() => { el.remove(); cb(); }, delay);
  }

  function _quoteDocText(text) {
    return text.split('\n').map(line => line.trim() ? `> ${line}` : '>').join('\n');
  }

  function explainDocSelection(text) {
    const quoted = _quoteDocText(text);
    const prompt = `请根据以下引用内容进行解释，指出关键点、原理和应用场景：\n\n${quoted}`;
    openAiSidebarAndSend(prompt);
  }

  function explainCodeBlock(codeBlock) {
    const clone = codeBlock.cloneNode(true);
    clone.querySelectorAll('button, .sandbox-btn-wrapper, .lang-tag').forEach(el => el.remove());
    const codeText = clone.innerText.trim();
    if (!codeText) return;
    const prompt = `请解释以下代码：\n\n${codeText}`;
    openAiSidebarAndSend(prompt);
  }

  function hideSelectionButton() {
    const btn = document.getElementById('selection-ai-button');
    if (btn) btn.classList.remove('visible');
  }

  function getSelectedDocText() {
    const sel = window.getSelection();
    if (!sel || !sel.toString().trim()) return '';
    const docsContent = document.getElementById('docs-main');
    if (!docsContent || !docsContent.contains(sel.anchorNode) || !docsContent.contains(sel.focusNode)) return '';
    let text = sel.toString().trim();
    if (text.length > 500) text = text.slice(0, 500) + '...';
    return text;
  }

  function attachDocAiHelpers() {
    const helper = document.createElement('button');
    helper.id = 'selection-ai-button';
    helper.className = 'selection-ai-btn';
    helper.type = 'button';
    helper.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M9 2C9 5.86599 5.86599 9 2 9C5.86599 9 9 12.134 9 16C9 12.134 12.134 9 16 9C12.134 9 9 5.86599 9 2Z"/><path d="M20 12C20 14.2091 18.2091 16 16 16C18.2091 16 20 17.7909 20 20C20 17.7909 21.7909 16 24 16C21.7909 16 20 14.2091 20 12Z"/></svg>AI 解释';
    helper.addEventListener('click', event => {
      event.stopPropagation();
      const text = getSelectedDocText();
      if (!text) return hideSelectionButton();
      explainDocSelection(text);
      hideSelectionButton();
      window.getSelection().removeAllRanges();
    });
    document.body.appendChild(helper);

    document.addEventListener('selectionchange', () => {
      const text = getSelectedDocText();
      const button = document.getElementById('selection-ai-button');
      if (!button) return;
      if (!text) {
        return hideSelectionButton();
      }
      const sel = window.getSelection();
      if (!sel.rangeCount) return hideSelectionButton();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) return hideSelectionButton();
      
      // Determine selection direction
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      const isForward = startOffset < endOffset;
      
      // Position button based on selection direction
      if (isForward) {
        // Forward selection: button at the end
        button.style.top = `${window.scrollY + rect.top - 10}px`;
        button.style.left = `${window.scrollX + rect.right}px`;
      } else {
        // Backward selection: button at the beginning
        button.style.top = `${window.scrollY + rect.top - 10}px`;
        button.style.left = `${window.scrollX + rect.left}px`;
      }
      
      button.classList.add('visible');
    });

    document.addEventListener('click', event => {
      const button = document.getElementById('selection-ai-button');
      if (!button) return;
      if (button.contains(event.target)) return;
      const text = getSelectedDocText();
      if (!text) hideSelectionButton();
    });

    document.querySelectorAll('.code-block').forEach(block => {
      if (block.querySelector('.explain-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'explain-btn';
      btn.type = 'button';
      btn.textContent = '代码解释';
      btn.addEventListener('click', () => explainCodeBlock(block));

      let actions = block.querySelector('.code-block-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'code-block-actions';
        block.appendChild(actions);
      }

      const sandboxWrapper = block.querySelector('.sandbox-btn-wrapper');
      const copyBtn = block.querySelector('.copy-btn');
      if (sandboxWrapper && !actions.contains(sandboxWrapper)) actions.appendChild(sandboxWrapper);
      if (copyBtn && !actions.contains(copyBtn)) actions.appendChild(copyBtn);
      actions.appendChild(btn);
    });
  }

  // Send AI Sidebar Message
  async function sendAiMessage(overrideMsg) {
    const input = document.getElementById('ai-sidebar-input');
    const msg = overrideMsg || input.value.trim();
    if (!msg) return;
    input.value = '';
    document.getElementById('ai-chips').innerHTML = '';

    // AI page action — "帮我 + 操作" triggers cursor-driven UI execution
    if (await _tryPageAction(msg)) return;

    // Route to path generation conversation when in path mode
    if (_aiPathMode && _aiPathState === 'clarifying') {
      _aiAddUser(msg);
      _aiPathHandleClarify(msg);
      return;
    }
    // Route to path editing when a path has been generated
    if (_aiPathMode && _aiPathState === 'editing') {
      _aiAddUser(msg);
      _aiPathEditMode(msg);
      return;
    }

    const container = document.getElementById('ai-messages');

    // 1. 添加用户消息
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.textContent = msg;
    container.appendChild(userDiv);
    container.scrollTop = container.scrollHeight;

    // 2. 添加 loading 消息
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg bot';
    loadingDiv.id = 'ai-loading-' + Date.now();
    loadingDiv.innerHTML = '<div class="floor-loading" style="display:flex;align-items:center;gap:8px;color:var(--text-muted);font-size:13px"><div class="floor-dots"><span></span><span></span><span></span></div><span>AI 正在思考…</span></div>';
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    // 3. 构建上下文感知的 system prompt
    let contextHint = '';
    const docsPage = document.getElementById('page-docs');
    const learnPage = document.getElementById('page-learn');
    const apiPage = document.getElementById('page-api');
    if (docsPage && docsPage.classList.contains('active')) {
        contextHint = '用户当前正在浏览 CANN 文档页面。';
    } else if (learnPage && learnPage.classList.contains('active')) {
        contextHint = '用户当前正在浏览 CANN 学习路径页面。';
        if (_currentDrawerNode) {
            contextHint += ` 用户正在学习"${_currentDrawerNode.title}"这个知识点。`;
        }
    } else if (apiPage && apiPage.classList.contains('active')) {
        contextHint = '用户当前正在浏览 CANN API 参考页面。';
    }

    const systemPrompt = `你是 CANN（华为昇腾 AI 异构计算架构）的智能助手。${contextHint}
你的职责：
- 解答关于 AscendCL 编程、TBE 算子开发、ATC 模型转换、HCCL 分布式通信等 CANN 相关问题
- 提供清晰、准确的代码示例（使用 Python 或 C++）
- 帮助用户理解昇腾 NPU 硬件架构和软件栈
- 引导用户查阅相关文档和学习资源

回答要求：
- 使用中文，简洁专业，不超过 500 字
- 如有代码示例，用三个反引号包裹并标注语言（如 \`\`\`python）
- 如果问题超出 CANN 范围，礼貌引导用户回到 CANN 主题`;

    // 4. 调用真实的 AI 接口
    fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system: systemPrompt,
            user: msg,
            max_tokens: 800,
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('API 响应异常: ' + response.status);
        return response.json();
    })
    .then(data => {
        const replyText = data.text || '';
        if (!replyText || replyText.trim() === '') {
            throw new Error('AI 返回了空内容');
        }
        // 移除 loading 消息
        if (loadingDiv.parentNode) loadingDiv.remove();
        // 添加真实的 AI 回复
        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg bot';
        botDiv.innerHTML = formatFloorText(replyText);
        container.appendChild(botDiv);
        container.scrollTop = container.scrollHeight;
    })
    .catch(error => {
        console.error('AI Sidebar Error:', error);
        // 更新 loading 消息为错误提示
        loadingDiv.innerHTML = '<span style="color:#EF4444;font-size:13px">⚠️ 连接失败，请稍后重试。</span><br><span style="color:var(--text-muted);font-size:11px">' + error.message + '</span>';
        loadingDiv.id = '';
        container.scrollTop = container.scrollHeight;
    });
}

  // Run Sandbox Code
  function runSandbox(btn) {
    const sandbox = btn.closest('.sandbox-container');
    const editor = sandbox.querySelector('.sandbox-code-editor');
    const output = sandbox.querySelector('.sandbox-output pre');
    const code = editor.innerText;

    output.textContent = '正在运行代码...';
    // Simulate code execution
    setTimeout(() => {
      try {
        // This is a very basic simulation. In a real scenario, you'd send
        // the code to a backend for execution and get the actual output.
        // For now, we'll just parse the simulated Python code.
        if (code.includes('acl.init()')) {
          output.textContent = 'Initializing ACL...\nACL initialized successfully!';
        } else {
          output.textContent = '模拟运行结果：\n' + code;
        }
      } catch (e) {
        output.textContent = '运行错误：\n' + e.message;
      }
    }, 1500);
  }

  // ── NODE KNOWLEDGE DATA ──
  const NODE_KNOWLEDGE = {
    '昇腾硬件体系': {
      summary: '昇腾 AI 处理器基于达芬奇（Da Vinci）架构，由多个 AI Core 并行工作，每个 AI Core 集成矩阵、向量和标量三种计算单元，通过 HBM 高带宽内存实现 900GB/s 的数据访问速度，是高性能 NPU 推理与训练的硬件基础。',
      concepts: [
        { term: 'Da Vinci 架构', desc: '昇腾专属神经网络计算架构，包含 Cube 单元（矩阵乘法加速）、Vector 单元（向量运算）和 Scalar 单元（标量控制流），三者协同实现极致 AI 算力' },
        { term: 'AI Core', desc: '基本计算单元，每个 AI Core 独立完成一个 tile 级计算任务，多个 AI Core 并行工作。910B 有 64 个 AI Core，峰值算力达 320 TFLOPS（FP16）' },
        { term: 'HBM 高带宽内存', desc: '位于处理器旁侧的高带宽内存（High Bandwidth Memory），提供约 900 GB/s 带宽，相比 DDR 内存高出 10 倍以上，是 AI 计算带宽密集型特点的关键匹配' },
        { term: 'L0/L1/L2 缓存层次', desc: 'L0 Buffer 在 AI Core 内部（最快），L1 Cache 在 AI Core 间共享，L2 Cache 供全芯片共用。合理利用缓存层次是性能优化的核心手段' },
        { term: 'Ascend 910 vs 310', desc: '910 系列面向大规模训练（服务器集群），算力强且带宽高；310 系列面向边缘推理（功耗低、体积小），常用于摄像头、车载等场景' },
      ],
      diagram: `          ┌────────────── 昇腾处理器（910B）──────────────┐
          │  AI Core×64                               │
          │  ┌──────────┐  ┌──────────┐              │
          │  │ Cube单元  │  │ Vector   │  × 64       │
          │  │ (矩阵乘) │  │  单元    │             │
          │  └──────────┘  └──────────┘              │
          │         ↕  L0 Buffer ↕                   │
          │  ─────────── L1 Cache ───────────        │
          │  ─────────── L2 Cache ───────────        │
          │                                          │
          │  AI CPU (控制调度)   HBM (~900 GB/s)      │
          └──────────────────────────────────────────┘`,
      resources: [
        { icon: '📖', title: '昇腾 AI 处理器架构白皮书', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '达芬奇架构完整技术说明' },
        { icon: '🎬', title: '达芬奇架构深度解析', href: '#', type: '视频课程', subtitle: '约 45 分钟，华为工程师讲解' },
        { icon: '📄', title: 'Ascend 910 规格对比表', href: '#', type: '参考资料', subtitle: '910A/910B/910C 参数对比' },
      ]
    },
    'CANN 软件栈概览': {
      summary: 'CANN 是一个完整的异构计算软件栈，从底层驱动到上层框架适配形成完整的纵向分层，开发者通常只需关注 AscendCL 编程接口层，而不必了解底层细节。',
      concepts: [
        { term: '驱动层（Driver）', desc: '最底层，直接与硬件交互，管理昇腾处理器的初始化、内存映射和中断。由华为提供，开发者无需修改' },
        { term: 'CANN Runtime', desc: '运行时层，提供设备管理、内存分配、Stream/Context 管理等核心服务。AscendCL 的底层支撑' },
        { term: 'AscendCL', desc: '主要编程接口层（C/C++ API），开发者通过它控制设备、加载模型、执行推理。类比 CUDA 之于 NVIDIA' },
        { term: '算子库（CANN Ops）', desc: '内置高性能算子库，包含数千个 AI 算子的优化实现，ATC 转换后的模型会自动调用这些算子' },
        { term: '框架适配层', desc: '使 PyTorch、TensorFlow、MindSpore 等框架能透明地调用昇腾 NPU，开发者可以用熟悉的框架直接跑在昇腾上' },
        { term: 'ATC 工具', desc: '模型转换工具，将训练好的 ONNX/Caffe/TF 模型转换为昇腾专用的 .om 离线模型格式，并进行算子融合优化' },
      ],
      diagram: `  用户代码 / 框架（PyTorch, TF, MindSpore）
      ↕  框架适配层（CANN Plugin）
  ┌─────────────────────────────────────┐
  │         AscendCL 编程接口            │  ← 主要开发层
  ├─────────────────────────────────────┤
  │   CANN Runtime  |  算子库(Ops)       │
  ├─────────────────────────────────────┤
  │         NPU 驱动（Driver）           │
  └─────────────────────────────────────┘
              ↕ 硬件
         昇腾 NPU（Da Vinci）`,
      resources: [
        { icon: '📖', title: 'CANN 软件栈介绍', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '完整的组件关系说明' },
        { icon: '📖', title: 'AscendCL 编程指南', href: '#', type: '开发指南', subtitle: '从 Hello World 开始' },
      ]
    },
    '环境安装与配置': {
      summary: 'CANN 开发环境的安装分为驱动（Driver）和工具链（Toolkit）两个独立包。驱动版本须与 CANN 版本严格匹配，版本不匹配是最常见的安装报错来源。',
      concepts: [
        { term: 'NPU 固件 + 驱动', desc: '最底层的硬件支撑，需以 root 权限安装。每个 CANN 大版本都有严格对应的驱动版本号，混用必报错' },
        { term: 'CANN Toolkit', desc: '包含 ATC、AscendCL 头文件/库、性能工具等的完整工具包，安装后需 source set_env.sh 激活环境变量' },
        { term: 'set_env.sh', desc: '安装目录下的环境变量配置脚本，每次新 shell 都需执行。建议加到 ~/.bashrc 自动生效，否则 acl 库找不到' },
        { term: 'Python 绑定（pyACL）', desc: 'Python 调用 AscendCL 的封装层，pip install acl 安装。与 Toolkit 版本绑定，请勿混用' },
        { term: 'Docker 镜像方案', desc: '推荐开发时使用官方 ascend-toolkit Docker 镜像，已预装驱动适配层和 CANN，避免复杂的本地环境问题' },
      ],
      code: {
        lang: 'bash',
        body: `# 1. 验证驱动已安装
npu-smi info

# 2. 安装 CANN Toolkit（示例：8.0版本）
chmod +x Ascend-cann-toolkit_8.0.0_linux-x86_64.run
./Ascend-cann-toolkit_8.0.0_linux-x86_64.run --install

# 3. 激活环境变量（每次新 shell 必须执行）
source /usr/local/Ascend/ascend-toolkit/set_env.sh

# 4. 验证安装
python3 -c "import acl; print(acl.__version__)"`,
        note: '注意：Driver 和 Toolkit 需分开安装，且版本号必须严格匹配。推荐查阅官方版本兼容矩阵后再安装。'
      },
      lab: {
        intro: '通过以下步骤逐一验证你的 CANN 环境是否正常。HiDevLab 已预装 CANN 8.0，可直接运行。',
        steps: [
          { title: '检查 NPU 驱动状态', desc: '使用 npu-smi 工具查看当前服务器上识别到的 NPU 设备列表和状态。', code: 'import subprocess\nresult = subprocess.run(["npu-smi", "info"], capture_output=True, text=True)\nprint(result.stdout or "（模拟输出）\\nNPU ID | Name          | Health\\n-------|---------------|-------\\n  0   | Ascend 910B   | OK    ")', expected: '看到 NPU 设备表格，Health 状态为 OK' },
          { title: '激活并验证 CANN 环境变量', desc: '确认 ASCEND_TOOLKIT_HOME 等关键环境变量已正确设置。', code: 'import os\n\ntoolkit = os.environ.get("ASCEND_TOOLKIT_HOME", "未设置")\nprint(f"ASCEND_TOOLKIT_HOME: {toolkit}")\n\n# 验证 acl 可以导入\ntry:\n    import acl\n    print(f"✓ pyACL 已安装，版本: {getattr(acl, \'__version__\', \'未知\')}")\nexcept ImportError:\n    print("✗ pyACL 未安装，请检查 CANN Toolkit 安装")', expected: '输出 CANN Toolkit 路径和 pyACL 版本号' },
          { title: '获取 NPU 设备数量', desc: '用 AscendCL API 查询当前系统上可用的 NPU 数量。', code: 'import acl\n\nret = acl.init()\ncount, ret2 = acl.rt.get_device_count()\nprint(f"当前系统 NPU 数量: {count}")\nfor i in range(count):\n    print(f"  - Device {i}: 可用")\nacl.finalize()', expected: '输出 NPU 数量（HiDevLab 上为 1）' },
        ]
      },
      resources: [
        { icon: '📖', title: 'CANN 安装指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '含版本兼容矩阵' },
        { icon: '🐳', title: '官方 Docker 镜像（AscendHub）', href: 'https://ascendhub.huawei.com/', type: 'Docker', subtitle: '开箱即用的开发环境' },
        { icon: '📦', title: 'CANN Toolkit 下载', href: 'https://www.hiascend.com/developer/download', type: '下载', subtitle: '选择对应版本和硬件平台' },
      ]
    },
    'AscendCL 编程基础': {
      summary: 'AscendCL 是调用昇腾 NPU 的核心 C/C++ API，遵循"初始化 → 分配设备 → 创建上下文 → 创建流 → 执行计算 → 销毁资源"的固定生命周期，每一步的错误码返回值都必须检查。',
      concepts: [
        { term: 'acl.init() / aclInit()', desc: '全局初始化，进程生命周期内只需调用一次，必须最先调用。传入 None/nullptr 使用默认配置即可' },
        { term: 'Device（设备）', desc: '物理昇腾 NPU 卡。setDevice 绑定当前线程到指定卡，多卡推理时每线程绑不同 device_id' },
        { term: 'Context（上下文）', desc: '隔离执行环境，类似 CUDA context。每个线程通常创建独立 Context，Context 之间资源互不干扰' },
        { term: 'Stream（流）', desc: '任务队列，Host 把 kernel/内存拷贝等任务提交到 Stream，NPU 异步执行。同 Stream 内任务串行，不同 Stream 可并行' },
        { term: '内存管理', desc: 'aclrtMalloc 在 Device 侧分配显存，aclrtMemcpy 在 Host↔Device 间搬运数据。完成后必须 aclrtFree，否则内存泄漏' },
      ],
      code: {
        lang: 'python',
        body: `import acl

# 1. 初始化
acl.init()

# 2. 指定设备（第 0 块 NPU）
acl.rt.set_device(0)

# 3. 创建 Context 和 Stream
context, ret = acl.rt.create_context(0)
stream, ret  = acl.rt.create_stream()

# 4. 分配设备内存（1MB）
ptr, ret = acl.rt.malloc(1024*1024, 0)

# 5. Host → Device 数据拷贝
import numpy as np
data = np.ones((256,), dtype=np.float32)
acl.rt.memcpy(ptr, data.nbytes, data.ctypes.data, data.nbytes, 1)

# --- 在此插入推理逻辑 ---

# 6. 释放资源（顺序相反）
acl.rt.free(ptr)
acl.rt.destroy_stream(stream)
acl.rt.destroy_context(context)
acl.rt.reset_device(0)
acl.finalize()`,
        note: '每个 AscendCL API 都返回错误码，0 表示成功。生产代码中应对每步返回值做断言检查（assert ret == 0）。'
      },
      lab: {
        intro: '从零搭建一个完整的 AscendCL 程序骨架。每一步独立可运行，完成后拼接即是完整的推理应用基础。',
        steps: [
          { title: 'Step 1 — 初始化运行时与设备', desc: '调用 acl.init() 启动 CANN 运行时，再用 set_device(0) 绑定到第一块 NPU。这两步是所有 AscendCL 程序的起点。', code: `import acl

ret = acl.init()
assert ret == 0, f"acl.init 失败，错误码: {ret}"
print("✓ acl.init() 成功")

ret = acl.rt.set_device(0)
assert ret == 0, f"set_device 失败，错误码: {ret}"
print("✓ 绑定 Device 0 成功")

# 查询设备信息
count, _ = acl.rt.get_device_count()
print(f"  当前系统共有 {count} 块 NPU")`, expected: '✓ acl.init() 成功 / ✓ 绑定 Device 0 成功' },
          { title: 'Step 2 — 创建 Context 和 Stream', desc: 'Context 隔离线程执行环境，Stream 是异步任务队列。每个线程应独立创建自己的 Context，避免资源竞争。', code: `# 接上步（确保已 set_device）
context, ret = acl.rt.create_context(0)
assert ret == 0
print(f"✓ Context 创建成功: {context}")

stream, ret = acl.rt.create_stream()
assert ret == 0
print(f"✓ Stream 创建成功: {stream}")
print("  → 后续推理/内存操作将提交到此 Stream 异步执行")`, expected: '✓ Context 和 Stream 地址均非空' },
          { title: 'Step 3 — 分配显存并拷贝数据', desc: '用 aclrtMalloc 在 NPU 侧申请内存，再用 aclrtMemcpy 将 Host numpy 数组搬运到 Device。方向参数 1 = H2D。', code: `import numpy as np

# 准备 Host 侧数据
data = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0],
                dtype=np.float32)
print(f"Host 数据: {data}")

# 在 Device 侧分配内存
ptr, ret = acl.rt.malloc(data.nbytes, 0)  # 0 = 默认内存类型
assert ret == 0
print(f"✓ Device 内存已分配 ({data.nbytes} bytes)")

# Host → Device 拷贝 (memcpy_kind=1)
ret = acl.rt.memcpy(ptr, data.nbytes, data.ctypes.data, data.nbytes, 1)
assert ret == 0
print("✓ 数据已从 Host 拷贝到 Device")`, expected: '✓ Device 内存已分配 (32 bytes) / ✓ 数据已从 Host 拷贝到 Device' },
          { title: 'Step 4 — 释放资源（收尾）', desc: '资源必须按创建的相反顺序释放，否则会内存泄漏或段错误。这是生产代码必须做到的。', code: `# 按相反顺序释放：内存 → Stream → Context → Device → finalize
acl.rt.free(ptr)
print("✓ Device 内存已释放")

acl.rt.destroy_stream(stream)
print("✓ Stream 已销毁")

acl.rt.destroy_context(context)
print("✓ Context 已销毁")

acl.rt.reset_device(0)
print("✓ Device 已重置")

acl.finalize()
print("✓ AscendCL 运行时已关闭")
print("\\n全部资源释放完毕 — 程序骨架验证成功！")`, expected: '全部 ✓ 项输出，最后一行验证成功' },
        ]
      },
      resources: [
        { icon: '📖', title: 'AscendCL Python API 参考', href: '#', type: '官方文档', subtitle: '完整 API 列表和参数说明' },
        { icon: '💻', title: 'AscendCL 示例代码仓', href: 'https://gitee.com/ascend/samples', type: 'Gitee', subtitle: '设备初始化、内存管理完整示例' },
      ]
    },
    '模型推理部署': {
      summary: '昇腾推理的核心流程是：用 ATC 工具将 ONNX/Caffe/PB 模型转换为 .om 离线模型，再通过 AscendCL 的 Model 接口加载执行。.om 格式已内嵌算子融合优化，无需运行时再编译。',
      concepts: [
        { term: 'ATC 工具', desc: '离线模型转换工具，将 ONNX/Caffe/TF 等格式转为昇腾专属 .om 格式。转换时可指定输入 shape、精度（FP16/INT8）、算子融合策略' },
        { term: '.om 模型格式', desc: '昇腾离线模型，包含算子描述、权重数据和调度信息。已内嵌 NPU 指令，运行时直接加载执行无需再编译' },
        { term: 'aclmdlLoadFromFile', desc: '将 .om 文件从磁盘加载进显存，返回 modelId。一次加载可多次推理，避免重复加载的 I/O 开销' },
        { term: 'Dataset / DataBuffer', desc: 'AscendCL 的数据集抽象，每次推理需构造输入 Dataset（含预处理后的 tensor），推理完读取输出 Dataset' },
        { term: '动态 shape 推理', desc: '对可变输入尺寸（如 NLP 可变序列长度），ATC 转换时需使用 --input_shape_range，推理时每次指定实际 shape' },
      ],
      code: {
        lang: 'python',
        body: `import acl, numpy as np

acl.init(); acl.rt.set_device(0)
ctx, _ = acl.rt.create_context(0)

# 加载 .om 模型
model_id, ret = acl.mdl.load_from_file("resnet50.om")
desc = acl.mdl.create_desc()
acl.mdl.get_desc(desc, model_id)

# 构造输入（假设单输入 1×3×224×224）
input_data = np.random.randn(1,3,224,224).astype(np.float32)
in_buf, _ = acl.rt.malloc(input_data.nbytes, 0)
acl.rt.memcpy(in_buf, input_data.nbytes,
              input_data.ctypes.data, input_data.nbytes, 1)

# 执行推理
dataset_in  = acl.mdl.create_dataset()
dataset_out = acl.mdl.create_dataset()
# （省略 add_dataset_buffer 步骤）
acl.mdl.execute(model_id, dataset_in, dataset_out)

# 读取结果（1000 类 logits）
# ...

acl.mdl.unload(model_id)
acl.rt.free(in_buf)`,
        note: '实际工程中推荐使用 MindX SDK 或 ACLite 封装，避免手动管理 Dataset/DataBuffer 的繁琐步骤。'
      },
      lab: {
        intro: '分步演示从模型加载到推理执行的完整流程。Step 1 需在 Terminal 执行 ATC 命令，Step 2-3 在 Notebook 中运行 Python 代码。',
        steps: [
          { title: 'Step 1 — 用 ATC 转换 ONNX 模型', desc: '将标准 ONNX 模型转换为昇腾 .om 格式。先在 Terminal 下载示例模型，再执行转换。', code: `# 在 Terminal 中执行以下命令：

# 1. 下载 ResNet50 ONNX 示例
wget https://gitee.com/ascend/samples/raw/master/inference/resnet50.onnx

# 2. 用 ATC 转换（FP16，固定输入 shape）
atc --model=resnet50.onnx \\
    --framework=5 \\
    --output=resnet50 \\
    --input_shape="input:1,3,224,224" \\
    --soc_version=Ascend910B \\
    --log=error

# 转换成功后当前目录出现 resnet50.om`, expected: 'ATC run success, generate om file.' },
          { title: 'Step 2 — 加载 .om 模型并查看结构', desc: '用 aclmdlLoadFromFile 加载 .om，然后用 desc 接口查询输入/输出 tensor 的 shape 和数据类型。', code: `import acl
acl.init()
acl.rt.set_device(0)
ctx, _ = acl.rt.create_context(0)

# 加载模型
model_id, ret = acl.mdl.load_from_file("resnet50.om")
assert ret == 0, f"加载失败: {ret}"
print(f"✓ 模型加载成功 (model_id={model_id})")

# 查看模型结构
desc = acl.mdl.create_desc()
acl.mdl.get_desc(desc, model_id)

n_in  = acl.mdl.get_num_inputs(desc)
n_out = acl.mdl.get_num_outputs(desc)
print(f"  输入张量数: {n_in}")
print(f"  输出张量数: {n_out}")

for i in range(n_in):
    shape = acl.mdl.get_input_dims(desc, i)[0]
    print(f"  输入[{i}] shape: {shape['dims']}")
for i in range(n_out):
    shape = acl.mdl.get_output_dims(desc, i)[0]
    print(f"  输出[{i}] shape: {shape['dims']}")`, expected: '输入 shape: [1,3,224,224]，输出 shape: [1,1000]' },
          { title: 'Step 3 — 构造输入数据并执行推理', desc: '准备随机图像 tensor，完成 Host→Device 拷贝，执行推理，读取并展示 Top-5 分类结果。', code: `import numpy as np

# 准备输入（模拟一张随机图片）
input_data = np.random.randn(1, 3, 224, 224).astype(np.float32)

# 分配显存并拷贝
in_size = input_data.nbytes
in_ptr, _ = acl.rt.malloc(in_size, 0)
acl.rt.memcpy(in_ptr, in_size, input_data.ctypes.data, in_size, 1)

# 准备输出显存（1000类 float32）
out_size = 1000 * 4
out_ptr, _ = acl.rt.malloc(out_size, 0)

# 执行推理（使用低层 API 示意）
print("正在执行推理...")
# acl.mdl.execute(model_id, dataset_in, dataset_out)

# 模拟读取输出 logits
logits = np.random.randn(1000).astype(np.float32)
top5_idx = np.argsort(logits)[::-1][:5]
print("Top-5 预测类别 ID:")
for rank, idx in enumerate(top5_idx):
    print(f"  #{rank+1}: class {idx:4d}  score={logits[idx]:.4f}")

# 清理
acl.rt.free(in_ptr); acl.rt.free(out_ptr)
acl.mdl.unload(model_id)
acl.mdl.destroy_desc(desc)
acl.rt.destroy_context(ctx)
acl.rt.reset_device(0); acl.finalize()`, expected: 'Top-5 预测类别 ID 列表' },
        ]
      },
      resources: [
        { icon: '📖', title: 'ATC 模型转换指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '含 ONNX/Caffe/TF 各格式示例' },
        { icon: '🎬', title: 'ResNet50 推理实战', href: '#', type: '视频', subtitle: '从转换到部署完整流程' },
        { icon: '💻', title: '推理示例代码仓', href: 'https://gitee.com/ascend/samples', type: 'Gitee', subtitle: '分类/检测/分割多任务示例' },
      ]
    },
    '数据预处理 (DVPP)': {
      summary: 'DVPP（Digital Vision Pre-Processing）是昇腾内置的硬件图像处理单元，负责高性能的图片解码/编码、缩放、裁剪等操作，绕过 CPU 直接将处理结果送入 NPU，避免 Host↔Device 反复拷贝。',
      concepts: [
        { term: 'DVPP 硬件单元', desc: '独立于 AI Core 的专用图像处理硬件，支持 JPEG/PNG 解码、H.264/H.265 视频解码、图像缩放/剪裁/色彩转换（RGB/YUV）' },
        { term: 'acldvppCreateChannel', desc: '创建 DVPP 通道，类似 AscendCL 的 Stream 概念，所有 DVPP 操作提交到通道中异步执行' },
        { term: 'VPC（Vision Process Core）', desc: 'DVPP 中负责图像缩放、格式转换的模块，常用于将任意尺寸图像 resize 到模型要求的固定尺寸' },
        { term: '内存对齐要求', desc: 'DVPP 处理的数据有严格内存对齐要求（宽度16对齐、高度2对齐），不满足时需补 padding，是常见踩坑点' },
        { term: 'ACL DVPP vs OpenCV', desc: 'DVPP 直接在 NPU 侧处理图像效率更高；OpenCV 在 Host CPU 上运行，需额外数据拷贝。大批量图片处理推荐 DVPP' },
      ],
      resources: [
        { icon: '📖', title: 'DVPP API 文档', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: 'VPC/VENC/VDEC 完整 API' },
        { icon: '💻', title: 'DVPP 图像处理示例', href: 'https://gitee.com/ascend/samples', type: 'Gitee', subtitle: 'JPEG 解码+resize 完整代码' },
      ]
    },
    '性能调优实战': {
      summary: '昇腾性能调优的主要工具是 Profiling，它能精确测量每个算子的耗时、NPU 利用率、内存带宽占用，找到真正的性能瓶颈，而不是凭感觉优化。常见瓶颈是数据排布不合理和访存效率低。',
      concepts: [
        { term: 'Profiling 工具', desc: '采集算子级执行时间、AI Core 利用率、HBM 带宽等指标。通过 msprof 命令行或 MindStudio 可视化分析，精确定位热点算子' },
        { term: 'AI Core 利用率', desc: '目标通常是 >80%。低利用率说明算子计算量不足（shape 太小）或存在访存瓶颈，需增大 batch size 或优化数据排布' },
        { term: '数据排布（Format）', desc: 'AI Core 最优排布是 NC1HWC0（C维分块16），而非普通 NCHW。ATC 转换时自动处理，但自定义算子需手动适配' },
        { term: '算子融合', desc: '将多个连续算子合并成一个，减少 HBM 读写次数。ATC 自动执行基础融合，也可自定义图融合规则进一步优化' },
        { term: 'Tiling 策略', desc: '将大 tensor 切成小块，使每块数据能完全驻留在 L1 Buffer 中，避免频繁访问 HBM。TIK 开发需要手动设计 tiling' },
      ],
      resources: [
        { icon: '📖', title: '性能调优指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: 'Profiling 采集与分析全流程' },
        { icon: '🛠️', title: 'MindStudio 性能分析工具', href: '#', type: '工具', subtitle: '图形化 profiling 报告可视化' },
      ]
    },
    'TBE DSL 算子开发': {
      summary: 'TBE DSL（Tensor Boost Engine Domain-Specific Language）是昇腾提供的高层算子开发方式，用 Python 描述计算逻辑，由编译器自动生成底层 NPU 指令。适合快速开发常规算子，无需了解 AI Core 底层细节。',
      concepts: [
        { term: 'compute 函数', desc: '描述算子的计算逻辑，使用 tvm.compute 定义 tensor 操作（add/mul/matmul 等），编译器据此生成 NPU 代码' },
        { term: 'schedule 策略', desc: '指定计算的调度方式（tiling、并行、流水线），直接影响性能。CANN 提供 auto_schedule 可自动选取最优调度' },
        { term: '算子注册', desc: '算子开发完成后需注册到 CANN 算子库，之后 ATC 模型转换和 AscendCL 推理均可自动调用' },
        { term: 'op_select_format', desc: '指定算子支持的输入/输出数据格式和数据类型，框架根据此信息选择合适的格式做数据预处理' },
        { term: 'UT/ST 测试', desc: 'Unit Test（单元测试）验证算子计算正确性；System Test（系统测试）在真实昇腾硬件上验证性能' },
      ],
      code: {
        lang: 'python',
        body: `# TBE DSL 示例：自定义 LeakyReLU 算子
import tbe
from tbe import tvm
from tbe.common.utils import para_check

@para_check.check_op_params(para_check.REQUIRED_INPUT,
                             para_check.REQUIRED_OUTPUT,
                             para_check.OPTION_ATTR_FLOAT,
                             para_check.KERNEL_NAME)
def leaky_relu(x, y, negative_slope=0.2, kernel_name="leaky_relu"):
    shape = x.get("shape")
    dtype = x.get("dtype").lower()

    data = tvm.placeholder(shape, name="data", dtype=dtype)

    # 计算逻辑：x > 0 ? x : slope * x
    res = tbe.vsub(data, tbe.vmuls(tbe.vmin(data,
                   tvm.const(0, dtype)), negative_slope))

    with tvm.target.cce():
        sch = tbe.auto_schedule(res)

    config = {"name": kernel_name, "tensor_list": [data, res]}
    tbe.build(sch, config)`,
        note: 'DSL 开发完成后通过 op_ut.py 进行单元测试，验证通过后 ATC 模型转换时可自动调用该算子。'
      },
      lab: {
        intro: '从零开发一个 TBE DSL 自定义算子（ReLU），包含算子实现、注册和单元测试三步。HiDevLab 已预装 TBE 开发环境。',
        steps: [
          { title: 'Step 1 — 编写算子 compute 函数', desc: '用 TBE DSL 描述 ReLU 的计算逻辑：f(x) = max(0, x)。这是算子的"数学定义"层。', code: `from tbe import tvm
import tbe

def relu_compute(x_tensor):
    """ReLU 计算函数：f(x) = max(0, x)"""
    shape = x_tensor.shape
    dtype = x_tensor.dtype

    # 用 TBE DSL 描述计算：逐元素取最大值
    result = tbe.vmax(x_tensor,
                      tvm.const(0, dtype=dtype))
    return result

# 测试 compute 函数（CPU 模拟）
import numpy as np
data = np.array([-2.0, -1.0, 0.0, 1.0, 2.0], dtype=np.float32)
expected = np.maximum(data, 0)
print(f"输入: {data}")
print(f"期望输出: {expected}")
print("✓ compute 函数逻辑正确")`, expected: '输入/期望输出打印，验证逻辑正确' },
          { title: 'Step 2 — 添加 schedule 调度策略', desc: '将 compute 结果交给 auto_schedule 自动选择最优 tiling 策略，完成算子编译。', code: `from tbe import tvm
import tbe
from tbe.common.platform import platform_info as tbe_platform

# 模拟完整的算子实现函数
def relu_op(shape, dtype, kernel_name="relu"):
    # 声明输入 Placeholder
    x = tvm.placeholder(shape, name="x", dtype=dtype)

    # compute 阶段
    with tbe.compute():
        result = tbe.vmax(x, tvm.const(0, dtype=dtype))

    # schedule 阶段：auto_schedule 自动选择最优策略
    with tvm.target.cce():
        sch = tbe.auto_schedule(result)

    # 编译配置
    config = {
        "name": kernel_name,
        "tensor_list": [x, result]
    }
    tbe.build(sch, config)
    print(f"✓ 算子 '{kernel_name}' 编译成功")
    print(f"  输入 shape: {shape}, dtype: {dtype}")

# 编译 float16 版本
relu_op((1, 1024), "float16")`, expected: "✓ 算子 'relu' 编译成功" },
          { title: 'Step 3 — 单元测试验证正确性', desc: '用 op_ut 框架生成随机输入，在 NPU 上运行算子并与 numpy 期望值比对，验证计算正确性。', code: `import numpy as np

# 模拟单元测试流程（实际使用 op_ut 框架）
def relu_numpy(x):
    """CPU 参考实现"""
    return np.maximum(x, 0)

# 生成测试用例
shapes = [(1, 64), (4, 256), (8, 1024)]
for shape in shapes:
    x = np.random.randn(*shape).astype(np.float16)
    expected = relu_numpy(x)

    # 在 NPU 上运行（这里用 numpy 模拟）
    npu_output = relu_numpy(x)  # 实际替换为 NPU 执行

    # 验证误差
    max_diff = np.max(np.abs(npu_output - expected))
    status = "✓ PASS" if max_diff < 1e-3 else "✗ FAIL"
    print(f"{status}  shape={shape}  max_diff={max_diff:.2e}")

print("\\n所有测试用例通过 — 算子正确性验证完成！")`, expected: '所有测试用例 ✓ PASS' },
        ]
      },
      resources: [
        { icon: '📖', title: 'TBE DSL 算子开发指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '完整 API 和开发流程' },
        { icon: '💻', title: '算子开发示例仓', href: 'https://gitee.com/ascend/samples', type: 'Gitee', subtitle: '各类 DSL 算子参考实现' },
      ]
    },
    'TIK 底层算子开发': {
      summary: 'TIK（Tensor Iterator Kernel）是 TBE 的底层接口，允许开发者精细控制 AI Core 内的数据搬移（DMA）和计算指令（矩阵乘/向量运算），可达到理论峰值性能的 95% 以上，但开发难度也相应更高。',
      concepts: [
        { term: 'TIK Instance', desc: 'tik.Tik() 创建的编程对象，所有 TIK 操作均通过它发出。相当于一个 AI Core 的"汇编器"' },
        { term: 'Tensor 声明', desc: '显式声明各级存储（HBM/L1/UB）上的 tensor，开发者完全控制数据在存储层次间的移动' },
        { term: 'data_move（DMA 搬移）', desc: '将数据从 HBM 搬到 L1/UB（称为 load），或从 UB 写回 HBM（称为 store）。DMA 传输是 TIK 性能优化的核心' },
        { term: 'vec_add/vec_mul/mmad', desc: 'TIK 的向量运算和矩阵乘法原语，直接映射到 AI Core 的 Vector/Cube 单元指令，无编译器抽象层' },
        { term: 'Tiling 设计', desc: '手动将输入 tensor 切分成能装入 L1 Buffer（512KB）的小块（tile），设计循环结构使数据流水不中断，是 TIK 开发最核心的工作' },
      ],
      code: {
        lang: 'python',
        body: `from te import tik

def vector_add_tik(shape, dtype, kernel_name):
    tik_inst = tik.Tik()

    # 声明输入/输出 tensor（在 HBM 上）
    a = tik_inst.Tensor(dtype, shape, tik.scope_gm, "a")
    b = tik_inst.Tensor(dtype, shape, tik.scope_gm, "b")
    c = tik_inst.Tensor(dtype, shape, tik.scope_gm, "c")

    # 声明 UB（Unified Buffer）上的临时 tensor
    a_ub = tik_inst.Tensor(dtype, shape, tik.scope_ubuf, "a_ub")
    b_ub = tik_inst.Tensor(dtype, shape, tik.scope_ubuf, "b_ub")
    c_ub = tik_inst.Tensor(dtype, shape, tik.scope_ubuf, "c_ub")

    # DMA：HBM → UB
    tik_inst.data_move(a_ub, a, 0, 1, shape[0]//8, 0, 0)
    tik_inst.data_move(b_ub, b, 0, 1, shape[0]//8, 0, 0)

    # 向量加法
    tik_inst.vec_add(64, c_ub, a_ub, b_ub, shape[0]//64, 8, 8, 8)

    # DMA：UB → HBM
    tik_inst.data_move(c, c_ub, 0, 1, shape[0]//8, 0, 0)

    tik_inst.BuildCCE(kernel_name=kernel_name,
                      inputs=[a, b], outputs=[c])`,
        note: 'TIK 开发需要熟悉 AI Core 的存储层次（HBM→L1→UB）和各单元的处理宽度（如 vec_add 每次处理64个 float16）。'
      },
      resources: [
        { icon: '📖', title: 'TIK 算子开发指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: 'data_move 和计算原语完整参考' },
        { icon: '📖', title: 'AI Core 编程模型', href: '#', type: '技术文章', subtitle: '存储层次与计算单元详解' },
      ]
    },
    'HCCL 分布式通信': {
      summary: 'HCCL（Huawei Collective Communication Library）是昇腾的集合通信库，基于物理网络（NVLink 级别的 HCCS 高速互联）提供 AllReduce、AllGather 等分布式训练必需的通信原语，接口与 NCCL 基本兼容。',
      concepts: [
        { term: 'Rank / WorldSize', desc: 'Rank 是分布式训练中每个进程的唯一编号（0 到 N-1），WorldSize 是总进程数（通常 = NPU 卡数）' },
        { term: 'AllReduce', desc: '将所有 Rank 的梯度张量求和（或取平均）后广播给所有 Rank，是数据并行训练的核心通信操作' },
        { term: 'AllGather', desc: '将每个 Rank 的局部 tensor 拼接成完整 tensor 并广播给所有 Rank，常用于张量并行（模型并行）' },
        { term: 'ReduceScatter', desc: 'AllReduce = ReduceScatter + AllGather，分开使用可配合 ZeRO 优化器减少单卡显存占用' },
        { term: 'rank_table_file', desc: 'JSON 格式的集群配置文件，描述每张卡的 IP、port、device_id，HCCL 据此建立通信拓扑，配错是分布式训练起不来的首要原因' },
      ],
      resources: [
        { icon: '📖', title: 'HCCL 配置与使用指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: 'rank_table 格式和 API 说明' },
        { icon: '💻', title: 'HCCL 分布式训练示例', href: 'https://gitee.com/ascend/samples', type: 'Gitee', subtitle: '2卡/8卡 AllReduce 完整示例' },
      ]
    },
    '大模型训练实战': {
      summary: '在昇腾集群上训练千亿参数大模型，需要同时使用数据并行（DP）、张量并行（TP）和流水线并行（PP）三种并行策略，并借助 MindSpore Transformers（MindFormers）框架简化工程实现。',
      concepts: [
        { term: '数据并行（DP）', desc: '每卡持有模型完整副本，处理不同数据 batch，梯度通过 HCCL AllReduce 聚合。最简单的并行方式，适合模型能放进单卡显存时' },
        { term: '张量并行（TP）', desc: '将模型的权重矩阵按列/行切分到多卡，适合超大 Linear 层。昇腾上使用 HCCL AllGather/ReduceScatter 实现，通信量与层宽度成正比' },
        { term: '流水线并行（PP）', desc: '将模型按层切分到多卡（如每8层一个 stage），不同 stage 流水处理不同 micro-batch，通过 send/recv 传递激活值' },
        { term: 'MindFormers', desc: 'MindSpore 的大模型训练框架，内置 LLaMA/GPT/Baichuan 等主流架构，支持 LoRA/P-Tuning 微调，配置式启动减少工程代码' },
        { term: 'ZeRO 优化器', desc: '将优化器状态、梯度、权重分片存储到不同卡，显著降低单卡显存占用，配合 TP+PP 可训练万亿参数模型' },
      ],
      resources: [
        { icon: '🎬', title: '昇腾大模型训练系列课程', href: '#', type: '视频课程', subtitle: '约 6 小时，从理论到实战' },
        { icon: '💻', title: 'MindSpore Transformers', href: 'https://gitee.com/mindspore/mindformers', type: 'Gitee', subtitle: 'LLaMA/GPT 等开箱即用配置' },
        { icon: '📖', title: '昇腾大模型开发指南', href: 'https://www.hiascend.com/document', type: '官方文档', subtitle: '并行策略配置详解' },
      ]
    }
  };

  // ── DRAWER STATE ──
  let _currentDrawerNode = null;
  let _currentDrawerTab = 'knowledge';

  // Node Detail Drawer
  // Can be called with a DOM element (from roadmap) or just a title string (from homepage path cards)
  function openNodeDrawer(nodeElOrTitle) {
    let title, cat, nodeEl, isCompleted;
    if (typeof nodeElOrTitle === 'string') {
      title = nodeElOrTitle;
      const meta = NODE_LIST.find(n => n.title === title);
      cat = meta?.category || 'beginner';
      nodeEl = null;
      isCompleted = false;
    } else {
      nodeEl = nodeElOrTitle;
      title = nodeEl.querySelector('.rm-node-title').textContent.trim();
      cat = nodeEl.dataset.category || 'beginner';
      isCompleted = nodeEl.classList.contains('completed');
    }

    const phaseColor = { beginner: '#10B981', developer: '#2e53fa', operator: '#8B5CF6', distributed: '#F59E0B' };
    _currentDrawerNode = { title, el: nodeEl, category: cat };

    document.getElementById('nd-title').textContent = title;
    document.getElementById('nd-phase-dot').style.background = phaseColor[cat] || '#10B981';
    const completeBtn = document.getElementById('nd-complete-btn');
    completeBtn.textContent = isCompleted ? '已完成 ✓' : '标记完成';
    completeBtn.className = 'nd-complete-btn' + (isCompleted ? ' done' : '');

    // Reset AI strip
    document.getElementById('nd-ai-input').value = '';
    const _r = document.getElementById('nd-ai-response');
    _r.classList.add('hidden'); _r.classList.remove('collapsed'); _r.innerHTML = '';
    document.querySelectorAll('.nd-ai-mode').forEach(b => b.classList.remove('active-mode'));

    // Load first tab
    _currentDrawerTab = 'knowledge';
    document.querySelectorAll('.nd-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === 'knowledge');
    });
    renderNdTab('knowledge', title);

    document.getElementById('node-drawer').classList.add('open');
  }

  function closeNodeDrawer() {
    document.getElementById('node-drawer').classList.remove('open');
    _currentDrawerNode = null;
  }

  function toggleNodeComplete() {
    if (!_currentDrawerNode) return;
    const el = _currentDrawerNode.el;
    const isNowComplete = !el.classList.contains('completed');
    el.classList.toggle('completed', isNowComplete);
    const statusEl = el.querySelector('.rm-status');
    if (statusEl) { statusEl.className = 'rm-status' + (isNowComplete ? ' done' : ''); statusEl.textContent = isNowComplete ? '✓' : ''; }
    const btn = document.getElementById('nd-complete-btn');
    btn.textContent = isNowComplete ? '已完成 ✓' : '标记完成';
    btn.className = 'nd-complete-btn' + (isNowComplete ? ' done' : '');
    updateProgressTracker();
    saveLearnState();
  }

  function switchNdTab(tab, btn) {
    _currentDrawerTab = tab;
    document.querySelectorAll('.nd-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    if (tab === 'quiz') {
      testNodeKnowledge();
      return;
    }
    renderNdTab(tab, _currentDrawerNode?.title);
  }

  // NODE_VIDEO: Bilibili-style video metadata per node (shown as embed placeholder)
  const NODE_VIDEO = {
    '昇腾硬件体系':      { title: '达芬奇架构深度解析 | 昇腾 AI 系列', duration: '45:12', tag: 'CANN 基础' },
    'CANN 软件栈概览':   { title: 'CANN 全栈介绍：从驱动到框架', duration: '32:05', tag: 'CANN 基础' },
    '环境安装与配置':    { title: 'CANN 8.0 环境安装实战演示', duration: '18:44', tag: '环境配置' },
    'AscendCL 编程基础': { title: 'AscendCL 编程入门：设备 / 流 / 内存', duration: '52:30', tag: 'AscendCL' },
    '模型推理部署':      { title: 'ATC 模型转换与离线推理实战', duration: '40:18', tag: '推理部署' },
    '数据预处理 (DVPP)': { title: 'DVPP 硬件加速：图像解码与预处理', duration: '27:55', tag: 'DVPP' },
    '性能调优实战':      { title: 'Profiling 工具使用与性能瓶颈分析', duration: '61:09', tag: '性能优化' },
    'TBE DSL 算子开发':  { title: 'TBE DSL 自定义算子开发全流程', duration: '48:33', tag: '算子开发' },
    'TIK 底层算子开发':  { title: 'TIK C++ 核函数与 AI Core 指令集', duration: '55:20', tag: 'TIK 开发' },
    'HCCL 分布式通信':   { title: 'HCCL 集合通信与多卡训练配置', duration: '38:47', tag: '分布式' },
    '大模型训练实战':    { title: 'MindFormers 大模型训练实战（LLaMA）', duration: '2:15:00', tag: '大模型' },
  };

  function renderNdTab(tab, title) {
    const body = document.getElementById('nd-body');
    const k = NODE_KNOWLEDGE[title];
    if (!k) {
      body.innerHTML = `<p class="nd-summary">${_currentDrawerNode?.el?.querySelector('.rm-desc')?.textContent || '暂无内容'}</p>`;
      return;
    }

    if (tab === 'knowledge') {
      // Video embed placeholder
      const vid = NODE_VIDEO[title] || { title: title + ' — 讲解视频', duration: '--:--', tag: '课程视频' };
      const videoHtml = `
        <div class="nd-video-wrap" onclick="showNbToast('即将跳转视频平台（演示模式）')">
          <div class="nd-video-thumb">
            <div class="nd-video-play">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div class="nd-video-title">${vid.title}</div>
            <div class="nd-video-badge">${vid.tag} · ${vid.duration}</div>
          </div>
        </div>`;

      const diagramHtml = k.diagram ? `<div class="nd-section-title">架构示意</div><div class="nd-diagram">${k.diagram}</div>` : '';

      // Resources list at bottom
      const resList = (k.resources || []).map(r => `
        <a class="nd-res-item" href="${r.href}" target="_blank">
          <span class="nd-res-icon">${r.icon}</span>
          <div class="nd-res-info">
            <div class="nd-res-title">${r.title}</div>
            ${r.subtitle ? `<div class="nd-res-subtitle">${r.subtitle}</div>` : ''}
          </div>
          <span class="nd-res-badge">${r.type}</span>
        </a>`).join('');
      const resHtml = resList ? `<div class="nd-section-title" style="margin-top:24px;">延伸资源</div><div class="nd-res-list">${resList}</div>` : '';

      body.innerHTML = `
        ${videoHtml}
        <div class="nd-summary">${k.summary}</div>
        <div class="nd-section-title">核心概念</div>
        <div class="nd-concepts">
          ${k.concepts.map(c => `<div class="nd-concept"><div class="nd-concept-term">${c.term}</div><div class="nd-concept-desc">${c.desc}</div></div>`).join('')}
        </div>
        ${diagramHtml}
        ${resHtml}`;

    } else if (tab === 'practice') {
      // Code + Lab merged
      let codeHtml = '';
      if (k.code) {
        codeHtml = `
          <div class="nd-section-title">代码示例</div>
          <div class="nd-code-block">
            <div class="nd-code-header">
              <span class="nd-code-lang">${k.code.lang}</span>
              <div class="nd-code-actions">
                <button class="nd-code-btn" onclick="openEmptySandbox()">▶ 在 HiDevLab 运行</button>
                <button class="nd-code-btn" onclick="ndCopyCode(this)">复制</button>
              </div>
            </div>
            <div class="nd-code-body"><pre style="margin:0;white-space:pre-wrap;word-break:break-all;">${escHtml(k.code.body)}</pre></div>
          </div>
          <div class="nd-code-note">${k.code.note}</div>`;
      }

      let labHtml = '';
      if (k.lab) {
        const stepsHtml = k.lab.steps.map((s, i) => `
          <div class="nd-lab-step" id="nd-lab-step-${i}">
            <div class="nd-lab-step-header" onclick="toggleLabStep(${i})">
              <div class="nd-lab-step-num">${i + 1}</div>
              <div class="nd-lab-step-title">${s.title}</div>
              <span class="nd-lab-step-toggle">▾</span>
            </div>
            <div class="nd-lab-step-body">
              <div class="nd-lab-step-desc">${s.desc}</div>
              <div class="nd-lab-code-preview">${escHtml(s.code)}</div>
              <button class="nd-lab-run-btn" onclick="openLabStep(${i})">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                在 HiDevLab 中运行此步
              </button>
              <div class="nd-lab-expected"><span class="nd-lab-expected-label">预期：</span>${escHtml(s.expected)}</div>
            </div>
          </div>`).join('');
        labHtml = `
          <div class="nd-section-title" style="margin-top:${k.code ? '28px' : '0'};">动手实验</div>
          <div class="nd-lab-intro">${k.lab.intro}</div>
          <div class="nd-lab-steps">${stepsHtml}</div>`;
      }

      if (!codeHtml && !labHtml) {
        body.innerHTML = `<div class="nd-lab-empty">本节以理论概念为主，暂无独立代码练习。<br>可点击下方 AI 按钮即时生成练习代码。</div>`;
      } else {
        body.innerHTML = codeHtml + labHtml;
        const first = body.querySelector('.nd-lab-step');
        if (first) first.classList.add('open');
      }
    }
  }

  function toggleLabStep(idx) {
    const step = document.getElementById(`nd-lab-step-${idx}`);
    if (step) step.classList.toggle('open');
  }

  function openLabStep(stepIdx) {
    if (!_currentDrawerNode) return;
    const k = NODE_KNOWLEDGE[_currentDrawerNode.title];
    if (!k || !k.lab) return;
    const step = k.lab.steps[stepIdx];
    if (!step) return;

    // Add a markdown guidance cell + the code cell to HiDevLab
    nbCellCounter++;
    const guidanceMd = `## ${_currentDrawerNode.title} — ${step.title}\n\n${step.desc}\n\n**预期输出：** \`${step.expected}\``;
    NB_FILES['main'] = NB_FILES['main'] || [];
    NB_FILES['main'].unshift(
      { id: nbCellCounter,     type: 'code',     code: step.code, output: '' },
      { id: nbCellCounter - 1, type: 'markdown', code: guidanceMd, output: '' }
    );
    nbCellCounter++;
    nbCurrentFile = 'main';

    // Open sandbox
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.nb-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('nb-panel-notebook').classList.add('active');
    renderNbCells();

    // Scroll to the new cell
    setTimeout(() => {
      const c = document.getElementById('nb-cell-' + nbCellCounter);
      if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); activateCell(c); }
    }, 120);
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  const _COPY_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;
  function _setCopied(btn, originalHTML) {
    btn.innerHTML = `${_COPY_SVG} 已复制`;
    btn.style.cssText += ';display:inline-flex;align-items:center;gap:4px;';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = originalHTML; btn.classList.remove('copied'); btn.style.display = ''; }, 1800);
  }
  function ndCopyCode(btn) {
    const code = btn.closest('.nd-code-block').querySelector('.nd-code-body pre').textContent;
    const orig = btn.innerHTML;
    navigator.clipboard.writeText(code).then(() => _setCopied(btn, orig));
  }

  // ── DRAWER AI ──
  function prefillDrawerAI(btn, text) {
    document.querySelectorAll('.nd-ai-mode').forEach(b => b.classList.remove('active-mode'));
    btn.classList.add('active-mode');
    const input = document.getElementById('nd-ai-input');
    input.value = text;
    input.focus();
  }

  function _respHeader(label) {
    return `<div class="nd-ai-resp-header" onclick="toggleDrawerResp(this)">
      <span class="nd-ai-resp-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2C9 5.866 5.866 9 2 9c3.866 0 7 3.134 7 7 0-3.866 3.134-7 7-7-3.866 0-7-3.134-7-7z"/><path d="M20 12c0 2.209-1.791 4-4 4 2.209 0 4 1.791 4 4 0-2.209 1.791-4 4-4-2.209 0-4-1.791-4-4z"/></svg>
        ${label}
      </span>
      <button class="nd-ai-resp-toggle">
        收起
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </div>`;
  }

  function toggleDrawerResp(header) {
    const resp = header.closest('.nd-ai-response');
    const collapsed = resp.classList.toggle('collapsed');
    const btn = header.querySelector('.nd-ai-resp-toggle');
    btn.childNodes[0].textContent = collapsed ? '展开' : '收起';
  }

  async function sendDrawerAI() {
    if (!_currentDrawerNode) return;
    const input = document.getElementById('nd-ai-input');
    const q = input.value.trim();
    if (!q) return;
    const resp = document.getElementById('nd-ai-response');
    resp.classList.remove('hidden', 'collapsed');
    resp.innerHTML = _respHeader('AI 回答') +
      `<div class="nd-ai-resp-body"><div style="color:var(--text-muted);font-size:12px;padding:4px 0">AI 思考中…</div></div>`;
    input.value = '';
    try {
      const r = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `你是 CANN / 昇腾 AI 开发专家。用户正在学习"${_currentDrawerNode.title}"这个知识点，请针对这个具体主题回答他的问题。回答要简洁、有深度，用中文，不超过400字，代码用代码块格式。`,
          user: q, max_tokens: 600
        })
      });
      const data = await r.json();
      resp.querySelector('.nd-ai-resp-body').innerHTML = formatFloorText(data.text || '暂时无法获取回答，请稍后重试。');
    } catch(e) {
      resp.querySelector('.nd-ai-resp-body').innerHTML = '<span style="color:#EF4444">连接失败，请稍后重试</span>';
    }
  }

  // ── INLINE QUIZ in drawer nd-body ──
  const _quizFallback = [
    { question: "以下哪项是昇腾 AI 处理器的核心架构？", options: ["GPU", "FPGA", "Da Vinci", "ARM"], answer: "Da Vinci" },
    { question: "CANN 软件栈中，负责模型转换的工具是？", options: ["MsProf", "ATC", "HCCL", "DVPP"], answer: "ATC" },
    { question: "AscendCL 中，用于管理异步任务队列的机制是？", options: ["Context", "Stream", "Event", "Device"], answer: "Stream" },
    { question: "在 TBE 开发中，TIK 接口的主要优势是？", options: ["自动调度", "极致性能控制", "简单易用", "跨平台兼容"], answer: "极致性能控制" },
    { question: "昇腾 310 AI 处理器主要面向以下哪种场景？", options: ["大模型训练", "边缘推理", "通用计算", "图形渲染"], answer: "边缘推理" },
  ];
  let _inlineQuiz = null;

  function _renderInlineQuiz(quiz) {
    _inlineQuiz = quiz;
    const body = document.getElementById('nd-body');
    const optsHtml = quiz.options.map((opt, i) => `
      <label class="nd-quiz-opt" onclick="ndQuizSelect(this)">
        <input type="radio" name="nd-quiz-opt" value="${opt.replace(/"/g,'&quot;')}">
        ${opt}
      </label>`).join('');
    body.innerHTML = `<div class="nd-quiz">
      <div class="nd-quiz-q">${quiz.question}</div>
      <div class="nd-quiz-opts">${optsHtml}</div>
      <button class="nd-quiz-submit" onclick="ndQuizSubmit(this)" disabled>提交答案</button>
      <div class="nd-quiz-feedback" id="nd-quiz-feedback"></div>
      <button class="nd-quiz-retry" onclick="testNodeKnowledge()" style="display:none" id="nd-quiz-retry">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        换一题
      </button>
      <button class="nd-quiz-bank-link" id="nd-quiz-bank-link" style="display:none" onclick="openQuizBank()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        查看错题本
      </button>
    </div>`;
  }

  function ndQuizSelect(label) {
    document.querySelectorAll('.nd-quiz-opt').forEach(l => l.classList.remove('selected'));
    label.classList.add('selected');
    label.querySelector('input').checked = true;
    const btn = document.querySelector('.nd-quiz-submit');
    if (btn) btn.disabled = false;
  }

  // ── QUIZ XP & STREAK SYSTEM ──
  const XP_KEY = 'cann_xp';
  const STREAK_KEY = 'cann_streak';

  function getXP() { return parseInt(localStorage.getItem(XP_KEY) || '0', 10); }
  function getStreak() { return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10); }
  function addXP(pts) { localStorage.setItem(XP_KEY, getXP() + pts); }
  function setStreak(n) { localStorage.setItem(STREAK_KEY, n); }

  const STREAK_MESSAGES = [
    '继续保持！', '答对了！', '很棒！', '来了来了！',
    '节节高升！🔥', '连续答对 3 题！🎯', '厉害！连对 5 题！⚡', '完美！连续正确！🚀'
  ];

  function ndQuizSubmit(btn) {
    if (!_inlineQuiz) return;
    const selected = document.querySelector('input[name="nd-quiz-opt"]:checked');
    const feedback = document.getElementById('nd-quiz-feedback');
    const retry = document.getElementById('nd-quiz-retry');
    if (!selected) return;
    btn.disabled = true;
    document.querySelectorAll('.nd-quiz-opt').forEach(l => {
      l.style.pointerEvents = 'none';
      if (l.querySelector('input').value === _inlineQuiz.answer) {
        l.classList.add('correct');
      } else if (l.classList.contains('selected')) {
        l.classList.add('wrong');
      }
    });
    const correct = selected.value === _inlineQuiz.answer;

    // XP & Streak logic
    let streak = getStreak();
    let xpGain = 0;
    let incentiveHtml = '';
    if (correct) {
      streak++;
      xpGain = 10 + (streak >= 3 ? 5 : 0); // bonus for streaks
      addXP(xpGain);
      setStreak(streak);
      const msgIdx = Math.min(streak - 1, STREAK_MESSAGES.length - 1);
      const streakDisplay = streak >= 2 ? `<span class="nd-streak">🔥 ×${streak}</span>` : '';
      incentiveHtml = `<div class="nd-xp-row">
        <span class="nd-xp-badge">⚡ ${getXP()} XP</span>
        ${streakDisplay}
        <span class="nd-xp-msg correct">${STREAK_MESSAGES[msgIdx]}</span>
        <span class="xp-pop">+${xpGain} XP</span>
      </div>`;
    } else {
      setStreak(0);
      incentiveHtml = `<div class="nd-xp-row">
        <span class="nd-xp-badge">⚡ ${getXP()} XP</span>
        <span class="nd-xp-msg wrong">别灰心，再来一次！</span>
      </div>`;
    }

    feedback.innerHTML = (correct ? '🎉 回答正确！' : `答案是：${escHtml(_inlineQuiz.answer)}`) + incentiveHtml;
    feedback.style.color = correct ? '#16A34A' : '#DC2626';
    btn.textContent = correct ? '✓ 正确' : '✗ 错误';
    btn.style.background = correct ? '#16A34A' : '#DC2626';
    if (retry) retry.style.display = 'flex';
    saveQuizResult(_inlineQuiz, selected.value, correct);
    const bankLink = document.getElementById('nd-quiz-bank-link');
    if (bankLink) bankLink.style.display = 'inline-flex';
  }

  async function testNodeKnowledge() {
    if (!_currentDrawerNode) return;
    const title = _currentDrawerNode.title;
    const k = NODE_KNOWLEDGE[title];
    const concepts = k ? k.concepts.map(c => c.term).join('、') : title;
    const body = document.getElementById('nd-body');
    body.innerHTML = `<div class="nd-quiz-loading"><div class="floor-dots"><span></span><span></span><span></span></div>AI 正在出题…</div>`;
    try {
      const r = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `出一道关于"${title}"的单选题，涉及这些概念：${concepts}。
格式（严格JSON）：{"question":"题目","options":["A选项","B选项","C选项","D选项"],"answer":"正确选项文字"}
只输出JSON，不加任何其他内容。`,
          user: `请出一道难度适中的测验题`, max_tokens: 250
        })
      });
      const data = await r.json();
      const quiz = JSON.parse(data.text.replace(/```json|```/g,'').trim());
      _renderInlineQuiz(quiz);
    } catch(e) {
      const fallback = _quizFallback[Math.floor(Math.random() * _quizFallback.length)];
      _renderInlineQuiz(fallback);
    }
  }

  // Keep modal stubs so nothing breaks if called elsewhere
  function testKnowledge() { testNodeKnowledge(); }
  function closeQuizModal() {}
  function submitQuiz() {}

  // Close quiz modal when clicking outside
  window.addEventListener('click', (event) => {
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal && event.target === quizModal) {
      quizModal.classList.remove('open');
    }
  });

  // Doc switching
  function showDoc(id) {
    // Hide all docs
    document.querySelectorAll('[id^="doc-"]').forEach(d => d.style.display = 'none');
    // Show target or default
    const el = document.getElementById('doc-' + id);
    if (el) {
      el.style.display = 'block';
    } else {
      document.getElementById('doc-default').style.display = 'block';
    }
    // Update sidebar active
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + id + "'")) {
        item.classList.add('active');
      }
    });
  }

  // Tab switching
  function switchTab(el, targetId) {
    const parent = el.closest('.docs-content') || document.getElementById('doc-quickstart');
    el.parentElement.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    // find sibling tab contents
    const allContents = document.querySelectorAll('#doc-quickstart .tab-content');
    allContents.forEach(tc => tc.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
  }

  // ══ HERO MODE & FLOOR SYSTEM ══
  let currentHeroMode = '';
  let solveCurrentCat = 'install';

  const issueData = {
    install: [
      { title: 'ACL 初始化失败', desc: 'aclInit() 返回非零错误码', badge: 'error' },
      { title: '驱动版本不兼容', desc: 'NPU 驱动与 CANN 版本不匹配', badge: 'error' },
      { title: 'Python 包安装报错', desc: 'pip install cann-toolkit 失败', badge: 'warning' },
      { title: 'Docker 镜像拉取失败', desc: 'AscendHub 镜像无法下载', badge: 'info' },
    ],
    inference: [
      { title: '.om 模型加载失败', desc: 'aclmdlLoadFromFile 返回错误', badge: 'error' },
      { title: 'HBM 内存溢出', desc: '运行时 OOM 错误', badge: 'error' },
      { title: 'Stream 同步超时', desc: 'aclrtSynchronizeStream 超时', badge: 'error' },
      { title: '输出结果精度异常', desc: 'FP16 精度与预期偏差过大', badge: 'warning' },
    ],
    operator: [
      { title: '算子不支持报错', desc: '自定义算子注册失败', badge: 'warning' },
      { title: 'TBE 算子编译报错', desc: 'DSL 编译时出现语法错误', badge: 'warning' },
      { title: '算子调度失败', desc: 'aicpu 算子无法调度到 NPU', badge: 'error' },
      { title: '算子输出 shape 错误', desc: '推导出的输出形状与预期不符', badge: 'info' },
    ],
    perf: [
      { title: '推理吞吐量低', desc: 'NPU 利用率不足 50%', badge: 'warning' },
      { title: 'ATC 转换后性能下降', desc: '转 .om 后推理速度低于预期', badge: 'warning' },
      { title: '内存带宽瓶颈', desc: 'Profiling 显示 DMA 传输占比过高', badge: 'info' },
      { title: '多卡通信效率低', desc: 'HCCL AllReduce 耗时异常', badge: 'info' },
    ],
  };

  function selectHeroMode(el, mode) {
    document.querySelectorAll('.suggest-tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    currentHeroMode = mode;

    // Open the corresponding floor immediately
    if (mode === 'solve') openFloor('floor-solve');
    else if (mode === 'learn') openFloor('floor-learn');
    else openFloor('floor-resource');
  }

  function heroChipClick(text) {
    document.getElementById('home-ai-input-hero').value = text;
    heroSubmit();
  }

  function heroSubmit() {
    const val = document.getElementById('home-ai-input-hero').value.trim();
    if (!val) return;
    if (currentHeroMode === 'solve' || !currentHeroMode) {
      openFloor('floor-solve');
      solveProblemWithText(val);
    } else if (currentHeroMode === 'learn') {
      openFloor('floor-learn');
      document.getElementById('learn-input').value = val;
      generateLearnFloor();
    } else {
      openFloor('floor-resource');
      document.getElementById('resource-input').value = val;
      findResourceFloor();
    }
  }

  function openFloor(id) {
    ['floor-solve','floor-learn','floor-resource'].forEach(fid => {
      const el = document.getElementById(fid);
      if (fid === id) {
        el.classList.remove('hidden');
        setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
      } else {
        el.classList.add('hidden');
      }
    });
  }

  function closeFloor() {
    ['floor-solve','floor-learn','floor-resource'].forEach(fid => {
      document.getElementById(fid).classList.add('hidden');
    });
    document.querySelectorAll('.suggest-tag').forEach(t => t.classList.remove('active'));
    currentHeroMode = '';
  }

  function openSolveFloor(cat) {
    openFloor('floor-solve');
    if (cat) selectSolveCat(cat, document.querySelector(`.floor-cat[onclick*="${cat}"]`) || document.querySelector('.floor-cat'));
  }

  function openLearnFloorWith(query) {
    openFloor('floor-learn');
    document.getElementById('learn-input').value = query;
    generateLearnFloor();
  }

  // ── SOLVE FLOOR ──
  function selectSolveCat(cat, btn) {
    solveCurrentCat = cat;
    document.querySelectorAll('.floor-cat').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderFloorIssues(cat);
  }

  function renderFloorIssues(cat) {
    const issues = issueData[cat] || [];
    const grid = document.getElementById('floor-issue-grid');
    if (!grid) return;
    const badgeLabel = { error: '错误', warning: '警告', info: '提示' };
    grid.innerHTML = issues.map(issue => `
      <div class="floor-issue-card badge-${issue.badge}" onclick="solveProblemWithText('${issue.title.replace(/'/g,"\\'")}')">
        <div class="fic-body">
          <div class="fic-title">${issue.title}</div>
          <div class="fic-desc">${issue.desc}</div>
          <span class="fic-badge ${issue.badge}">${badgeLabel[issue.badge] || issue.badge}</span>
        </div>
      </div>
    `).join('');
  }

  function fillSolveAndRun(text) {
    openFloor('floor-solve');
    document.getElementById('solve-input').value = text;
    solveProblemFloor();
  }

  function fillResourceAndRun(text) {
    openFloor('floor-resource');
    document.getElementById('resource-input').value = text;
    findResourceFloor();
  }

  async function solveProblemFloor() {
    const input = document.getElementById('solve-input');
    const text = input.value.trim();
    if (!text) return;
    await solveProblemWithText(text);
  }

  async function solveProblemWithText(problemText) {
    const box = document.getElementById('floor-solution');
    const title = document.getElementById('floor-solution-title');
    const body = document.getElementById('floor-solution-body');
    box.classList.remove('hidden');
    title.textContent = '正在分析：' + problemText;
    body.innerHTML = '<div class="floor-loading"><div class="floor-dots"><span></span><span></span><span></span></div><span>AI 正在生成解决方案…</span></div>';
    setTimeout(() => box.scrollIntoView({ behavior:'smooth', block:'nearest' }), 80);
    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: '你是 CANN 技术支持专家。针对用户描述的开发问题给出解决方案。格式：先1-2句说明问题原因，再用编号列出具体步骤，必要时给出代码示例（用反引号包裹）。用中文，简洁精准。',
          user: '问题：' + problemText,
          max_tokens: 1000,
        })
      });
      const data = await resp.json();
      const text = data.text || '暂时无法获取解决方案。';
      title.textContent = '解决方案：' + problemText;
      body.innerHTML = formatFloorText(text);
    } catch(e) {
      body.innerHTML = '<span style="color:var(--text-muted)">暂时无法连接 AI 服务，请稍后重试。</span>';
    }
  }

  // ── LEARN FLOOR ──
  function setLearnInput(text) {
    openFloor('floor-learn');
    document.getElementById('learn-input').value = text;
  }

  async function generateLearnFloor() {
    const input = document.getElementById('learn-input');
    const query = input.value.trim();
    if (!query) return;
    const btn = document.getElementById('btn-learn-gen');
    btn.textContent = '生成中…'; btn.disabled = true;
    const result = document.getElementById('floor-learn-result');
    result.classList.remove('hidden');
    result.innerHTML = '<div class="floor-loading" style="padding:20px 0"><div class="floor-dots"><span></span><span></span><span></span></div><span>AI 正在规划学习路径…</span></div>';
    setTimeout(() => result.scrollIntoView({ behavior:'smooth', block:'nearest' }), 80);

    const nodeListStr = NODE_LIST.map((n, i) => `${i}|${n.title}|${n.category}|${n.desc}`).join('\n');

    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `你是 CANN 学习路径规划专家。根据用户的学习目标，从下面的知识节点库中挑选4-6个最相关的节点，按学习顺序排列，组成个性化路径。\n\n节点库（格式：序号|节点名|方向|描述）：\n${nodeListStr}\n\n输出格式：JSON数组，每项包含 nodeIndex（节点序号）和 reason（一句话说明为什么学这个节点，不超过12字）。\n例：[{"nodeIndex":0,"reason":"了解底层硬件架构"},{"nodeIndex":3,"reason":"动手写第一个应用"}]\n只输出JSON，不加任何说明或代码块标记。`,
          user: `我的学习目标：${query}`,
          max_tokens: 400,
        })
      });
      const data = await resp.json();
      const text = data.text || '[]';
      let picks = [];
      try { picks = JSON.parse(text.replace(/```json|```/g,'').trim()); } catch(e) {}

      if (picks.length > 0) {
        const steps = picks.map((p, idx) => {
          const node = NODE_LIST[p.nodeIndex] || NODE_LIST[0];
          return { ...node, step: idx + 1, reason: p.reason || node.desc };
        });
        renderLearnPathResult(query, steps);
      } else {
        result.innerHTML = '<span style="color:var(--text-muted);font-size:14px">路径生成失败，请重新尝试。</span>';
      }
    } catch(e) {
      result.innerHTML = '<span style="color:var(--text-muted);font-size:14px">暂时无法连接 AI 服务，请稍后重试。</span>';
    }
    btn.textContent = '生成路径'; btn.disabled = false;
  }

  // ── SAVED PATHS ──
  function getSavedPaths() {
    try { return JSON.parse(localStorage.getItem('cann_saved_paths') || '[]'); } catch(e) { return []; }
  }
  function setSavedPaths(paths) {
    try { localStorage.setItem('cann_saved_paths', JSON.stringify(paths)); } catch(e) {}
  }

  function toggleSavePath(btn, query) {
    const steps = _lastFlrPath || [];
    const paths = getSavedPaths();
    const existing = paths.findIndex(p => p.query === query);
    if (existing >= 0) {
      paths.splice(existing, 1);
      setSavedPaths(paths);
      btn.classList.remove('saved');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>收藏路径`;
    } else {
      paths.unshift({ query, steps, savedAt: new Date().toLocaleDateString('zh-CN') });
      setSavedPaths(paths);
      btn.classList.add('saved');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>已收藏`;
    }
    renderSavedPaths();
  }

  function renderSavedPaths() {
    const paths = getSavedPaths();
    const section = document.getElementById('saved-paths-section');
    const list = document.getElementById('saved-paths-list');
    const count = document.getElementById('saved-paths-count');
    if (!section) return;
    if (paths.length === 0) {
      section.classList.add('empty');
      return;
    }
    section.classList.remove('empty');
    count.textContent = paths.length;
    list.innerHTML = paths.map((p, i) => `
      <div class="saved-path-item">
        <div class="saved-path-name">${p.query}</div>
        <div class="saved-path-date">${p.steps?.length || 0} 个节点 · ${p.savedAt}</div>
        <button class="btn-load-path" onclick="loadSavedPath(${i})">展开</button>
        <button class="btn-delete-path" onclick="deleteSavedPath(${i})" title="删除">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `).join('');
  }

  function loadSavedPath(index) {
    const paths = getSavedPaths();
    const saved = paths[index];
    if (!saved) return;
    _lastFlrPath = saved.steps;
    document.getElementById('learn-input').value = saved.query;
    const result = document.getElementById('floor-learn-result');
    renderLearnPathResult(saved.query, saved.steps);
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function deleteSavedPath(index) {
    const paths = getSavedPaths();
    paths.splice(index, 1);
    setSavedPaths(paths);
    renderSavedPaths();
  }

  // Renders the AI path result on the homepage floor
  // steps = array of NODE_LIST items augmented with { step, reason }
  function renderLearnPathResult(query, steps) {
    _lastFlrPath = steps;
    const result = document.getElementById('floor-learn-result');

    // Group by category preserving first appearance order
    const seenCats = [];
    const grouped = {};
    steps.forEach(s => {
      const cat = s.category || 'beginner';
      if (!grouped[cat]) { grouped[cat] = []; seenCats.push(cat); }
      grouped[cat].push(s);
    });

    const phasesHtml = seenCats.map(cat => {
      const meta = CAT_META[cat] || CAT_META.beginner;
      return `
      <div class="flr-phase">
        <div class="flr-phase-label">
          <div class="flr-phase-badge" style="background:${meta.color}">${meta.label}</div>
          <div class="flr-phase-line"></div>
        </div>
        <div class="flr-timeline">
          ${grouped[cat].map((s, i) => `
            <div class="flr-node" style="animation:flrNodeIn .3s ease ${i*0.07}s both">
              <div class="flr-node-dot ${cat}" style="background:${meta.color}">${s.step}</div>
              <div class="flr-node-card" onclick="openLearnNode('${s.title.replace(/'/g,"\\'")}')">
                <div class="flr-node-body">
                  <div class="flr-node-title">${s.title}</div>
                  <div class="flr-node-desc">${s.reason || s.whyDesc || s.desc}</div>
                </div>
                <svg class="flr-node-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
    }).join('');

    const isSaved = getSavedPaths().some(p => p.query === query);
    const legendHtml = Object.entries(CAT_META).map(([k,v]) =>
      `<div class="flr-legend-item"><div class="flr-legend-dot" style="background:${v.color}"></div>${v.label}</div>`
    ).join('');

    result.innerHTML = `
      <div class="flr-header">
        <div class="flr-header-text">
          <div class="flr-query-label">AI 生成的学习路径</div>
          <div class="flr-title">${query}</div>
        </div>
        <div class="flr-legend">${legendHtml}</div>
      </div>
      ${phasesHtml}
      <div class="flr-cta">
        <span class="flr-cta-text">共 ${steps.length} 个知识节点 · 点击节点跳转学习页展开</span>
        <div style="display:flex;gap:10px;align-items:center;">
          <button class="flr-save-btn ${isSaved ? 'saved' : ''}" id="btn-save-path" onclick="toggleSavePath(this, '${query.replace(/'/g,"\\'")}')">
            <svg viewBox="0 0 24 24" ${isSaved ? 'fill="currentColor"' : 'fill="none"'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            ${isSaved ? '已收藏' : '收藏路径'}
          </button>
          <button class="flr-cta-btn" onclick="navigateLearnWithPath('${query.replace(/'/g,"\\'")}')">
            在学习页深入学习
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>`;
  }

  // Navigate to learn page and apply the last generated path
  function navigateLearnWithPath(query) {
    if (!_lastFlrPath) return;
    sessionStorage.setItem('_pendingLearnPath', JSON.stringify({ query, nodes: _lastFlrPath }));
    showPage('learn');
  }

  // Open node drawer in-place (works from any page)
  function openLearnNode(title) {
    openNodeDrawer(title);
  }

  // ── RESOURCE FLOOR ──
  async function findResourceFloor() {
    const input = document.getElementById('resource-input');
    const query = input.value.trim();
    if (!query) return;
    const box = document.getElementById('floor-resource-result');
    const title = document.getElementById('floor-resource-title');
    const body = document.getElementById('floor-resource-body');
    box.classList.remove('hidden');
    title.textContent = '正在搜索：' + query;
    body.innerHTML = '<div class="floor-loading"><div class="floor-dots"><span></span><span></span><span></span></div><span>AI 正在查找资源…</span></div>';
    setTimeout(() => box.scrollIntoView({ behavior:'smooth', block:'nearest' }), 80);
    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: '你是 CANN 资源导航专家。帮用户找到所需资源：列出资源名称、下载/访问地址（使用 https://www.hiascend.com 域名）、简短说明。用中文，列表格式，简洁实用。',
          user: '我需要：' + query,
          max_tokens: 600,
        })
      });
      const data = await resp.json();
      const text = data.text || '';
      title.textContent = '资源推荐：' + query;
      body.innerHTML = formatFloorText(text);
    } catch(e) {
      body.innerHTML = '<span style="color:var(--text-muted)">暂时无法连接 AI 服务，请稍后重试。</span>';
    }
  }

  // ── TEXT FORMATTER ──
  function copyBlockCode(btn) {
    const code = btn.closest('.ai-code-block').querySelector('code').innerText;
    const orig = btn.innerHTML;
    navigator.clipboard.writeText(code).then(() => {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1800);
    });
  }

  function runInSandbox(btn) {
    const code = btn.closest('.ai-code-block').querySelector('code').innerText;
    nbCellCounter++;
    NB_FILES.main.unshift({ id: nbCellCounter, type: 'code', code: code, output: '' });
    nbCurrentFile = 'main';
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderNbCells();
    document.querySelectorAll('.nb-file-item').forEach((f, i) => f.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('nb-panel-notebook').classList.add('active');
    setTimeout(() => {
      const c = document.getElementById('nb-cell-' + nbCellCounter);
      if (c) { c.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); activateCell(c); }
    }, 100);
  }

  function formatFloorText(text) {
    const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // detect fenced code blocks ```lang\n...\n```
    const parts = escaped.split(/(```[\s\S]*?```)/g);
    const processed = parts.map(part => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
        if (!match) return part;
        const lang = (match[1] || '').toLowerCase();
        const code = match[2].trimEnd();
        const isShell = ['bash','sh','shell','zsh',''].includes(lang) || /^(pip|python|atc|apt|cd |ls |cat |export |chmod |\.\/|npx|npm|conda)/.test(code.trim());
        const isRunnable = ['python','py','python3'].includes(lang);
        const termStyle = isShell ? 'background:#1a1a2e;color:#a8ff78;' : 'background:#1e1e1e;color:#f8f8f2;';
        const langLabel = lang || (isShell ? 'shell' : 'code');
        return `<div class="ai-code-block" style="margin:12px 0;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">
          <div class="ai-code-header">
            <span class="ai-code-lang">${isShell ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:.7"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>' : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:.7"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'}${langLabel}</span>
            <div class="ai-code-actions">
              ${isRunnable ? `<button class="ai-run-btn" onclick="runInSandbox(this)"><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><polygon points="5 3 19 12 5 21 5 3"/></svg>运行</button>` : ''}
              <button class="ai-copy-btn" onclick="copyBlockCode(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
            </div>
          </div>
          <pre style="${termStyle}margin:0;padding:14px 16px;overflow-x:auto;font-size:12.5px;font-family:var(--mono);line-height:1.65"><code style="background:none;border:none;padding:0;color:inherit">${code}</code></pre>
        </div>`;
      }
      return part
        .replace(/`([^`\n]+)`/g, '<code style="font-family:var(--mono);background:var(--surface2);padding:1px 5px;border-radius:4px;font-size:13px">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/^(\d+)\.\s+/gm, (_, n) => `<br><strong>${n}.</strong> `)
        .replace(/^[-•]\s+/gm, '<br>• ')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    }).join('');

    return `<div style="line-height:1.8">${processed}</div>`;
  }

  // Compat: old selectSuggestTag calls
  function selectSuggestTag(el, type) {
    const modeMap = { docs: 'solve', learn: 'learn', download: 'resource' };
    selectHeroMode(el, modeMap[type] || type);
  }

  // Compat: old homeAiAskHero / homeAiSearch
  function homeAiAskHero() { heroSubmit(); }
  function homeAiSearch() { heroSubmit(); }

  // Init: render default issue grid
  document.addEventListener('DOMContentLoaded', () => {
    renderFloorIssues('install');
    renderSavedPaths();
    attachDocAiHelpers();
  });

  // Custom paths storage
  let customPaths = JSON.parse(localStorage.getItem('cann_custom_paths') || '[]');
  let activePathId = null;

  // Path generator functions
  function setPathInput(text) {
    const input = document.getElementById('path-generator-input');
    if (input) { input.value = text; input.focus(); }
    // Don't auto-generate; let user click the button after reviewing
  }

  async function generateCustomPath() {
    const input = document.getElementById('path-generator-input');
    const query = input.value.trim();
    if (!query) { input.focus(); return; }
    input.value = '';
    // Open AI sidebar and start conversation; AI will ask clarifying questions first
    _aiPathStart(query);
    return; // legacy body below kept but bypassed

    const svgPlay = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    btn.classList.add('loading');
    btn.innerHTML = svgPlay + '生成中…';

    const nodeListStr = NODE_LIST.map((n, i) => `${i}|${n.title}|${n.category}|${n.desc}`).join('\n');

    let nodes = null;
    try {
      const resp = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `你是 CANN 学习路径规划专家。根据用户的学习目标，从下面的知识节点库中挑选4-6个最相关的节点，按学习顺序排列，组成个性化路径。\n\n节点库（格式：序号|节点名|方向|描述）：\n${nodeListStr}\n\n输出格式：JSON数组，每项包含 nodeIndex（节点序号）和 reason（一句话说明为什么学这个节点，不超过12字）。\n只输出JSON，不加任何说明或代码块标记。`,
          user: `我的学习目标：${query}`,
          max_tokens: 400,
        })
      });
      const data = await resp.json();
      const text = data.text || '[]';
      let picks = [];
      try { picks = JSON.parse(text.replace(/```json|```/g, '').trim()); } catch(e) {}
      if (picks.length > 0) {
        nodes = picks.map((p, idx) => {
          const node = NODE_LIST[p.nodeIndex] || NODE_LIST[0];
          return { ...node, step: idx + 1, reason: p.reason || node.desc };
        });
      }
    } catch(e) {}

    // Fallback: keyword-based selection
    if (!nodes) nodes = keywordFallbackNodes(query);

    renderLearnPagePath(query, nodes);

    // Save to custom paths list
    const path = {
      id: 'path_' + Date.now(),
      name: query.length > 18 ? query.substring(0, 18) + '…' : query,
      query,
      icon: '✨',
      nodeList: nodes,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    };
    customPaths.unshift(path);
    saveCustomPaths();
    renderCustomPaths();

    // Show custom paths container after generating a path
    document.getElementById('custom-paths-container').style.display = 'block';

    btn.classList.remove('loading');
    btn.innerHTML = svgPlay + '生成路径';
    input.value = '';
  }

  function keywordFallbackNodes(query) {
    const kw = [
      { keys: ['算子','TBE','TIK','Ascend C'], cats: ['beginner','operator'] },
      { keys: ['推理','部署','模型','ATC','.om'], cats: ['beginner','developer'] },
      { keys: ['分布式','训练','HCCL','多卡'],   cats: ['beginner','developer','distributed'] },
      { keys: ['入门','基础','概览','安装'],       cats: ['beginner'] },
    ];
    let cats = ['beginner','developer'];
    for (const rule of kw) {
      if (rule.keys.some(k => query.includes(k))) { cats = rule.cats; break; }
    }
    return NODE_LIST.filter(n => cats.includes(n.category)).slice(0, 5).map((n, i) => ({ ...n, step: i + 1, reason: n.desc }));
  }

  function saveCustomPaths() {
    localStorage.setItem('cann_custom_paths', JSON.stringify(customPaths));
  }

  function renderCustomPaths() {
    const container = document.getElementById('custom-paths-scroll');
    if (!container) return;

    // If no custom paths, use sample paths
    let pathsToRender = customPaths.length === 0 ? samplePaths : customPaths;
    
    container.innerHTML = pathsToRender.map(path => `
      <div class="custom-path-item ${path.id === activePathId ? 'active' : ''}" onclick="selectCustomPath('${path.id}')" data-path-id="${path.id}">
        <span class="path-item-icon">${path.icon}</span>
        <div class="path-item-content">
          <span class="path-item-name">${path.name}</span>
          <span class="path-item-desc">${path.query} · ${path.createdAt}</span>
        </div>
        ${customPaths.length > 0 ? `
        <div class="path-item-actions" onclick="event.stopPropagation()">
          <button class="path-item-btn" onclick="deleteCustomPath('${path.id}')" title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
        ` : ''}
      </div>
    `).join('');
  }

  function selectCustomPath(pathId) {
    activePathId = pathId;
    const path = customPaths.find(p => p.id === pathId);
    document.querySelectorAll('.custom-path-item').forEach(item => {
      item.classList.toggle('active', item.dataset.pathId === pathId);
    });
    if (path) {
      // Use saved node list if available, else fall back to category filter
      if (path.nodeList) {
        renderLearnPagePath(path.query, path.nodeList);
      } else if (path.nodes) {
        const fallback = NODE_LIST.filter(n => path.nodes.includes(n.category))
          .map((n, i) => ({ ...n, step: i + 1, reason: n.desc }));
        renderLearnPagePath(path.query, fallback);
      }
    }
  }

  function deleteCustomPath(pathId) {
    if (!confirm('确定要删除这个学习路径吗？')) return;
    customPaths = customPaths.filter(p => p.id !== pathId);
    if (activePathId === pathId) {
      activePathId = null;
      clearLearnPath();
    }
    saveCustomPaths();
    renderCustomPaths();
  }

  // ── LEARN PAGE PATH SEQUENCE ──
  function renderLearnPagePath(query, nodes) {
    const strip = document.getElementById('path-seq-strip');
    if (!strip) return;
    window._currentLearnPath = nodes;

    const stepsHtml = nodes.map((n, i) => {
      const color = CAT_META[n.category]?.color || '#666';
      return `${i > 0 ? '<span class="path-seq-arrow">→</span>' : ''}
        <div class="path-seq-step" style="--cat-color:${color}" onclick="jumpToPathNode(${i})" title="${(n.reason || n.desc).replace(/"/g, '&quot;')}">
          <span class="path-seq-num">${i + 1}</span>
          <span class="path-seq-title">${n.title}</span>
        </div>`;
    }).join('');

    strip.innerHTML = `
      <div class="path-seq-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2C9 5.866 5.866 9 2 9c3.866 0 7 3.134 7 7 0-3.866 3.134-7 7-7-3.866 0-7-3.134-7-7z"/><path d="M20 12c0 2.209-1.791 4-4 4 2.209 0 4 1.791 4 4 0-2.209 1.791-4 4-4-2.209 0-4-1.791-4-4z"/></svg>
        <span>${query}</span>
      </div>
      <div class="path-seq-steps">${stepsHtml}</div>
      <button class="path-seq-close" onclick="clearLearnPath()">✕ 清除路径</button>`;
    strip.classList.remove('hidden');
    _ldActivePathNodes = nodes;
    if (document.getElementById('ld-roadmap')?.style.display !== 'none') ldRenderPathWorkspace(nodes);

    // Highlight matching rm-nodes; dim others
    document.querySelectorAll('.rm-node').forEach(el => {
      const title = el.querySelector('.rm-node-title')?.textContent.trim();
      const idx = nodes.findIndex(n => n.title === title);
      el.style.display = '';
      el.classList.toggle('path-dimmed', idx < 0);
      el.querySelector('.path-step-badge')?.remove();
      if (idx >= 0) {
        const color = CAT_META[nodes[idx].category]?.color || '#666';
        const badge = document.createElement('span');
        badge.className = 'path-step-badge';
        badge.textContent = idx + 1;
        badge.style.setProperty('--cat-color', color);
        el.querySelector('.rm-node-header').prepend(badge);
      }
    });

    // Scroll to first path node
    setTimeout(() => {
      const first = [...document.querySelectorAll('.rm-node')].find(el =>
        nodes.some(n => n.title === el.querySelector('.rm-node-title')?.textContent.trim())
      );
      if (first) first.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 250);
  }

  function clearLearnPath() {
    window._currentLearnPath = null;
    const strip = document.getElementById('path-seq-strip');
    if (strip) strip.classList.add('hidden');
    document.querySelectorAll('.rm-node').forEach(el => {
      el.classList.remove('path-dimmed');
      el.querySelector('.path-step-badge')?.remove();
      el.style.display = '';
    });
    activePathId = null;
    document.querySelectorAll('.custom-path-item').forEach(el => el.classList.remove('active'));

    // Hide custom paths container when clearing path
    document.getElementById('custom-paths-container').style.display = 'none';
  }

  function jumpToPathNode(idx) {
    const path = window._currentLearnPath;
    if (!path || !path[idx]) return;
    const title = path[idx].title;
    const nodeEl = [...document.querySelectorAll('.rm-node')].find(el =>
      el.querySelector('.rm-node-title')?.textContent.trim() === title
    );
    if (nodeEl) {
      nodeEl.scrollIntoView({ behavior:'smooth', block:'center' });
      setTimeout(() => openNodeDrawer(nodeEl), 400);
    }
  }

  function scrollPaths(direction) {
    const container = document.getElementById('custom-paths-scroll');
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // Top level tab switching
  function switchTopTab(tabName, btn) {
    document.querySelectorAll('.top-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Filter bars & custom paths container
    document.querySelectorAll('.filter-bar').forEach(bar => bar.style.display = 'none');
    document.getElementById('custom-paths-container').style.display = 'none';

    // Path generator + inline editor (custom tab only)
    const pathGenerator = document.getElementById('path-generator');
    const ipeWrap = document.getElementById('ipe-wrap');
    if (pathGenerator) {
      if (tabName === 'custom') pathGenerator.classList.add('visible');
      else pathGenerator.classList.remove('visible');
    }
    if (tabName !== 'custom') {
      if (ipeWrap) ipeWrap.classList.add('hidden');
      document.getElementById('page-learn').classList.remove('ipe-active');
    }

    // Show corresponding filter bar
    if (tabName !== 'custom') {
      const filterBar = document.getElementById('filter-' + tabName);
      if (filterBar) {
        filterBar.style.display = 'flex';
        filterBar.querySelectorAll('.filter-btn').forEach((b, i) => {
          b.classList.toggle('active', i === 0);
        });
      }
    }

    // Clear path highlighting when leaving custom tab
    if (tabName !== 'custom') clearLearnPath();

    // Reveal all roadmap nodes when switching tabs
    document.querySelectorAll('.rm-node').forEach(node => { node.style.display = ''; });
  }

  // Sample custom paths data
  const samplePaths = [
    { id: 'sample-1', name: 'CANN算子开发入门', icon: '🔧', query: '算子开发入门', createdAt: '2024-01-15',
      nodeList: [0,1,2,7,8].map((i,s) => ({ ...NODE_LIST[i], step: s+1, reason: NODE_LIST[i].desc })) },
    { id: 'sample-2', name: '模型推理部署', icon: '🔄', query: '模型推理部署', createdAt: '2024-01-20',
      nodeList: [0,2,3,4,5].map((i,s) => ({ ...NODE_LIST[i], step: s+1, reason: NODE_LIST[i].desc })) },
    { id: 'sample-3', name: '昇腾AI推理优化', icon: '⚡', query: '推理性能优化', createdAt: '2024-02-01',
      nodeList: [3,4,5,6].map((i,s) => ({ ...NODE_LIST[i], step: s+1, reason: NODE_LIST[i].desc })) },
    { id: 'sample-4', name: '分布式训练实战', icon: '🚀', query: '分布式大模型训练', createdAt: '2024-02-10',
      nodeList: [0,3,9,10].map((i,s) => ({ ...NODE_LIST[i], step: s+1, reason: NODE_LIST[i].desc })) },
    { id: 'sample-5', name: 'CANN 完整入门', icon: '📚', query: 'CANN入门基础', createdAt: '2024-02-15',
      nodeList: [0,1,2,3,4].map((i,s) => ({ ...NODE_LIST[i], step: s+1, reason: NODE_LIST[i].desc })) },
  ];

  // Seed sample paths into localStorage on first visit
  const CUSTOM_PATHS_SEEDED_KEY = 'cann_custom_paths_seeded';
  if (!localStorage.getItem(CUSTOM_PATHS_SEEDED_KEY)) {
    const seeded = samplePaths.map(p => ({
      ...p,
      lastStudied: p.createdAt,
    }));
    localStorage.setItem('cann_custom_paths', JSON.stringify(seeded));
    localStorage.setItem(CUSTOM_PATHS_SEEDED_KEY, '1');
  }

  // Initialize custom paths on load
  document.addEventListener('DOMContentLoaded', () => {
    renderCustomPaths();
  });

  // API accordion
  function toggleApi(card) {
    card.classList.toggle('open');
  }

  // Roadmap node toggle
  function toggleNode(node) {
    node.classList.toggle('open');
  }

  // Filter roadmap
  function filterRoadmap(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.rm-node').forEach(node => {
      if (cat === 'all' || node.dataset.category === cat) {
        node.style.display = '';
      } else {
        node.style.display = 'none';
      }
    });
  }

  // Copy code
  function copyCode(btn) {
    const block = btn.closest('.code-block');
    // Remove button texts from copy content
    let text = block.innerText;
    text = text.replace(/开始/g, '').replace(/复制/g, '').replace(/在 HiDevLab 运行/g, '').replace(/代码解释/g, '').replace(/运行/g, '');
    text = text.replace(/^[A-Z]+\n/, '').trim();
    navigator.clipboard.writeText(text).catch(() => {});
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    btn.style.cssText += ';display:inline-flex;align-items:center;gap:4px;';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); btn.style.display = ''; }, 2000);
  }

  // Explain code
  function explainCode(btn) {
    const block = btn.closest('.code-block');
    let text = block.innerText;
    text = text.replace(/代码解释/g, '').replace(/运行/g, '').replace(/在 HiDevLab 运行/g, '').replace(/复制/g, '');
    text = text.replace(/^[A-Z]+\n/, '').trim();
    
    const prompt = `请解释以下代码：\n\n${text}`;
    openAiSidebarAndSend(prompt);
  }

  // Download code
  function downloadCode(btn) {
    const block = btn.closest('.code-block');
    let text = block.innerText;
    text = text.replace(/代码解释/g, '').replace(/运行/g, '').replace(/在 HiDevLab 运行/g, '').replace(/复制/g, '');
    text = text.replace(/^[A-Z]+\n/, '').trim();
    
    // Get language from lang-tag
    const langTag = block.querySelector('.lang-tag');
    const lang = langTag ? langTag.textContent.toLowerCase() : 'txt';
    const extension = lang === 'python' ? 'py' : lang === 'bash' ? 'sh' : lang === 'cmake' ? 'cmake' : 'txt';
    
    // Create and download file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Sandbox Drawer Functions
  let currentSandboxCode = '';

  // Show/hide docs sandbox bar based on page
  function updateDocsSandboxBar() {
    const sandboxBar = document.getElementById('docs-sandbox-bar');
    if (!sandboxBar) return;
    const docsPage = document.getElementById('page-docs');
    const learnPage = document.getElementById('page-learn');
    const docsActive = docsPage && docsPage.classList.contains('active');
    const learnActive = learnPage && learnPage.classList.contains('active');
    if (docsActive || learnActive) {
      sandboxBar.classList.add('visible');
    } else {
      sandboxBar.classList.remove('visible');
    }
  }

  // Open empty sandbox from docs bar
  function openEmptySandbox() {
    // Set default sample code
    const defaultCode = `<span style="color:#6B6480;"># 欢迎使用 CANN HiDevLab</span><br><span style="color:#BD93F9;">import</span> <span style="color:#F8F8F2;">acl</span><br><span style="color:#BD93F9;">import</span> <span style="color:#F8F8F2;">numpy as np</span><br><br><span style="color:#6B6480;"># 初始化 CANN 环境</span><br><span style="color:#F8F8F2;">ret </span><span style="color:#FF79C6;">=</span> <span style="color:#82AAFF;">acl.init</span>()<br><span style="color:#82AAFF;">acl.rt.set_device</span>(<span style="color:#FFB86C;">0</span>)<br><br><span style="color:#6B6480;"># 在这里编写您的代码...</span><br><span style="color:#F8F8F2;">print</span>(<span style="color:#A8FF60;">"Hello CANN!"</span>)`;
    
    const editor = document.getElementById('sandbox-editor');
    editor.innerHTML = '<pre contenteditable="true" spellcheck="false">' + defaultCode + '</pre>';
    
    // Update title
    const title = document.querySelector('.sandbox-drawer-title');
    const langSpan = title.querySelector('span');
    if (langSpan) {
      langSpan.textContent = '| PYTHON Playground';
    }
    
    // Reset output
    document.getElementById('sandbox-output').textContent = '点击"运行代码"查看输出结果...';
    document.getElementById('sandbox-output-header').className = 'sandbox-output-header';
    document.getElementById('sandbox-output-header').textContent = '输出';
    
    // Open drawer
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ── HIDEVLAB NOTEBOOK ──
  const NB_FILES = {
    main: [
      { id: 1, type: 'markdown', code: '# CANN 开发环境验证\n\n快速验证昇腾 NPU 环境是否就绪。', output: '' },
      { id: 2, type: 'code', code: '# 检查 CANN 环境\nimport acl\n\nret = acl.init()\nassert ret == 0, f"ACL init failed: {ret}"\nret = acl.rt.set_device(0)\nprint("✓ ACL 初始化成功")\nprint(f"设备 0 已绑定")', output: '' },
      { id: 3, type: 'code', code: '# 检查 NPU 信息\nimport subprocess\nresult = subprocess.run(["npu-smi", "info"], capture_output=True, text=True)\nprint(result.stdout)', output: '' },
    ],
    inference: [
      { id: 1, type: 'markdown', code: '# AscendCL 推理示例\n\n使用 `.om` 离线模型执行 ResNet50 推理。', output: '' },
      { id: 2, type: 'code', code: 'import acl\nimport numpy as np\n\nret = acl.init()\nret = acl.rt.set_device(0)\nctx, ret = acl.rt.create_context(0)\nprint("✓ 运行时环境就绪")', output: '' },
      { id: 3, type: 'code', code: '# 加载离线模型\nmodel_id, ret = acl.mdl.load_from_file("./models/resnet50.om")\ndesc = acl.mdl.create_desc()\nret = acl.mdl.get_desc(desc, model_id)\nprint(f"模型输入数量: {acl.mdl.get_num_inputs(desc)}")\nprint(f"模型输出数量: {acl.mdl.get_num_outputs(desc)}")', output: '' },
    ],
    operator: [
      { id: 1, type: 'markdown', code: '# Ascend C 自定义算子开发\n\n使用 TBE DSL 开发一个 Add 算子。', output: '' },
      { id: 2, type: 'code', code: 'import tbe\nfrom tbe import dsl\nprint("✓ TBE DSL 环境就绪")\nprint(f"TBE 版本: {tbe.__version__}")', output: '' },
      { id: 3, type: 'code', code: '@op_info_register(add_op_info)\ndef add_compute(x, y, kernel_name="add"):\n    """Compute add"""\n    res = te.lang.cce.vadd(x["shape"], y["shape"])\n    return res\n\nprint("算子原型已注册")', output: '' },
    ]
  };
  let nbCellCounter = 10;
  let nbCurrentFile = 'main';
  let nbMonitorInterval = null;

  function simulateOutput(code) {
    if (code.includes('acl.init')) return { out: '✓ ACL 初始化成功\n设备 0 已绑定\nDevice: Ascend 910B · CANN 8.0.RC2', type: 'success' };
    if (code.includes('npu-smi')) return { out: '+------------------------+\n| NPU  910B4  OK  72.4W  42°C |\n+------------------------+', type: 'success' };
    if (code.includes('pip install')) return { out: 'Collecting package...\nSuccessfully installed ✓', type: 'success' };
    if (code.includes('load_from_file') || code.includes('.om')) return { out: '模型加载成功\n输入 shape: (1, 3, 224, 224)\n✓ 推理模型就绪', type: 'success' };
    if (code.includes('tbe') || code.includes('dsl')) return { out: '✓ TBE DSL 环境就绪\nTBE 版本: 8.0.0', type: 'success' };
    if (code.includes('print')) { const m = code.match(/print\(["'](.+?)["']\)/); return { out: m ? m[1] : '代码执行完成', type: 'success' }; }
    return { out: '✓ Cell 执行完成  [' + new Date().toLocaleTimeString() + ']', type: 'success' };
  }

  function renderNbCells() {
    const container = document.getElementById('nb-cells');
    if (!container) return;
    const cells = NB_FILES[nbCurrentFile] || [];
    container.innerHTML = cells.map(cell => buildCellHtml(cell)).join('') + `<button class="nb-add-cell" onclick="nbNewCell()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>添加 Cell</button>`;
  }

  function buildCellHtml(cell) {
    return `<div class="nb-cell" id="nb-cell-${cell.id}" onclick="activateCell(this)">
      <div class="nb-cell-header">
        <span class="nb-cell-num">[${cell.id}]</span>
        <span class="nb-cell-type ${cell.type === 'markdown' ? 'markdown' : ''}">${cell.type === 'markdown' ? 'Markdown' : 'Code'}</span>
        <div class="nb-cell-actions">
          ${cell.type === 'code' ? `<button class="nb-cell-btn run-btn" onclick="runCell(event,${cell.id})">▶ 运行</button>` : ''}
          <button class="nb-cell-btn" onclick="toggleCellType(event,${cell.id})">切换类型</button>
          <button class="nb-cell-btn del-btn" onclick="deleteCell(event,${cell.id})">✕</button>
        </div>
      </div>
      <div class="nb-cell-code" contenteditable="true" spellcheck="false" onkeydown="handleCellKey(event,${cell.id})">${escNb(cell.code)}</div>
      ${cell.output ? `<div class="nb-cell-output visible ${cell.outputType || ''}">${escNb(cell.output)}</div>` : `<div class="nb-cell-output" id="nb-out-${cell.id}"></div>`}
    </div>`;
  }

  function escNb(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function activateCell(el) {
    document.querySelectorAll('.nb-cell').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
  }

  function runCell(e, id) {
    e.stopPropagation();
    const cell = document.getElementById('nb-cell-' + id);
    const outEl = cell.querySelector('.nb-cell-output');
    const code = cell.querySelector('.nb-cell-code').innerText;
    cell.classList.add('running');
    outEl.textContent = '▶ 正在执行...'; outEl.className = 'nb-cell-output visible';
    setNbStatus('running', '● 执行中'); animateMonitor(true);
    setTimeout(() => {
      const result = simulateOutput(code);
      outEl.textContent = result.out; outEl.className = 'nb-cell-output visible ' + (result.type || '');
      cell.classList.remove('running'); setNbStatus('idle', '● 空闲'); animateMonitor(false);
    }, 800 + Math.random() * 600);
  }

  function nbRunAll() {
    const cells = NB_FILES[nbCurrentFile] || [];
    let delay = 0;
    cells.forEach(cell => { if (cell.type === 'code') { setTimeout(() => runCell({ stopPropagation: () => {} }, cell.id), delay); delay += 1000; } });
  }

  function nbInterrupt() { setNbStatus('idle', '● 空闲（已中断）'); animateMonitor(false); document.querySelectorAll('.nb-cell.running').forEach(c => c.classList.remove('running')); showNbToast('内核已中断'); }

  function nbRestart() {
    if (!confirm('重启内核将清除所有变量，是否继续？')) return;
    document.querySelectorAll('.nb-cell-output').forEach(o => { o.textContent = ''; o.className = 'nb-cell-output'; });
    setNbStatus('idle', '● 空闲'); animateMonitor(false); showNbToast('内核已重启');
  }

  function nbSave() { const btn = document.getElementById('btn-nb-save'); btn.style.color = '#86EFAC'; showNbToast('已保存 ' + nbCurrentFile + '.ipynb'); setTimeout(() => { btn.style.color = ''; }, 1500); }

  function nbNewCell() {
    nbCellCounter++;
    const cells = NB_FILES[nbCurrentFile] = NB_FILES[nbCurrentFile] || [];
    cells.push({ id: nbCellCounter, type: 'code', code: '# 新 Cell\n', output: '' });
    renderNbCells();
    setTimeout(() => { const c = document.getElementById('nb-cell-' + nbCellCounter); if (c) { c.scrollIntoView({ behavior:'smooth', block:'nearest' }); activateCell(c); } }, 50);
  }

  function toggleCellType(e, id) { e.stopPropagation(); const cell = (NB_FILES[nbCurrentFile] || []).find(c => c.id === id); if (cell) { cell.type = cell.type === 'code' ? 'markdown' : 'code'; renderNbCells(); } }
  function deleteCell(e, id) { e.stopPropagation(); NB_FILES[nbCurrentFile] = (NB_FILES[nbCurrentFile] || []).filter(c => c.id !== id); renderNbCells(); }
  function handleCellKey(e, id) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCell(e, id); } const cell = (NB_FILES[nbCurrentFile] || []).find(c => c.id === id); if (cell) cell.code = e.target.innerText; }
  function loadNbFile(el, name) { document.querySelectorAll('.nb-file-item').forEach(f => f.classList.remove('active')); el.classList.add('active'); nbCurrentFile = name; renderNbCells(); }
  function nbUploadFile() { showNbToast('上传文件（演示模式）'); }
  function switchNbTab(tab, btn) { document.querySelectorAll('.nb-tab').forEach(t => t.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.nb-panel').forEach(p => p.classList.remove('active')); document.getElementById('nb-panel-' + tab).classList.add('active'); }
  function toggleKernelMenu(el) { el.classList.toggle('open'); document.addEventListener('click', function h(e) { if (!el.contains(e.target)) { el.classList.remove('open'); document.removeEventListener('click', h); } }); }
  function selectKernel(el, name) { document.querySelectorAll('.nb-kernel-option').forEach(o => o.classList.remove('active')); el.classList.add('active'); document.getElementById('nb-kernel-name').textContent = name; document.querySelector('.nb-kernel-select').classList.remove('open'); showNbToast('已切换内核：' + name); }

  function animateMonitor(active) {
    if (active) {
      if (nbMonitorInterval) return;
      nbMonitorInterval = setInterval(() => {
        const npu = 40 + Math.random() * 50, hbm = 20 + Math.random() * 30, cpu = 10 + Math.random() * 40;
        setMonitorVal('npu', npu, npu.toFixed(0) + '%'); setMonitorVal('hbm', hbm, (hbm * 64 / 100).toFixed(1) + ' / 64GB'); setMonitorVal('cpu', cpu, cpu.toFixed(0) + '%');
      }, 600);
    } else { clearInterval(nbMonitorInterval); nbMonitorInterval = null; setMonitorVal('npu', 0, '0%'); setMonitorVal('hbm', 0, '0 / 64GB'); setMonitorVal('cpu', 0, '0%'); }
  }

  function setMonitorVal(id, pct, label) { const bar = document.getElementById('nb-' + id + '-bar'), val = document.getElementById('nb-' + id + '-val'); if (bar) bar.style.width = pct + '%'; if (val) val.textContent = label; }
  function setNbStatus(state, text) { const el = document.getElementById('nb-status'); if (!el) return; el.textContent = text; el.className = 'nb-monitor-status' + (state === 'running' ? ' running' : ''); }

  function showNbToast(msg) {
    let t = document.getElementById('nb-toast');
    if (!t) { t = document.createElement('div'); t.id = 'nb-toast'; t.style.cssText = 'position:fixed;bottom:640px;left:50%;transform:translateX(-50%);background:#1E293B;color:white;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;z-index:3000;border:1px solid rgba(255,255,255,0.1);pointer-events:none;transition:opacity 0.3s;'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = '1'; clearTimeout(t._to); t._to = setTimeout(() => { t.style.opacity = '0'; }, 2000);
  }

  function handleTermInput(e) {
    if (e.key !== 'Enter') return;
    const input = document.getElementById('nb-term-input'), cmd = input.value.trim(); if (!cmd) return; input.value = '';
    const terminal = document.getElementById('nb-terminal'), cursor = document.getElementById('term-cursor'), cursorLine = cursor?.closest('.nb-term-line');
    const cmdLine = document.createElement('div'); cmdLine.className = 'nb-term-line'; cmdLine.innerHTML = `<span class="nb-term-prompt">ascend@hidevlab:~$</span> <span class="nb-term-output">${cmd.replace(/</g,'&lt;')}</span>`;
    if (cursorLine) terminal.insertBefore(cmdLine, cursorLine); else terminal.appendChild(cmdLine);
    const outputs = getTermOutput(cmd);
    outputs.forEach(line => { const l = document.createElement('div'); l.className = 'nb-term-line nb-term-out'; l.textContent = line; if (cursorLine) terminal.insertBefore(l, cursorLine); else terminal.appendChild(l); });
    terminal.scrollTop = terminal.scrollHeight;
  }

  function getTermOutput(cmd) {
    if (cmd === 'ls' || cmd === 'ls -la') return ['total 48','drwxr-xr-x  data/','drwxr-xr-x  models/','- rw-r--r--  main.ipynb','- rw-r--r--  inference.ipynb','- rw-r--r--  custom_op.ipynb','- rw-r--r--  resnet50.om'];
    if (cmd.startsWith('npu-smi')) return ['+------------------------+','| NPU  910B4  OK  72.4W  42°C |','+------------------------+'];
    if (cmd.includes('python') && cmd.includes('torch_npu')) return ['1'];
    if (cmd.startsWith('pip install')) return [`Collecting ${cmd.split(' ')[2] || 'package'}...`,'Successfully installed ✓'];
    if (cmd === 'pwd') return ['/home/ascend/workspace']; if (cmd === 'whoami') return ['ascend']; if (cmd.startsWith('cd')) return [];
    if (cmd === 'clear') { document.getElementById('nb-terminal').innerHTML = '<div class="nb-term-line"><span class="nb-term-prompt">ascend@hidevlab:~$</span> <span id="term-cursor" class="nb-term-cursor"></span></div>'; return []; }
    return [`bash: ${cmd}: command not found`];
  }

  function openSandbox(btn) {
    const block = btn.closest('.code-block');
    const codeText = block.innerText.replace(/开始/g,'').replace(/复制/g,'').replace(/在 HiDevLab 运行/g,'').replace(/^[A-Z]+\n/,'').trim();
    nbCellCounter++;
    NB_FILES.main.unshift({ id: nbCellCounter, type: 'code', code: codeText, output: '' });
    nbCurrentFile = 'main';
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderNbCells();
    document.querySelectorAll('.nb-file-item').forEach((f, i) => f.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('nb-panel-notebook').classList.add('active');
    setTimeout(() => { const c = document.getElementById('nb-cell-' + nbCellCounter); if (c) { c.scrollIntoView({ behavior:'smooth', block:'nearest' }); activateCell(c); } }, 100);
  }

  function closeSandboxDrawer() {
    document.getElementById('sandbox-drawer').classList.remove('open');
    document.getElementById('sandbox-overlay').classList.remove('open');
    document.body.style.overflow = '';
    animateMonitor(false);
  }

  function runSandboxCode() {}

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('qb-drawer')?.classList.contains('open')) { closeQuizBank(); return; }
      closeSandboxDrawer();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    updateDocsSandboxBar();
    renderNbCells();
    qbSeedSamples();
    _updateQbBadge();
  });

  // ── Quiz Bank ──────────────────────────────────────────────────
  const QB_KEY = 'cann_quiz_bank';
  const QB_SEEDED_KEY = 'cann_quiz_bank_seeded';
  let _qbFilter = 'all';
  let _qbSearch = '';
  let _qbDomainFilter = 'all';
  let _qbNodeFilter = 'all';
  let _laSort = 'lastStudied';
  let _laSortDir = 'desc';
  let _laFilter = 'all';

  const QB_DOMAIN_META = {
    beginner:    { label: '基础入门', color: '#10B981' },
    developer:   { label: '应用开发', color: '#2e53fa' },
    operator:    { label: '算子开发', color: '#8B5CF6' },
    distributed: { label: '分布式',  color: '#F59E0B' },
  };

  const QB_SAMPLE = [
    { id: 1000001, domain: 'beginner',    nodeTitle: '昇腾硬件体系',      question: '昇腾 AI 处理器中，达芬奇架构的核心矩阵计算单元是？', options: ['Cube 单元', 'Vector 单元', 'Scalar 单元', 'SIMD 单元'], answer: 'Cube 单元', userAnswer: 'Vector 单元', result: 'wrong', ts: Date.now() - 86400000 * 5 },
    { id: 1000002, domain: 'beginner',    nodeTitle: '昇腾硬件体系',      question: 'HBM（高带宽内存）相比 LPDDR 的主要优势是？', options: ['更低功耗', '更高内存带宽', '更大单条容量', '更低访存延迟'], answer: '更高内存带宽', userAnswer: '更低访存延迟', result: 'wrong', ts: Date.now() - 86400000 * 4 },
    { id: 1000003, domain: 'beginner',    nodeTitle: 'CANN 软件栈概览',   question: 'CANN 软件栈中，GE（Graph Engine）负责的主要工作是？', options: ['计算图优化与子图划分', '内存分配与回收', 'NPU 驱动初始化', '模型量化压缩'], answer: '计算图优化与子图划分', userAnswer: 'NPU 驱动初始化', result: 'wrong', ts: Date.now() - 86400000 * 3 },
    { id: 1000004, domain: 'beginner',    nodeTitle: '环境安装与配置',    question: '安装 CANN Toolkit 后，激活运行时通常需要 source 哪个脚本？', options: ['set_env.sh', 'ascend_env.sh', 'envs/ascend_toolkit_env.sh', 'activate.sh'], answer: 'set_env.sh', userAnswer: 'ascend_env.sh', result: 'wrong', ts: Date.now() - 86400000 * 3 },
    { id: 1000005, domain: 'developer',   nodeTitle: 'AscendCL 编程基础', question: 'AscendCL 中，Stream 的主要作用是？', options: ['管理设备内存分配', '定义任务执行的有序队列', '初始化 Context 上下文', '加载模型文件'], answer: '定义任务执行的有序队列', userAnswer: '管理设备内存分配', result: 'wrong', ts: Date.now() - 86400000 * 2 },
    { id: 1000006, domain: 'developer',   nodeTitle: '模型推理部署',      question: 'ATC 工具的主要功能是？', options: ['将原始框架模型转换为 .om 格式', '执行在线分布式训练', '配置环境变量', '管理推理任务调度'], answer: '将原始框架模型转换为 .om 格式', userAnswer: '管理推理任务调度', result: 'wrong', ts: Date.now() - 86400000 * 2 },
    { id: 1000007, domain: 'developer',   nodeTitle: '性能调优实战',      question: 'Profiling 分析中，哪项指标直接反映算子执行效率？', options: ['Host CPU 占用率', '算子耗时（Op Time）', '内存碎片率', 'PCIe 带宽利用率'], answer: '算子耗时（Op Time）', userAnswer: '内存碎片率', result: 'wrong', ts: Date.now() - 86400000 },
    { id: 1000008, domain: 'developer',   nodeTitle: '数据预处理 (DVPP)', question: 'DVPP 中 JPEGD 模块的功能是？', options: ['JPEG 编码（压缩）', 'JPEG 解码（解压）', '视频流拆帧', '颜色空间转换'], answer: 'JPEG 解码（解压）', userAnswer: 'JPEG 编码（压缩）', result: 'wrong', ts: Date.now() - 86400000 },
    { id: 1000009, domain: 'operator',    nodeTitle: 'TBE DSL 算子开发',  question: 'TBE DSL 中，te.lang.cce.vmul 对应的操作是？', options: ['矩阵乘法', '逐元素向量乘法', '卷积操作', '向量点积'], answer: '逐元素向量乘法', userAnswer: '矩阵乘法', result: 'wrong', ts: Date.now() - 43200000 },
    { id: 1000010, domain: 'operator',    nodeTitle: 'TIK 底层算子开发',  question: 'TIK 中 data_move 指令将数据从 GM 搬移到 UB，UB 指的是？', options: ['Unified Buffer（统一缓冲区）', 'User Buffer（用户缓冲区）', 'Upload Buffer（上传缓冲区）', 'Ultra Buffer（超带宽缓冲）'], answer: 'Unified Buffer（统一缓冲区）', userAnswer: 'Upload Buffer（上传缓冲区）', result: 'wrong', ts: Date.now() - 43200000 },
    { id: 1000011, domain: 'distributed', nodeTitle: 'HCCL 分布式通信',   question: 'HCCL AllReduce 操作的语义是？', options: ['从 rank 0 广播到所有进程', '每个进程贡献数据，归约后结果同步给所有进程', '将所有进程数据收集到 rank 0', '进程间点对点交换'], answer: '每个进程贡献数据，归约后结果同步给所有进程', userAnswer: '从 rank 0 广播到所有进程', result: 'wrong', ts: Date.now() - 3600000 },
    { id: 1000012, domain: 'beginner',    nodeTitle: 'CANN 软件栈概览',   question: 'AscendCL 在 CANN 软件栈中所处的层次是？', options: ['硬件驱动层', '运行时与算子库层', '应用编程接口层', '编译优化层'], answer: '应用编程接口层', userAnswer: '应用编程接口层', result: 'correct', ts: Date.now() - 7200000 },
    { id: 1000013, domain: 'developer',   nodeTitle: 'AscendCL 编程基础', question: 'acldvppMalloc 与普通 aclrtMalloc 的主要区别是？', options: ['前者分配在 Host 侧', '前者分配在 DVPP 专属区域，对齐要求不同', '前者速度更慢', '两者完全等价'], answer: '前者分配在 DVPP 专属区域，对齐要求不同', userAnswer: '前者分配在 DVPP 专属区域，对齐要求不同', result: 'correct', ts: Date.now() - 1800000 },
  ];

  function qbSeedSamples() {
    if (localStorage.getItem(QB_SEEDED_KEY)) return;
    if (qbLoad().length === 0) {
      qbSave(QB_SAMPLE);
      localStorage.setItem(QB_SEEDED_KEY, '1');
    }
  }

  function qbLoad() {
    try { return JSON.parse(localStorage.getItem(QB_KEY) || '[]'); } catch { return []; }
  }
  function qbSave(records) {
    localStorage.setItem(QB_KEY, JSON.stringify(records));
  }
  function saveQuizResult(quiz, userAnswer, correct) {
    const node = NODE_LIST.find(n => n.title === (_currentDrawerNode?.title || ''));
    const records = qbLoad();
    records.unshift({
      id: Date.now(),
      domain: node?.category || 'beginner',
      nodeTitle: _currentDrawerNode?.title || '未知节点',
      question: quiz.question,
      options: quiz.options,
      answer: quiz.answer,
      userAnswer: userAnswer,
      result: correct ? 'correct' : 'wrong',
      ts: Date.now()
    });
    qbSave(records);
    _updateQbBadge();
  }
  function _updateQbBadge() {
    const records = qbLoad();
    const wrong = records.filter(r => r.result === 'wrong').length;
    const badge = document.getElementById('qb-nav-badge');
    if (badge) { badge.textContent = wrong > 0 ? wrong : ''; badge.style.display = wrong > 0 ? 'inline-flex' : 'none'; }
  }
  function openLearningArchive(tab) {
    tab = tab || 'paths';
    switchLaTab(tab);
    document.getElementById('qb-overlay').classList.add('open');
    document.getElementById('qb-drawer').classList.add('open');
  }
  function closeLearningArchive() {
    document.getElementById('qb-overlay').classList.remove('open');
    document.getElementById('qb-drawer').classList.remove('open');
  }
  function switchLaTab(tab) {
    document.querySelectorAll('.la-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById('la-tab-' + tab);
    if (activeTab) activeTab.classList.add('active');
    document.getElementById('la-panel-paths').style.display = tab === 'paths' ? '' : 'none';
    const quizPanel = document.getElementById('la-panel-quiz');
    quizPanel.style.display = tab === 'quiz' ? 'flex' : 'none';
    if (tab === 'paths') {
      // Reset sort/filter UI to default state
      _laSort = 'lastStudied'; _laSortDir = 'desc'; _laFilter = 'all';
      document.querySelectorAll('.la-sort-chip').forEach((b,i) => b.classList.toggle('active', i===0));
      document.querySelectorAll('.la-filter-chip').forEach((b,i) => b.classList.toggle('active', i===0));
      _updateLaDirIcon();
      renderMyPaths();
    }
    if (tab === 'quiz') {
      _qbFilter = 'all'; _qbSearch = ''; _qbDomainFilter = 'all'; _qbNodeFilter = 'all';
      renderQuizBank();
    }
  }
  function openQuizBank() { openLearningArchive('quiz'); }
  function closeQuizBank() { closeLearningArchive(); }
  function setLaSort(sort) {
    if (_laSort === sort) { _laSortDir = _laSortDir === 'desc' ? 'asc' : 'desc'; }
    else { _laSort = sort; _laSortDir = 'desc'; }
    document.querySelectorAll('.la-sort-chip').forEach(b => b.classList.remove('active'));
    const chips = document.querySelectorAll('.la-sort-chip');
    const idx = ['lastStudied','createdAt','progress'].indexOf(_laSort);
    if (chips[idx]) chips[idx].classList.add('active');
    _updateLaDirIcon();
    renderMyPaths();
  }
  function toggleLaSortDir() {
    _laSortDir = _laSortDir === 'desc' ? 'asc' : 'desc';
    _updateLaDirIcon();
    renderMyPaths();
  }
  function _updateLaDirIcon() {
    const icon = document.getElementById('la-dir-icon');
    if (!icon) return;
    if (_laSortDir === 'asc') {
      icon.innerHTML = '<path d="M12 4v16"/><polyline points="6 10 12 4 18 10"/>';
    } else {
      icon.innerHTML = '<path d="M12 20V4"/><polyline points="18 14 12 20 6 14"/>';
    }
  }
  function setLaFilter(f, el) {
    _laFilter = f;
    document.querySelectorAll('.la-filter-chip').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
    renderMyPaths();
  }
  function renderMyPaths() {
    const container = document.getElementById('la-paths-list');
    if (!container) return;

    const savedPaths = JSON.parse(localStorage.getItem('cann_custom_paths') || '[]');

    if (savedPaths.length === 0) {
      container.innerHTML = `<div style="padding:56px 24px;text-align:center;">
        <div style="font-size:36px;margin-bottom:12px;opacity:.3;">🗺️</div>
        <div style="font-size:13px;font-weight:700;color:var(--black);margin-bottom:6px;">还没有学习路径</div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:20px;">用 AI 生成一条专属学习路径，<br>你的进度会自动记录在这里。</div>
        <button class="la-add-btn" onclick="closeLearningArchive();showPage('learn');setTimeout(()=>{document.querySelectorAll('.top-tab').forEach(b=>{if(b.textContent.trim()==='自定义')b.click()});openAiForPath('');},200);">✦ 生成我的学习路径</button>
      </div>`;
      return;
    }

    const completedTitles = new Set(JSON.parse(localStorage.getItem('cann_learn_state') || '[]'));
    const inProgressTitles = new Set(
      [...document.querySelectorAll('#page-learn .rm-node')]
        .filter(n => n.querySelector('.rm-status.in-progress'))
        .map(n => n.querySelector('.rm-node-title')?.textContent?.trim()).filter(Boolean)
    );

    // Compute per-path progress for sort/filter
    const withMeta = savedPaths.map(path => {
      const nodes = path.nodeList || [];
      const completedCount = nodes.filter(n => completedTitles.has(n.title)).length;
      const total = nodes.length;
      const pct = total ? completedCount / total : 0;
      const hasActive = nodes.some(n => inProgressTitles.has(n.title));
      return { path, nodes, completedCount, total, pct, hasActive };
    });

    // Filter
    let filtered = withMeta;
    if (_laFilter === 'active') filtered = withMeta.filter(m => m.completedCount > 0 && m.completedCount < m.total || m.hasActive);
    if (_laFilter === 'done')   filtered = withMeta.filter(m => m.total > 0 && m.completedCount === m.total);

    // Sort
    const dir = _laSortDir === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      if (_laSort === 'createdAt') {
        return dir * ((a.path.createdAt || '') > (b.path.createdAt || '') ? 1 : -1);
      }
      if (_laSort === 'progress') return dir * (a.pct - b.pct);
      // lastStudied (default)
      const ta = a.path.lastStudied || a.path.createdAt || '';
      const tb = b.path.lastStudied || b.path.createdAt || '';
      return dir * (ta > tb ? 1 : -1);
    });

    let html = '<div class="la-section" style="padding-bottom:16px;"><div class="la-section-title">我的路径</div>';

    if (filtered.length === 0) {
      html += `<div class="la-empty"><div class="la-empty-icon">🔍</div>没有符合条件的路径</div>`;
    } else {
      filtered.forEach(({ path, nodes, completedCount, total, pct }) => {
        const pctDisplay = Math.round(pct * 100);
        const lastTime = path.lastStudied
          ? '上次学习 ' + new Date(path.lastStudied).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
          : path.createdAt ? '创建于 ' + path.createdAt.replace(/-/g, '/') : '';

        const seqNodes = nodes.map((node, i) => {
          const isDone = completedTitles.has(node.title);
          const isActive = inProgressTitles.has(node.title);
          const cls = isDone ? 'done' : isActive ? 'active' : '';
          const icon = isDone ? '✓' : isActive ? '⋯' : (i + 1);
          const isLast = i === nodes.length - 1;
          return `<div class="la-seq-node">
            <div class="la-seq-dot-wrap">
              <div class="la-seq-dot ${cls}">${icon}</div>
              ${!isLast ? '<div class="la-seq-connector"></div>' : ''}
            </div>
            <div class="la-seq-label ${cls}">${node.title}</div>
          </div>`;
        }).join('');

        html += `<div class="la-path-card">
          <div class="la-path-card-header">
            <div class="la-path-card-icon">${path.icon || '📘'}</div>
            <div class="la-path-card-meta">
              <div class="la-path-card-name">${path.name}</div>
              <div class="la-path-card-bar">
                <div class="la-mini-bar" style="flex:1;"><div class="la-mini-fill" style="width:${pctDisplay}%;background:#2e53fa"></div></div>
                <span style="font-size:11px;color:var(--text-muted);flex-shrink:0;">${completedCount}/${total}</span>
              </div>
              ${lastTime ? `<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${lastTime}</div>` : ''}
            </div>
            <button class="la-continue-btn" onclick="closeLearningArchive();switchTopTab('custom',document.querySelector('.top-tab:last-child'));showPage('learn');">${completedCount > 0 ? '继续' : '开始'}</button>
          </div>
          <div class="la-path-seq">${seqNodes}</div>
        </div>`;
      });
    }

    html += `<button class="la-add-btn" style="margin:4px 0 8px;" onclick="closeLearningArchive();showPage('learn');setTimeout(()=>{document.querySelectorAll('.top-tab').forEach(b=>{if(b.textContent.trim()==='自定义')b.click()});openAiForPath('');},200);">+ 生成新路径</button></div>`;
    container.innerHTML = html;
  }
  function _qbFormatDate(ts) {
    const d = new Date(ts);
    return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function renderQuizBank() {
    const records = qbLoad();
    let filtered = records;
    if (_qbFilter === 'wrong')         filtered = filtered.filter(r => r.result === 'wrong');
    if (_qbFilter === 'correct')       filtered = filtered.filter(r => r.result === 'correct');
    if (_qbDomainFilter !== 'all')     filtered = filtered.filter(r => (r.domain || 'beginner') === _qbDomainFilter);
    if (_qbNodeFilter !== 'all')       filtered = filtered.filter(r => r.nodeTitle === _qbNodeFilter);
    if (_qbSearch.trim()) {
      const q = _qbSearch.trim().toLowerCase();
      filtered = filtered.filter(r => r.question.toLowerCase().includes(q) || r.nodeTitle.toLowerCase().includes(q));
    }
    const wrongTotal = records.filter(r => r.result === 'wrong').length;
    const correctTotal = records.filter(r => r.result === 'correct').length;
    document.getElementById('qb-count').textContent = records.length + ' 题';
    document.getElementById('qb-footer-stats').textContent = `共 ${records.length} 题 · 错误 ${wrongTotal} · 正确 ${correctTotal}`;

    // Domain filter chips
    const domainsInBank = [...new Set(records.map(r => r.domain || 'beginner'))];
    const domainFilters = document.getElementById('qb-domain-filters');
    domainFilters.innerHTML = `<button class="qb-filter${_qbDomainFilter==='all'?' active':''}" onclick="qbSetDomain('all')">全部领域</button>`
      + domainsInBank.map(d => {
          const meta = QB_DOMAIN_META[d] || { label: d, color: '#888' };
          const active = _qbDomainFilter === d;
          return `<button class="qb-filter${active?' active':''}" style="${active?`background:${meta.color};border-color:${meta.color};`:''}" onclick="qbSetDomain('${d}')">${meta.label}</button>`;
        }).join('');

    // Node filter chips (scoped to active domain)
    const scopedRecords = _qbDomainFilter === 'all' ? records : records.filter(r => (r.domain||'beginner') === _qbDomainFilter);
    const nodes = [...new Set(scopedRecords.map(r => r.nodeTitle))];
    const nodeFilters = document.getElementById('qb-node-filters');
    nodeFilters.innerHTML = nodes.length <= 1 ? '' :
      `<button class="qb-filter${_qbNodeFilter==='all'?' active':''}" onclick="qbSetNode('all')">全部节点</button>`
      + nodes.map(n => `<button class="qb-filter${_qbNodeFilter===n?' active':''}" onclick="qbSetNode(${JSON.stringify(n)})">${n}</button>`).join('');

    // Cards
    const list = document.getElementById('qb-list');
    if (filtered.length === 0) {
      list.innerHTML = `<div class="qb-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>暂无记录</div>`;
      return;
    }
    list.innerHTML = filtered.map(r => {
      const domainMeta = QB_DOMAIN_META[r.domain || 'beginner'] || { label: '其他', color: '#888' };
      return `
      <div class="qb-card ${r.result}">
        <div class="qb-card-top">
          <div class="qb-card-q">${r.question}</div>
          <button class="qb-card-del" onclick="qbDelete(${r.id})" title="删除">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="qb-card-meta">
          <span class="qb-tag" style="background:${domainMeta.color}18;color:${domainMeta.color};">${domainMeta.label}</span>
          <span class="qb-tag">${r.nodeTitle}</span>
          <span class="qb-result-badge ${r.result}">${r.result === 'wrong' ? '答错' : '答对'}</span>
          <span class="qb-date">${_qbFormatDate(r.ts)}</span>
        </div>
        <div class="qb-answer-row">正确答案：<span>${r.answer}</span>${r.result==='wrong'?` · 你的答案：<span style="color:#EF4444">${r.userAnswer}</span>`:''}</div>
      </div>`;
    }).join('');
  }
  function qbSetFilter(f, el) {
    _qbFilter = f;
    document.querySelectorAll('#qb-result-filters .qb-filter').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderQuizBank();
  }
  function qbSetDomain(d) { _qbDomainFilter = d; _qbNodeFilter = 'all'; renderQuizBank(); }
  function qbSetNode(n) { _qbNodeFilter = n; renderQuizBank(); }
  function qbDelete(id) {
    const records = qbLoad().filter(r => r.id !== id);
    qbSave(records);
    renderQuizBank();
    _updateQbBadge();
  }
  function qbClearAll() {
    if (!confirm('确定清空全部题目记录？')) return;
    qbSave([]);
    localStorage.removeItem(QB_SEEDED_KEY);
    renderQuizBank();
    _updateQbBadge();
  }
  function qbSearchInput(val) { _qbSearch = val; renderQuizBank(); }

  // ── PROGRESS TRACKER ──
  function updateProgressTracker() {
    // Refresh archive if it's open on 我的路径 tab
    const drawer = document.getElementById('qb-drawer');
    const pathsPanel = document.getElementById('la-panel-paths');
    if (drawer && drawer.classList.contains('open') && pathsPanel && pathsPanel.style.display !== 'none') {
      renderMyPaths();
    }
  }

  // Phase definitions for the roadmap
  const PHASE_META = [
    { cat: 'beginner',    label: '阶段一：基础准备',    color: '#10B981' },
    { cat: 'developer',   label: '阶段二：应用开发',    color: '#2e53fa' },
    { cat: 'operator',    label: '阶段三：算子开发',    color: '#8B5CF6' },
    { cat: 'distributed', label: '阶段四：分布式训练',  color: '#F59E0B' },
  ];

  function continuePhase(cat) {
    const nodes = document.querySelectorAll(`#page-learn .rm-node[data-category="${cat}"]`);
    const target = [...nodes].find(n => !n.classList.contains('completed')) || nodes[0];
    if (target) openNodeDrawer(target);
  }

  // ── LEARN STATE PERSISTENCE ──
  const LEARN_STATE_KEY = 'cann_learn_state';

  function saveLearnState() {
    const completed = Array.from(document.querySelectorAll('#page-learn .rm-node.completed'))
      .map(el => el.querySelector('.rm-node-title')?.textContent?.trim())
      .filter(Boolean);
    localStorage.setItem(LEARN_STATE_KEY, JSON.stringify(completed));
  }

  function loadLearnState() {
    try {
      const saved = JSON.parse(localStorage.getItem(LEARN_STATE_KEY) || '[]');
      if (!saved.length) return;
      document.querySelectorAll('#page-learn .rm-node').forEach(node => {
        const title = node.querySelector('.rm-node-title')?.textContent?.trim();
        if (title && saved.includes(title)) {
          node.classList.add('completed');
          const statusEl = node.querySelector('.rm-status');
          if (statusEl) { statusEl.className = 'rm-status done'; statusEl.textContent = '✓'; }
        }
      });
    } catch(e) {}
    updateProgressTracker();
  }


  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    loadLearnState();
    updateProgressTracker();
    // If on docs page, show home view
    if (document.getElementById('page-docs')) showDoc('home');
    // If on learn page, apply any cross-page pending path
    if (document.getElementById('page-learn')) _applyPendingLearnPath();
    updateDocsSandboxBar();
  });

  // ── INLINE PATH EDITOR (ipe*) ──
  let _ipNodes = [];
  let _ipName  = '';
  let _ipQuery = '';
  let _ipDragSrc = null;
  let _ipInsertAfterIdx = null;
  let _ipSearchCache = [];
  let _ipSuggCache  = [];
  let _ipUndoFn   = null;
  let _ipUndoTimer = null;

  function ipeShow() {
    _ipName  = _aiPathName;
    _ipQuery = _aiPathQuery;
    const wrap = document.getElementById('ipe-wrap');
    wrap.classList.remove('hidden');
    document.getElementById('ipe-name').textContent = _ipName;
    document.getElementById('ipe-meta').textContent = `${_ipNodes.length} 个节点 · 刚刚生成`;
    document.getElementById('ipe-save-btn').textContent = '保存路径';
    document.getElementById('ipe-save-btn').style.background = '';
    document.getElementById('ipe-save-hint').textContent = '保存后可在学习档案中查看';
    ipeRenderNodes();
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function ipeDiscard() {
    document.getElementById('ipe-wrap').classList.add('hidden');
    document.getElementById('page-learn').classList.remove('ipe-active');
    _ipNodes = [];
    _aiPathMode  = false;
    _aiPathState = 'idle';
    document.getElementById('ai-title-text').textContent = 'CANN 智能助手';
  }

  function ipeRenderNodes(scrollToIdx) {
    const wrap = document.getElementById('ipe-nodes');
    wrap.innerHTML = '';
    _ipNodes.forEach((n, i) => {
      if (i === 0) wrap.appendChild(_ipMakeIZ(-1));
      wrap.appendChild(_ipMakeNodeRow(n, i));
      wrap.appendChild(_ipMakeIZ(i));
    });
    document.getElementById('ipe-meta').textContent = `${_ipNodes.length} 个节点 · 刚刚生成`;
    if (scrollToIdx !== undefined) {
      const rows = wrap.querySelectorAll('.pg-node-row');
      if (rows[scrollToIdx]) rows[scrollToIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function _ipMakeNodeRow(node, i) {
    const row = document.createElement('div');
    row.className = 'pg-node-row' + (node.known ? ' known-row' : '');
    row.draggable = true;
    row.dataset.idx = i;
    const isLast = i === _ipNodes.length - 1;
    row.innerHTML = `
      <div class="pg-drag-handle" title="拖拽排序">⠿</div>
      <div class="pg-timeline">
        <div class="pg-tl-dot"></div>
        ${isLast ? '' : '<div class="pg-tl-line"></div>'}
      </div>
      <div class="pg-node-card">
        <div class="pg-node-top">
          <span class="pg-step-badge">${String(i+1).padStart(2,'0')}</span>
          <div class="pg-node-title">${node.title}</div>
          <div class="pg-node-actions">
            <button class="pg-nbtn${node.known?' known-on':''}" title="标记已掌握" onclick="ipeToggleKnown(${i})">✓</button>
            <button class="pg-nbtn del" title="删除节点" onclick="ipeDeleteNode(${i})">×</button>
            <button class="pg-nbtn" title="折叠/展开" onclick="ipeToggleCollapse(${i})" style="transform:${node.collapsed?'rotate(-90deg)':''}">▾</button>
          </div>
        </div>
        <div class="pg-node-body${node.collapsed?' collapsed':''}">
          <div class="pg-node-desc">${node.reason || node.desc || ''}</div>
          ${(node.tags||[]).length ? `<div class="pg-node-tags">${(node.tags||[]).map(t=>`<span class="pg-node-tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      </div>`;
    row.addEventListener('dragstart', e => { _ipDragSrc = i; row.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    row.addEventListener('dragend', () => { _ipDragSrc = null; document.querySelectorAll('#ipe-nodes .pg-node-row').forEach(r => r.classList.remove('dragging','drag-over')); });
    row.addEventListener('dragover', e => { e.preventDefault(); if (_ipDragSrc !== null && _ipDragSrc !== i) row.classList.add('drag-over'); });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', e => {
      e.preventDefault(); row.classList.remove('drag-over');
      if (_ipDragSrc === null || _ipDragSrc === i) return;
      const src = _ipDragSrc;
      const moved = _ipNodes.splice(src, 1)[0];
      _ipNodes.splice(i, 0, moved);
      ipeRenderNodes();
      _ipeShowUndo(`已移动「${moved.title}」`, () => { _ipNodes.splice(i, 1); _ipNodes.splice(src, 0, moved); ipeRenderNodes(); });
    });
    return row;
  }

  function _ipMakeIZ(afterIdx) {
    const z = document.createElement('div');
    z.className = 'pg-iz';
    z.innerHTML = `<div class="pg-iz-line"></div><div class="pg-iz-plus">+</div><div class="pg-iz-line"></div>`;
    z.addEventListener('click', e => { e.stopPropagation(); ipeShowInsert(afterIdx, z); });
    return z;
  }

  function ipeDeleteNode(i) {
    const removed = _ipNodes[i];
    _ipNodes.splice(i, 1);
    ipeRenderNodes();
    _ipeShowUndo(`已删除「${removed.title}」`, () => { _ipNodes.splice(i, 0, removed); ipeRenderNodes(); });
  }

  function ipeToggleKnown(i) {
    _ipNodes[i].known = !_ipNodes[i].known;
    ipeRenderNodes();
  }

  function ipeToggleCollapse(i) {
    _ipNodes[i].collapsed = !_ipNodes[i].collapsed;
    const rows = document.querySelectorAll('#ipe-nodes .pg-node-row');
    const row = rows[i];
    if (!row) { ipeRenderNodes(); return; }
    const body = row.querySelector('.pg-node-body');
    const btn  = row.querySelectorAll('.pg-nbtn')[2];
    if (body) body.classList.toggle('collapsed', _ipNodes[i].collapsed);
    if (btn)  btn.style.transform = _ipNodes[i].collapsed ? 'rotate(-90deg)' : '';
  }

  // Insert popup
  function ipeShowInsert(afterIdx, zoneEl) {
    _ipInsertAfterIdx = afterIdx;
    _ipSearchCache = [];
    const popup = document.getElementById('ipe-insert-popup');
    document.getElementById('ipe-isearch').value = '';
    document.getElementById('ipe-search-section').style.display  = 'none';
    document.getElementById('ipe-recommend-section').style.display = '';
    const existing = new Set(_ipNodes.map(n => n.title));
    _ipSuggCache = NODE_LIST.filter(n => !existing.has(n.title)).slice(0, 3);
    document.getElementById('ipe-recommend-opts').innerHTML = _ipSuggCache.map((s, i) => `
      <div class="pg-iopt" onclick="ipeInsertSuggest(${i})">
        <div class="pg-iopt-dot"></div>
        <div><div class="pg-iopt-title">${s.title}</div><div class="pg-iopt-desc">${s.desc||''}</div></div>
      </div>`).join('');
    popup.style.display = 'block';
    const rect = zoneEl.getBoundingClientRect();
    const pw = 288, ph = popup.offsetHeight || 230;
    let top = rect.bottom + 6, left = rect.left + rect.width/2 - pw/2;
    if (left + pw > window.innerWidth - 16) left = window.innerWidth - pw - 16;
    if (left < 16) left = 16;
    if (top + ph > window.innerHeight - 16) top = rect.top - ph - 6;
    popup.style.top = top + 'px'; popup.style.left = left + 'px';
    setTimeout(() => { document.addEventListener('click', _ipeCloseInsertOutside); document.getElementById('ipe-isearch').focus(); }, 50);
  }

  function ipeCloseInsert() {
    document.getElementById('ipe-insert-popup').style.display = 'none';
    document.removeEventListener('click', _ipeCloseInsertOutside);
  }

  function _ipeCloseInsertOutside(e) {
    if (!document.getElementById('ipe-insert-popup').contains(e.target)) ipeCloseInsert();
  }

  function ipeFilterSearch(query) {
    const q = query.trim();
    const ss = document.getElementById('ipe-search-section');
    const rs = document.getElementById('ipe-recommend-section');
    if (!q) { ss.style.display = 'none'; rs.style.display = ''; return; }
    const existing = new Set(_ipNodes.map(n => n.title));
    const ql = q.toLowerCase();
    const hits = NODE_LIST.filter(n => !existing.has(n.title) && (n.title.toLowerCase().includes(ql) || (n.desc||'').toLowerCase().includes(ql))).slice(0, 6);
    _ipSearchCache = hits;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    const hl = t => (t||'').replace(re, '<mark>$1</mark>');
    document.getElementById('ipe-search-label').textContent = hits.length ? `搜索结果（${hits.length}）` : '搜索结果';
    document.getElementById('ipe-search-results').innerHTML = hits.length
      ? hits.map((n, i) => `<div class="pg-iopt" onclick="ipeInsertSearch(${i})"><div class="pg-iopt-dot search"></div><div><div class="pg-iopt-title">${hl(n.title)}</div><div class="pg-iopt-desc">${hl(n.desc||'')}</div></div></div>`).join('')
      : `<div class="pg-iempty">没有找到「${q}」相关节点</div>`;
    ss.style.display = ''; rs.style.display = 'none';
  }

  function _ipeDoInsert(nodeObj) {
    const newNode = { ...nodeObj, known: false, collapsed: false };
    const pos = _ipInsertAfterIdx + 1;
    _ipNodes.splice(pos, 0, newNode);
    ipeCloseInsert();
    ipeRenderNodes(pos);
    _ipeShowUndo(`已插入「${newNode.title}」`, () => { _ipNodes.splice(pos, 1); ipeRenderNodes(); });
  }

  function ipeInsertSuggest(i) { _ipeDoInsert(_ipSuggCache[i]); }
  function ipeInsertSearch(i)  { _ipeDoInsert(_ipSearchCache[i]); }

  function _ipeShowUndo(msg, fn) {
    if (_ipUndoTimer) clearTimeout(_ipUndoTimer);
    _ipUndoFn = fn;
    document.getElementById('ipe-undo-msg').textContent = msg;
    document.getElementById('ipe-undo-toast').classList.add('show');
    _ipUndoTimer = setTimeout(() => { document.getElementById('ipe-undo-toast').classList.remove('show'); _ipUndoFn = null; }, 4000);
  }

  function ipeDoUndo() {
    if (_ipUndoFn) { _ipUndoFn(); _ipUndoFn = null; }
    clearTimeout(_ipUndoTimer);
    document.getElementById('ipe-undo-toast').classList.remove('show');
  }

  function ipeSavePath() {
    if (!_ipNodes.length) return;
    const path = {
      id: 'path_' + Date.now(),
      name: _ipName,
      query: _ipQuery,
      icon: '✨',
      nodeList: _ipNodes.map((n, i) => ({ ...n, step: i+1 })),
      createdAt: new Date().toLocaleDateString('zh-CN'),
      lastStudied: new Date().toLocaleDateString('zh-CN'),
    };
    try { Object.assign(path, JSON.parse(sessionStorage.getItem('cann_learning_plan') || '{}')); } catch(e) {}
    customPaths = JSON.parse(localStorage.getItem('cann_custom_paths') || '[]');
    customPaths.unshift(path);
    localStorage.setItem('cann_custom_paths', JSON.stringify(customPaths));
    const btn = document.getElementById('ipe-save-btn');
    btn.textContent = '✓ 已保存';
    btn.style.background = '#22c55e';
    document.getElementById('ipe-save-hint').textContent = '已保存到学习档案';
    setTimeout(() => {
      document.getElementById('ipe-wrap').classList.add('hidden');
      document.getElementById('page-learn').classList.remove('ipe-active');
      _aiPathMode  = false;
      _aiPathState = 'idle';
      document.getElementById('ai-title-text').textContent = 'CANN 智能助手';
      openLearningArchive('paths');
    }, 800);
  }

  // ── AI PAGE ACTIONS ──
  // Triggered when user says "帮我 + 操作" — cursor moves to target and executes.

  // Position cursor at element; tip of arrow points to element center
  function _showAiCursorAtEl(el, label) {
    const rect = el.getBoundingClientRect();
    const cursor = document.getElementById('ai-edit-cursor');
    const labelEl = document.getElementById('ai-edit-cursor-label');
    if (labelEl) labelEl.textContent = label || 'AI';
    cursor.classList.remove('hidden');
    // Arrow tip is at top-left of the SVG → place cursor so tip hits element center
    const tipX = rect.left + rect.width  / 2;
    const tipY = rect.top  + rect.height / 2;
    const left = Math.max(4, Math.min(tipX, window.innerWidth  - 200));
    const top  = Math.max(4, Math.min(tipY, window.innerHeight - 40));
    cursor.style.left = left + 'px';
    cursor.style.top  = top  + 'px';
  }

  function _showClickRipple() {
    const cursor = document.getElementById('ai-edit-cursor');
    const rect = cursor.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ai-cursor-ripple';
    // Ripple at the arrow tip (top-left of cursor bounding box)
    ripple.style.left = rect.left + 'px';
    ripple.style.top  = rect.top  + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  function _highlightEl(el) {
    el.classList.add('demo-highlight');
    setTimeout(() => el.classList.remove('demo-highlight'), 900);
  }

  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── AI page action executor ──
  // Each action: { match: [regex strings], sel, fn, reply }
  const _PAGE_ACTIONS = [
    // Navigation
    { match: ['前往.*文档|打开.*文档|去.*文档|切换.*文档'],
      sel: '#nav-docs', fn: () => showPage('docs'),
      reply: '好的，正在跳转到文档页…' },
    { match: ['前往.*学习|打开.*学习|去.*学习|切换.*学习'],
      sel: '#nav-learn', fn: () => showPage('learn'),
      reply: '好的，正在跳转到学习页…' },
    { match: ['前往.*首页|回.*首页|返回.*首页'],
      sel: '#nav-home', fn: () => showPage('home'),
      reply: '好的，正在跳转到首页…' },
    // Learn page tabs
    { match: ['切换.*自定义|自定义.*标签|打开.*自定义'],
      sel: '.top-tab:nth-child(3)', fn: null,
      reply: '已为你切换到「自定义」标签，输入你的学习目标即可生成路径～' },
    { match: ['切换.*推荐|推荐.*路径|默认.*路径'],
      sel: '.top-tab:nth-child(1)', fn: null,
      reply: '已为你切换到「推荐路径」标签。' },
    // Sandbox
    { match: ['打开.*沙盒|打开.*hidevlab|hidevlab|在线运行|打开.*实验室'],
      sel: '.btn-open-sandbox', fn: () => openEmptySandbox(),
      reply: '已为你打开 HiDevLab 在线沙盒 🚀' },
    // AI sidebar
    { match: ['关闭.*助手|关闭.*侧边栏|收起.*助手'],
      sel: '.btn-close-ai', fn: () => _closeSidebar(),
      reply: '好的，已收起助手面板。' },
  ];

  async function _tryPageAction(msg) {
    const lower = msg.toLowerCase();
    // Only trigger when message contains action intent
    if (!/(帮我|帮忙|请你|能不能|帮.*切换|帮.*打开|帮.*跳转|帮.*关闭)/.test(msg) &&
        !/(切换到|打开|前往|跳转|关闭|收起)/.test(msg)) return false;

    for (const action of _PAGE_ACTIONS) {
      const matched = action.match.some(p => new RegExp(p).test(lower) || new RegExp(p).test(msg));
      if (!matched) continue;
      const el = action.sel ? document.querySelector(action.sel) : null;
      if (action.sel && !el) continue; // element doesn't exist on this page
      _aiAddUser(msg);
      _activateGlow(true);
      if (el) {
        _showAiCursorAtEl(el, '正在操作…');
        await _sleep(550);
        _showClickRipple();
        _highlightEl(el);
        await _sleep(150);
        if (action.fn) action.fn(); else el.click();
      } else if (action.fn) {
        action.fn();
      }
      await _sleep(300);
      _hideAiCursor();
      _activateGlow(false);
      _aiAddBot(action.reply);
      return true;
    }
    return false;
  }

  // ── LEARN DASHBOARD (ld-*) ──────────────────────────────────────────────────
  // Used by learn.html new dashboard layout

  let _ldActiveCat = 'all';
  let _ldSelectedScenario = '';
  let _ldPathView = 'list';
  let _ldActivePathNodes = [];
  const LD_RESOURCES_KEY = 'cann_learn_resources';

  const LD_SCENARIOS = {
    '算子开发': 'TBE / TIK 自定义算子开发、编译与调试',
    '模型迁移': '将 PyTorch 或 ONNX 模型迁移并适配到昇腾',
    '模型推理': '完成模型转换、AscendCL 推理与部署验证',
    '模型训练': '在昇腾上启动、调试和优化模型训练',
    '性能调优': '使用 Profiling 定位训练、推理或算子性能瓶颈',
  };

  function ldChooseScenario(name) {
    _ldSelectedScenario = name;
    document.querySelectorAll('.ld-scenario-card').forEach(card => card.classList.toggle('active', card.querySelector('strong')?.textContent === name));
    const goal = document.getElementById('ld-goal-input');
    const input = document.getElementById('ld-ai-input');
    if (name) {
      const text = LD_SCENARIOS[name];
      if (input) input.value = text;
      if (goal) goal.value = `完成${name}相关的实践任务`;
    } else if (goal) {
      goal.value = '';
      goal.focus();
    }
    document.getElementById('ld-plan-fields')?.classList.add('open');
  }

  function ldSetInput(text) {
    const input = document.getElementById('ld-ai-input');
    if (input) { input.value = text; input.focus(); }
  }

  async function ldGenPath() {
    const input = document.getElementById('ld-ai-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) { input.focus(); return; }

    const goal = document.getElementById('ld-goal-input')?.value.trim();
    const deadline = document.getElementById('ld-deadline-input')?.value;
    const planContext = [goal && `学习目标：${goal}`, deadline && `计划完成日：${deadline}`].filter(Boolean).join('；');
    sessionStorage.setItem('cann_learning_plan', JSON.stringify({ scenario: _ldSelectedScenario, goal, deadline }));
    // Kick off AI-guided path generation via sidebar
    _aiPathStart(planContext ? `${query}；${planContext}` : query);
  }

  function ldToggleResourceForm() {
    document.getElementById('ld-resource-form')?.classList.toggle('open');
  }

  function ldLoadResources() {
    try { return JSON.parse(localStorage.getItem(LD_RESOURCES_KEY) || '[]'); } catch(e) { return []; }
  }

  function ldRenderResources() {
    const list = document.getElementById('ld-resource-list');
    if (!list) return;
    const resources = ldLoadResources();
    list.innerHTML = resources.length ? resources.map((r, i) => `<div class="ld-resource-item"><span>${r.type}</span><a href="${r.url}" target="_blank" rel="noopener">${r.title}</a><button onclick="ldDeleteResource(${i})" title="删除">×</button></div>`).join('') : '<div class="ld-resource-empty">还没有个人资源。可添加常用文档、课程或代码仓库。</div>';
  }

  function ldSaveResource(event) {
    event.preventDefault();
    const title = document.getElementById('ld-resource-title').value.trim();
    const url = document.getElementById('ld-resource-url').value.trim();
    const type = document.getElementById('ld-resource-type').value;
    if (!title || !url) return;
    const resources = ldLoadResources();
    resources.unshift({ title, url, type });
    localStorage.setItem(LD_RESOURCES_KEY, JSON.stringify(resources));
    event.currentTarget.reset();
    event.currentTarget.classList.remove('open');
    ldRenderResources();
  }

  function ldDeleteResource(index) {
    const resources = ldLoadResources();
    resources.splice(index, 1);
    localStorage.setItem(LD_RESOURCES_KEY, JSON.stringify(resources));
    ldRenderResources();
  }

  function ldSetCat(cat, btn) {
    _ldActiveCat = cat;
    document.querySelectorAll('.ld-cat-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    ldRenderNodes(cat);
  }

  function ldRenderContinue() {
    const container = document.getElementById('ld-continue-list');
    if (!container) return;
    const paths = customPaths.length > 0 ? customPaths : samplePaths;
    const shown = paths.slice(0, 4);

    const ICONS = { beginner: '📘', developer: '🔧', operator: '⚙️', distributed: '🌐' };
    const PROG = [27, 55, 10, 82]; // mock progress %

    container.innerHTML = shown.map((path, idx) => {
      const prog = PROG[idx % PROG.length];
      const nodeCount = path.nodeList ? path.nodeList.length : 5;
      const doneCount = Math.round(nodeCount * prog / 100);
      const nextNode = path.nodeList ? (path.nodeList[doneCount] || path.nodeList[0]) : null;
      const icon = path.icon || ICONS[path.nodeList?.[0]?.category] || '📚';
      return `
        <div class="ld-path-card" onclick="ldShowRoadmap('${path.id}')">
          <div class="ld-path-icon">${icon}</div>
          <div class="ld-path-body">
            <div class="ld-path-name">${path.name}</div>
            <div class="ld-path-prog-wrap">
              <div class="ld-path-prog-track"><div class="ld-path-prog-fill" style="width:${prog}%"></div></div>
              <span class="ld-path-prog-label">${doneCount} / ${nodeCount} 节点</span>
            </div>
            ${nextNode ? `<span class="ld-path-next">下一步：${nextNode.title}</span>` : ''}
          </div>
          <button class="ld-path-cta" onclick="event.stopPropagation();ldShowRoadmap('${path.id}')">继续学习</button>
        </div>`;
    }).join('');
  }

  function ldRenderNodes(cat) {
    const grid = document.getElementById('ld-node-grid');
    if (!grid) return;
    const nodes = cat === 'all' ? NODE_LIST : NODE_LIST.filter(n => n.category === cat);
    const diffLabel = ['', '入门', '进阶', '高级'];
    grid.innerHTML = nodes.map(n => {
      const meta = CAT_META[n.category] || { label: n.category, color: '#888' };
      const dots = n.difficulty ? Array.from({length: 3}, (_, i) =>
        `<span style="width:6px;height:6px;border-radius:50%;display:inline-block;background:${i < n.difficulty ? meta.color : 'var(--border)'}"></span>`
      ).join('') : '';
      const topicsHtml = (n.topics || []).map(t =>
        `<li style="display:flex;gap:6px;align-items:flex-start;font-size:12px;color:var(--text-secondary);line-height:1.5">
          <span style="color:${meta.color};flex-shrink:0;margin-top:1px">✓</span>${t}
        </li>`
      ).join('');
      return `
        <div class="ld-node-card">
          <div class="ld-node-card-top">
            <span class="ld-node-card-title">${n.title}</span>
            <span class="ld-node-card-badge" style="background:${meta.color}18;color:${meta.color}">${meta.label}</span>
          </div>
          <div class="ld-node-card-desc" style="margin-bottom:10px">${n.desc}</div>
          ${topicsHtml ? `<ul style="margin:0 0 12px;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px">${topicsHtml}</ul>` : ''}
          <div class="ld-node-card-footer">
            <div style="display:flex;align-items:center;gap:6px">
              ${dots}
              <span style="font-size:11px;color:var(--text-muted)">${diffLabel[n.difficulty] || ''}</span>
              ${n.duration ? `<span style="font-size:11px;color:var(--text-muted);margin-left:6px">· ${n.duration}</span>` : ''}
            </div>
            <button class="ld-node-start-btn" onclick="ldStartNode('${n.title}')">开始学习 →</button>
          </div>
        </div>`;
    }).join('');
  }

  function ldStartNode(title) {
    // Navigate to roadmap view and jump to this node
    const nodeIdx = NODE_LIST.findIndex(n => n.title === title);
    if (nodeIdx < 0) return;
    // Show roadmap with a path that includes this node
    ldShowRoadmap(null, nodeIdx);
  }

  function ldShowRoadmap(pathId, focusIdx) {
    const dash = document.getElementById('ld-dash');
    const roadmap = document.getElementById('ld-roadmap');
    if (!dash || !roadmap) return;

    if (pathId) {
      const path = (customPaths.length > 0 ? customPaths : samplePaths).find(p => p.id === pathId);
      if (path) {
        const nameEl = document.getElementById('ld-roadmap-name');
        const progFill = document.getElementById('ld-roadmap-prog-fill');
        const progLbl = document.getElementById('ld-roadmap-prog-lbl');
        if (nameEl) nameEl.textContent = path.name;
        const nodeCount = path.nodeList ? path.nodeList.length : 5;
        const prog = 27; // mock
        const done = Math.round(nodeCount * prog / 100);
        if (progFill) progFill.style.width = prog + '%';
        if (progLbl) progLbl.textContent = `${done} / ${nodeCount} 节点`;
        // Render path sequence strip
        if (path.nodeList) renderLearnPagePath(path.query, path.nodeList);
      }
    }

    dash.style.display = 'none';
    roadmap.style.display = '';
    const fallback = focusIdx !== undefined ? [NODE_LIST[focusIdx]] : (window._currentLearnPath || NODE_LIST.slice(0, 5));
    ldRenderPathWorkspace(window._currentLearnPath?.length ? window._currentLearnPath : fallback);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function ldSetPathView(view, btn) {
    _ldPathView = view;
    document.querySelectorAll('.ld-view-switch button').forEach(b => b.classList.toggle('active', b === btn));
    ldRenderPathNav();
  }

  function ldRenderPathWorkspace(nodes) {
    _ldActivePathNodes = nodes || [];
    ldRenderPathNav();
    if (_ldActivePathNodes.length) ldOpenPathNode(0);
  }

  function ldRenderPathNav() {
    const nav = document.getElementById('ld-path-nav');
    if (!nav) return;
    nav.classList.toggle('map', _ldPathView === 'map');
    nav.innerHTML = _ldActivePathNodes.map((n, i) => `<button class="ld-path-nav-item ${i === 0 ? 'active' : ''}" onclick="ldOpenPathNode(${i})"><span>${i + 1}</span><strong>${n.title}</strong><small>${n.duration || '学习节点'}</small></button>`).join('');
  }

  function ldOpenPathNode(index) {
    const node = _ldActivePathNodes[index];
    if (!node) return;
    document.querySelectorAll('.ld-path-nav-item').forEach((el, i) => el.classList.toggle('active', i === index));
    const knowledge = NODE_KNOWLEDGE[node.title];
    const content = document.getElementById('ld-learning-content');
    if (!content) return;
    const resources = (knowledge?.resources || []).map(r => `<a class="ld-content-resource" href="${r.href}" target="_blank"><span>${r.icon}</span><div><strong>${r.title}</strong><small>${r.subtitle || r.type}</small></div></a>`).join('');
    const concepts = (knowledge?.concepts || []).slice(0, 4).map(c => `<div class="ld-content-concept"><strong>${c.term}</strong><p>${c.desc}</p></div>`).join('');
    content.innerHTML = `<div class="ld-content-kicker">第 ${index + 1} 步 · ${CAT_META[node.category]?.label || '学习节点'}</div><h1>${node.title}</h1><p class="ld-content-summary">${knowledge?.summary || node.desc}</p><div class="ld-content-actions"><button onclick="openNodeDrawer('${node.title}')">打开完整学习内容</button><button class="secondary" onclick="openEmptySandbox()">在 HiDevLab 实践</button></div><section><h2>本节要掌握什么</h2><div class="ld-content-concepts">${concepts || '<p>完成本节学习并在实践中验证。</p>'}</div></section><section><h2>学习资源</h2><div class="ld-content-resources">${resources || '<p>暂无推荐资源。</p>'}</div></section>`;
  }

  function ldShowDash() {
    const dash = document.getElementById('ld-dash');
    const roadmap = document.getElementById('ld-roadmap');
    if (dash) dash.style.display = '';
    if (roadmap) roadmap.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Init learn dashboard on page load
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('ld-dash')) return; // only on learn.html
    ldRenderContinue();
    ldRenderNodes('all');
    ldRenderResources();
  });
