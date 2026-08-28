import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpenText, Brain, CaretDown, CaretRight, Check,
  CheckCircle, Clock, Copy, FileText, GitDiff, Info, Lightbulb, ListChecks,
  LockSimple, PaperPlaneTilt, Play, Robot, ShieldCheck, Sparkle, TerminalWindow,
  TrendUp, WarningCircle, X,
} from '@phosphor-icons/react';

const pathNodes = [
  { id: 1, title: '环境预检', duration: '约 45 分钟' },
  { id: 2, title: '推理基础', duration: '约 2 小时' },
  { id: 3, title: '运行时配置', duration: '约 2.5 小时' },
  { id: 4, title: '首次部署', duration: '约 3 小时' },
  { id: 5, title: '结果验证', duration: '约 1.5 小时' },
  { id: 6, title: '常见错误排查', duration: '约 2 小时' },
  { id: 7, title: '性能与交付', duration: '约 3–5 小时' },
];

const demoSteps = ['看懂路径', '学习节点', '动手运行', '处理失败', '调整路径', '验证完成'];

function IconButton({ label, children, onClick, disabled }) {
  return <button className="icon-button" aria-label={label} title={label} onClick={onClick} disabled={disabled}>{children}</button>;
}

function TopNavigation() {
  return (
    <header className="top-nav">
      <div className="brand-lockup"><img src="/assets/Ascendlogo.svg" alt="Ascend" /><strong>开发者</strong></div>
      <nav aria-label="主导航">
        <a href="#home">主页</a><a href="#develop">开发</a><a href="#docs">文档</a><a href="#events">活动</a>
        <a href="#learn" className="active">学习</a><a href="#forum">论坛</a><a href="#blog">博客</a><a href="#plan">开发者计划</a>
      </nav>
      <div className="nav-actions"><button>下载 <CaretDown size={14} /></button><button>支持</button><button>积分兑换 <span>NEW</span></button></div>
    </header>
  );
}

function GoalHeader({ onEvidence }) {
  return (
    <div className="goal-header"><div><span className="eyebrow">AI 生成的学习路径</span><h1>在昇腾 910B 上完成 Qwen3 推理部署，<br />一周内跑通并学会排错</h1>
      <div className="goal-meta"><span>Ascend 910B（单卡）</span><i /><span>CANN 8.0.RC2</span><i /><span>PyTorch 2.3</span><i /><span>18–24 小时</span><button onClick={onEvidence}>查看任务与生成依据 <CaretRight size={14} /></button></div>
    </div></div>
  );
}

function EvidenceSheet({ open, onClose }) {
  if (!open) return null;
  return (
    <aside className="floating-sheet evidence-sheet" aria-label="任务与生成依据">
      <div className="sheet-title"><div><ShieldCheck size={20} /><b>任务与生成依据</b></div><IconButton label="关闭" onClick={onClose}><X size={18} /></IconButton></div>
      <p>AI 根据你的目标、环境、时间与已验证能力生成路径。以下信息不会成为学习主导航。</p>
      <dl><div><dt>真实交付</dt><dd>部署服务、健康检查通过、输出排错清单</dd></div><div><dt>能力起点</dt><dd>已掌握 Linux、Python 与 PyTorch 基础</dd></div><div><dt>约束</dt><dd>一周完成；单卡 910B；优先跑通再优化</dd></div></dl>
      <div className="evidence-sources"><span><CheckCircle size={15} weight="fill" />官方文档</span><span><CheckCircle size={15} weight="fill" />兼容矩阵</span><span><CheckCircle size={15} weight="fill" />社区验证案例</span></div>
    </aside>
  );
}

