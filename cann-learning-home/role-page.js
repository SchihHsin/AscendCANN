(() => {
  const roles = {
    beginner: {
      name: '新手开发者',
      intro: '先用一节公共基础课认识 NPU 与 CANN，再按目标选择训练、推理、算子、应用或推荐方向。',
      heading: '从 CANN 基础开始',
      meta: '公共基础 · 约 2 小时',
      routes: [{
        title: 'CANN 基础第一课',
        description: '认识 NPU 与 CANN，完成第一次实践。',
        steps: ['人工智能基础', '认识 NPU', '认识 CANN', 'NPU 实践', 'MNIST 手写数字识别（可选）'],
        href: './resources.html#cann-basics', action: '查看基础课程'
      }, {
        title: '继续选择学习主线',
        description: '完成公共基础后，按目标进入对应方向。',
        steps: ['大模型训练或推理', 'Ascend C 算子开发', '应用开发或推荐系统'],
        href: './resources.html#resource-path-details', action: '浏览五条学习主线'
      }],
      resources: [
        ['第一课：CANN 基础', '5 个入门单元，约 2 小时，含可选 MNIST 案例。', 'cann-basics'],
        ['先修知识清单', 'Python 与 NumPy 可开始第一课，其他基础按学习方向补充。', '前置基础按需补不用先全学完']
      ]
    },
    llm: {
      name: '大模型开发者',
      intro: '先补 CANN 公共基础，再根据目标进入大模型训练或推理路线；两条主线分别呈现阶段和课程。',
      heading: '选择训练或推理方向', meta: '两条学习主线',
      routes: [{
        title: '大模型训练', description: '从微调实践进入 SFT / RL 训练系列。',
        steps: ['SwanLab 微调案例', 'SFT / RL 初阶', 'SFT / RL 中阶', '高阶课程建设中'],
        href: './resources.html#mainline-training', action: '查看训练路线'
      }, {
        title: '大模型推理', description: '以 Qwen3 为主线，逐步完成推理与优化。',
        steps: ['跑通 Baseline', 'Profiling 分析', '融合优化与量化', '图模式调优'],
        href: './resources.html#mainline-inference', action: '查看推理路线'
      }],
      resources: [
        ['公共基础', 'CANN 基础第一课是五条主线的公共基础。', 'cann-basics'],
        ['大模型训练课程', '查看课程阶段、课件与在线实践状态。', 'mainline-training'],
        ['大模型推理课程', '查看 Qwen3 课程与配套课件。', 'mainline-inference']
      ]
    },
    operator: {
      name: '算子开发工程师',
      intro: '从短时体验进入 Ascend C 系统学习，再衔接工程开发与性能优化。',
      heading: '从体验算子到工程开发', meta: 'Ascend C · 体验、系统学习、实战',
      routes: [{
        title: '算子开发路线', description: '先跑通最小实践，再补齐编程和工程能力。',
        steps: ['10 分钟体验自定义算子与 API 调用', 'Ascend C 系统学习（约 12h）', '算子工程开发', '性能优化与精度校验'],
        href: './resources.html#mainline-operator', action: '查看算子课程'
      }],
      resources: [
        ['CANN 公共基础', '进入算子主线前可先完成第一课。', 'cann-basics'],
        ['CANNJudge 算子题库', '在线练习并通过赛事验证。', 'competition'],
        ['课程前置知识', '进入算子开发主线时再补 C / C++ 等基础。', '前置基础按需补不用先全学完']
      ]
    },
    application: {
      name: '应用开发工程师',
      intro: '围绕离线推理完成模型准备、ATC 编译、ACL 调用和性能调优。',
      heading: '离线推理应用路线', meta: 'YOLOv13 · ATC · ACL',
      routes: [{
        title: '应用开发（离线推理）', description: '从模型转换走到应用部署与调优。',
        steps: ['准备与导出模型', 'ATC 模型编译', 'ACL 推理调用', '性能调优'],
        href: './resources.html#mainline-appdev', action: '查看应用开发课程'
      }],
      resources: [
        ['CANN 公共基础', '认识 NPU、CANN 与基础实践。', 'cann-basics'],
        ['应用开发课程', '查看 YOLOv13 离线推理相关阶段和资源。', 'mainline-appdev']
      ]
    },
    aiapp: {
      name: 'AI 应用开发者',
      intro: '围绕 RAG 知识库问答实践，按文档处理、检索、模型服务和回答验证串起端到端流程。',
      heading: 'RAG 知识库问答实践', meta: '端到端应用开发',
      routes: [{
        title: 'AI 应用开发', description: '将知识库问答从资料准备推进到结果核验。',
        steps: ['文档处理', '向量检索', '本地模型服务', '来源引用与问答验证'],
        href: './resources.html#mainline-ai-appdev', action: '查看 AI 应用课程索引'
      }],
      resources: [
        ['AI 应用课程索引', '查看 RAG 知识库问答实践及相关学习入口。', 'mainline-ai-appdev'],
        ['在线与本地实践方式', '按课程已有支持选择 Notebook、CANNLab 或本地运行。', 'practice-modes']
      ]
    },
    recommender: {
      name: '推荐算法工程师',
      intro: '从 CTR 排序开始，逐步进入召回、多任务建模、工程化与 NPU 推理优化。',
      heading: '推荐系统学习路线', meta: 'CTR · 召回 · NPU',
      routes: [{
        title: '推荐系统', description: '从模型与实验进入工程实践和 NPU 推理。',
        steps: ['DeepFM CTR', 'DIN / DSSM / 多任务', '实验跟踪与工程化', 'NPU 推理优化'],
        href: './resources.html#mainline-recsys', action: '查看推荐系统课程'
      }],
      resources: [
        ['CANN 公共基础', '五条学习主线的公共基础课程。', 'cann-basics'],
        ['推荐系统课程', '查看 CTR、召回、工程化和推理优化的课程。', 'mainline-recsys']
      ]
    },
    teacher: {
      name: '高校老师',
      intro: '从课程提纲出发，按教学目标组织课程，再把学生衔接到学习路径和实践资源。',
      heading: '课程提纲 → 教学组织 → 学生实践', meta: '教师教学支持',
      routes: [{
        title: '组织一门昇腾课程', description: '以 135 门原子课程为基础，组合教学内容并衔接学生学习。',
        steps: ['课程提纲：四层技术栈 × 初级 / 中级 / 高级', '教学组织：启航营、传统学科、新增课程与教材', '学生学习：基础课程、学习主线与实践环境'],
        href: './resources.html#resource-teaching-card', action: '查看课程大纲与教学资料'
      }],
      resources: [
        ['原子课程总纲', '135 门课程，覆盖四层技术栈和三个难度级别。', 'resource-teaching-card'],
        ['教学方案与课程共建', '查看启航营、传统学科、新增课程、教材和高校共建内容。', 'resource-teaching-card'],
        ['学生学习入口', 'CANN 基础第一课、五条主线和边学边练资源。', 'resource-preparation']
      ]
    },
    competition: {
      name: '竞赛选手',
      intro: '先补算子开发基础，再用题库练习和赛事任务检验实现能力。',
      heading: '从算子学习到赛事练习', meta: 'CANNJudge · CANN 大赛',
      routes: [{
        title: '算子竞赛准备', description: '以 Ascend C 学习路线补足开发能力，再进入题库和赛事。',
        steps: ['体验自定义算子', '学习 Ascend C 编程', '完成算子题库练习', '报名参加 CANN 大赛'],
        href: './resources.html#competition', action: '查看赛事备考专区'
      }],
      resources: [
        ['赛事备考专区', '查看 CANNJudge、竞赛入口与备赛资源。', 'competition'],
        ['Ascend C 算子课程', '从快速体验进入系统学习和工程实战。', 'mainline-operator']
      ]
    },
    community: {
      name: '社区开发者',
      intro: '通过技术博客和科研案例了解实践经验，也可以贡献教程与案例共建学习资源。',
      heading: '阅读实践经验并参与共建', meta: '技术博客 · 科研案例 · 内容贡献',
      routes: [{
        title: '社区参与路径', description: '从阅读现有实践，到分享经验和参与学习仓共建。',
        steps: ['阅读技术博客', '浏览科研案例', '提交教程或实践案例'],
        href: './resources.html#resource-community-card', action: '查看社区资源与贡献方式'
      }],
      resources: [
        ['技术博客', '查看算子、推理和训练方向的技术文章。', '技术博客'],
        ['科研案例', '查看社区实践与科研案例。', '科研案例'],
        ['参与贡献', '了解如何贡献教程与案例。', '参与贡献']
      ]
    }
  };

  const id = new URLSearchParams(location.search).get('role') || 'beginner';
  const role = roles[id] || roles.beginner;
  const title = document.getElementById('role-title');
  const intro = document.getElementById('role-intro');
  const heading = document.getElementById('route-heading');
  const meta = document.getElementById('route-meta');
  const routes = document.getElementById('route-steps');
  const resourceGrid = document.getElementById('role-resource-grid');
  const primaryAction = document.getElementById('role-primary');
  const linkTo = (anchor) => `./resources.html#${encodeURIComponent(anchor)}`;

  document.title = `${role.name} · CANN Learning Hub`;
  if (title) title.textContent = role.name;
  if (intro) intro.textContent = role.intro;
  if (heading) heading.textContent = role.heading;
  if (meta) meta.textContent = role.meta;
  if (primaryAction && role.routes[0]) {
    primaryAction.href = role.routes[0].href;
    primaryAction.firstChild.textContent = '打开重点课程资料 ';
  }

  if (routes) {
    routes.innerHTML = role.routes.map((route) => `
      <article class="route-card">
        <h3>${route.title}</h3><p>${route.description}</p>
        <ol>${route.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
        <a class="route-action" href="${route.href}">${route.action}<span aria-hidden="true">→</span></a>
      </article>`).join('');
  }
  if (resourceGrid) {
    resourceGrid.innerHTML = role.resources.map(([name, description, anchor]) => `
      <a class="role-resource" href="${linkTo(anchor)}"><strong>${name}</strong><p>${description}</p><span>打开对应资料 →</span></a>`).join('');
  }
})();
