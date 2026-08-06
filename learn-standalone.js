/* Shared behaviour for the two standalone learning pages. */
(() => {
  const page = window.__LEARN_STANDALONE_PAGE;
  const homeUrl = 'learn-home.html';
  const pathUrl = 'learn-path.html';
  const originalShowRoadmap = window.ldShowRoadmap;
  const originalStartNode = window.ldStartNode;
  const originalOpenPathNode = window.ldOpenPathNode;
  const originalShowDash = window.ldShowDash;
  const originalSetPathView = window.ldSetPathView;
  const toolMeta = {
    ai: { title:'AI 助手', icon:'bot', height:420, min:300 },
    visual: { title:'知识图谱', icon:'network', height:540, min:380 },
    quiz: { title:'随堂测验', icon:'circle-help', height:320, min:240 }
  };

  const escapeHtml = value => String(value || '').replace(/[&<>\"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[char]);
  const pathLocation = (pathId, nodeTitle) => {
    const query = new URLSearchParams();
    if (pathId) query.set('path', pathId);
    if (nodeTitle) query.set('node', nodeTitle);
    window.location.href = `${pathUrl}?${query.toString()}`;
  };

  function ensureUtilityWindow() {
    let windowEl = document.getElementById('learn-utility-window');
    if (windowEl) return windowEl;
    windowEl = document.createElement('aside');
    windowEl.id = 'learn-utility-window';
    windowEl.className = 'learn-utility-window';
    windowEl.innerHTML = '<header><strong></strong><button type="button" aria-label="关闭">×</button></header><div class="learn-utility-body"></div>';
    windowEl.querySelector('button').addEventListener('click', () => windowEl.classList.remove('open'));
    document.body.appendChild(windowEl);
    return windowEl;
  }

  function showUtilityWindow(title, content) {
    const windowEl = ensureUtilityWindow();
    windowEl.querySelector('header strong').textContent = title;
    windowEl.querySelector('.learn-utility-body').innerHTML = content;
    windowEl.classList.add('open');
  }

  // The dashboard's original assistant is tied to the full site shell. Keep the
  // standalone entry self-contained instead of requiring unrelated navigation DOM.
  window.toggleAiChat = function toggleStandaloneAssistant() {
    showUtilityWindow('智能助手', '<p>我会结合你的学习记录与当前任务，帮助解释概念、检查代码并规划下一步。</p><div class="learn-utility-suggestions"><button type="button">帮我规划下一步</button><button type="button">解释当前概念</button><button type="button">准备一次练习</button></div><label>输入你的问题<input placeholder="例如：Qwen3 首跑前要检查什么？"></label>');
  };

  window.openLearningArchive = function openStandaloneArchive(tab = 'paths') {
    const selected = tab === 'quiz' ? '随堂复习' : tab === 'map' ? '学习全景图' : '学习档案';
    const paths = [
      { id:'qwen3-npu-inference-baseline', name:'在昇腾 NPU 上运行 Qwen3', count:17 },
      { id:'official-ascend-c', name:'算子开发从入门到精通', count:34 }
    ];
    const list = paths.map(item => `<button type="button" class="learn-utility-path" data-path="${escapeHtml(item.id)}"><strong>${escapeHtml(item.name)}</strong><small>${item.count} 个节点 · 打开路径</small></button>`).join('');
    const content = tab === 'paths'
      ? `<p>从这里继续已保存或官方学习路径。</p>${list || '<p>暂无学习路径。</p>'}`
      : tab === 'quiz'
        ? '<p>随堂测验会根据正在学习的节点生成，进入路径后从右侧 FAB 打开即可。</p>'
        : '<p>学习全景图聚合你的路径和已学节点；完整视图保留在整站兼容入口中。</p>';
    showUtilityWindow(selected, content);
    document.querySelectorAll('.learn-utility-path').forEach(button => button.addEventListener('click', () => pathLocation(button.dataset.path)));
  };

  window.ldToggleTwinPanel = function toggleStandaloneTwin() {
    showUtilityWindow('我的学习分身', '<div class="learn-twin-summary"><b>分身 Lv.2</b><span>成长中</span></div><p>已点亮 5/13 个知识点。它会根据你的学习进度推荐下一步和复习内容。</p><button type="button" onclick="openLearningArchive(\'map\')">查看学习全景图</button>');
  };
  window.ldCloseTwinPanel = () => document.getElementById('learn-utility-window')?.classList.remove('open');

  if (page === 'home') {
    window.ldShowRoadmap = pathId => pathLocation(pathId || 'qwen3-npu-inference-baseline');
    window.ldStartNode = title => pathLocation('', title);
    window.ldShowDash = () => window.scrollTo({ top:0, behavior:'instant' });
  }

  if (page === 'path') {
    function renderPathNav() {
      const nav = document.getElementById('ld-path-nav');
      if (!nav || !Array.isArray(_ldActivePathNodes)) return;
      const clusters = [];
      _ldActivePathNodes.forEach((node, index) => {
        const course = node.course || '学习节点';
        let cluster = clusters[clusters.length - 1];
        if (!cluster || cluster.course !== course) {
          cluster = { course, items:[] };
          clusters.push(cluster);
        }
        cluster.items.push({ node, index });
      });
      nav.classList.remove('map');
      nav.innerHTML = `<div class="v2-list-route">${clusters.map(cluster => `<section class="v2-list-cluster"><h3><i data-lucide="book-open" aria-hidden="true"></i>${escapeHtml(cluster.course)}</h3>${cluster.items.map(({ node, index }) => `<button class="v2-list-node ${index === _ldActivePathIndex ? 'active' : ''}" type="button" onclick="ldOpenPathNode(${index})"><span>${index + 1}</span><div><strong>${escapeHtml(node.title)}</strong><small>${escapeHtml(node.duration || `第 ${index + 1} 章`)}</small></div></button>`).join('')}</section>`).join('')}</div>`;
      window.lucide?.createIcons();
    }
    window.ldShowRoadmap = function showStandaloneRoadmap(pathId, focusIdx) {
      const result = originalShowRoadmap?.(pathId, focusIdx);
      document.getElementById('ld-roadmap')?.style.setProperty('display', 'flex');
      document.getElementById('ld-dash')?.style.setProperty('display', 'none');
      renderPathNav();
      requestAnimationFrame(() => window.lucide?.createIcons());
      return result;
    };
    window.ldShowDash = () => { window.location.href = homeUrl; };
    window.ldStartNode = function startStandaloneNode(title) {
      originalStartNode?.(title);
      renderPathNav();
      requestAnimationFrame(() => window.lucide?.createIcons());
    };
    window.ldOpenPathNode = function openStandalonePathNode(index) {
      originalOpenPathNode?.(index);
      renderPathNav();
    };

    window.v2SetPathView = function v2SetPathView(view, button) {
      _ldPathView = view;
      document.querySelectorAll('.ld-view-switch button').forEach(item => item.classList.toggle('active', item === button));
      renderPathNav();
    };
    window.v2ToggleWorkspacePanel = function v2ToggleWorkspacePanel(side) {
      const workspace = document.getElementById('ld-path-workspace');
      if (!workspace) return;
      if (side === 'right') return window.v2OpenToolFloat('ai');
      workspace.classList.toggle('v2-left-collapsed');
      workspace.classList.remove('v2-path-float-open');
    };
    window.v2OpenPathFloat = function v2OpenPathFloat() {
      document.getElementById('ld-path-workspace')?.classList.add('v2-left-collapsed', 'v2-path-float-open');
    };
    window.v2ClosePathFloat = function v2ClosePathFloat() {
      document.getElementById('ld-path-workspace')?.classList.remove('v2-path-float-open');
    };
    window.v2OpenToolFloat = function v2OpenToolFloat(name) {
      const workspace = document.getElementById('ld-path-workspace');
      const meta = toolMeta[name];
      if (!workspace || !meta) return;
      workspace.dataset.v2ToolFloat = name;
      workspace.style.setProperty('--v2-tool-float-height', `${meta.height}px`);
      workspace.classList.add('v2-right-collapsed', 'ld-tools-collapsed', 'v2-tool-float-open');
      window.ldSwitchTool?.(name);
      workspace.querySelectorAll('[data-v2-tool-fab]').forEach(button => button.classList.toggle('active', button.dataset.v2ToolFab === name));
      const title = workspace.querySelector('.v2-tool-float-head strong');
      if (title) title.textContent = meta.title;
      const icon = workspace.querySelector('.v2-tool-float-head span > i, .v2-tool-float-head span > svg');
      if (icon) icon.outerHTML = `<i data-lucide="${meta.icon}" aria-hidden="true"></i>`;
      window.lucide?.createIcons();
      if (name === 'ai') setTimeout(() => document.getElementById('ld-tool-ai-input')?.focus(), 0);
    };
    window.v2CloseToolFloat = function v2CloseToolFloat() {
      const workspace = document.getElementById('ld-path-workspace');
      workspace?.classList.remove('v2-tool-float-open');
      if (workspace) delete workspace.dataset.v2ToolFloat;
      workspace?.querySelectorAll('[data-v2-tool-fab]').forEach(button => button.classList.remove('active'));
    };
    window.v2SetSandboxDock = function v2SetSandboxDock(mode) {
      const drawer = document.getElementById('sandbox-drawer');
      const overlay = document.getElementById('sandbox-overlay');
      if (!drawer) return;
      const dock = ['bottom', 'split', 'full'].includes(mode) ? mode : 'bottom';
      drawer.classList.remove('v2-dock-bottom', 'v2-dock-split', 'v2-dock-full');
      drawer.classList.add(`v2-dock-${dock}`);
      drawer.dataset.v2SandboxDock = dock;
      overlay?.classList.toggle('open', drawer.classList.contains('open') && dock === 'bottom');
      document.querySelectorAll('[data-v2-sandbox-dock]').forEach(button => button.classList.toggle('active', button.dataset.v2SandboxDock === dock));
    };
    window.ldOpenPathEditor = () => showUtilityWindow('编辑路径', '<p>路径编辑暂在整站兼容入口中提供。这里保留独立学习与实践工作区，避免编辑状态返回首页时丢失。</p>');
    window.ldOpenAiPathEditor = () => showUtilityWindow('让 AI 调整路径', '<p>告诉 AI 想增加、删除或重排哪些节点；路径编辑将以独立流程继续提供。</p>');
  }

  function bindToolResizer() {
    const handle = document.getElementById('v2-tool-float-resizer');
    if (!handle || handle.dataset.bound) return;
    handle.dataset.bound = 'true';
    handle.addEventListener('pointerdown', event => {
      const workspace = document.getElementById('ld-path-workspace');
      const tools = document.getElementById('ld-study-tools');
      const name = workspace?.dataset.v2ToolFloat;
      if (!workspace || !tools || !name) return;
      event.preventDefault();
      const startY = event.clientY;
      const startHeight = tools.getBoundingClientRect().height;
      const min = toolMeta?.[name]?.min || 240;
      const move = moveEvent => workspace.style.setProperty('--v2-tool-float-height', `${Math.max(min, Math.min(window.innerHeight - 82, startHeight + startY - moveEvent.clientY))}px`);
      const finish = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', finish, { once:true });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (page === 'home') {
      document.getElementById('ld-ai-input')?.addEventListener('input', window.ldUpdateGenerateState);
      window.lucide?.createIcons();
      return;
    }
    if (page !== 'path') return;
    const params = new URLSearchParams(window.location.search);
    const node = params.get('node');
    const pathId = params.get('path') || 'qwen3-npu-inference-baseline';
    if (node) window.ldStartNode(node);
    else window.ldShowRoadmap(pathId);
    bindToolResizer();
    window.v2SetSandboxDock('bottom');
    window.lucide?.createIcons();
  });
})();