function NodeTrail({ onStart }) {
  return (
    <div className="trail-canvas">
      <div className="trail-start" />
      <div className="trail-line line-a" /><div className="trail-line line-b" /><div className="trail-line line-c" /><div className="trail-line line-d" />
      {pathNodes.map((node, index) => <button key={node.id} className={`trail-node trail-node-${node.id} ${index === 0 ? 'selected' : ''}`}><span>{String(node.id).padStart(2, '0')}</span><b>{node.title}</b><small>{node.duration}</small>{index > 0 && <LockSimple size={14} />}</button>)}
      <article className="why-card"><div className="card-kicker"><Lightbulb size={20} weight="fill" />为什么先学这个</div><p>先确认 910B、驱动、CANN 与 PyTorch 环境可用，能避免把环境问题误判为模型或代码问题。</p>
        <div className="why-stats"><div><Clock size={18} /><span>预计时长<b>约 45 分钟</b></span></div><div><ShieldCheck size={18} /><span>成功信号<b>8 项预检全部通过</b></span></div></div>
        <ul><li>检查硬件与系统状态</li><li>验证 CANN、驱动与 PyTorch 版本</li><li>生成环境指纹，供后续失败定位</li></ul><button className="primary" onClick={onStart}>开始学习 <ArrowRight size={17} /></button>
      </article>
      <article className="journey-preview"><b>接下来，界面会跟着任务改变</b><div><BookOpenText size={20} /><span><strong>学习当前节点</strong><small>讲解与练习围绕本节点展开</small></span></div><div><TerminalWindow size={20} /><span><strong>运行成为主画布</strong><small>HiDevLab 承接代码、日志与验证</small></span></div><div><GitDiff size={20} /><span><strong>失败后才出现调整</strong><small>AI 用执行证据提出路径 diff</small></span></div></article>
    </div>
  );
}

function AiAdjuster() {
  const [text, setText] = useState(''); const [notice, setNotice] = useState('');
  const apply = value => { setText(value); setNotice('已生成调整预览，应用前会展示时长与依赖影响。'); };
  return <aside className="floating-sheet ai-adjuster"><div className="sheet-title"><div><Sparkle size={19} weight="fill" /><b>AI 调整路径</b></div><span>按需出现</span></div><p>告诉我新的时间、已掌握内容或优先目标。</p>
    <div className="composer"><input value={text} onChange={e => setText(e.target.value)} placeholder="例如：我只有周末时间…" /><button onClick={() => apply(text || '我只有周末时间')}><PaperPlaneTilt size={18} weight="fill" /></button></div>
    <div className="quick-prompts"><button onClick={() => apply('我只有周末时间')}>只有周末可学</button><button onClick={() => apply('我已掌握 PyTorch')}>已掌握 PyTorch</button><button onClick={() => apply('优先跑通再深入')}>优先跑通</button></div>{notice && <div className="inline-notice"><Info size={15} />{notice}</div>}
  </aside>;
}

function OverviewScene({ go, evidenceOpen, setEvidenceOpen }) {
  return <main className="scene overview-scene"><GoalHeader onEvidence={() => setEvidenceOpen(true)} /><NodeTrail onStart={() => go(1)} /><AiAdjuster /><EvidenceSheet open={evidenceOpen} onClose={() => setEvidenceOpen(false)} /></main>;
}

function LearnScene({ go }) {
  return (
    <main className="scene learn-scene"><div className="focus-heading"><button className="text-button" onClick={() => go(0)}><ArrowLeft size={16} />路径总览</button><span>节点 01 · 环境预检</span><h1>先建立可信环境，再开始部署</h1><p>这一节点只回答一个问题：当前 910B 环境是否具备运行 Qwen3 的前提。</p></div>
      <section className="learn-canvas"><article className="lesson-hero"><div className="lesson-label"><BookOpenText size={19} />核心讲解 · 6 分钟</div><h2>环境指纹比“我装过 CANN”更可靠</h2><p>版本、驱动、设备、框架与环境变量共同决定一次运行是否可复现。平台会把它们整理成同一份环境指纹，后续日志自动携带。</p><div className="concept-strip"><span>硬件状态</span><CaretRight size={15} /><span>驱动与固件</span><CaretRight size={15} /><span>CANN Toolkit</span><CaretRight size={15} /><span>框架适配</span></div></article>
        <article className="knowledge-block"><span className="eyebrow">你需要理解</span><h3>四层版本必须彼此兼容</h3><div className="layer-list"><div><b>01</b><span>Ascend 910B</span><small>硬件与固件</small></div><div><b>02</b><span>Driver 24.1</span><small>设备运行层</small></div><div><b>03</b><span>CANN 8.0.RC2</span><small>算子与运行时</small></div><div><b>04</b><span>torch_npu 2.3</span><small>框架适配层</small></div></div></article>
        <aside className="coach-inline"><div><Robot size={21} weight="fill" /><b>学习助手</b></div><p>先不记版本号。你认为哪一层不匹配时最可能导致 Runtime 初始化失败？</p><div className="quick-prompts"><button>驱动层</button><button>CANN 层</button><button>框架层</button></div></aside>
      </section><div className="scene-action"><span><Clock size={16} />已学习 8 分钟 · 下一步进行环境预检</span><button className="primary" onClick={() => go(2)}>开始动手预检 <ArrowRight size={17} /></button></div>
    </main>
  );
}

