  const AI_WORKER_URL = 'https://ascend-cann.10xinyu0901.workers.dev';

  // Official Ascend C programming path, aligned with hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53.
  const NODE_LIST = [
    { title:'昇腾硬件架构介绍', course:'昇腾异构编程基础（速成班）', category:'beginner', desc:'第 1 章：认识昇腾 AI 处理器的硬件架构与异构计算基础。', topics:['昇腾 AI 处理器组成','AI Core 与计算单元','异构计算任务分工'], duration:'第 1 章', difficulty:1 },
    { title:'CANN软件包结构', course:'昇腾异构编程基础（速成班）', category:'beginner', desc:'第 2 章：理解 CANN 软件包、组件职责与开发环境组成。', topics:['CANN 软件包组成','Toolkit 与开发工具','组件依赖关系'], duration:'第 2 章', difficulty:1 },
    { title:'算子开发编程基础', course:'昇腾异构编程基础（速成班）', category:'beginner', desc:'第 3 章：建立自定义算子开发所需的基础编程认知。', topics:['算子与计算逻辑','数据与存储层级','开发流程概览'], duration:'第 3 章', difficulty:1 },
    { title:'算子开发编程范式', course:'昇腾异构编程基础（速成班）', category:'operator', desc:'第 4 章：学习算子开发的通用组织方式与执行范式。', topics:['数据搬运','计算过程','流水并行'], duration:'第 4 章', difficulty:2 },
    { title:'昇腾平台仿真分析', course:'昇腾异构编程基础（速成班）', category:'operator', desc:'第 5 章：使用仿真分析理解算子执行行为。', topics:['仿真分析目标','执行过程观察','问题定位'], duration:'第 5 章', difficulty:2 },
    { title:'自定义算子性能评估', course:'昇腾异构编程基础（速成班）', category:'operator', desc:'第 6 章：评估自定义算子的执行效率和性能瓶颈。', topics:['性能指标','瓶颈识别','评估结果解读'], duration:'第 6 章', difficulty:2 },
    { title:'自定义算子性能优化', course:'昇腾异构编程基础（速成班）', category:'operator', desc:'第 7 章：围绕数据搬运、并行与计算组织开展优化。', topics:['数据搬运优化','并行策略','性能调优闭环'], duration:'第 7 章', difficulty:3 },
    { title:'多机多卡系统', course:'昇腾异构编程基础（速成班）', category:'distributed', desc:'第 8 章：了解多机多卡场景下的系统与协同方式。', topics:['多机多卡概念','资源协同','系统运行基础'], duration:'第 8 章', difficulty:2 },
    { title:'异构编程实践', course:'昇腾异构编程基础（速成班）', category:'operator', desc:'第 9 章：综合运用基础知识完成异构编程实践。', topics:['任务拆解','算子开发实践','结果验证'], duration:'第 9 章', difficulty:3 },
    { title:'什么是算子', course:'Ascend C算子开发（入门）', category:'operator', desc:'模块一：理解算子的角色、输入输出与在模型中的作用。', topics:['算子定义','计算图中的算子','自定义算子场景'], duration:'模块一', difficulty:1 },
    { title:'什么是Ascend C', course:'Ascend C算子开发（入门）', category:'operator', desc:'模块二：认识以标准 C/C++ 为基础扩展的 Ascend C 编程语言。', topics:['Ascend C 定位','编程模型','面向 AI Core 的开发'], duration:'模块二', difficulty:1 },
    { title:'算子开发初体验', course:'Ascend C算子开发（入门）', category:'operator', desc:'模块三：完成一次从工程创建到运行验证的算子开发体验。', topics:['首个算子','编译与运行','结果校验'], duration:'模块三', difficulty:1 },
    { title:'算子开发环境搭建', course:'Ascend C算子开发（入门）', category:'operator', desc:'模块四：准备 Ascend C 算子开发所需的软件与工程环境。', topics:['环境准备','工具链配置','工程目录'], duration:'模块四', difficulty:1 },
    { title:'一个Add算子的前世今生', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块一：以 Add 算子为例串起从需求、实现到调用的完整过程。', topics:['Add 算子逻辑','开发流程','端到端链路'], duration:'模块一', difficulty:2 },
    { title:'Host侧实现', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块二：理解 Host 侧负责的算子配置、启动与资源组织。', topics:['Host 侧职责','核函数启动','参数配置'], duration:'模块二', difficulty:2 },
    { title:'算子开发工程', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块三：掌握算子工程的文件组织、构建与调试入口。', topics:['工程结构','构建流程','调试入口'], duration:'模块三', difficulty:2 },
    { title:'API调用解读', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块四：理解开发和调用链路中的关键 API。', topics:['API 作用','参数传递','调用时序'], duration:'模块四', difficulty:2 },
    { title:'算子的多种调用方式', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块五：比较不同场景下的算子调用方式。', topics:['调用场景','调用接口','集成方式'], duration:'模块五', difficulty:2 },
    { title:'非对齐尾块处理', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块六：处理数据长度不能整齐切分时的尾块计算。', topics:['数据对齐','尾块场景','边界处理'], duration:'模块六', difficulty:3 },
    { title:'Add算子微认证', course:'Ascend C算子开发（进阶）', category:'operator', desc:'模块七：检验 Add 算子开发、调用与边界处理的掌握程度。', topics:['知识回顾','动手验证','微认证'], duration:'模块七', difficulty:2 },
    { title:'算子调试', course:'Ascend C算子开发（高级）', category:'operator', desc:'模块一：定位 Ascend C 算子开发、编译和运行过程中的问题。', topics:['调试流程','问题定位','结果验证'], duration:'模块一', difficulty:3 },
    { title:'矩阵编程（高阶API）', course:'Ascend C算子开发（高级）', category:'operator', desc:'模块二：使用矩阵编程相关高阶 API 组织计算。', topics:['矩阵计算','高阶 API','计算组织'], duration:'模块二', difficulty:3 },
    { title:'融合算子', course:'Ascend C算子开发（高级）', category:'operator', desc:'模块三：理解融合算子的设计目标与实现方式。', topics:['算子融合','访存减少','计算协同'], duration:'模块三', difficulty:3 },
    { title:'性能优化（理论）', course:'Ascend C算子开发（高级）', category:'operator', desc:'模块四：建立算子性能优化的理论框架与分析方法。', topics:['性能瓶颈','数据搬运','并行优化'], duration:'模块四', difficulty:3 },
    { title:'Ascend C语言定位与核心特性', course:'Ascend C Skills 全景概览', category:'operator', desc:'第 1 节：认识 Ascend C 的语言定位、能力边界与核心特性。', topics:['语言定位','核心特性','适用场景'], duration:'第 1 节', difficulty:1 },
    { title:'Ascend C Skills工具链全景', course:'Ascend C Skills 全景概览', category:'operator', desc:'第 2 节：了解围绕算子开发的 Skills 工具链和协作方式。', topics:['Skills 工具链','开发流程','能力分工'], duration:'第 2 节', difficulty:2 },
    { title:'课程体系与学习路径', course:'Ascend C Skills 全景概览', category:'beginner', desc:'第 3 节：理解 Ascend C Skills 的课程体系与推荐学习顺序。', topics:['课程体系','学习路径','能力进阶'], duration:'第 3 节', difficulty:1 },
    { title:'异构架构与Ascend C定位', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'beginner', desc:'Ch1：明确 Ascend C 在什么硬件上、以什么语言进行开发。', topics:['异构硬件架构','Ascend C 定位','高性能开发前提'], duration:'Ch1', difficulty:1 },
    { title:'Ascend C编程基础', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'operator', desc:'Ch2：掌握 Host / Device 分工、SPMD 模型与矢量编程范式。', topics:['Host / Device 分工','SPMD 模型','矢量编程范式'], duration:'Ch2', difficulty:1 },
    { title:'算子开发流程与环境搭建', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'operator', desc:'Ch3：搭建环境并创建工程，理解 env-config 和 project-init。', topics:['全流程地图','env-config','project-init'], duration:'Ch3', difficulty:1 },
    { title:'算子设计与代码实现', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'operator', desc:'Ch4：学习 Tiling 策略和 API 映射，完成设计、编码与编译。', topics:['Tiling 策略','API 映射','design / code-gen / compile-debug'], duration:'Ch4', difficulty:2 },
    { title:'文档输出与课程总结', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'operator', desc:'Ch5：生成 API 文档，回顾算子开发关键知识。', topics:['API 文档','doc-gen','知识回顾'], duration:'Ch5', difficulty:2 },
    { title:'随堂实操练习', course:'Ascend C skills系列课程第二弹 - 算子开发入门', category:'operator', desc:'Ch6：以 Add 算子串联 6 个 Skills，完成从零到跑通的实践。', topics:['Add 算子','6 个 Skills 全流程','端到端实践'], duration:'Ch6', difficulty:2 },
    { title:'AI 与大模型基础', course:'第一次让大模型在昇腾 NPU 上运行', category:'developer', desc:'第 1 节：建立训练、推理、模型与数据的整体认识，了解 Qwen3-0.6B。', topics:['训练与推理','LLM 参数规模','Qwen3-0.6B'], duration:'第 1 节', difficulty:1 },
    { title:'大模型推理核心组件', course:'第一次让大模型在昇腾 NPU 上运行', category:'developer', desc:'第 2 节：理解 Tokenizer、模型、后处理与 NPU 如何协同完成生成。', topics:['Tokenizer','逐 token 生成','EOS 结束标记'], duration:'第 2 节', difficulty:1 },
    { title:'PyTorch 与张量基础', course:'第一次让大模型在昇腾 NPU 上运行', category:'developer', desc:'第 3 节：认识 PyTorch 工具箱和作为 AI 基本数据单位的 Tensor。', topics:['PyTorch','Tensor','张量运算'], duration:'第 3 节', difficulty:1 },
    { title:'昇腾 NPU 与 torch_npu', course:'第一次让大模型在昇腾 NPU 上运行', category:'developer', desc:'第 4 节：通过 torch_npu 适配层，让 PyTorch 模型运行在昇腾 NPU 上。', topics:['torch_npu','.to(\'npu:0\')','CANN'], duration:'第 4 节', difficulty:1 },
    { title:'检查昇腾 NPU 环境', course:'在昇腾 NPU 上准备 Qwen3', category:'developer', desc:'第 5 节：检查 PyTorch、torch_npu 版本及 NPU 设备是否可用。', topics:['版本检查','NPU 可用性','设备数量'], duration:'第 5 节', difficulty:1 },
    { title:'下载 Qwen3-0.6B 模型', course:'在昇腾 NPU 上准备 Qwen3', category:'developer', desc:'第 6 节：使用 ModelScope 将 Qwen3-0.6B 下载并缓存到本地工作目录。', topics:['ModelScope','模型缓存','Qwen3-0.6B'], duration:'第 6 节', difficulty:1 },
    { title:'加载分词器与 Qwen3 模型', course:'在昇腾 NPU 上准备 Qwen3', category:'developer', desc:'第 7 节：加载 Tokenizer 和模型，将模型以 FP16 Eager 模式放到 npu:0。', topics:['AutoTokenizer','AutoModelForCausalLM','FP16 / eval'], duration:'第 7 节', difficulty:2 },
    { title:'体验 Tokenizer 编码与解码', course:'理解 Qwen3 基线推理', category:'developer', desc:'第 8 节：把文本转换为 token IDs，再还原为文本，观察模型的输入形式。', topics:['encode','decode','token IDs'], duration:'第 8 节', difficulty:1 },
    { title:'手写逐 Token 推理循环', course:'理解 Qwen3 基线推理', category:'developer', desc:'第 9 节：用贪心解码、EOS 检查与序列拼接，让 Qwen3 在 NPU 上回答问题。', topics:['前向传播','argmax','EOS / 拼接'], duration:'第 9 节', difficulty:2 },
    { title:'测量 Qwen3 推理基线速度', course:'理解 Qwen3 基线推理', category:'developer', desc:'第 10 节：热身后连续测量三次推理，得到 tokens/s 作为后续加速的 Baseline。', topics:['warmup','torch.npu.synchronize','tokens/s'], duration:'第 10 节', difficulty:2 },
    { title:'首跑后：建立本地推理实验工程', course:'巩固与扩展', category:'developer', desc:'第 11 节：从已跑通的基线进入固定工程，明确文件、首个改动和验证方式。', topics:['cann-learning-hub','实验副本','验证清单'], duration:'第 11 节', difficulty:1 },
    { title:'替换 Qwen3 RMSNorm 融合算子', course:'巩固与扩展', category:'operator', desc:'第 12 节：将 RMSNorm 的小算子拼接替换为 torch_npu.npu_rms_norm。', topics:['Qwen3RMSNorm','npu_rms_norm','融合算子'], duration:'第 12 节', difficulty:2 },
    { title:'验证融合算子加速效果', course:'巩固与扩展', category:'developer', desc:'第 13 节：分别测量小算子版与融合版，记录 tokens/s 和加速比。', topics:['warmup','三次计时','tokens/s'], duration:'第 13 节', difficulty:2 },
    { title:'扩展 RoPE 与图模式推理', course:'巩固与扩展', category:'operator', desc:'第 14 节：继续尝试 npu_rotary_mul，并让融合算子与图模式优化叠加。', topics:['npu_rotary_mul','RoPE','图模式'], duration:'第 14 节', difficulty:3 },
    { title:'用多种提示词测试模型', course:'巩固与扩展', category:'developer', desc:'第 15 节：以诗歌、英文问答和代码生成等提示词体验 Qwen3 的生成能力。', topics:['Prompt','文本生成','模型能力边界'], duration:'第 15 节', difficulty:1 },
    { title:'自由对话与推理练习', course:'巩固与扩展', category:'developer', desc:'第 16 节：修改问题与最大生成 token 数，完成自己的 Qwen3 NPU 推理实验。', topics:['my_question','max_new_tokens','采样扩展'], duration:'第 16 节', difficulty:1 },
    { title:'提交实验成果并完成认证', course:'巩固与扩展', category:'developer', desc:'第 17 节：整理可复现成果、性能对比和排障记录，再进入对应的昇腾学习认证。', topics:['实验报告','成果归档','学习认证'], duration:'第 17 节', difficulty:2 },
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
    if (document.getElementById('ld-roadmap')?.style.display !== 'none') {
      openLearningAi();
      return;
    }
    const sidebar = document.getElementById('ai-sidebar');
    if (sidebar.classList.contains('open')) _closeSidebar();
    else _openSidebar();
  }

  function openLearningAi() {
    const roadmap = document.getElementById('ld-roadmap');
    if (roadmap?.style.display !== 'none') {
      _closeSidebar();
      const workspace = document.getElementById('ld-path-workspace');
      const aiTab = [...document.querySelectorAll('.ld-tool-tabs button')].find(button => button.textContent.trim() === 'AI 助手');
      const aiIsActive = aiTab?.classList.contains('active');
      if (workspace?.classList.contains('ld-tools-collapsed')) {
        workspace.classList.remove('ld-tools-collapsed');
      } else if (aiIsActive) {
        workspace?.classList.add('ld-tools-collapsed');
        return;
      }
      if (aiTab) ldSwitchTool('ai', aiTab);
      setTimeout(() => document.getElementById('ld-tool-ai-input')?.focus(), 0);
      return;
    }
    toggleAiChat();
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

  function _aiPathStart(query, planContext) {
    _aiPathMode  = true;
    _aiPathState = 'idle';
    _aiPathQuery = query;
    _aiPathName  = query.length > 22 ? query.slice(0, 22) + '…' : query;
    // Open sidebar
    if (!document.getElementById('ai-sidebar').classList.contains('open')) _openSidebar();
    document.getElementById('ai-title-text').textContent = 'AI 路径规划';
    document.getElementById('ai-messages').innerHTML = '';
    document.getElementById('ai-chips').innerHTML = '';
    // The dashboard has already collected structured preferences, so do not ask them twice.
    if (planContext) {
      _aiPathState = 'generating';
      setTimeout(() => _aiTyping(() => {
        _aiAddBot('已读取你的场景与学习偏好，正在为你规划路径…');
        _aiPathGenerate(query, planContext);
      }), 300);
    } else {
      setTimeout(() => _aiPathHandleFirst(query), 300);
    }
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
    _aiPathState = 'ready';
    _aiTyping(() => {
      _aiAddBot(`已为你规划 <strong>${_ipNodes.length}</strong> 个节点，正在进入学习路径。`);
      ldShowGeneratedPath();
    }, 500);
  }

  function ldShowGeneratedPath() {
    const nodes = _ipNodes.map((node, index) => ({ ...node, step: index + 1 }));
    const dash = document.getElementById('ld-dash');
    const roadmap = document.getElementById('ld-roadmap');
    if (dash) dash.style.display = 'none';
    if (roadmap) roadmap.style.display = '';
    document.getElementById('ld-roadmap-name').textContent = _ipName || '我的学习路径';
    document.getElementById('ld-roadmap-prog-fill').style.width = '0%';
    document.getElementById('ld-roadmap-prog-lbl').textContent = `0 / ${nodes.length} 节点`;
    window._currentLearnPath = nodes;
    ldRenderPathWorkspace(nodes);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function ldOpenPathEditor() {
    if (!_ipNodes.length && window._currentLearnPath?.length) _ipNodes = window._currentLearnPath.map(node => ({ ...node, known: false, collapsed: false }));
    if (!_ipNodes.length) return;
    _aiPathState = 'editing';
    document.getElementById('ld-roadmap').style.display = 'none';
    document.getElementById('ld-dash').style.display = '';
    _ipeShowAndHideRoadmap();
  }

  // Reuse the original cursor-driven editor so AI changes remain visible and reversible.
  function ldOpenAiPathEditor() {
    if (!_ipNodes.length && window._currentLearnPath?.length) _ipNodes = window._currentLearnPath.map(node => ({ ...node, known: false, collapsed: false }));
    if (!_ipNodes.length) return;
    _aiPathMode = true;
    _aiPathState = 'editing';
    _ipName = document.getElementById('ld-roadmap-name')?.textContent || _ipName || '当前学习路径';
    ldOpenPathEditor();
    if (!document.getElementById('ai-sidebar')?.classList.contains('open')) _openSidebar();
    document.getElementById('ai-title-text').textContent = 'AI 路径调整';
    document.getElementById('ai-messages').innerHTML = '';
    document.getElementById('ai-chips').innerHTML = '';
    _aiAddBot('我可以直接调整当前路径。告诉我希望<strong>增加、删除、移动或替换</strong>哪些节点；修改过程会同步显示在左侧。');
    document.getElementById('ai-sidebar-input')?.focus();
  }

  // Preserve a request written in the contextual AI panel, then hand it to the
  // cursor-driven path editor instead of asking the learner to repeat it.
  function ldStartAiPathEdit() {
    const request = document.getElementById('ld-tool-ai-input')?.value.trim();
    ldOpenAiPathEditor();
    if (!request) return;
    const editorInput = document.getElementById('ai-sidebar-input');
    if (!editorInput) return;
    editorInput.value = request;
    sendAiMessage();
  }

  function ldIsPathEditRequest(text) {
    return /(?:添加|增加|删除|移除|移动|调整|替换|重排|修改).{0,16}(?:路径|学习路径|节点|步骤)|(?:路径|学习路径|节点|步骤).{0,16}(?:添加|增加|删除|移除|移动|调整|替换|重排|修改)/.test(text);
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

  Object.assign(NODE_KNOWLEDGE, {
    'Ascend C基本概念': { summary:'这是官方 Ascend C 编程路径的预备知识。先理解 Ascend C 以标准 C/C++ 为基础扩展、用于开发高性能算子的定位，再进入课程学习。', concepts:[{term:'Ascend C',desc:'面向昇腾 AI Core 的算子开发语言，以标准 C/C++ 为基础扩展。'},{term:'算子开发',desc:'将计算逻辑、数据搬运和并行执行组织为可在昇腾 AI 处理器上高效运行的算子。'}], resources:[{icon:'📖',title:'Ascend C基本概念',href:'https://hiascend.com/document/redirect/CannCommunityAscendCbase',type:'官方预备知识',subtitle:'官方路径指定的预备知识'}] },
    '昇腾异构编程基础课程（速成班）': { summary:'官方 Ascend C 编程路径第 1 门课程。建立昇腾 AI 处理器、CANN 异构计算架构、算子开发与性能分析的基础认识。', concepts:[{term:'异构编程',desc:'让 CPU 与 AI 处理器各自承担擅长的任务，并通过 CANN 完成调度和协同。'},{term:'CANN',desc:'昇腾 AI 异构计算架构，提供算子开发、运行时和性能分析能力。'}], resources:[{icon:'🎓',title:'Ascend C编程官方学习路径',href:'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',type:'官方课程',subtitle:'课程 1：昇腾异构编程基础课程（速成班）'}] },
    'Ascend C算子开发（入门）': { summary:'官方 Ascend C 编程路径第 2 门课程。从 Ascend C 编程模型出发，完成首个算子开发与调用。', concepts:[{term:'编程模型',desc:'以数据搬运、向量/矩阵计算和流水协同组织算子执行。'},{term:'算子调用',desc:'将已开发的算子接入工程，并完成编译、运行与结果验证。'}], resources:[{icon:'🎓',title:'Ascend C编程官方学习路径',href:'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',type:'官方课程',subtitle:'课程 2：Ascend C算子开发（入门）'}] },
    'Ascend C算子开发（进阶）': { summary:'官方 Ascend C 编程路径第 3 门课程。围绕数据搬运、并行计算、算子调用和调测深化开发能力。', concepts:[{term:'数据搬运',desc:'在不同存储层级间组织数据传输，为计算单元准备数据。'},{term:'算子调测',desc:'通过编译、运行、精度校验等步骤定位算子开发问题。'}], resources:[{icon:'🎓',title:'Ascend C编程官方学习路径',href:'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',type:'官方课程',subtitle:'课程 3：Ascend C算子开发（进阶）'}] },
    'Ascend C算子开发（高级）': { summary:'官方 Ascend C 编程路径第 4 门课程。聚焦算子性能分析与优化，面向高性能算子开发实践。', concepts:[{term:'性能分析',desc:'识别算子在计算、数据搬运和并行协同中的瓶颈。'},{term:'性能优化',desc:'针对瓶颈调整数据切分、流水与计算组织，提高算子执行效率。'}], resources:[{icon:'🎓',title:'Ascend C编程官方学习路径',href:'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',type:'官方课程',subtitle:'课程 4：Ascend C算子开发（高级）'}] },
    'Ascend C skills系列课程': { summary:'官方 Ascend C 编程路径第 5 门课程。以技能专题和案例练习巩固算子开发、调用、性能分析与优化的完整流程。', concepts:[{term:'Skills 专题',desc:'围绕具体开发技能设计的系列化练习，强调在场景中应用。'},{term:'全流程实践',desc:'从开发、调用到性能分析与优化的闭环能力。'}], resources:[{icon:'🎓',title:'Ascend C编程官方学习路径',href:'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',type:'官方课程',subtitle:'课程 5：Ascend C skills系列课程'}] },
    '昇腾异构编程基础微认证': { summary:'官方 Ascend C 编程路径的微认证。用于检验昇腾 AI 处理器、CANN 异构计算架构、算子开发和性能分析等基础知识。', concepts:[{term:'认证范围',desc:'昇腾 AI 处理器硬件架构、CANN 异构计算架构、算子开发及性能分析。'}], resources:[{icon:'🏅',title:'昇腾异构编程基础微认证',href:'https://www.hiascend.com/edu/certification/detail/c9ce549104334952b06a472ef600dc53',type:'官方微认证',subtitle:'完成路径后进行能力验证'}] }
  });

  // Content follows the real CANN Learning Hub Qwen3 NPU inference baseline notebook.
  const QWEN3_BASELINE_NOTEBOOK = 'https://gitcode.com/cann/cann-learning-hub/blob/master/quick_start/first_llm_inference/01_qwen3_npu_inference_baseline.ipynb';
  const QWEN3_FUSED_OP_NOTEBOOK = 'https://gitcode.com/cann/cann-learning-hub/blob/master/quick_start/first_llm_inference/03_qwen3_npu_inference_fused_op.ipynb';
  const QWEN3_LEARNING_HUB = 'https://gitcode.com/cann/cann-learning-hub';
  const QWEN3_CERTIFICATION = 'https://www.hiascend.com/edu/certification';
  const qwen3Resources = subtitle => [
    { icon:'📓', title:'Qwen3 昇腾 NPU 推理基线 Notebook', href:QWEN3_BASELINE_NOTEBOOK, type:'GitCode Notebook', subtitle },
    { icon:'🤗', title:'Qwen3-0.6B 模型页', href:'https://www.modelscope.cn/models/Qwen/Qwen3-0.6B', type:'ModelScope', subtitle:'本路径使用的开源模型' }
  ];
  const qwen3ExtensionResources = subtitle => [
    { icon:'📓', title:'Qwen3 融合算子替换 Notebook', href:QWEN3_FUSED_OP_NOTEBOOK, type:'GitCode Notebook', subtitle },
    { icon:'⌘', title:'CANN Learning Hub 工程', href:QWEN3_LEARNING_HUB, type:'代码仓库', subtitle:'创建个人实验副本的起点' },
    { icon:'🏅', title:'昇腾学习认证', href:QWEN3_CERTIFICATION, type:'认证中心', subtitle:'按当前开放认证选择匹配方向' }
  ];
  Object.assign(NODE_KNOWLEDGE, {
    'AI 与大模型基础': {
      summary:'本路径以 Qwen3-0.6B 为例，先建立“训练”和“推理”的整体概念：训练让模型从大量数据中学习；推理则是把已经学到的能力用于回答一个新问题。',
      concepts:[{term:'训练',desc:'使用大量数据调整模型参数，让模型学会语言和任务规律。'},{term:'推理',desc:'固定已训练好的参数，根据输入生成回答；这是本 Notebook 要跑通的环节。'},{term:'Qwen3-0.6B',desc:'通义千问第 3 代的 6 亿参数模型，体量适合第一次在本地 NPU 上学习推理流程。'}],
      resources:qwen3Resources('第 1 课：AI、LLM 与 Qwen3-0.6B 的入门说明')
    },
    '大模型推理核心组件': {
      summary:'一次文本生成由分词器、模型、后处理和 NPU 共同完成。模型只输出“下一个 token 的概率”，选哪个 token、何时结束以及如何接回序列都由后处理完成。',
      concepts:[{term:'Tokenizer',desc:'把文字编码成 token IDs，并将模型生成的 token IDs 解码回文字。'},{term:'模型前向传播',desc:'输入当前 token 序列，输出下一个位置所有候选 token 的概率分布。'},{term:'后处理',desc:'选择 token、检查 EOS 结束标记并拼接到已有序列；三步构成逐 token 推理循环。'},{term:'NPU',desc:'神经网络处理器，擅长大规模矩阵运算，用于加速模型前向计算。'}],
      resources:qwen3Resources('第 3 节：推理流程和四个核心组件')
    },
    'PyTorch 与张量基础': {
      summary:'PyTorch 提供张量计算、自动求导和神经网络模块。推理时，输入、模型参数和输出都以 Tensor 的形式参与计算。',
      concepts:[{term:'Tensor',desc:'多维数组；标量、向量和矩阵都是 Tensor 的特殊形式。'},{term:'张量运算',desc:'可在 CPU 或 NPU 上执行，例如逐元素乘法、加法和矩阵运算。'},{term:'PyTorch',desc:'Notebook 使用的深度学习框架，torch_npu 会为它注册昇腾 NPU 后端。'}],
      code:{lang:'python',body:`import torch\n\nx = torch.tensor([1.0, 2.0, 3.0])\ny = x * 2 + 1\nprint(y)  # tensor([3., 5., 7.])`},
      resources:qwen3Resources('第 4 节：PyTorch 与 Tensor 基础')
    },
    '昇腾 NPU 与 torch_npu': {
      summary:'torch_npu 是 PyTorch 的昇腾适配插件。导入后，可将 Tensor 或模型通过 .to(\'npu:0\') 放到第 0 张 NPU 上执行；CANN 提供其底层运行能力。',
      concepts:[{term:'torch_npu',desc:'导入后自动注册 PyTorch 的 NPU 后端，是原生 PyTorch 代码跑在昇腾上的适配层。'},{term:'npu:0',desc:'第 0 个昇腾 NPU 设备标识；模型和输入应位于同一设备。'},{term:'CANN',desc:'昇腾异构计算架构，为 NPU 上的算子和运行时提供基础能力。'}],
      code:{lang:'python',body:`import torch\nimport torch_npu\n\nprint(torch.npu.is_available())\nx = torch.tensor([1.0, 2.0]).to('npu:0')\nprint(x.device)`},
      resources:qwen3Resources('第 5 节：通过 torch_npu 使用昇腾 NPU')
    },
    '检查昇腾 NPU 环境': {
      summary:'在下载模型前，先检查 PyTorch、torch_npu 和 NPU 是否正常。只有 torch.npu.is_available() 返回 True，才应继续执行后续模型加载和推理。',
      concepts:[{term:'版本兼容',desc:'PyTorch 与 torch_npu 的版本需要匹配，先打印版本信息方便排查环境问题。'},{term:'设备可用性',desc:'torch.npu.is_available() 为 True 表示当前运行环境可识别并使用 NPU。'},{term:'设备名称',desc:'通过 get_device_name(0) 确认当前推理实际使用的昇腾设备。'}],
      code:{lang:'python',body:`import torch\nimport torch_npu\n\nprint(f"PyTorch 版本: {torch.__version__}")\nprint(f"torch_npu 版本: {torch_npu.__version__}")\nprint(f"NPU 是否可用: {torch.npu.is_available()}")\nprint(f"NPU 设备数量: {torch.npu.device_count()}")\nprint(f"NPU 设备名称: {torch.npu.get_device_name(0)}")`},
      lab:{steps:[{title:'运行 NPU 环境检查',desc:'在 HiDevLab 中执行原 Notebook 的检查代码，确认 NPU 是否可用。',code:'import torch\nimport torch_npu\nprint(torch.npu.is_available())',expected:'输出 True，且可查看到 NPU 设备名称'}]},
      resources:qwen3Resources('第 6 节：动手实践，环境检查')
    },
    '下载 Qwen3-0.6B 模型': {
      summary:'Notebook 通过 ModelScope 下载 Qwen/Qwen3-0.6B，并缓存在 /mnt/workspace/models。模型约 1.4GB，首次下载完成后可复用本地缓存。',
      concepts:[{term:'ModelScope',desc:'国内模型开源平台；Notebook 使用 snapshot_download 获取 Qwen3 模型文件。'},{term:'模型缓存',desc:'将模型保存到指定目录，之后从本地读取，避免重复下载。'},{term:'模型权重',desc:'模型参数文件决定模型能力，加载前必须完整下载。'}],
      code:{lang:'python',body:`from modelscope import snapshot_download\n\nmodel_dir = snapshot_download(\n    'Qwen/Qwen3-0.6B',\n    cache_dir='/mnt/workspace/models'\n)\nprint(f'模型已下载到: {model_dir}')`},
      lab:{steps:[{title:'下载 Qwen3-0.6B',desc:'执行下载并记录模型缓存目录；下载完成后下次无需重新下载。'}]},
      resources:qwen3Resources('第 7 节：从魔搭社区下载 Qwen3-0.6B')
    },
    '加载分词器与 Qwen3 模型': {
      summary:'使用 AutoTokenizer 和 AutoModelForCausalLM 加载本地模型。Notebook 选择 eager 注意力实现以便理解基础执行流程，再将模型迁移到 npu:0、转换为 FP16 并切换至 eval 模式。',
      concepts:[{term:'AutoTokenizer',desc:'从模型目录读取分词器配置，用于构造模型输入和解析输出。'},{term:'Eager 模式',desc:'每个算子立即执行，适合观察基础推理流程；后续可学习图编译加速。'},{term:'FP16',desc:'半精度参数仅占用 float32 一半存储，通常可节省显存并提升推理速度。'},{term:'eval()',desc:'关闭 Dropout 等训练期行为，确保模型进入稳定的推理模式。'}],
      code:{lang:'python',body:`from transformers import AutoTokenizer, AutoModelForCausalLM\n\nmodel_path = '/mnt/workspace/models/Qwen/Qwen3-0.6B'\ntokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_path, trust_remote_code=True, attn_implementation='eager'\n).to('npu:0').half()\nmodel.eval()`},
      lab:{steps:[{title:'加载分词器与模型到 NPU',desc:'运行原 Notebook 的加载代码，确认 model.device 为 npu:0，model.dtype 为 float16。'}]},
      resources:qwen3Resources('第 8 节：加载分词器和模型')
    },
    '体验 Tokenizer 编码与解码': {
      summary:'模型不直接读取“你好，我是昇腾”这样的文字，而是读取 token IDs。通过一次 encode 与 decode 往返，可以看到文字和数字序列之间的转换。',
      concepts:[{term:'编码',desc:'tokenizer.encode 将文本切分并转换为整数 token IDs。'},{term:'解码',desc:'tokenizer.decode 将 token IDs 还原为人类可读文本。'},{term:'token IDs',desc:'模型在 NPU 上实际计算的离散数字序列。'}],
      code:{lang:'python',body:`test_text = '你好，我是昇腾'\n\ntokens = tokenizer.encode(test_text)\ndecoded = tokenizer.decode(tokens)\nprint(f'原文: {test_text}')\nprint(f'编码为 token IDs: {tokens}')\nprint(f'解码回文字: {decoded}')`},
      resources:qwen3Resources('第 9 节：体验分词器')
    },
    '手写逐 Token 推理循环': {
      summary:'这是本 Notebook 的核心实践：将聊天模板编码为 NPU Tensor，循环执行模型前向传播，贪心选择下一个 token；遇到 EOS 结束标记即停止，否则拼接 token 后继续。',
      concepts:[{term:'聊天模板',desc:'apply_chat_template 将 user 消息组织为 Qwen3 能理解的提示词格式。'},{term:'贪心解码',desc:'torch.argmax 选择当前概率最大的 token，结果稳定且便于理解。'},{term:'EOS',desc:'结束标记；生成到 EOS 时停止循环，避免无意义地生成到 token 上限。'},{term:'拼接',desc:'将新 token 接到 generated_ids 尾部，作为下一轮前向传播的输入。'}],
      code:{lang:'python',body:`question = '你好，请介绍一下AI是什么'\nmessages = [{'role': 'user', 'content': question}]\ntext = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=False)\ninput_ids = torch.tensor([tokenizer.encode(text)], dtype=torch.long).to('npu:0')\ngenerated_ids = input_ids.clone()\n\nfor step in range(128):\n    with torch.no_grad():\n        logits = model(generated_ids).logits\n    next_token_id = torch.argmax(logits[:, -1, :], dim=-1, keepdim=True)\n    if next_token_id.item() == tokenizer.eos_token_id:\n        break\n    generated_ids = torch.cat([generated_ids, next_token_id], dim=1)\n\nresponse = tokenizer.decode(generated_ids[0][input_ids.shape[1]:], skip_special_tokens=True)\nprint(response)`},
      lab:{steps:[{title:'让 Qwen3 在 NPU 上回答第一个问题',desc:'运行逐 token 推理循环，观察输入 token 数、EOS 和最终模型回答。'}]},
      resources:qwen3Resources('第 10 节：第一次推理')
    },
    '测量 Qwen3 推理基线速度': {
      summary:'第一次推理会包含初始化开销，不能直接作为性能结论。Notebook 先热身，再用 torch.npu.synchronize() 等待 NPU 任务完成，连续测量三次并以 tokens/s 作为基线。',
      concepts:[{term:'Warmup',desc:'提前跑一次推理，让首次加载和初始化开销不干扰正式测量。'},{term:'synchronize()',desc:'等待 NPU 异步任务完成，确保计时覆盖真实的设备执行时间。'},{term:'Baseline',desc:'未加速的推理速度；后续使用 npugraph_ex 等技术时可与它对比。'}],
      code:{lang:'python',body:`import time\n\n# 先执行一次与正式推理相同的循环作为热身\n# ...\ntorch.npu.synchronize()\n\ntimes = []\nfor i in range(3):\n    generated_ids = input_ids.clone()\n    t0 = time.time()\n    # 执行逐 token 推理循环\n    # ...\n    torch.npu.synchronize()\n    times.append(time.time() - t0)\n\navg_time = sum(times) / len(times)\nprint(f'平均推理时间: {avg_time:.3f}s')\nprint(f'生成速度: {num_generated / avg_time:.1f} tokens/s')`},
      resources:qwen3Resources('第 11 节：测量推理速度')
    },
    '用多种提示词测试模型': {
      summary:'同一套推理循环可以服务不同任务。Notebook 以古诗、英文问答和快速排序代码为例，观察 Qwen3 在不同提示词下的文本生成表现。',
      concepts:[{term:'Prompt',desc:'输入给模型的指令或问题；不同表达会影响模型输出。'},{term:'生成任务',desc:'诗歌、问答和代码生成本质上都是根据上下文预测后续 token。'},{term:'能力观察',desc:'测试结果用于体验模型能力，不应替代对事实正确性和代码可运行性的验证。'}],
      code:{lang:'python',body:`test_prompts = [\n    '请写一首关于春天的五言绝句',\n    'What is the capital of France?',\n    '用Python写一个快速排序算法',\n]\n\nfor prompt in test_prompts:\n    # 套用上一节的聊天模板与逐 token 推理循环\n    print(f'Q: {prompt}')\n    print(f'A: {response}')`},
      resources:qwen3Resources('第 12 节：更多有趣的问题')
    },
    '自由对话与推理练习': {
      summary:'最后将问题抽为 my_question、将生成长度抽为 max_new_tokens。先修改这两个变量，再复用已经跑通的推理循环；进一步可把贪心解码替换为随机采样，比较输出差异。',
      concepts:[{term:'my_question',desc:'可自由替换的问题变量，例如知识问答、代码生成、创作或英文提问。'},{term:'max_new_tokens',desc:'限制最多生成多少个新 token；值越大，输出可能更长，耗时也会增加。'},{term:'随机采样',desc:'可用 torch.multinomial 替代 argmax，让输出具有随机性；需额外控制温度等参数。'}],
      code:{lang:'python',body:`my_question = '你好，请用一句话介绍你自己'\nmax_new_tokens = 128\n\nmessages = [{'role': 'user', 'content': my_question}]\ntext = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=False)\ninput_ids = torch.tensor([tokenizer.encode(text)], dtype=torch.long).to('npu:0')\n# 复用上一节的逐 token 推理循环\n# 修改 my_question 后重新运行即可`},
      lab:{steps:[{title:'设计自己的 Qwen3 提问',desc:'修改 my_question，并尝试调整 max_new_tokens，记录回答长度和效果的变化。'}]},
      resources:qwen3Resources('课后练习：和大模型自由对话')
    },
    '首跑后：建立本地推理实验工程': {
      summary:'首跑成功后的下一步已经为你固定好：进入 cann-learning-hub 工程，复制融合算子 Notebook，只替换 RMSNorm，再以同一输入测三次 tokens/s。不要从零新建项目，也不要一次改多个模块。',
      nextSteps:[
        { icon:'folder-git-2', label:'在哪个工程做', title:'cann-learning-hub', detail:'克隆官方工程后，进入 quick_start/first_llm_inference；不要另起一个空工程。', code:'git clone https://gitcode.com/cann/cann-learning-hub.git\ncd cann-learning-hub/quick_start/first_llm_inference' },
        { icon:'copy-plus', label:'从哪个文件开始', title:'03_qwen3_npu_inference_fused_op.ipynb', detail:'保留 01 基线 Notebook 不改动，把第 03 课复制为自己的实验副本。', code:'cp 03_qwen3_npu_inference_fused_op.ipynb my_qwen3_fused_op.ipynb' },
        { icon:'pencil-line', label:'第一处改什么', title:'只替换 Qwen3RMSNorm.forward', detail:'将小算子实现切换为 torch_npu.npu_rms_norm；模型、提示词和生成长度先保持不变。', code:'qwen3_mod.Qwen3RMSNorm.forward = fused_forward' },
        { icon:'badge-check', label:'怎样算验证完成', title:'热身 1 次，正式测 3 次', detail:'小算子版与融合版各记录平均耗时、tokens/s、加速比；结果异常就切回 orig_forward。', code:'avg_small = benchmark("small ops", small_ops_forward)\navg_fused = benchmark("fused op", fused_forward)' }
      ],
      body:'<p><strong>首跑结束后，按下面四步继续即可。</strong>你不需要猜“该在哪个工程改、先改什么、怎么判断成功”。本节把下一步收成一条固定路径：工程 → 文件 → 单点改动 → 验证标准。</p><p>每次只改变一个模块，并在实验文件开头记录 CANN / PyTorch / torch_npu 版本、基线 tokens/s 和本轮改动目标。这样结果异常时，可立即切回基线，判断问题来自环境、模型加载还是这次替换。</p>',
      concepts:[{term:'基线副本',desc:'保留 01 基线推理 Notebook 不改动；所有优化都在复制出的实验文件中进行。'},{term:'实验目录',desc:'将模型路径、Notebook、运行日志和性能记录放在同一工程，避免只在临时单元里改完就丢失。'},{term:'单变量改动',desc:'每次只替换一个模块，例如先 RMSNorm，再 RoPE；这样性能变化和精度问题才可定位。'}],
      code:{lang:'bash',body:`git clone https://gitcode.com/cann/cann-learning-hub.git\ncd cann-learning-hub/quick_start/first_llm_inference\n\n# 保留基线，复制融合算子课作为个人实验副本\ncp 03_qwen3_npu_inference_fused_op.ipynb my_qwen3_fused_op.ipynb\n\n# 在 Notebook 首个 Markdown 单元记录：\n# CANN / PyTorch / torch_npu 版本、基线 tokens/s、改动目标`},
      lab:{steps:[{title:'创建个人 Qwen3 实验副本',desc:'在 HiDevLab 或本地工作区复制融合算子 Notebook；不要直接覆盖已跑通的基线。',code:'cp 03_qwen3_npu_inference_fused_op.ipynb my_qwen3_fused_op.ipynb',expected:'得到独立实验文件，并保留 01 基线 Notebook 可随时回退。'}]},
      resources:qwen3ExtensionResources('第 13 节：从首跑 Notebook 进入可复现的本地实验')
    },
    '替换 Qwen3 RMSNorm 融合算子': {
      summary:'Qwen3 的 RMSNorm 在原始实现中由精度转换、平方、均值、加 epsilon、rsqrt、归一化和乘权重等 8 个小算子串联而成。使用 torch_npu.npu_rms_norm 后，可将该单元替换为一个融合算子，减少启动和中间内存读写。',
      body:'<p><strong>这一步只改 RMSNorm，不动模型其余部分。</strong>先通过 <code>transformers.models.qwen3.modeling_qwen3</code> 获取模块，保存原始 <code>forward</code>。随后定义小算子版与融合版，使用一行赋值切换，以便在同一环境和同一输入下公平比较。</p><p><code>npu_rms_norm</code> 的三个参数对应原公式：输入 <code>hidden_states</code>、权重 <code>self.weight</code>、属性 <code>self.variance_epsilon</code>。接口返回两个 Tensor；推理只取第一个归一化结果。</p>',
      concepts:[{term:'RMSNorm',desc:'Qwen3 中高频出现的归一化单元；0.6B 模型 28 层中共出现 57 次。'},{term:'融合算子',desc:'把多个连续小算子交给一个针对硬件优化的算子一次完成，减少调度和中间读写。'},{term:'npu_rms_norm',desc:'torch_npu 提供的 RMSNorm 融合接口，推理时返回值取 [0]。'}],
      code:{lang:'python',body:`import torch_npu\nimport transformers.models.qwen3.modeling_qwen3 as qwen3_mod\n\n# 保存原实现，便于回退\norig_forward = qwen3_mod.Qwen3RMSNorm.forward\n\ndef fused_forward(self, hidden_states):\n    return torch_npu.npu_rms_norm(\n        hidden_states,\n        self.weight,\n        self.variance_epsilon\n    )[0]\n\n# 只替换 RMSNorm；模型其余模块保持不变\nqwen3_mod.Qwen3RMSNorm.forward = fused_forward`},
      lab:{steps:[{title:'保存原实现并切换至融合 RMSNorm',desc:'先保存 orig_forward，再把 Qwen3RMSNorm.forward 指向 fused_forward。若结果异常，立即切回 orig_forward。',code:'orig_forward = qwen3_mod.Qwen3RMSNorm.forward\nqwen3_mod.Qwen3RMSNorm.forward = fused_forward',expected:'模型可继续加载并完成一次 Eager 推理；需要回退时可恢复 orig_forward。'}]},
      resources:qwen3ExtensionResources('第 14 节：融合算子替换，8 个小算子到 1 个 RMSNorm 算子')
    },
    '验证融合算子加速效果': {
      summary:'是否“优化成功”不能只看模型还能输出。必须在相同输入、相同 max_new_tokens、相同 Eager 模式下，让小算子版和融合版各热身一次、正式计时三次，再比较平均 tokens/s 与加速比。',
      body:'<p><strong>先保证比较公平。</strong>基线版与融合版共用同一个模型、提示词和 <code>max_new_tokens</code>；每次测量前先热身一次，并在计时结束后执行 <code>torch.npu.synchronize()</code>，否则 Python 可能在 NPU 尚未执行完时就停止计时。</p><p>记录生成 token 数、三次耗时、平均 tokens/s 和加速比。若融合版速度没有提升，先检查是否真的切换到了 <code>fused_forward</code>、是否仍为 Eager 模式，以及输入长度和生成长度是否一致。</p>',
      concepts:[{term:'Warmup',desc:'排除首次加载与初始化成本，避免一次偶然的慢结果影响结论。'},{term:'synchronize',desc:'等待 NPU 异步任务完成，确保耗时包含真实的设备执行。'},{term:'加速比',desc:'小算子版平均耗时除以融合版平均耗时；大于 1 说明融合版更快。'}],
      code:{lang:'python',body:`# 小算子版和融合版均各热身一次后，重复三次计时\ndef benchmark(label, forward_impl):\n    qwen3_mod.Qwen3RMSNorm.forward = forward_impl\n    run_inference(model, input_ids, max_new_tokens)  # warmup\n    times = []\n    for _ in range(3):\n        t0 = time.time()\n        output = run_inference(model, input_ids, max_new_tokens)\n        torch.npu.synchronize()\n        times.append(time.time() - t0)\n    avg = sum(times) / len(times)\n    tokens = output.shape[1] - input_ids.shape[1]\n    print(label, f'{tokens / avg:.1f} tokens/s')\n    return avg\n\navg_small = benchmark('small ops', small_ops_forward)\navg_fused = benchmark('fused op', fused_forward)\nprint(f'加速比: {avg_small / avg_fused:.2f}x')`},
      lab:{steps:[{title:'输出小算子版与融合版对比表',desc:'两个版本各热身一次、计时三次，记录平均耗时、tokens/s 与加速比。',code:'# 复用本节 benchmark 函数\navg_small = benchmark("small ops", small_ops_forward)\navg_fused = benchmark("fused op", fused_forward)',expected:'得到两组可比较的速度数据与加速比；不要只记录一次运行结果。'}]},
      resources:qwen3ExtensionResources('第 15 节：在 Eager 模式下验证纯算子层面的加速')
    },
    '扩展 RoPE 与图模式推理': {
      summary:'RMSNorm 只是一个开始。下一步可以把 Qwen3 的 RoPE 旋转位置编码替换为 npu_rotary_mul，并在 RMSNorm 融合基础上尝试图模式推理；融合算子优化和图编译优化处于不同层，可以叠加。',
      body:'<p><strong>按同样的实验方法继续扩展。</strong>先保留 RMSNorm 融合版作为新的基线，再独立替换 <code>apply_rotary_pos_emb</code> 为 <code>npu_rotary_mul</code>。确认输出正常并测量后，再开启图模式。每做完一层优化都保存一个可运行版本，避免无法区分是哪项改动带来了收益或回归。</p><p>图编译解决的是“CPU 逐个调度算子的等待”；融合算子解决的是“多个小算子重复启动和读写”。两者目标不同，因此可以组合，但也应分阶段验证。</p>',
      concepts:[{term:'RoPE',desc:'旋转位置编码；Qwen3 使用它让注意力计算感知 token 的相对位置。'},{term:'npu_rotary_mul',desc:'可用于替换 RoPE 中乘法、旋转和加法等组合计算的融合算子。'},{term:'图模式',desc:'将算子编排为执行图后一次交给 NPU，减少 CPU 与 NPU 间的逐算子调度。'}],
      code:{lang:'python',body:`# 推荐实验顺序（每一步都独立记录性能）\n# 1. RMSNorm 融合版：已得到新的基线\n# 2. 替换 apply_rotary_pos_emb 为 torch_npu.npu_rotary_mul\n# 3. 复用相同输入，验证输出与性能\n# 4. 在融合版基础上开启图模式，再单独测量\n\n# 不要在一次实验中同时替换多个模块，\n# 否则出现性能或结果异常时无法定位。`},
      lab:{steps:[{title:'规划下一轮单变量优化',desc:'先创建 RoPE 实验副本，保持 RMSNorm 融合版不变；记录本轮只验证 npu_rotary_mul。',code:'# my_qwen3_rope_op.ipynb\n# baseline: fused RMSNorm\n# change: apply_rotary_pos_emb -> npu_rotary_mul',expected:'形成可回退的优化序列：基线 → RMSNorm 融合 → RoPE 融合 → 图模式。'}]},
      resources:qwen3ExtensionResources('第 16 节：RoPE 融合与图模式是可叠加的下一步')
    },
    '提交实验成果并完成认证': {
      summary:'路径的终点不是“代码跑过一次”，而是能把实验讲清楚、复现出来：说明环境、基线、每项改动、性能数据和遇到的问题。完成后可进入昇腾学习认证，检验并沉淀推理与优化能力。',
      body:'<p><strong>提交前用一页实验记录收口。</strong>至少包含：环境版本、模型与提示词、基线 tokens/s、RMSNorm 融合后的 tokens/s、加速比、是否继续尝试 RoPE / 图模式，以及一次问题排查记录。它既是个人作品的可复现说明，也是之后继续优化的起点。</p><p>认证不应只是额外跳转链接，而应排在实践成果之后：先完成路径内验证，再按认证中心当前开放的方向选择匹配课程或考试。</p>',
      concepts:[{term:'可复现实验',desc:'他人根据工程、版本、输入与步骤能够重复得到同类结果。'},{term:'性能报告',desc:'用基线、优化后数据和明确的测量条件说明收益，而不是只描述“感觉更快”。'},{term:'学习认证',desc:'将系统学习与实操成果结合，选择认证中心当前开放的相关方向完成能力验证。'}],
      lab:{steps:[{title:'整理并提交 Qwen3 优化实验记录',desc:'将环境、改动、三次计时结果、加速比与一次排障记录写入实验 README 或 Notebook 首段。',code:'# 实验收口清单\n# [ ] 环境与模型版本\n# [ ] baseline / fused tokens/s\n# [ ] 三次耗时和加速比\n# [ ] 失败或排障记录\n# [ ] 下一轮优化计划',expected:'形成可回看、可分享的实验记录，并可进入昇腾学习认证继续验证能力。'}]},
      resources:qwen3ExtensionResources('第 17 节：实验成果收口与学习认证')
    }
  });

  // Notebook explanations are kept in the middle reading flow rather than reduced to titles and code.
  const QWEN3_NOTEBOOK_READING = {
    'AI 与大模型基础': [
      { term:'先分清训练与推理', desc:'可以把 AI 想成一名学生：阅读大量课本和试卷是训练，学会知识是模型形成能力，毕业后回答新问题就是推理。本路径关注的是后一步：让训练完成的模型在昇腾 NPU 上生成回答。' },
      { term:'为什么叫“大模型”', desc:'“大”来自参数量、训练数据和训练计算量。参数可以理解为模型内部大量可调整的数字；Qwen3-0.6B 有约 6 亿个参数，0.6B 即 0.6 Billion。' },
      { term:'为什么从 Qwen3-0.6B 开始', desc:'它是通义千问第 3 代中较轻量的模型：规模足以完成流畅对话，又适合第一次在本地 NPU 上完整跑通下载、加载和推理闭环。' }
    ],
    '大模型推理核心组件': [
      { term:'分词器是“翻译官”', desc:'计算机不直接认识“你好”这样的文字。Tokenizer 会把文本编码为一串 token ID，例如把一句话变成 [108046, 3837, ...]；模型生成后，再由它把 ID 解码回文字。' },
      { term:'模型只负责给出概率', desc:'模型输入已有 token 序列，输出下一个 token 的概率分布。例如“从前有座”之后，“山”可能最有可能，“庙”次之。模型并不替你做最终选择。' },
      { term:'后处理决定如何继续生成', desc:'每轮前向传播后，需要选出 token、检查它是否为 EOS 结束标记，并把它拼接回原序列。若没有 EOS，拼接后的长序列会再次输入模型，形成逐 token 的循环。' },
      { term:'NPU 是推理的计算工作台', desc:'数亿参数涉及大量矩阵运算，CPU 完成得较慢。昇腾 NPU 面向这类 AI 计算优化，承担模型前向传播中的主要计算。' }
    ],
    'PyTorch 与张量基础': [
      { term:'PyTorch 是 AI 开发工具箱', desc:'它提供张量计算、自动求导和常用神经网络模块。即使本课只做推理、不训练模型，仍会通过 PyTorch 构造输入、调用模型和处理输出。' },
      { term:'Tensor 是统一的数据形式', desc:'标量、向量、矩阵以及更高维数组都属于 Tensor。可以把它理解为 Excel 表格的扩展：不止行和列，还可表达任意维度，并能在 NPU 上高速计算。' },
      { term:'本课中 Tensor 的位置', desc:'分词器输出的 token IDs 会被包装为 long 类型 Tensor 并迁移到 npu:0；模型参数、logits 和生成序列也都以 Tensor 参与推理。' }
    ],
    '昇腾 NPU 与 torch_npu': [
      { term:'torch_npu 是适配层', desc:'开源大模型通常基于 PyTorch 编写。导入 torch_npu 后，它会注册昇腾 NPU 后端，让原有模型代码只需很少改动便可使用昇腾设备。' },
      { term:'三行最常见的设备操作', desc:'import torch_npu 导入适配层；.to(\'npu:0\') 把模型或 Tensor 放到第 0 张 NPU；torch.npu.is_available() 检查 NPU 是否可用。模型和输入必须在同一设备上。' },
      { term:'CANN 在底层做什么', desc:'CANN 是昇腾异构计算架构，可理解为 NPU 的运行基础：提供算子、运行时和底层计算能力，torch_npu 则把这些能力接入熟悉的 PyTorch 使用方式。' }
    ],
    '检查昇腾 NPU 环境': [
      { term:'先检查再下载', desc:'模型下载和加载都需要时间，先打印 PyTorch、torch_npu 版本和设备信息，能快速发现环境不匹配、设备不可见等基础问题。' },
      { term:'最关键的判断', desc:'只有“NPU 是否可用”输出 True，才说明当前 Python 进程可以继续使用昇腾 NPU。还可用设备数量和 get_device_name(0) 确认实际识别到的硬件。' },
      { term:'失败时先不要往下跑', desc:'若设备不可用，后续 .to(\'npu:0\') 会失败。应先核对 torch_npu 安装、驱动和运行环境，而不是直接执行模型加载代码。' }
    ],
    '下载 Qwen3-0.6B 模型': [
      { term:'模型也需要先“安装”', desc:'Qwen3-0.6B 的参数文件约 1.4GB。Notebook 使用 ModelScope 的 snapshot_download 从魔搭社区获取模型，并将文件保存到 /mnt/workspace/models。' },
      { term:'缓存意味着只需下载一次', desc:'下载完成后，模型文件保留在本地目录；下次加载时直接使用这个路径即可，不必重复下载。' },
      { term:'关于下载进度提示', desc:'在某些 CANN Lab 环境中，Jupyter 扩展可能显示 Error rendering 或无法正常展示进度条；只要代码仍在执行，通常不影响实际下载，等待完成即可。' }
    ],
    '加载分词器与 Qwen3 模型': [
      { term:'先请“翻译官”，再请“大脑”', desc:'AutoTokenizer.from_pretrained 从本地模型目录加载分词器；AutoModelForCausalLM.from_pretrained 加载用于续写下一个 token 的语言模型。' },
      { term:'为什么使用 eager', desc:'attn_implementation="eager" 表示注意力相关算子按即时模式逐个执行，不进行图编译或算子融合。它不是最快的方式，但最便于先观察基础推理流程；后续课程会在此基础上加速。' },
      { term:'为什么 half 与 eval 必不可少', desc:'.half() 将参数转为 float16，每个数由 4 字节降为 2 字节，可减少显存并通常提升推理速度。model.eval() 关闭 Dropout 等训练专用行为，进入稳定的推理状态。' },
      { term:'加载后的三个核对点', desc:'输出应能确认分词器已完成、模型位于 npu:0，且数据类型为 float16。若这三项不对，应在第一次推理前排查。' }
    ],
    '体验 Tokenizer 编码与解码': [
      { term:'模型看到的不是汉字', desc:'test_text 先经 tokenizer.encode 变为 token ID 列表；这些整数才是后续送入模型计算的输入形式。一个 token 不一定等于一个汉字或一个单词。' },
      { term:'再解码是一次自检', desc:'把 token ID 用 tokenizer.decode 还原后，应能得到与原文一致或等价的文字。这一步能直观看到“文本 → 数字 → 文本”的往返过程。' },
      { term:'为什么要在推理前单独体验', desc:'后续聊天模板、输入 Tensor 和生成结果都依赖同一个分词器。先理解编码与解码，阅读逐 token 推理循环时不会只看到一串抽象数字。' }
    ],
    '手写逐 Token 推理循环': [
      { term:'先构造 Qwen3 能理解的输入', desc:'messages 保存用户问题；apply_chat_template 将其包装为聊天格式，并追加 generation prompt；随后 encode 并构造 long 类型 input_ids，再迁移到 npu:0。' },
      { term:'每一轮只预测一个位置', desc:'model(generated_ids).logits 给出序列每个位置的输出；logits[:, -1, :] 取最后一个位置，也就是“下一个 token”的候选概率。with torch.no_grad() 表示推理无需记录训练梯度。' },
      { term:'贪心解码与 EOS', desc:'torch.argmax 直接选择概率最大的 token，称为贪心解码。若这个 token 等于 tokenizer.eos_token_id，就说明模型自然结束，循环立即 break。' },
      { term:'拼接让上下文持续增长', desc:'未结束时，torch.cat 把新 token 接到 generated_ids 尾部。下一轮模型看到的是更长的完整上下文，因此才能一个 token 接一个 token 地生成回答。' },
      { term:'最后只解码新增部分', desc:'generated_ids 前半部分是用户输入；用 input_ids.shape[1] 切掉它，只对模型后来生成的 token 解码，得到真正的回答文本。' }
    ],
    '测量 Qwen3 推理基线速度': [
      { term:'首次推理不适合直接计时', desc:'第一次调用往往包含初始化和热身开销，速度通常偏慢。Notebook 先完整跑一次生成循环，再开始正式测量。' },
      { term:'为什么要 synchronize', desc:'NPU 任务可能异步执行。如果不调用 torch.npu.synchronize()，Python 的计时器可能在 NPU 尚未完成时就停止，得到的耗时不真实。' },
      { term:'三次测量取平均', desc:'Notebook 重复三次生成，记录每次 elapsed，再计算平均时间。生成 token 数除以平均时间得到 tokens/s，这就是当前 eager 实现的 Baseline。' },
      { term:'基线是后续优化的参照', desc:'下一个 Notebook 会使用 CANN npugraph_ex 加速推理。没有此处的基线速度，就无法判断图编译等优化实际带来了多少提升。' }
    ],
    '用多种提示词测试模型': [
      { term:'同一循环可服务多种任务', desc:'古诗创作、英文问答和快速排序代码生成，看似不同，本质都是根据当前上下文预测下一个 token。只需替换 prompt，底层推理循环无需改变。' },
      { term:'每个问题都要重新构造输入', desc:'循环中为每个 prompt 新建 messages、聊天模板、input_ids 和 generated_ids，避免前一个问题的生成序列污染下一个问题。' },
      { term:'体验不等于验证', desc:'这些例子用于感受模型的生成能力。涉及事实、代码正确性或生产使用时，仍应对输出进行人工检查和实际运行验证。' }
    ],
    '自由对话与推理练习': [
      { term:'只改两个变量即可开始', desc:'my_question 决定你问什么，max_new_tokens 限制最多新生成多少 token。其余聊天模板、编码、循环和解码代码可以保持不变。' },
      { term:'建议怎样提问', desc:'可尝试知识问答、C++ Hello World、科幻短故事、简单推理题或英文问题。比较不同任务的回答长度、风格与完成度。' },
      { term:'长度与耗时的关系', desc:'把 max_new_tokens 从 128 调到 256，模型最多能输出更多内容，但逐 token 循环也会运行更久；它是观察生成长度与延迟关系的直接参数。' },
      { term:'可继续挑战随机采样', desc:'当前代码通过 argmax 做贪心解码。可尝试用 torch.multinomial 从概率分布中采样，观察结果的多样性；此时还需要进一步学习温度等采样控制参数。' }
    ]
  };
  Object.entries(QWEN3_NOTEBOOK_READING).forEach(([title, reading]) => {
    if (NODE_KNOWLEDGE[title]) {
      NODE_KNOWLEDGE[title].reading = reading;
      NODE_KNOWLEDGE[title].body = reading.map(item => `<p><strong>${item.term}</strong>${item.desc}</p>`).join('');
    }
  });

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
      requestAnimationFrame(() => window.lucide?.createIcons());

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
              <i class="nd-lab-step-toggle" data-lucide="chevron-down" aria-hidden="true"></i>
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
        requestAnimationFrame(() => window.lucide?.createIcons());
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
  const QWEN3_PATH_COURSES = new Set(['第一次让大模型在昇腾 NPU 上运行', '在昇腾 NPU 上准备 Qwen3', '理解 Qwen3 基线推理', '巩固与扩展']);
  const samplePaths = [
    { id: 'official-ascend-c', name: '算子开发从入门到精通', icon: '⚙️', query: 'Ascend C编程', createdAt: '2026-07-15', official: true,
      sourceUrl: 'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53',
      nodeList: NODE_LIST.filter(node => !QWEN3_PATH_COURSES.has(node.course)).map((node, step) => ({ ...node, step:step + 1, reason:node.desc })) },
    { id: 'qwen3-npu-inference-baseline', name: '在昇腾 NPU 上运行Qwen3', icon: '✨', query: 'Qwen3 昇腾 NPU 推理入门', createdAt: '2026-07-17', official: true,
      sourceUrl: 'https://gitcode.com/cann/cann-learning-hub/blob/master/quick_start/first_llm_inference/01_qwen3_npu_inference_baseline.ipynb',
      nodeList: NODE_LIST.filter(node => QWEN3_PATH_COURSES.has(node.course)).map((node, step) => ({ ...node, step:step + 1, reason:node.desc })) },
  ];

  // Seed sample paths into localStorage on first visit
  const CUSTOM_PATHS_SEEDED_KEY = 'cann_custom_paths_seeded';
  const OFFICIAL_PATH_MIGRATION_KEY = 'cann_official_path_v4';
  if (!localStorage.getItem(OFFICIAL_PATH_MIGRATION_KEY)) {
    // Replace only earlier built-in demo paths; preserve learner-created paths.
    customPaths = customPaths.filter(path => !String(path.id).startsWith('sample-'));
    customPaths.unshift({ ...samplePaths[0], lastStudied: samplePaths[0].createdAt });
    localStorage.setItem('cann_custom_paths', JSON.stringify(customPaths));
    localStorage.setItem(OFFICIAL_PATH_MIGRATION_KEY, '1');
  }
  if (!localStorage.getItem(CUSTOM_PATHS_SEEDED_KEY)) {
    const seeded = (customPaths.length ? customPaths : samplePaths).map(p => ({
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
    if (docsActive) {
      sandboxBar.classList.add('visible');
    } else {
      sandboxBar.classList.remove('visible');
    }
  }

  // Open empty sandbox from docs bar
  function openEmptySandbox() {
    // The old playground DOM was replaced by the HiDevLab notebook drawer.
    nbCurrentFile = 'main';
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('.nb-tab').forEach((tab, i) => tab.classList.toggle('active', i === 0));
    document.querySelectorAll('.nb-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('nb-panel-notebook').classList.add('active');
    renderNbCells();
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
    const railBadge = document.getElementById('learn-rail-quiz-count');
    if (railBadge) railBadge.classList.toggle('has-items', wrong > 0);
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
  function ldOpenArchivedPath(pathId) {
    const savedPaths = JSON.parse(localStorage.getItem('cann_custom_paths') || '[]');
    const path = [...samplePaths, ...customPaths, ...savedPaths].find(item => item.id === pathId);
    if (!path) return;
    closeLearningArchive();
    showPage('learn');
    document.getElementById('ld-onboarding')?.classList.remove('open');
    ldShowRoadmap(path.id);
  }
  function switchLaTab(tab) {
    document.querySelectorAll('.la-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById('la-tab-' + tab);
    if (activeTab) activeTab.classList.add('active');
    document.getElementById('la-panel-paths').style.display = tab === 'paths' ? '' : 'none';
    const quizPanel = document.getElementById('la-panel-quiz');
    quizPanel.style.display = tab === 'quiz' ? 'flex' : 'none';
    const mapPanel = document.getElementById('la-panel-map');
    if (mapPanel) mapPanel.style.display = tab === 'map' ? '' : 'none';
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
    if (tab === 'map') renderLearningMap();
  }

  function renderLearningMap() {
    const panel = document.getElementById('la-panel-map');
    if (!panel) return;
    const paths = customPaths.length ? customPaths : samplePaths;
    const completed = new Set(JSON.parse(localStorage.getItem(LEARN_STATE_KEY) || '[]'));
    const active = new Set((_ldActivePathNodes || []).map(node => node.title));
    // Keep all three states visible for the seeded example before the learner has activity.
    const demoDone = new Set(['昇腾硬件体系', 'CANN 软件栈概览']);
    const demoCurrent = new Set(['环境安装与配置']);
    const nodePaths = new Map();
    paths.forEach(path => (path.nodeList || []).forEach(node => {
      if (!nodePaths.has(node.title)) nodePaths.set(node.title, []);
      nodePaths.get(node.title).push(path.name);
    }));
    const nodes = [...nodePaths.keys()].map(title => NODE_LIST.find(node => node.title === title)).filter(Boolean);
    const groups = ['beginner', 'developer', 'operator', 'distributed'];
    const statusText = { done:'已学', current:'学习中', todo:'待学' };
    panel.innerHTML = `<div class="la-map-desc">汇总所有学习路径中的知识节点。按知识类型分列；纵向连线表示同类学习顺序，曲线表示跨类别的知识依赖。</div><div class="la-map-legend"><span class="done">已学</span><span class="current">学习中</span><span class="todo">待学</span><span class="linked">跨类依赖</span></div><div class="la-column-map">${groups.map(category => {
      const meta = CAT_META[category];
      const groupNodes = nodes.filter(node => node.category === category);
      return `<section class="la-map-column" style="--map-color:${meta.color}"><h3><i></i>${meta.label}<small>${groupNodes.length}</small></h3><div class="la-map-column-nodes">${groupNodes.length ? groupNodes.map(node => {
        const state = completed.has(node.title) || (!completed.size && demoDone.has(node.title)) ? 'done' : active.has(node.title) || (!completed.size && demoCurrent.has(node.title)) ? 'current' : 'todo';
        const related = nodePaths.get(node.title) || [];
        return `<button class="la-column-node ${state}" data-map-node="${NODE_LIST.indexOf(node)}" onclick="ldStartNode('${node.title}')" title="来自：${related.join('、')}"><span class="la-column-node-state">${statusText[state]}</span><strong>${node.title}</strong><small>关联 ${related.length} 条路径</small></button>`;
      }).join('') : '<div class="la-column-empty">尚未接触此类知识</div>'}</div></section>`;
    }).join('')}<svg class="la-map-cross-links" aria-hidden="true"></svg></div>`;
    requestAnimationFrame(() => renderLearningMapCrossLinks(panel, paths));
  }

  function renderLearningMapCrossLinks(panel, paths) {
    const map = panel.querySelector('.la-column-map');
    const svg = panel.querySelector('.la-map-cross-links');
    if (!map || !svg) return;
    const mapRect = map.getBoundingClientRect();
    const edges = new Map();
    paths.forEach(path => {
      const list = (path.nodeList || []).map(node => NODE_LIST.findIndex(item => item.title === node.title)).filter(index => index >= 0);
      list.slice(1).forEach((target, index) => {
        const source = list[index];
        if (NODE_LIST[source].category === NODE_LIST[target].category) return;
        const key = `${source}-${target}`;
        edges.set(key, { source, target, count:(edges.get(key)?.count || 0) + 1 });
      });
    });
    svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`);
    svg.setAttribute('width', mapRect.width);
    svg.setAttribute('height', mapRect.height);
    svg.innerHTML = [...edges.values()].map(edge => {
      const source = map.querySelector(`[data-map-node="${edge.source}"]`);
      const target = map.querySelector(`[data-map-node="${edge.target}"]`);
      if (!source || !target) return '';
      const a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
      const goingRight = b.left > a.left;
      const x1 = (goingRight ? a.right : a.left) - mapRect.left;
      const x2 = (goingRight ? b.left : b.right) - mapRect.left;
      const y1 = a.top - mapRect.top + a.height / 2;
      const y2 = b.top - mapRect.top + b.height / 2;
      const curve = Math.max(24, Math.abs(x2 - x1) * .45);
      const c1 = x1 + (goingRight ? curve : -curve);
      const c2 = x2 + (goingRight ? -curve : curve);
      return `<path d="M${x1} ${y1} C${c1} ${y1},${c2} ${y2},${x2} ${y2}" stroke-width="${edge.count > 1 ? 2.25 : 1.35}"/>`;
    }).join('');
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

        html += `<div class="la-path-card" role="button" tabindex="0" onclick="ldOpenArchivedPath('${path.id}')" onkeydown="if(event.key==='Enter'||event.key===' ')ldOpenArchivedPath('${path.id}')">
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
            <button class="la-continue-btn" onclick="event.stopPropagation();ldOpenArchivedPath('${path.id}')">${completedCount > 0 ? '继续' : '开始'}</button>
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
            <button class="pg-nbtn pg-collapse-btn" title="折叠/展开" onclick="ipeToggleCollapse(${i})"><i data-lucide="chevron-down" aria-hidden="true"></i></button>
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
    requestAnimationFrame(() => window.lucide?.createIcons());
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
    if (btn) btn.classList.toggle('is-collapsed', _ipNodes[i].collapsed);
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
  let _ldRecommendationOffset = 0;
  let _ldSelectedScenario = '';
  let _ldGeneratedPlanContext = '';
  let _ldPathView = 'map';
  let _ldActivePathNodes = [];
  let _ldActivePathIndex = 0;
  let _ldPlan = {};
  const LD_RESOURCES_KEY = 'cann_learn_resources';
  const LD_PROFILE_KEY = 'cann_learning_profile';
  let _ldOnboardingStep = 0;
  let _ldProfileDraft = {};
  const LD_ONBOARDING = [
    { key:'role', title:'你的角色是？', options:['学生','应用开发者','算子开发者','算法工程师','暂不确定'] },
    { key:'goal', title:'你希望通过学习达成什么？', options:['跑通一个项目','解决当前任务','提升工作技能','学习认证','暂不确定'] },
    { key:'foundation', title:'你的基础与资源如何？', hint:'可多选', multiple:true, options:['零基础','会 Python','会 PyTorch','熟悉 C++','有昇腾硬件','希望在线实验'] },
  ];

  function ldProfileLoad() { try { return JSON.parse(localStorage.getItem(LD_PROFILE_KEY) || '{}'); } catch(e) { return {}; } }
  function ldOpenOnboarding(reset) {
    _ldProfileDraft = ldProfileLoad();
    _ldOnboardingStep = 0;
    document.getElementById('ld-onboarding')?.classList.add('open');
    ldRenderOnboarding();
  }
  function ldSkipOnboarding() {
    localStorage.setItem(LD_PROFILE_KEY, JSON.stringify({ skipped:true }));
    document.getElementById('ld-onboarding')?.classList.remove('open');
    ldArrangeDashboard(false);
    ldRenderNodes(_ldActiveCat);
  }
  function ldCloseOnboarding() {
    document.getElementById('ld-onboarding')?.classList.remove('open');
  }
  function ldRenderOnboarding() {
    const item = LD_ONBOARDING[_ldOnboardingStep];
    const box = document.getElementById('ld-ob-question');
    const next = document.getElementById('ld-ob-next');
    if (!box || !next) return;
    const stored = _ldProfileDraft[item.key];
    const current = item.multiple ? (Array.isArray(stored) ? stored : stored ? [stored] : []) : stored;
    box.innerHTML = `<h2>${item.title}${item.hint ? `<small>${item.hint}</small>` : ''}</h2><div class="ld-ob-options ${item.multiple ? 'is-multiple' : ''}">${item.options.map(option => {
      const selected = item.multiple ? current.includes(option) : current === option;
      return `<button class="${selected ? 'active' : ''}" aria-pressed="${selected}" onclick="ldPickOnboarding('${item.key}','${option}',this)">${option}</button>`;
    }).join('')}</div>`;
    document.querySelectorAll('.ld-ob-progress span').forEach(span => span.classList.toggle('active', Number(span.dataset.step) <= _ldOnboardingStep + 1));
    next.disabled = item.multiple ? !current.length : !current;
    next.textContent = _ldOnboardingStep === LD_ONBOARDING.length - 1 ? '查看我的推荐' : '下一步';
  }
  function ldPickOnboarding(key, value, button) {
    const item = LD_ONBOARDING.find(entry => entry.key === key);
    if (item?.multiple) {
      let choices = Array.isArray(_ldProfileDraft[key]) ? [..._ldProfileDraft[key]] : _ldProfileDraft[key] ? [_ldProfileDraft[key]] : [];
      // “零基础” is mutually exclusive with declared programming experience.
      if (value === '零基础') choices = choices.includes(value) ? [] : ['零基础'];
      else {
        choices = choices.filter(choice => choice !== '零基础');
        choices = choices.includes(value) ? choices.filter(choice => choice !== value) : [...choices, value];
      }
      _ldProfileDraft[key] = choices;
      button.closest('.ld-ob-options').querySelectorAll('button').forEach(option => {
        const selected = choices.includes(option.textContent);
        option.classList.toggle('active', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
    } else {
      _ldProfileDraft[key] = value;
      button.closest('.ld-ob-options').querySelectorAll('button').forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
    }
    // Role is the explicit switch for the dashboard recommendation layout.
    if (key === 'role') ldArrangeDashboard(value !== '暂不确定');
    const choices = _ldProfileDraft[key];
    document.getElementById('ld-ob-next').disabled = Array.isArray(choices) ? !choices.length : !choices;
    if (!item?.multiple) {
      // A single choice is already complete, so continue without another click.
      setTimeout(ldNextOnboarding, 120);
    }
  }
  function ldNextOnboarding() {
    const answer = _ldProfileDraft[LD_ONBOARDING[_ldOnboardingStep].key];
    if (!answer || (Array.isArray(answer) && !answer.length)) return;
    if (_ldOnboardingStep < LD_ONBOARDING.length - 1) { _ldOnboardingStep++; ldRenderOnboarding(); return; }
    localStorage.setItem(LD_PROFILE_KEY, JSON.stringify(_ldProfileDraft));
    document.getElementById('ld-onboarding')?.classList.remove('open');
    ldArrangeDashboard(_ldProfileDraft.role && _ldProfileDraft.role !== '暂不确定');
    ldRenderNodes(_ldActiveCat);
  }

  function ldArrangeDashboard(hasProfile) {
    const recommend = document.getElementById('ld-recommend-section');
    const scenario = document.getElementById('ld-scenario-section');
    const chips = document.getElementById('ld-cat-chips');
    const note = document.getElementById('ld-recommend-note');
    if (!recommend || !scenario) return;
    if (hasProfile) scenario.before(recommend); else scenario.after(recommend);
    if (chips) chips.style.display = hasProfile ? 'none' : '';
    if (note) note.textContent = hasProfile ? '基于你的学习画像' : '';
  }

  const LD_SCENARIOS = {
    '算子开发': 'TBE / TIK 自定义算子开发、编译与调试',
    '模型迁移': '将 PyTorch 或 ONNX 模型迁移并适配到昇腾',
    '模型推理': '完成模型转换、AscendCL 推理与部署验证',
    '模型训练': '在昇腾上启动、调试和优化模型训练',
    '性能调优': '使用 Profiling 定位训练、推理或算子性能瓶颈',
  };

  const LD_PLAN_PRESETS = {
    '算子开发': [
      ['identity', '你的身份', ['学生', '算子开发者', '算法工程师']],
      ['foundation', '你的基础', ['零基础', '会 Python', '熟悉 C++', '了解 AI Core']],
      ['goal', '你的目标', ['完成首个算子', '调试精度', '性能优化', '开发认证']],
      ['resource', '你的资源', ['有昇腾硬件', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
    '模型迁移': [
      ['identity', '你的身份', ['学生', '应用开发者', '算法工程师']],
      ['foundation', '你的基础', ['零基础', '会 PyTorch', '熟悉 ONNX', '会 Python']],
      ['goal', '你的目标', ['跑通迁移', '精度对齐', '算子适配', '完成认证']],
      ['resource', '你的资源', ['有昇腾硬件', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
    '模型推理': [
      ['identity', '你的身份', ['学生', '应用开发者', '算法工程师']],
      ['foundation', '你的基础', ['零基础', '会 Python', '熟悉 C++', '了解 ONNX']],
      ['goal', '你的目标', ['模型转换', '跑通推理', '服务化部署', '完成认证']],
      ['resource', '你的资源', ['有部署环境', '有昇腾硬件', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
    '模型训练': [
      ['identity', '你的身份', ['学生', '算法工程师', '应用开发者']],
      ['foundation', '你的基础', ['会 PyTorch', '会 MindSpore', '零基础', '熟悉分布式']],
      ['goal', '你的目标', ['启动训练', '模型微调', '训练稳定性', '多卡训练']],
      ['resource', '你的资源', ['单卡昇腾硬件', '多卡昇腾硬件', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
    '性能调优': [
      ['identity', '你的身份', ['应用开发者', '算子开发者', '算法工程师']],
      ['foundation', '你的基础', ['会 Profiling', '会 Python', '熟悉 C++', '零基础']],
      ['goal', '你的目标', ['定位瓶颈', '降低时延', '提升吞吐', '优化算子']],
      ['resource', '你的资源', ['有昇腾硬件', '有性能数据', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
    '个性定制': [
      ['identity', '你的身份', ['学生', '应用开发者', '算子开发者', '算法工程师']],
      ['foundation', '你的基础', ['零基础', '会 Python', '会 PyTorch', '熟悉 C++']],
      ['goal', '你的目标', ['入门', '模型迁移', '推理部署', '算子开发', '认证']],
      ['resource', '你的资源', ['有昇腾硬件', '希望在线实验']],
      ['time', '你的时间', ['30 分钟', '1 天', '1 周', '1 个月']],
    ],
  };

  function ldRenderPlanPreset(name) {
    const container = document.getElementById('ld-plan-fields');
    const preset = LD_PLAN_PRESETS[name || '个性定制'];
    if (!container || !preset) return;
    _ldPlan = {};
    const customGoal = name === '个性定制' ? `<label class="ld-custom-goal"><b>你的目标</b><input id="ld-custom-goal-input" type="text" placeholder="例如：我想让 LLM 应用跑在昇腾 NPU 上" oninput="ldUpdateGenerateState()"></label>` : '';
    container.innerHTML = customGoal + preset.map(([key, label, options]) => `<div class="ld-plan-row" data-plan="${key}"><b>${label}</b><div>${[...options, '其他'].map(option => `<button type="button" onclick="ldSelectPlan('${key}', this)">${option}</button>`).join('')}</div></div>`).join('');
    container.classList.add('open');
  }

  function ldSelectPlan(key, button) {
    button.closest('.ld-plan-row').querySelectorAll('button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const value = button.textContent.trim();
    _ldPlan[key] = value;
    let customInput = button.closest('.ld-plan-row').querySelector('.ld-other-input');
    if (value === '其他') {
      if (!customInput) {
        customInput = document.createElement('input');
        customInput.className = 'ld-other-input';
        customInput.placeholder = '请输入你的情况';
        customInput.addEventListener('input', () => { _ldPlan[key] = customInput.value.trim() || '其他'; });
        button.closest('.ld-plan-row').querySelector('div').appendChild(customInput);
      }
      customInput.focus();
    } else if (customInput) {
      customInput.remove();
    }
    ldUpdateGenerateState();
  }

  function ldUpdateGenerateState() {
    const btn = document.getElementById('ld-task-gen-btn');
    const hint = document.getElementById('ld-gen-hint');
    const freeBtn = document.getElementById('ld-free-gen-btn');
    const freeInput = document.getElementById('ld-ai-input');
    // The free-form input is independent from the optional scenario configuration.
    if (freeBtn && freeInput) freeBtn.disabled = !freeInput.value.trim();
    if (!btn || !hint) return;
    const customGoal = document.getElementById('ld-custom-goal-input')?.value.trim();
    const ready = Boolean(_ldSelectedScenario) && (_ldSelectedScenario !== '个性定制' || Boolean(customGoal));
    btn.disabled = !ready;
    hint.textContent = ready ? '可直接生成；补充学习偏好后，路径会更贴近你的情况' : (_ldSelectedScenario === '个性定制' ? '请描述你的学习目标' : '请先选择一个任务场景');
  }

  function ldChooseScenario(name) {
    _ldSelectedScenario = name;
    document.querySelectorAll('.ld-scenario-card').forEach(card => card.classList.toggle('active', card.querySelector('strong')?.textContent === name));
    const custom = document.getElementById('ld-custom-scenario');
    if (name === '个性定制') {
      custom?.classList.add('open');
      document.getElementById('ld-custom-goal-input')?.focus();
      return;
    }
    custom?.classList.remove('open');
    ldGenPath('scenario');
  }

  function ldSetInput(text) {
    const scenario = Object.entries(LD_SCENARIOS).find(([, value]) => value === text)?.[0];
    if (scenario) ldChooseScenario(scenario);
  }

  async function ldGenPath(mode) {
    const input = document.getElementById('ld-ai-input');
    if (mode === 'free') {
      const query = input?.value.trim();
      if (!query) return;
      _ldGeneratedPlanContext = `你的学习目标「${query}」`;
      sessionStorage.setItem('cann_learning_plan', JSON.stringify({ scenario: '自由输入' }));
      _aiPathStart(query, '用户已在输入框明确描述学习任务，请直接生成学习路径，不再追问学习目标。');
      return;
    }
    const query = mode === 'custom'
      ? document.getElementById('ld-custom-goal-input')?.value.trim()
      : LD_SCENARIOS[_ldSelectedScenario];
    if (!query) return;
    const profile = ldProfileLoad();
    const planContext = Object.entries(profile).filter(([key]) => key !== 'skipped').map(([key, value]) => `${({interest:'兴趣场景',goal:'学习目标',foundation:'基础与资源'})[key] || key}：${value}`).join('；');
    sessionStorage.setItem('cann_learning_plan', JSON.stringify({ scenario: _ldSelectedScenario, ...profile }));
    _ldGeneratedPlanContext = `你选择的典型场景「${_ldSelectedScenario}」`;
    _aiPathStart(query, planContext);
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
    _ldRecommendationOffset = 0;
    document.querySelectorAll('.ld-cat-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    ldRenderNodes(cat);
  }

  function ldRefreshRecommendations() {
    _ldRecommendationOffset += 3;
    ldRenderNodes(_ldActiveCat);
  }

  function ldRenderContinue() {
    const container = document.getElementById('ld-continue-list');
    if (!container) return;
    const paths = customPaths.length > 0 ? customPaths : samplePaths;
    // Keep the dashboard concise; the archive contains the complete path list.
    const shown = paths.slice(0, 1);

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
    let nodes = cat === 'all' ? [...NODE_LIST] : NODE_LIST.filter(n => n.category === cat);
    const profile = ldProfileLoad();
    const interestMap = { '算子开发':'operator', '模型训练':'distributed', '模型推理':'developer', '模型迁移':'developer', '性能调优':'developer' };
    const preferred = interestMap[profile.interest];
    if (cat === 'all' && preferred) nodes.sort((a, b) => (b.category === preferred) - (a.category === preferred));
    const qwenPath = samplePaths.find(item => item.id === 'qwen3-npu-inference-baseline');
    const showQwenPath = Boolean(qwenPath) && (cat === 'all' || cat === 'developer');
    const pageSize = showQwenPath ? 2 : 3;
    if (_ldRecommendationOffset >= nodes.length) _ldRecommendationOffset = 0;
    nodes = [...nodes.slice(_ldRecommendationOffset), ...nodes.slice(0, _ldRecommendationOffset)].slice(0, pageSize);
    const diffLabel = ['', '入门', '进阶', '高级'];
    const pathCard = showQwenPath ? `<div class="ld-node-card" onclick="ldShowRoadmap('${qwenPath.id}')">
      <div class="ld-node-card-top"><span class="ld-node-card-title">${qwenPath.name}</span><span class="ld-node-card-badge" style="background:#2e53fa18;color:#2e53fa">学习路径</span></div>
      <div class="ld-node-card-desc">Qwen3-0.6B · ${qwenPath.nodeList.length} 节：从 NPU 环境检查、模型加载到逐 token 推理和基线测速。</div>
      <div class="ld-node-card-footer"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:11px;color:var(--text-muted)">模型推理 · 入门</span></div></div>
      <div class="ld-node-hover"><strong>路径内容</strong><ul><li>检查昇腾 NPU 与 torch_npu 环境</li><li>加载 Qwen3-0.6B 并执行首次推理</li><li>测量 tokens/s 基线速度</li></ul><button class="ld-node-enter" onclick="event.stopPropagation();ldShowRoadmap('${qwenPath.id}')" title="进入学习" aria-label="进入学习：${qwenPath.name}">→</button></div>
    </div>` : '';
    grid.innerHTML = pathCard + nodes.map(n => {
      const meta = CAT_META[n.category] || { label: n.category, color: '#888' };
      const dots = n.difficulty ? Array.from({length: 3}, (_, i) =>
        `<span style="width:6px;height:6px;border-radius:50%;display:inline-block;background:${i < n.difficulty ? meta.color : 'var(--border)'}"></span>`
      ).join('') : '';
      const topics = (n.topics || []).slice(0, 3).map(topic => `<li>${topic}</li>`).join('');
      return `
        <div class="ld-node-card" onclick="ldStartNode('${n.title}')">
          <div class="ld-node-card-top">
            <span class="ld-node-card-title">${n.title}</span>
            <span class="ld-node-card-badge" style="background:${meta.color}18;color:${meta.color}">${meta.label}</span>
          </div>
          <div class="ld-node-card-desc">${n.desc}</div>
          <div class="ld-node-card-footer">
            <div style="display:flex;align-items:center;gap:6px">
              ${dots}
              <span style="font-size:11px;color:var(--text-muted)">${diffLabel[n.difficulty] || ''}</span>
              ${n.duration ? `<span style="font-size:11px;color:var(--text-muted);margin-left:6px">· ${n.duration}</span>` : ''}
            </div>
          </div>
          ${topics ? `<div class="ld-node-hover"><strong>本节内容</strong><ul>${topics}</ul><button class="ld-node-enter" onclick="event.stopPropagation();ldStartNode('${n.title}')" title="进入学习" aria-label="进入学习：${n.title}">→</button></div>` : ''}
        </div>`;
    }).join('');
  }

  function ldStartNode(title) {
    const nodeIdx = NODE_LIST.findIndex(n => n.title === title);
    if (nodeIdx < 0) return;
    const selected = NODE_LIST[nodeIdx];
    const related = NODE_LIST.filter(node => node.category === selected.category && node.title !== selected.title);
    const foundation = NODE_LIST.filter(node => node.category === 'beginner').slice(0, 3);
    const path = [...foundation, selected, ...related].filter((node, i, all) => all.findIndex(item => item.title === node.title) === i).slice(0, 6).map((node, i) => ({ ...node, step:i + 1, reason: node.title === selected.title ? '你选择的学习节点' : '建议的前置或进阶节点' }));
    const dash = document.getElementById('ld-dash');
    const roadmap = document.getElementById('ld-roadmap');
    if (dash) dash.style.display = 'none';
    if (roadmap) roadmap.style.display = '';
    document.getElementById('ld-roadmap-name').textContent = `${selected.title}学习路径`;
    document.getElementById('ld-roadmap-prog-fill').style.width = '0%';
    document.getElementById('ld-roadmap-prog-lbl').textContent = `0 / ${path.length} 节点`;
    window._currentLearnPath = path;
    ldRenderPathWorkspace(path);
    const focus = path.findIndex(node => node.title === selected.title);
    if (focus >= 0) ldOpenPathNode(focus);
    window.scrollTo({ top:0, behavior:'instant' });
  }

  function ldShowRoadmap(pathId, focusIdx) {
    const dash = document.getElementById('ld-dash');
    const roadmap = document.getElementById('ld-roadmap');
    if (!dash || !roadmap) return;

    if (pathId) {
      // Built-in sample paths remain addressable even when the learner has saved paths.
      const path = [...samplePaths, ...customPaths].find(p => p.id === pathId);
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
        if (path.nodeList) {
          window._currentLearnPath = path.nodeList;
          const strip = document.getElementById('path-seq-strip');
          if (strip) renderLearnPagePath(path.query, path.nodeList);
        }
      }
    }

    dash.style.display = 'none';
    roadmap.style.display = '';
    const fallback = focusIdx !== undefined ? [NODE_LIST[focusIdx]] : (window._currentLearnPath || NODE_LIST.slice(0, 5));
    ldRenderPathWorkspace(window._currentLearnPath?.length ? window._currentLearnPath : fallback);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function ldOpenAscendCDemo() {
    _ldGeneratedPlanContext = 'Ascend C 编程样板路径';
    ldShowRoadmap('official-ascend-c');
  }

  function ldSetPathView(view, btn) {
    _ldPathView = view;
    document.querySelectorAll('.ld-view-switch button').forEach(b => b.classList.toggle('active', b === btn));
    ldRenderPathNav();
  }

  function ldRenderPathWorkspace(nodes) {
    _ldActivePathNodes = nodes || [];
    _ldActivePathIndex = 0;
    ldRenderPathNav();
    if (_ldActivePathNodes.length) ldOpenPathNode(0);
  }

  function ldRenderPathNav() {
    const nav = document.getElementById('ld-path-nav');
    if (!nav) return;
    nav.classList.toggle('map', _ldPathView === 'map');
    if (_ldPathView === 'map') {
      const clusters = [];
      _ldActivePathNodes.forEach((node, index) => {
        const last = clusters[clusters.length - 1];
        if (!last || last.course !== node.course) clusters.push({ course:node.course || '学习节点', items:[] });
        clusters[clusters.length - 1].items.push({ node, index });
      });
      const W = 230, H = Math.max(220, _ldActivePathNodes.length * 68 + clusters.length * 32 + 30);
      let y = 26;
      const layout = [];
      clusters.forEach(cluster => { y += 16; cluster.y = y; cluster.items.forEach(item => { y += 34; layout.push({ ...item, y }); y += 34; }); y += 12; });
      const label = text => String(text).replace(/[&<>]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' })[char]);
      const links = layout.slice(0, -1).map((item, i) => {
        const next = layout[i + 1];
        return `<path class="ld-route-link" d="M42 ${item.y + 22} L42 ${next.y - 22}" marker-end="url(#ldRouteArrow)"/>`;
      }).join('');
      const headings = clusters.map(cluster => `<text class="ld-route-cluster" x="20" y="${cluster.y}">${label(cluster.course)}</text>`).join('');
      const marks = layout.map(({ node, index, y:nodeY }) => {
        const active = index === _ldActivePathIndex ? ' active' : '';
        const color = CAT_META[node.category]?.color || '#002FA7';
        return `<g class="ld-route-node${active}" onclick="ldOpenPathNode(${index})" role="button" aria-label="打开第 ${index + 1} 步：${label(node.title)}"><rect x="20" y="${nodeY - 22}" width="190" height="44" rx="7"/><circle cx="42" cy="${nodeY}" r="13" fill="${color}"/><text class="ld-route-number" x="42" y="${nodeY + 4}" text-anchor="middle">${index + 1}</text><text class="ld-route-title" x="64" y="${nodeY - 2}">${label(node.title)}</text><text class="ld-route-meta" x="64" y="${nodeY + 13}">${label(node.duration || '学习节点')}</text></g>`;
      }).join('');
      nav.innerHTML = `<div class="ld-route-map-wrap"><svg class="ld-route-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="按课程聚类的学习路径可视化路线图"><defs><marker id="ldRouteArrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z"/></marker></defs>${headings}${links}${marks}</svg></div>`;
      return;
    }
    let previousCourse = '';
    nav.innerHTML = _ldActivePathNodes.map((n, i) => {
      const cluster = n.course && n.course !== previousCourse ? `<div class="ld-path-cluster">${n.course}</div>` : '';
      previousCourse = n.course || previousCourse;
      return `${cluster}<button class="ld-path-nav-item ${i === _ldActivePathIndex ? 'active' : ''}" onclick="ldOpenPathNode(${i})"><span>${i + 1}</span><strong>${n.title}</strong><small>${n.duration || '学习节点'}</small></button>`;
    }).join('');
  }

  function ldOpenPathNode(index) {
    const node = _ldActivePathNodes[index];
    if (!node) return;
    _ldActivePathIndex = index;
    if (_ldPathView === 'map') ldRenderPathNav();
    document.querySelectorAll('.ld-path-nav-item').forEach((el, i) => el.classList.toggle('active', i === index));
    const knowledge = NODE_KNOWLEDGE[node.title] || ldBuildChapterKnowledge(node);
    const content = document.getElementById('ld-learning-content');
    if (!content) return;
    const video = NODE_VIDEO[node.title] || { title: `${node.title}讲解视频`, duration: '课程视频', tag: '视频学习' };
    const videoOverlay = `<div class="ld-video-overlay"><strong>${video.title}</strong><small>跟随本节内容理解核心概念，并完成对应实践</small></div><button class="ld-video-play" type="button" aria-label="播放：${video.title}">▶</button>`;
    const videoStage = node.title === '算子开发编程基础'
      ? `<div class="ld-video-stage ld-video-cover"><img src="ascend-c-course-cover.png" alt="昇腾异构编程基础课程封面">${videoOverlay}</div>`
      : `<div class="ld-video-stage">${videoOverlay}</div>`;
    const resources = (knowledge?.resources || []).map(r => `<a class="ld-content-resource" href="${r.href}" target="_blank"><span>${r.icon}</span><div><strong>${r.title}</strong><small>${r.subtitle || r.type}</small></div></a>`).join('');
    const conceptDoc = concept => concept.href || knowledge?.resources?.[0]?.href || 'https://www.hiascend.com/document';
    const concepts = (knowledge?.concepts || []).map(c => `<div class="ld-content-concept"><strong>${c.term}</strong><p>${c.desc}</p><a class="ld-concept-doc" href="${conceptDoc(c)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">查看文档 <span aria-hidden="true">↗</span></a></div>`).join('');
    const readingHtml = knowledge?.body ? `<section class="ld-reading-section"><h2>本节讲解</h2><div class="ld-reading-body">${knowledge.body}</div></section>` : '';
    const nextStepsHtml = knowledge?.nextSteps?.length ? `<section class="ld-next-steps"><div class="ld-next-steps-head"><h2>首跑后，照着做</h2><p>先固定工程与验证规则，再开始优化。</p></div><div class="ld-next-steps-grid">${knowledge.nextSteps.map((step, stepIndex) => `<article class="ld-next-step"><div class="ld-next-step-index">${stepIndex + 1}</div><i data-lucide="${step.icon}" aria-hidden="true"></i><small>${step.label}</small><strong>${step.title}</strong><p>${step.detail}</p><pre>${escHtml(step.code)}</pre></article>`).join('')}</div><a class="ld-next-steps-source" href="${QWEN3_FUSED_OP_NOTEBOOK}" target="_blank" rel="noopener">打开官方融合算子 Notebook，按第 1 步开始 <span aria-hidden="true">↗</span></a></section>` : '';
    const code = knowledge?.code;
    const codeHtml = code ? `<section><h2>代码示例</h2><div class="ld-code-example"><div><span>${code.lang}</span><button onclick="ldRunNodeCode()">▶ 在 HiDevLab 运行</button></div><pre>${escHtml(code.body)}</pre></div></section>` : '';
    const practiceSteps = knowledge?.lab?.steps || [{ title:`运行「${node.title}」配套练习`, desc:'在 HiDevLab 中打开本章节的实践环境，边学边验证。' }];
    const practice = `<section><h2>动手练习</h2><div class="ld-practice-steps">${practiceSteps.map((step, stepIndex) => `<button onclick="ldOpenLabStep(${stepIndex})"><span>${stepIndex + 1}</span><div><strong>${step.title}</strong><small>${step.desc}</small></div><b>在 HiDevLab 运行</b></button>`).join('')}</div></section>`;
    const troubleshooting = ldRenderTroubleshooting(node, knowledge);
    content.innerHTML = `<div class="ld-content-kicker">${node.course || 'Ascend C编程'} · ${node.duration || `第 ${index + 1} 步`}</div><h1>${node.title}</h1><div class="ld-content-intro"><p class="ld-content-summary">${knowledge?.summary || node.desc}</p><div class="ld-content-actions"><button class="secondary" onclick="openEmptySandbox()">在 HiDevLab 实践</button></div></div>${nextStepsHtml}<section><h2>学习视频</h2><div class="ld-video-embed">${videoStage}<div class="ld-video-caption"><strong>${video.title}</strong><small>${video.tag} · 当前节点配套讲解</small></div></div></section>${readingHtml}${practice}${troubleshooting}<section><h2>本节要掌握什么</h2><div class="ld-content-concepts">${concepts || '<p>完成本节学习并在实践中验证。</p>'}</div></section>${codeHtml}<section><div class="ld-section-title-row"><h2>学习资源</h2><button onclick="ldAddResourceToNode('${node.title}')">+ 添加到当前节点</button></div><div class="ld-content-resources">${resources || '<p>暂无推荐资源。</p>'}</div></section>`;
    requestAnimationFrame(() => window.lucide?.createIcons());
    ldRefreshStudyTools(node, knowledge);
  }

  const LD_ERROR_CODE_REFERENCE = 'https://www.hiascend.com/document/detail/zh/canncommercial/80RC1/developmentguide/maintenref/troubleshooting/atlaserrorcode_15_0313.html';
  const LD_TROUBLESHOOTING = {
    qwen: [
      { code:'E10001', title:'Invalid Argument（参数非法）', symptom:'调用接口或启动推理时返回 E10001，通常伴随输入参数、模型路径或设备参数不符合要求。', causes:'传入的参数为空、格式不正确，或模型 / tokenizer 路径不满足当前接口要求。', steps:['保留完整的 E10001 前后日志，确认首个无效参数。','核对 model_path、设备号、dtype、max_new_tokens 等参数。','先以教程中的最小参数集复测，再逐项恢复自定义配置。'], fix:'不要只按报错表面修改后续异常；先修复第一条 E10001 所指向的无效参数。' },
      { code:'E10002', title:'Invalid --input_shape Argument（输入形状参数非法）', symptom:'运行模型转换、编译或指定输入 shape 时返回 E10002。', causes:'输入 shape 的格式、维度数量或动态维度设置与模型实际输入不匹配。', steps:['查看模型输入名称和每一维的含义。','对照命令中的 --input_shape，确认名称、分隔符和维度数量。','先用静态的最小合法 shape 验证，再添加动态 shape。'], fix:'以模型真实输入为唯一依据填写 input_shape，不要凭经验猜测维度顺序。' },
      { code:'EZ9999', title:'AclNN Inner Error（AclNN 内部错误）', symptom:'运行 NPU 推理时出现 EZ9999 或 AclNN Inner Error。', causes:'输入 shape / dtype 不匹配、设备与环境版本不匹配，或前序错误引发运行时内部失败。', steps:['从日志中向前查找第一条 E 开头的错误码。','核对 PyTorch、torch_npu、CANN 与设备环境是否配套。','缩小为单个短问题、较小 max_new_tokens 的最小复现。'], fix:'优先依据第一条明确错误码排查；EZ9999 需要结合完整日志定位，不能单独判断根因。' },
      { raw:'ModuleNotFoundError: torch_npu', title:'Python 适配插件未安装', symptom:'import torch_npu 时提示 No module named torch_npu。', causes:'当前 Notebook 内核不是 PyTorch NPU 环境，或插件版本与 PyTorch 不匹配。', steps:['在当前内核执行 import sys，确认解释器路径。','切换到 Python 3 (PyTorch NPU) 内核。','核对 PyTorch 与 torch_npu 的配套版本。'], fix:'这是 Python 报错原文，不是昇腾错误码；切换到预装 NPU 运行时的环境后从环境检查节点重试。' },
      { raw:'OSError / from_pretrained', title:'模型路径或权重文件不可用', symptom:'from_pretrained 报目录不存在、配置缺失或无法找到模型文件。', causes:'model_path 与 snapshot_download 返回目录不一致，或下载尚未完成。', steps:['打印 model_dir，直接把该返回值作为 model_path。','检查模型目录是否包含配置、权重与 tokenizer 文件。','若 Lab 仅显示进度渲染异常，等待代码单元真正执行结束。'], fix:'这是运行异常原文，不是昇腾错误码；以 snapshot_download 的返回路径作为唯一来源。' }
    ],
    operator: [
      { code:'EZ9999', title:'AclNN / AI Core 内部错误', symptom:'运行日志中出现 EZ9999 或 AclNN Inner Error。', causes:'这类错误需要结合上下文定位，常见于输入 shape 与编译期不符、soc_version 与实际芯片不匹配，或自定义算子未正确部署到 OPP。', steps:['打开详细日志并保留首次失败前后的完整上下文。','用 npu-smi info 核对设备型号，并核对构建时 soc_version。','复查输入 shape、dtype 与算子编译配置；随后确认 OPP 部署路径。'], fix:'从最小输入复测，逐项恢复 shape、设备和部署配置；不要只依据错误码的通用描述直接修改代码。' },
      { code:'编译失败', title:'算子工程构建或核函数编译失败', symptom:'编译阶段出现 kernel build failed、找不到依赖或符号错误。', causes:'CANN 环境变量未生效、工程配置与当前 Toolkit 不匹配，或 Host / Device 侧接口不一致。', steps:['在新终端重新加载 CANN 环境变量。','确认编译器、Toolkit 与工程模板版本一致。','从第一条错误日志开始处理，优先修复头文件、接口签名或路径问题。'], fix:'先恢复官方最小样例的可编译状态，再把自定义逻辑逐段加回。' },
      { code:'精度异常', title:'结果不一致或边界输入失败', symptom:'算子可以运行，但输出与基线不一致，或只在尾块 / 特定 shape 下失败。', causes:'数据类型、切分策略、尾块处理或数据搬运顺序不一致。', steps:['先用很小且可手算的输入比对输出。','分别检查主块与非对齐尾块。','记录每一步中间结果，缩小第一个出现偏差的位置。'], fix:'先确保正确性，再讨论流水和性能优化；不要在结果未验证时叠加性能改动。' }
    ],
    general: [
      { code:'运行时错误', title:'设备、版本或环境不匹配', symptom:'初始化、加载或运行阶段返回非零错误码。', causes:'驱动、CANN Toolkit、框架插件或芯片配置之间不匹配。', steps:['记录完整错误码与前后日志。','核对当前 CANN 版本、设备型号与运行环境。','使用最小示例先验证环境，再回到当前章节代码。'], fix:'以当前版本的官方文档与错误码页为准，逐项排除环境与输入差异。' },
      { code:'结果异常', title:'代码运行但输出不符合预期', symptom:'输出为空、数值异常或与示例结果不同。', causes:'输入、数据类型、版本或上一步状态不一致。', steps:['对照章节中的最小输入与预期输出。','确认执行顺序和变量未被旧单元覆盖。','缩小输入规模，逐步复现问题。'], fix:'保留最小可复现代码与日志，再向 AI 助手或社区提问。' }
    ]
  };

  function ldRenderTroubleshooting(node) {
    const isQwen = QWEN3_PATH_COURSES.has(node.course);
    const guides = isQwen ? LD_TROUBLESHOOTING.qwen : node.category === 'operator' ? LD_TROUBLESHOOTING.operator : LD_TROUBLESHOOTING.general;
    const title = isQwen ? '常见昇腾错误码与运行异常' : '常见错误码与排查';
    const html = `<section class="ld-troubleshooting"><div class="ld-section-title-row"><h2>${title}</h2><a href="${LD_ERROR_CODE_REFERENCE}" target="_blank" rel="noopener">官方错误码参考 ↗</a></div><p class="ld-troubleshooting-lead">官方昇腾错误码以 E / EZ 开头；Python、模型下载等报错会作为运行异常原文单独标注。若日志包含多个报错，请优先从最早出现的一条开始排查。</p><label class="ld-error-search"><i data-lucide="search" aria-hidden="true"></i><input type="search" placeholder="例如：E10001、EZ9999、torch_npu" oninput="ldFilterTroubleshooting(this)"></label><div class="ld-error-guides">${guides.map((guide, index) => { const label = guide.code || guide.raw; const kind = guide.code ? '官方错误码' : '报错原文'; return `<details class="ld-error-guide" data-error-search="${[guide.code, guide.raw, guide.title, guide.symptom, guide.causes].filter(Boolean).join(' ').toLowerCase()}"${index === 0 ? ' open' : ''}><summary><span class="${guide.code ? '' : 'ld-error-raw'}">${label}</span><strong>${guide.title}</strong><small>${kind}</small><i class="ld-error-chevron" data-lucide="chevron-down" aria-hidden="true"></i></summary><div class="ld-error-guide-body"><p><b>出现时：</b>${guide.symptom}</p><p><b>常见原因：</b>${guide.causes}</p><ol>${guide.steps.map(step => `<li>${step}</li>`).join('')}</ol><p class="ld-error-fix"><b>建议修复：</b>${guide.fix}</p></div></details>`; }).join('')}</div><p class="ld-error-empty" hidden>当前章节没有匹配项。请保留完整错误码和前后日志，并查看官方错误码参考。</p></section>`;
    requestAnimationFrame(() => window.lucide?.createIcons());
    return html;
  }

  function ldFilterTroubleshooting(input) {
    const section = input.closest('.ld-troubleshooting');
    if (!section) return;
    const keyword = input.value.trim().toLowerCase();
    let visible = 0;
    section.querySelectorAll('.ld-error-guide').forEach(item => {
      const matches = !keyword || item.dataset.errorSearch.includes(keyword);
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    const empty = section.querySelector('.ld-error-empty');
    if (empty) empty.hidden = visible > 0;
  }

  function ldBuildChapterKnowledge(node) {
    const topics = node.topics || [];
    const skillsSource = node.course?.includes('Skills');
    const extra = node.title === '算子设计与代码实现' ? [{ term:'实践流程', desc:'按 design、code-gen、compile-debug 的顺序完成设计、编码与编译调试。' }] : [];
    const labs = {
      '算子开发环境搭建': [{ title:'核对开发环境', desc:'确认 CANN 环境变量、编译工具与工程目录可用。' }, { title:'创建算子工程', desc:'使用官方工程模板创建一个可编译的算子项目。' }],
      '算子开发初体验': [{ title:'编译首个算子', desc:'运行样例工程，观察编译产物与执行结果。' }],
      '一个Add算子的前世今生': [{ title:'梳理 Add 算子链路', desc:'从算子描述、Host 侧到 Device 侧，标出每个环节的职责。' }],
      '非对齐尾块处理': [{ title:'构造尾块测试', desc:'用不能整除的数据长度验证尾块处理逻辑。' }],
      '算子设计与代码实现': [{ title:'执行 Skills 流程', desc:'按 design、code-gen、compile-debug 完成 Add 算子的设计与构建。' }],
      '随堂实操练习': [{ title:'完成 Add 全流程', desc:'串联 env-config、project-init、design、code-gen、compile-debug、doc-gen 六个 Skills。' }]
    };
    const chapterConcepts = node.title === '算子开发编程基础' ? [
      { term:'算子与计算逻辑', desc:'在 CANN 中，算子用于描述模型中的一个计算单元，例如加法、卷积或归一化。自定义算子开发的第一步不是直接写代码，而是先明确输入、输出、数据类型与计算规则；这些信息决定后续的数据切分和执行方式。' },
      { term:'数据与存储层级', desc:'昇腾 AI Core 上的高性能算子通常把执行过程组织为数据搬运、计算和结果写回。需要关注数据所在的存储层级、搬运顺序与计算单元的配合，避免计算单元因等待数据而空闲。' },
      { term:'开发流程概览', desc:'一个可用的算子需要经过工程创建、实现、编译、调用和结果校验。先以正确性为目标跑通最小样例，再结合实际输入规模观察性能，形成开发验证闭环。' }
    ] : topics.map(topic => ({ term:topic, desc:`围绕「${node.title}」理解 ${topic} 的作用、基本方法与在 Ascend C 开发中的应用；阅读官方说明后，可通过最小样例验证理解。` }));
    return {
      summary: node.desc,
      concepts: [...chapterConcepts, ...extra],
      resources: [
        { icon:skillsSource ? '📝' : '🎓', title:node.course || 'Ascend C编程', href:skillsSource ? 'https://www.hiascend.com/blogs/details/1c91fc3edb804adca3c93e1e3de9266f' : 'https://www.hiascend.com/edu/growth/details/9614049b0d6044c28e291aea1d931a53', type:skillsSource ? '官方课程文章' : '官方课程', subtitle:`${node.duration || '课程章节'} · 查看完整课程内容` },
        { icon:'📖', title:'Ascend C基本概念', href:'https://hiascend.com/document/redirect/CannCommunityAscendCbase', type:'官方文档', subtitle:'配合章节学习查阅基础概念' }
      ],
      lab: labs[node.title] ? { steps:labs[node.title] } : undefined
    };
  }

  function ldSwitchTool(name, button) {
    document.querySelectorAll('.ld-tool-tabs button').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.ld-tool-panel').forEach(panel => panel.classList.toggle('active', panel.id === `ld-tool-${name}`));
    if (name === 'quiz') ldLoadEmbeddedQuiz();
  }

  function ldRefreshStudyTools(node, knowledge) {
    _closeSidebar();
    const context = document.getElementById('ld-ai-context');
    const chat = document.getElementById('ld-tool-chat');
    if (context) context.textContent = `当前节点：${node.title}`;
    if (chat) {
      const pathNotice = _ldGeneratedPlanContext === 'Ascend C 编程样板路径'
        ? '已根据您的需求生成个性化学习路径“算子开发从入门到精通”，请在左侧查看。你还可以继续问我任何学习、代码或实践问题。'
        : _ldGeneratedPlanContext
        ? `已根据${_ldGeneratedPlanContext}生成学习路径，请在左侧查看。当前打开「${node.title}」，你还可以继续问我任何学习、代码或实践问题。`
        : `正在学习「${node.title}」。可以让我解释概念、给出代码示例或规划练习。`;
      chat.innerHTML = `<div class="ld-tool-msg">${pathNotice}</div>`;
    }
    const prompts = document.getElementById('ld-tool-prompts');
    if (prompts) prompts.innerHTML = ['用适合初学者的方式解释这个概念', '逐行讲解这个节点的代码示例', '列出实践中最常见的三个错误与排查方法', '为我设计一个 20 分钟的动手练习'].map(text => `<button onclick="ldToolPrompt('${text}')">${text}</button>`).join('') + '<button class="ld-tool-path-edit" onclick="ldStartAiPathEdit()"><i data-lucide="wand-sparkles" aria-hidden="true"></i>让 AI 调整学习路径</button>';
    const quiz = document.getElementById('ld-embedded-quiz');
    if (quiz) quiz.innerHTML = `<div class="ld-tool-empty">切换到随堂测验后会自动出题。</div>`;
    const visual = document.getElementById('ld-knowledge-visual');
    if (!visual) return;
    if (QWEN3_PATH_COURSES.has(node.course)) {
      ldRenderInferenceFlow(visual, node);
      return;
    }
    const graph = ldBuildKnowledgeGraph(node, knowledge);
    const links = graph.edges.map(([from, to], edgeIndex) => {
      const start = graph.nodes.find(item => item.id === from);
      const end = graph.nodes.find(item => item.id === to);
      if (!start || !end) return '';
      const sx = start.x + 40, sy = start.y + 16, ex = end.x + 40, ey = end.y + 16;
      const bend = (edgeIndex % 2 ? 1 : -1) * (14 + (edgeIndex % 3) * 7);
      return `<path d="M ${sx} ${sy} Q ${(sx + ex) / 2 + bend} ${(sy + ey) / 2 - bend} ${ex} ${ey}" />`;
    }).join('');
    const nodes = graph.nodes.map(item => `<button class="ld-kv-graph-node ${item.group}" style="left:${item.x}px;top:${item.y}px" onclick="ldFocusLearningContent()"><span>${item.label}</span><em><b>${item.title}</b>${item.desc}${item.source ? `<a href="${item.source}" target="_blank" onclick="event.stopPropagation()">查看官方文档 ↗</a>` : ''}</em></button>`).join('');
    const clusters = (graph.clusters || []).map(item => `<div class="ld-kv-cluster ${item.group}" style="left:${item.x || 0}px;top:${item.y}px;width:${item.width || 278}px;height:${item.height || 80}px"><strong>${item.title}</strong><small>${item.subtitle}</small></div>`).join('');
    const legend = graph.clusters?.length
      ? graph.clusters.map(item => `<span class="${item.group}">${item.title}</span>`).join('')
      : '<span class="model">概念建模</span><span class="layout">数据与访存</span><span class="flow">执行与优化</span>';
    visual.innerHTML = `<div class="ld-kv-title">${node.title} · 知识图谱</div><div class="ld-kv-legend">${legend}</div><div class="ld-kv-map"><svg class="ld-kv-edges" viewBox="0 0 278 416" aria-hidden="true"><defs><marker id="ld-kv-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L8,4 L0,8 Z" /></marker></defs>${links}</svg>${clusters}${nodes}</div><p class="ld-kv-note">同一轮廓为一个知识簇；曲线表示簇内或跨簇的知识依赖。</p>`;
  }

  function ldRenderInferenceFlow(visual, node) {
    const isExtension = node?.course === '巩固与扩展';
    if (isExtension) {
      visual.innerHTML = `<div class="ld-kv-title">优化闭环一图看懂</div>
        <p class="ld-inference-lead">从首跑基线到融合算子、验证和认证</p>
        <div class="ld-inference-flow ld-optimization-flow">
          <button class="ld-inference-step input" onclick="ldFocusLearningContent()"><small>已跑通基线</small><strong>保留 Notebook、环境与 tokens/s</strong></button>
          <span class="ld-inference-arrow" aria-hidden="true">↓</span>
          <button class="ld-inference-step tokenizer" onclick="ldFocusLearningContent()"><small>建立实验工程</small><strong>复制融合算子 Notebook</strong><em>一次只修改一个模块</em></button>
          <span class="ld-inference-arrow" aria-hidden="true">↓</span>
          <div class="ld-inference-loop">
            <div class="ld-inference-loop-head"><span>单变量验证循环</span><small>每一步均可回退</small></div>
            <button onclick="ldFocusLearningContent()"><b>1</b><span><strong>替换 RMSNorm</strong><small>8 个小算子 → npu_rms_norm</small></span></button>
            <button onclick="ldFocusLearningContent()"><b>2</b><span><strong>热身与三次计时</strong><small>记录 tokens/s 与加速比</small></span></button>
            <button onclick="ldFocusLearningContent()"><b>3</b><span><strong>继续扩展或回退</strong><small>RoPE 融合、图模式、排障记录</small></span></button>
          </div>
          <span class="ld-inference-arrow" aria-hidden="true">↓</span>
          <button class="ld-inference-step output" onclick="ldFocusLearningContent()"><small>成果与认证</small><strong>提交可复现实验记录，完成学习认证</strong></button>
        </div>
        <p class="ld-kv-note">点击任一步骤可回到当前章节；每次只变更一项，才能说明优化结果来自哪里。</p>`;
      return;
    }
    visual.innerHTML = `<div class="ld-kv-title">推理流程一图看懂</div>
      <p class="ld-inference-lead">Qwen3 在昇腾 NPU 上如何把一句问题变成回答</p>
      <div class="ld-inference-flow">
        <button class="ld-inference-step input" onclick="ldFocusLearningContent()"><small>用户输入</small><strong>“你好，请介绍你自己”</strong></button>
        <span class="ld-inference-arrow" aria-hidden="true">↓</span>
        <button class="ld-inference-step tokenizer" onclick="ldFocusLearningContent()"><small>Tokenizer · 编码</small><strong>文字 → token IDs</strong><em>[108046, 3837, ...]</em></button>
        <span class="ld-inference-arrow" aria-hidden="true">↓</span>
        <div class="ld-inference-loop">
          <div class="ld-inference-loop-head"><span>推理循环</span><small>重复生成下一个 token</small></div>
          <button onclick="ldFocusLearningContent()"><b>1</b><span><strong>模型前向传播</strong><small>输出下一个 token 的概率分布</small></span></button>
          <button onclick="ldFocusLearningContent()"><b>2</b><span><strong>后处理：选 token</strong><small>贪心解码取 argmax</small></span></button>
          <button onclick="ldFocusLearningContent()"><b>3</b><span><strong>检查 EOS 并拼接</strong><small>未结束则接回序列，继续推理</small></span></button>
          <span class="ld-inference-loopback" aria-hidden="true">↺ 未结束</span>
        </div>
        <span class="ld-inference-arrow" aria-hidden="true">↓</span>
        <button class="ld-inference-step tokenizer" onclick="ldFocusLearningContent()"><small>Tokenizer · 解码</small><strong>token IDs → 文字</strong></button>
        <span class="ld-inference-arrow" aria-hidden="true">↓</span>
        <button class="ld-inference-step output" onclick="ldFocusLearningContent()"><small>输出结果</small><strong>“我是 AI 助手，专注于帮助用户解决问题”</strong></button>
      </div>
      <p class="ld-kv-note">点击任一步骤可回到当前章节内容；循环在生成 EOS 结束标记后停止。</p>`;
  }

  function ldBuildKnowledgeGraph(node, knowledge) {
    if (node.title === '昇腾硬件架构介绍') {
      return { nodes:[
        { id:'ascend', label:'昇腾 AI 处理器', title:'昇腾 AI 处理器', desc:'面向 AI 计算的异构处理器，协同处理控制、计算与数据访问任务。', group:'model', x:0, y:12 },
        { id:'host', label:'Host CPU', title:'Host 侧', desc:'负责应用控制、任务下发和运行时调度。', group:'model', x:99, y:12 },
        { id:'device', label:'Device', title:'Device 侧', desc:'承接由 Host 下发的计算任务，在昇腾 AI 处理器上执行。', group:'model', x:198, y:12 },
        { id:'aicore', label:'AI Core', title:'AI Core', desc:'执行高性能 AI 算子的核心计算资源，由不同计算与搬运单元协同组成。', group:'layout', x:0, y:104 },
        { id:'cube', label:'Cube 单元', title:'Cube 计算单元', desc:'面向矩阵类计算，服务卷积、矩阵乘等高吞吐运算。', group:'layout', x:99, y:104 },
        { id:'vector', label:'Vector 单元', title:'Vector 计算单元', desc:'负责向量类计算，适合逐元素计算、激活和归一化等操作。', group:'layout', x:198, y:104 },
        { id:'gm', label:'Global Memory', title:'全局内存', desc:'容量较大的片外存储，用于保存输入、输出与中间数据。', group:'layout', x:0, y:196 },
        { id:'l1', label:'L1 Buffer', title:'L1 存储', desc:'片上缓存层级之一，用于缩短数据到计算单元的访问路径。', group:'layout', x:99, y:196 },
        { id:'ub', label:'Unified Buffer', title:'Unified Buffer', desc:'面向向量计算等场景的片上缓冲区，承接数据搬运与计算。', group:'layout', x:198, y:196 },
        { id:'mte', label:'MTE 搬运', title:'数据搬运单元', desc:'在不同存储层级之间搬运数据，为计算单元持续供数。', group:'flow', x:0, y:288 },
        { id:'pipeline', label:'执行流水', title:'搬运-计算流水', desc:'将数据搬运、计算和写回组织为流水，减少计算单元等待。', group:'flow', x:99, y:288 },
        { id:'operator', label:'自定义算子', title:'算子执行', desc:'将具体计算逻辑映射到 AI Core 的计算和存储资源上执行。', group:'flow', x:198, y:288 }
      ], edges:[
        ['ascend','host'], ['ascend','device'], ['device','aicore'], ['aicore','cube'], ['aicore','vector'], ['device','gm'], ['gm','l1'], ['l1','ub'], ['ub','cube'], ['ub','vector'], ['gm','mte'], ['mte','pipeline'], ['pipeline','operator'], ['cube','operator'], ['vector','operator']
      ] };
    }
    const operatorBasics = node.title === '算子开发编程基础';
    if (!operatorBasics) {
      const items = (knowledge?.concepts || []).slice(0, 8);
      return {
        nodes: items.map((item, index) => ({ id:`n${index}`, label:item.term, title:item.term, desc:item.desc, group:index % 3 === 0 ? 'model' : index % 3 === 1 ? 'layout' : 'flow', x:[0,99,198][index % 3], y:18 + Math.floor(index / 3) * 92 })),
        edges: items.slice(1).map((_, index) => [`n${index}`, `n${index + 1}`])
      };
    }
    const docs = {
      operator:'https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/910beta3/programug/Ascendcopdevg/docs/guide/%E6%8A%80%E6%9C%AF%E9%99%84%E5%BD%95/%E6%A6%82%E5%BF%B5%E5%8E%9F%E7%90%86%E5%92%8C%E6%9C%AF%E8%AF%AD/%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C%E5%92%8C%E7%AE%97%E5%AD%90/%E7%AE%97%E5%AD%90%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5.md',
      layout:'https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/910beta3/programug/Ascendcopdevg/docs/guide/%E6%8A%80%E6%9C%AF%E9%99%84%E5%BD%95/%E6%A6%82%E5%BF%B5%E5%8E%9F%E7%90%86%E5%92%8C%E6%9C%AF%E8%AF%AD/%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C%E5%92%8C%E7%AE%97%E5%AD%90/%E6%95%B0%E6%8D%AE%E6%8E%92%E5%B8%83%E6%A0%BC%E5%BC%8F.md',
      scalar:'https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/910beta3/programug/Ascendcopdevg/docs/guide/%E6%8A%80%E6%9C%AF%E9%99%84%E5%BD%95/%E6%A6%82%E5%BF%B5%E5%8E%9F%E7%90%86%E5%92%8C%E6%9C%AF%E8%AF%AD/%E5%86%85%E5%AD%98%E8%AE%BF%E9%97%AE%E5%8E%9F%E7%90%86/Scalar%E8%AF%BB%E5%86%99%E6%95%B0%E6%8D%AE.md',
      buffer:'https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/910beta3/programug/Ascendcopdevg/docs/guide/%E6%8A%80%E6%9C%AF%E9%99%84%E5%BD%95/%E6%A6%82%E5%BF%B5%E5%8E%9F%E7%90%86%E5%92%8C%E6%9C%AF%E8%AF%AD/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8A%80%E6%9C%AF%E5%8E%9F%E7%90%86/DoubleBuffer.md'
    };
    return { clusters:[
      { group:'model', title:'算子建模', subtitle:'定义计算契约', x:8, y:0, width:262, height:93 },
      { group:'layout', title:'数据排布', subtitle:'决定访问与计算适配', x:6, y:99, width:258, height:96 },
      { group:'scalar', title:'Scalar 访存', subtitle:'控制与数据读写', x:14, y:201, width:248, height:93 },
      { group:'flow', title:'流水优化', subtitle:'隐藏搬运等待', x:5, y:300, width:266, height:104 }
    ], nodes:[
      { id:'operator', label:'算子', title:'算子基本概念', desc:'算子是模型中的计算单元；先定义输入、输出、数据类型与计算规则。', group:'model', x:22, y:42, source:docs.operator },
      { id:'io', label:'输入 / 输出', title:'逻辑输入与输出', desc:'输入、输出及其 shape、数据类型共同描述算子的计算契约。', group:'model', x:112, y:28, source:docs.operator },
      { id:'logic', label:'计算逻辑', title:'计算规则', desc:'将数学计算拆成可在 AI Core 上执行的数据搬运与计算步骤。', group:'model', x:190, y:55, source:docs.operator },
      { id:'tensor', label:'Tensor', title:'Tensor 数据排布', desc:'数据排布定义多维 Tensor 在内存中的存储方式。', group:'layout', x:20, y:144, source:docs.layout },
      { id:'nd', label:'ND / NCHW', title:'通用数据格式', desc:'ND、NCHW、NHWC 为维度赋予业务语义，通道位置会影响访问特性。', group:'layout', x:114, y:123, source:docs.layout },
      { id:'nz', label:'FRACTAL_NZ', title:'分形数据格式', desc:'NZ 等格式通过分块布局适配 Cube 计算单元，服务矩阵计算效率。', group:'layout', x:183, y:158, source:docs.layout },
      { id:'gmub', label:'GM ↔ UB', title:'Scalar 可访问存储', desc:'Scalar 仅支持读写 Global Memory 和 Unified Buffer。', group:'scalar', x:25, y:251, source:docs.scalar },
      { id:'scalar', label:'Get / Set', title:'Scalar 读写', desc:'Scalar 通过 GetValue、SetValue 操作数据，属于 PIPE_S 流水操作。', group:'scalar', x:109, y:222, source:docs.scalar },
      { id:'sync', label:'DataCache 同步', title:'缓存一致性', desc:'GM 标量访问经过 DataCache；多核共享数据变化时需要保证一致性。', group:'scalar', x:181, y:250, source:docs.scalar },
      { id:'pipeline', label:'Copy + Compute', title:'搬运与计算流水', desc:'CopyIn、Compute、CopyOut 组成典型的数据搬运与计算过程。', group:'flow', x:22, y:354, source:docs.buffer },
      { id:'queues', label:'MTE / Vector', title:'独立指令队列', desc:'MTE 搬运队列和 Vector 计算队列相互独立，可并行执行。', group:'flow', x:109, y:326, source:docs.buffer },
      { id:'double', label:'DoubleBuffer', title:'双缓冲优化', desc:'将数据分两块，让一块计算时另一块搬运或回写，以隐藏等待时间。', group:'flow', x:181, y:362, source:docs.buffer }
    ], edges:[
      ['operator','io'], ['io','logic'], ['io','tensor'], ['tensor','nd'], ['tensor','nz'], ['nd','gmub'], ['nz','pipeline'], ['gmub','scalar'], ['scalar','sync'], ['pipeline','queues'], ['queues','double'], ['gmub','pipeline']
    ] };
  }

  async function ldToolAsk() {
    const input = document.getElementById('ld-tool-ai-input');
    const chat = document.getElementById('ld-tool-chat');
    const node = _ldActivePathNodes[_ldActivePathIndex];
    const question = input?.value.trim();
    if (!question || !chat || !node) return;
    if (ldIsPathEditRequest(question)) {
      ldStartAiPathEdit();
      return;
    }
    input.value = '';
    chat.insertAdjacentHTML('beforeend', `<div class="ld-tool-msg user">${escHtml(question)}</div><div class="ld-tool-msg pending">正在思考…</div>`);
    try {
      const response = await fetch(AI_WORKER_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ system:`你是 CANN AI 助手。用户当前学习「${node.title}」，但也可能询问其他 CANN、页面操作或学习路径问题。请结合当前上下文用中文简明作答，不超过180字。`, user:question, max_tokens:350 }) });
      const data = await response.json();
      chat.querySelector('.pending')?.remove();
      chat.insertAdjacentHTML('beforeend', `<div class="ld-tool-msg">${formatFloorText(data.text || '暂时无法回答，请稍后再试。')}</div>`);
    } catch(e) { chat.querySelector('.pending')?.replaceWith(Object.assign(document.createElement('div'), { className:'ld-tool-msg', textContent:'连接失败，请稍后再试。' })); }
    chat.scrollTop = chat.scrollHeight;
  }

  function ldToolPrompt(text) {
    const input = document.getElementById('ld-tool-ai-input');
    if (!input) return;
    input.value = text;
    ldToolAsk();
  }

  function ldFocusLearningContent() {
    document.getElementById('ld-learning-content')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function ldAddResourceToNode(title) {
    const name = window.prompt('资源名称');
    const url = window.prompt('资源链接（https://...）');
    if (!name || !url) return;
    const resources = ldLoadResources();
    resources.unshift({ title:name, url, type:`${title} · 自定义资源` });
    localStorage.setItem(LD_RESOURCES_KEY, JSON.stringify(resources));
    ldRenderResources();
    const node = _ldActivePathNodes[_ldActivePathIndex];
    if (node) ldOpenPathNode(_ldActivePathIndex);
  }

  function ldRunNodeCode() {
    const node = _ldActivePathNodes[_ldActivePathIndex];
    const code = NODE_KNOWLEDGE[node?.title]?.code;
    if (!code) return openEmptySandbox();
    nbCellCounter++;
    NB_FILES.main.unshift({ id:nbCellCounter, type:'code', code:code.body, output:'' });
    nbCurrentFile = 'main';
    document.getElementById('sandbox-drawer').classList.add('open');
    document.getElementById('sandbox-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderNbCells();
  }

  function ldOpenLabStep(stepIndex) {
    const node = _ldActivePathNodes[_ldActivePathIndex];
    if (!node) return;
    const lab = NODE_KNOWLEDGE[node.title]?.lab;
    if (!lab?.steps?.[stepIndex]) return openEmptySandbox();
    _currentDrawerNode = { title:node.title, el:null, category:node.category };
    openLabStep(stepIndex);
  }

  function ldLoadEmbeddedQuiz() {
    const node = _ldActivePathNodes[_ldActivePathIndex];
    const box = document.getElementById('ld-embedded-quiz');
    if (!node || !box) return;
    const pool = _quizFallback.filter(item => item.question).slice(0, 5);
    const quiz = pool[_ldActivePathIndex % pool.length];
    box.innerHTML = `<div class="ld-quiz-question">${quiz.question}</div><div class="ld-quiz-options">${quiz.options.map(option => `<button onclick="ldAnswerEmbeddedQuiz(this,'${escHtml(quiz.answer)}')">${option}</button>`).join('')}</div>`;
  }

  function ldAnswerEmbeddedQuiz(button, answer) {
    const correct = button.textContent.trim() === answer;
    button.closest('.ld-quiz-options').querySelectorAll('button').forEach(item => { item.disabled = true; if (item.textContent.trim() === answer) item.classList.add('correct'); });
    if (!correct) button.classList.add('wrong');
  }

  function ldGenerateQuestion() {
    const active = document.querySelector('.ld-path-nav-item.active');
    const node = _ldActivePathNodes[active ? [...document.querySelectorAll('.ld-path-nav-item')].indexOf(active) : 0] || NODE_LIST[0];
    openNodeDrawer(node.title);
    setTimeout(() => {
      const tab = document.querySelector('.nd-tab[data-tab="quiz"]');
      if (tab) switchNdTab('quiz', tab);
    }, 80);
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
    // Prevent the browser from restoring a previous free-form prompt on page load.
    const freeInput = document.getElementById('ld-ai-input');
    if (freeInput) freeInput.value = '';
    ldRenderContinue();
    ldRenderNodes('all');
    ldRenderResources();
    _updateQbBadge();
    document.getElementById('ld-ai-input')?.addEventListener('input', ldUpdateGenerateState);
    ldUpdateGenerateState();
    const profile = ldProfileLoad();
    ldArrangeDashboard(Boolean(profile.role && profile.role !== '暂不确定'));
    const requestedPath = new URLSearchParams(window.location.search).get('path');
    const hashPath = window.location.hash.replace(/^#learn\//, '');
    const demoPath = requestedPath === 'ascend-c-demo' || window.location.hash === '#ascend-c-demo';
    const directPath = window.__cannInitialLearningPath === 'qwen3-npu-inference-baseline' || requestedPath === 'qwen3-npu-inference-baseline' || hashPath === 'qwen3-npu-inference-baseline' ? 'qwen3-npu-inference-baseline' : null;
    if (directPath) {
      ldShowRoadmap(directPath);
    } else if (demoPath) {
      ldOpenAscendCDemo();
    } else {
      ldOpenOnboarding(false);
    }
  });
