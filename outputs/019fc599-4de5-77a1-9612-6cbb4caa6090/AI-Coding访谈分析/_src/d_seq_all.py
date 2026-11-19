# -*- coding: utf-8 -*-
"""全景时序图：一条任务从需求到合入，把工具与知识源都画进参与者。"""
from d_seq2 import M, seq_slide

DEV, AIA, ENV = 'dev', 'ai', 'env'
SITE, REPO, OTHER, TEAM = 'site', 'repo', 'other', 'team'

PARTS = [
    {'id': DEV, 'label': '开发者', 'color': '#2F3D63'},
    {'id': AIA, 'label': 'AI 助手', 'color': '#6B5BA8'},
    {'id': ENV, 'label': '环境与工具', 'color': '#3F7D72'},
    {'id': SITE, 'label': '昇腾社区官网', 'color': '#8A6A3C'},
    {'id': REPO, 'label': 'GitHub / GitCode', 'color': '#7B8A3C'},
    {'id': OTHER, 'label': '其他知识来源', 'color': '#9C6B8A'},
    {'id': TEAM, 'label': '团队', 'color': '#45536B'},
]

ALLSEQ = seq_slide({
    'title': '一条任务的全景：AI 卡在工具和知识之间',
    'participants': PARTS,
    'phases': [
        (0, 0, '01 开工', 'human'),
        (1, 1, '02 找知识', 'human'),
        (2, 2, '03 交办', 'human'),
        (3, 3, '04 AI 执行', 'ai'),
        (4, 4, '05 验收', 'human'),
        (5, 5, '06 沉淀', 'human'),
    ],
    'steps': [
        {'node': {'actor': DEV, 'kind': 'action', 'title': '接需求 / 切题目',
                  'detail': '企业接需求单，学生从课题里切出能做的任务'},
         'msgs': [M(DEV, TEAM, '要需求与验收标准'), M(TEAM, DEV, '需求单 / 导师目标')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '自己查：官网看定义，仓库看用法',
                  'detail': '"单个 API 有文档，API 之间怎么配合没有"——两份知识要人拼起来'},
         'msgs': [M(DEV, SITE, '查接口 / 工具指南'), M(SITE, DEV, '定义、参数、限制'),
                  M(DEV, REPO, '找样例、翻 issue'), M(REPO, DEV, '别人怎么组合')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '把知识搬进对话',
                  'detail': '详设 + 文档片段 + 样例链接，全靠人贴'},
         'msgs': [M(DEV, OTHER, '查论文 / 内部 wiki'),
                  M(DEV, AIA, '贴详设 + 文档 + 样例', 'AI 拿到的是人加工过的二手知识', red=True)]},
        {'node': {'actor': AIA, 'kind': 'action', 'title': '读仓库、写、跑',
                  'detail': 'AI 能碰到的是文件系统和终端，碰不到专业工具与文档站'},
         'msgs': [M(AIA, ENV, '读文件 / 跑命令'), M(ENV, AIA, '报错与日志')]},
        {'node': {'actor': DEV, 'kind': 'decision', 'title': '过没过？',
                  'detail': '精度对 golden、性能对 baseline，人看工具输出下判断'},
         'msgs': [M(DEV, ENV, '跑测试 / msOpProf / Insight'), M(ENV, DEV, '指标与指令流水'),
                  M(DEV, AIA, '把性能数据贴回来让它改', '工具输出没有直接进 AI 上下文', red=True)]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '写回、提 PR、等评审',
                  'detail': '详设回写、wiki 沉淀、committer 检视'},
         'msgs': [M(DEV, TEAM, '提 PR，等 committer'), M(TEAM, DEV, '评审意见'),
                  M(DEV, OTHER, '沉淀到 wiki / 设计文档')]},
    ],
}, '过程 · 全景（七类参与者）',
    '一条真实任务从需求走到合入。<b>AI 只连到文件系统和终端</b>，专业工具与知识源都在它够不到的地方。',
    '除“AI 执行”一段，其余五段都在人这边：<b>人既是执行者，也是运输工</b>。',
    '两组红色箭头＝人肉中转：知识搬进去、工具结果搬回来')