const precheckCommand = `python3 ascend_precheck.py \\\n  --device 0 \\\n  --framework pytorch \\\n  --export-fingerprint`;

function PracticeScene({ go }) {
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);
  const signalState = ran ? ['pass', 'pass', 'fail'] : ['ready', 'ready', 'ready'];
  return <main className="scene practice-scene">
    <div className="context-heading">
      <div className="context-crumbs"><button onClick={() => go(0)}><ArrowLeft size={15} />返回学习路径</button><span>/</span><b>节点 01 · 环境预检</b><span>/</span><strong>动手练习</strong></div>
      <div className="context-copy"><div><span className="eyebrow">HiDevLab · 任务工作台</span><h1>运行环境预检并生成指纹</h1><p>完成条件：获得 8 项检查结果，并导出 <code>ascend-env.json</code></p></div><button className="secondary" onClick={() => go(1)}><BookOpenText size={17} />查看讲解</button></div>
    </div>
    <section className="practice-workbench">
      <aside className="task-panel">
        <div className="panel-heading"><span>当前任务</span><b>01 / 03</b></div>
        <h2>确认运行环境是否可用</h2>
        <p>先执行只读预检，再根据实际输出决定当前节点是否完成。</p>
        <div className="task-steps">
          <button className="done"><Check size={15} weight="bold" /><span><b>理解环境指纹</b><small>已完成 · 8 分钟</small></span></button>
          <button className="active"><Play size={15} weight="fill" /><span><b>运行环境预检</b><small>{ran ? '已运行 · 发现 1 个问题' : '当前步骤'}</small></span></button>
          <button><ShieldCheck size={15} /><span><b>确认验证信号</b><small>{ran ? '等待处理失败项' : '运行后自动开始'}</small></span></button>
        </div>
        <div className="environment-facts"><span>Ascend 910B</span><span>CANN 8.0.RC2</span><span>PyTorch 2.3</span></div>
        <div className="safety-note"><ShieldCheck size={18} /><span><b>只读操作</b>不会修改驱动、CANN 或设备配置。</span></div>
      </aside>

      <section className="lab-main" aria-label="HiDevLab 运行环境">
        <div className="lab-command-head"><div><span>待执行命令</span><b>ascend_precheck.py</b></div><button onClick={() => { navigator.clipboard?.writeText(precheckCommand); setCopied(true); }}><Copy size={17} />{copied ? '已复制' : '复制命令'}</button></div>
        <pre className="workbench-command"><code>{precheckCommand}</code></pre>
        <div className="terminal-shell workbench-terminal">
          <div className="terminal-head"><span><TerminalWindow size={17} />HiDevLab · Ascend 910B · /workspace/qwen3</span><div><i /><i /><i /></div></div>
          <div className={`terminal-session ${ran ? 'has-result' : ''}`}>
            <div className="terminal-prompt"><span>$</span><code>python3 ascend_precheck.py --device 0 --framework pytorch --export-fingerprint</code></div>
            {!ran ? <div className="terminal-ready"><b>工作区已连接，命令和环境参数已准备完成</b><span>运行后，设备、驱动、运行时与框架结果会直接写入本次学习证据。</span></div> : <pre className="terminal-result"><code><span className="ok">[PASS] Device detected: Ascend 910B</span>{'\n'}<span className="ok">[PASS] Driver version: 24.1</span>{'\n'}<span className="error-line">[FAIL] Ascend Runtime initialization · ErrorCode 507001</span>{'\n'}ASCEND_HOME_PATH is not set in current session{'\n'}<span className="muted">Fingerprint exported: ./ascend-env.json</span></code></pre>}
          </div>
          <div className="terminal-actions"><span><Info size={15} />{ran ? '结果已关联到节点 01，可进入诊断与路径调整。' : '预计运行 5–10 秒，不会更改当前环境。'}</span><button className="primary" onClick={() => ran ? go(3) : setRan(true)}>{ran ? <WarningCircle size={17} weight="fill" /> : <Play size={17} weight="fill" />}{ran ? '查看失败诊断' : '运行预检'}</button></div>
        </div>
      </section>

      <aside className="verification-panel">
        <div className="panel-heading"><span>验证信号</span><b>{ran ? '2 / 3' : '待运行'}</b></div>
        <h2>运行结果决定下一步</h2>
        <div className="signal-list">
          {[
            ['设备可见', 'npu-smi 返回 Ascend 910B'],
            ['驱动匹配', 'Driver 24.1 与固件兼容'],
            ['运行时可用', 'AscendCL initialize: PASS'],
          ].map((item, index) => <div className={`signal-item ${signalState[index]}`} key={item[0]}><span>{signalState[index] === 'pass' ? <Check size={15} weight="bold" /> : signalState[index] === 'fail' ? <X size={15} weight="bold" /> : <Clock size={15} />}</span><div><b>{item[0]}</b><small>{signalState[index] === 'fail' ? '未通过 · ErrorCode 507001' : item[1]}</small></div></div>)}
        </div>
        <div className={`coach-note ${ran ? 'alert' : ''}`}><Robot size={20} weight="fill" /><div><b>{ran ? 'AI 已定位到运行时层' : 'AI 会观察实际证据'}</b><p>{ran ? '设备和驱动已经通过，不需要重做整个节点；下一步只补一个最小修复任务。' : '运行前不猜答案；运行后才根据日志给出最小提示或调整建议。'}</p></div></div>
      </aside>
    </section>
  </main>;
}

function FailureScene({ go }) {
  return <main className="scene failure-scene"><div className="lab-heading"><div><span className="eyebrow error">节点 01 · 运行结果</span><h1>预检未通过，但无需离开当前任务</h1><p>失败证据已关联到本次学习会话。</p></div><button className="secondary"><FileText size={17} />下载诊断包</button></div>
    <section className="failure-canvas"><div className="terminal-shell error-terminal"><div className="terminal-head"><span><TerminalWindow size={17} />HiDevLab · 环境预检</span><span>运行 6.02s · 退出码 1</span></div><pre><code><span className="ok">[PASS] Device detected: Ascend 910B</span>{'\n'}<span className="ok">[PASS] Driver version: 24.1</span>{'\n'}<span className="error-line">[FAIL] Ascend Runtime initialization</span>{'\n'}<span className="error-line">ErrorCode: 507001</span>{'\n'}ASCEND_HOME_PATH is not set in current session{'\n'}Suggested check: source /usr/local/Ascend/ascend-toolkit/set_env.sh</code></pre></div>
      <aside className="diagnosis-popover"><div className="diagnosis-title"><WarningCircle size={22} weight="fill" /><div><span>AI 诊断 · 基于第 3–5 行</span><b>运行时环境未完成初始化</b></div></div><p>设备与驱动已经通过，问题集中在 CANN 环境变量。先补一个 20 分钟微任务，比继续学习后续内容更有效。</p><div className="evidence-chain"><span><Check size={14} />设备通过</span><CaretRight size={14} /><span><Check size={14} />驱动通过</span><CaretRight size={14} /><span className="failed"><X size={14} />运行时失败</span></div><button className="primary" onClick={() => go(4)}>查看路径调整建议 <GitDiff size={17} /></button><button className="text-button">先按官方步骤尝试修复</button></aside>
    </section>
  </main>;
}

function ReplanScene({ go }) {
  const [applied, setApplied] = useState(false);
  return <main className="scene replan-scene"><div className="focus-heading"><span>AI 路径调整 · 基于运行证据</span><h1>只插入一个缺口任务，不推翻整条路径</h1><p>调整前先展示原因、依赖和时间影响；由你决定是否应用。</p></div>
    <section className="replan-canvas"><div className="diff-path before"><span>原计划</span><div><b>01</b><strong>环境预检</strong><small>未通过</small></div><i /><div><b>02</b><strong>推理基础</strong><small>待开始</small></div><i /><div><b>03</b><strong>运行时配置</strong><small>待开始</small></div></div>
      <div className="diff-path after"><span>调整后</span><div><b>01</b><strong>环境预检</strong><small>保留失败证据</small></div><i /><div className="inserted"><b>01A</b><strong>修复 CANN 环境</strong><small>新增 · 20 分钟</small></div><i /><div><b>02</b><strong>推理基础</strong><small>顺延 20 分钟</small></div></div>
      <article className="impact-panel"><div className="card-kicker"><GitDiff size={20} />为什么调整</div><p>运行证据已证明设备与驱动可用，只需补齐 CANN 环境变量并复跑；无需重复学习环境概念。</p><dl><div><dt>总时长</dt><dd>18 小时 → <b>18 小时 20 分</b></dd></div><div><dt>依赖变化</dt><dd>节点 02 需等待 01A 通过</dd></div><div><dt>可回滚</dt><dd>保留 v1.0，可随时恢复</dd></div></dl><div className="impact-actions"><button className="secondary">保持原计划</button><button className="primary" onClick={() => { setApplied(true); setTimeout(() => go(5), 700); }}>{applied ? <Check size={17} /> : <GitDiff size={17} />}{applied ? '已应用，进入验证' : '应用并执行微任务'}</button></div></article>
    </section>
  </main>;
}

function CompletionScene({ go }) {
  return <main className="scene completion-scene"><section className="completion-hero"><CheckCircle size={58} weight="fill" /><span className="eyebrow">7 / 7 节点完成 · 已验证</span><h1>你已完成 Qwen3 首次部署，并留下可复用证据</h1><p>不是“看完课程”，而是关键命令、输出、日志与排错过程均满足任务验收条件。</p></section>
    <section className="completion-canvas"><article className="receipt-panel"><div className="card-kicker"><ShieldCheck size={20} />验证回执</div><h2>Qwen3 推理服务 · Ascend 910B</h2><div className="receipt-grid"><div><span>服务启动</span><b><CheckCircle size={17} weight="fill" />通过</b><small>Uvicorn running on :8000</small></div><div><span>健康检查</span><b><CheckCircle size={17} weight="fill" />通过</b><small>GET /health → 200 OK</small></div><div><span>推理结果</span><b><CheckCircle size={17} weight="fill" />通过</b><small>基准问题输出稳定</small></div><div><span>排错能力</span><b><CheckCircle size={17} weight="fill" />通过</b><small>独立修复 ErrorCode 507001</small></div></div><button className="primary"><FileText size={17} />导出学习与验证报告</button></article>
      <article className="skill-evidence-panel"><div className="card-kicker"><Brain size={20} />能力证据已更新</div><div className="skill-ring"><span>82</span><small>推理部署<br />可信度</small></div><ul><li><Check size={15} />环境兼容判断</li><li><Check size={15} />推理服务部署</li><li><Check size={15} />常见错误定位</li><li><TrendUp size={15} />性能调优待加强</li></ul></article>
      <article className="memory-panel"><div className="card-kicker"><Sparkle size={20} weight="fill" />这次失败已成为下次的起点</div><p>环境指纹、修复命令和适用版本已写入个人学习记忆；下一条路径不再重复询问。</p><button className="secondary" onClick={() => go(0)}>回看完整路径</button><button className="text-button">提交为社区案例</button></article>
    </section>
  </main>;
}

function DemoController({ scene, go }) {
  return <aside className="demo-controller" aria-label="旅程演示控制"><span><b>旅程演示</b><small>{String(scene + 1).padStart(2, '0')} / 06 · {demoSteps[scene]}</small></span><div><IconButton label="上一步" disabled={scene === 0} onClick={() => go(scene - 1)}><ArrowLeft size={17} /></IconButton><IconButton label="下一步" disabled={scene === 5} onClick={() => go(scene + 1)}><ArrowRight size={17} /></IconButton></div></aside>;
}

export function App() {
  const initial = useMemo(() => { const match = window.location.hash.match(/scene-(\d)/); return match ? Math.max(0, Math.min(5, Number(match[1]) - 1)) : 0; }, []);
  const [scene, setScene] = useState(initial); const [evidenceOpen, setEvidenceOpen] = useState(false);
  const go = next => { const safe = Math.max(0, Math.min(5, next)); setScene(safe); setEvidenceOpen(false); window.location.hash = `scene-${safe + 1}`; window.scrollTo({ top: 0, behavior: 'smooth' }); };
  useEffect(() => { const onKey = event => { if (event.key === 'ArrowRight') go(scene + 1); if (event.key === 'ArrowLeft') go(scene - 1); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [scene]);
  return <div className={`app scene-${scene + 1}`}><TopNavigation />
    {scene === 0 && <OverviewScene go={go} evidenceOpen={evidenceOpen} setEvidenceOpen={setEvidenceOpen} />}{scene === 1 && <LearnScene go={go} />}{scene === 2 && <PracticeScene go={go} />}{scene === 3 && <FailureScene go={go} />}{scene === 4 && <ReplanScene go={go} />}{scene === 5 && <CompletionScene go={go} />}<DemoController scene={scene} go={go} /></div>;
}
