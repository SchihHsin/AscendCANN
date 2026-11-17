"""Build the interview deck and four editable journey maps from pinned local sources."""
from pathlib import Path
import base64
import html
import json
import re

HERE = Path(__file__).resolve().parent
SKILLS = Path('/Users/hsin/.codex/skills')
EVIDENCE = json.loads((HERE / 'evidence.json').read_text())
QUOTES = {item['id']: item for item in EVIDENCE['quotes']}
JOURNEY_TEMPLATE = (SKILLS / 'ai-user-journey/assets/reference-dual-journey.html').read_text()
JOURNEY_CSS = re.search(r'<style>(.*?)</style>', JOURNEY_TEMPLATE, re.S)[1]
AVATARS = re.findall(r'class="avatar" src="([^"]+)"', JOURNEY_TEMPLATE)
ICONS = re.search(r'const icons = (\{.*?\n\});', JOURNEY_TEMPLATE, re.S)[1]


def esc(value):
    return html.escape(str(value), quote=True)


def quote_button(identifier):
    item = QUOTES[identifier]
    return f'<button class="evidence-ref" data-evidence="{identifier}">{item["participant"]} · {item["time"]} · {identifier}</button>'


def quotation(identifier):
    item = QUOTES[identifier]
    return f'<blockquote><p>“{esc(item["quote"])}”</p><footer>{quote_button(identifier)}</footer></blockquote>'


def avatar(role, mode):
    original = AVATARS[1 if role == 'student' else 0]
    if mode == 'learning' and role == 'student':
        return original
    svg = base64.b64decode(original.split(',')[1]).decode()
    svg = svg.replace('#ef923c', '#3b9699').replace('#e7842c', '#267a82')
    if mode == 'learning':
        svg = svg.replace('#e8f1f2', '#fff0db').replace('#66818b', '#c58b4d').replace('#4c6d7a', '#c07d30')
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()


JOURNEYS = [
    dict(id='student-development', role='student', mode='task', title='高校学生 · 研究开发',
         basis='王鹤锦为主，梁淼城、徐立桂作差异对照',
         scenario='以无人机跨视角定位研究为主要经历。先读论文、和老师讨论方法，再借 AI 探针检验方向，细化机制后实现。具体探针和后续实验记录未提供。',
         boundary='综合路径由研究者归纳。图中疑问与体验起伏为定性重建，纵向高度没有测量含义。最终实验效果与交付结局待补。',
         stages=['形成研究问题','查资料与讨论','探针与方向判断','实现与纠正','检查结果'],
         activities=['围绕实验问题找方法<br>任务来自研究活动','看论文、与老师讨论<br>再与 AI 讨论可行性','AI 写短探针快速尝试<br>本人判断是否继续','细化机制后交 AI 实现<br>效果差时核对模块接法','检查核心逻辑与结果<br>最终阈值 / 结局未记录'],
         thoughts=['这次实验要验证什么？','论文方法适合当前问题吗？','粗略探针支持继续投入吗？','AI 接入的模块符合我意思吗？','结果能支持研究判断吗？'],
         steps=[('target','选实验问题'),('document','阅读论文'),('users','与老师讨论'),('chat','AI 讨论可行性'),('signup','AI 写探针'),('check','判断方向'),('signup','AI 实现机制'),('tools','检查模块接法'),('search','检查核心逻辑'),('chart','查看实验结果')],
         pains={7:('模块接法与意图不一致','效果较差后重新说明意图','Q19')},
         notes=['明确研究问题','资料与讨论形成方向','探针加速初步尝试','纠正后继续交 AI','最终结果记录缺失'],
         refs=['Q04','Q19','Q42']),
    dict(id='student-learning', role='student', mode='learning', title='高校学生 · 主动学习',
         basis='王鹤锦 mini vLLM 经历为主，梁淼城补充掌握标准',
         scenario='为了学习框架，让 AI 列技术点与实现计划，按点自己写小型实现，再由 AI 指导和写测试。亲自实现是受访者主动选择的学习投入。',
         boundary='前四阶段有经历支持。末阶段的复现标准来自梁淼城，属跨案例补充。延迟回忆、独立迁移和学习效果待验证。',
         stages=['明确要学什么','拆解技术点','亲自实现','求助与测试','检查掌握程度'],
         activities=['以学习框架为目标<br>与快速验证任务分开','让 AI 列主要技术点<br>形成分点实现计划','每次实现一个点<br>代码由自己编写','和 AI 对话获取指导<br>功能实现后生成测试','看核心逻辑、判断复现<br>长期迁移未测量'],
         thoughts=['我需要做到什么程度？','哪些技术点需要逐一实现？','哪些细节要亲自写才理解？','AI 帮我解决后，我懂原因吗？','离开当前回答还能复现吗？'],
         steps=[('target','明确学习目标'),('chat','向 AI 说明目标'),('document','AI 列技术点'),('calendar','拆分实现节奏'),('signup','本人逐点写代码'),('tools','暴露实现困难'),('chat','向 AI 求助'),('check','运行功能测试'),('search','检查核心逻辑'),('target','自评能否复现')],
         pains={5:('具体实现遇到很多小问题','亲自写代码仍遇到实现困难','Q49')},
         notes=['有明确学习目标','拆成可动手的技术点','亲自实现需要投入','解释与测试帮助修正','复现是自述标准'],
         refs=['Q20','Q21','Q25']),
    dict(id='employee-development', role='employee', mode='task', title='企业员工 · 算子开发',
         basis='王伟为主要案例，彭椒、郑雨豪用于补充差异',
         scenario='编写详设与验收要求，把 API 资料交给 AI 实现。本人通读、引用代码指出问题，结合精度 / 性能工具结果反复调整，随后清理结构并回写文档。',
         boundary='按王伟口述顺序重建，审查与执行反复交替。自报时间估计有重叠，图中阶段宽度不代表工时。具体日志、指标值与交付结局待补。',
         stages=['详设与验收','资料与基线','初版与人工审查','运行与优化','整理与回写'],
         activities=['写详细设计文档<br>说明框架、精度 / 性能要求','提供相关 API 链接<br>采集当前任务性能基线','AI 生成代码<br>本人通读、引用片段纠正','测试精度和性能<br>补新方向后再次实现','清理封装与变量传递<br>同步修改最初文档'],
         thoughts=['哪些边界和标准先说清？','资料能指导多个 API 配合吗？','每部分代码在做什么？','误差与性能支持继续吗？','后续维护能否理解这份代码？'],
         steps=[('document','本人写详设'),('target','设定测试要求'),('link','提供 API 资料'),('chart','采集性能基线'),('signup','AI 生成初版'),('search','本人通读代码'),('desktop','运行验证工具'),('tools','终止错误尝试'),('signup','清理代码结构'),('document','回写最初文档')],
         pains={5:('多余封装增加审查负担','代码结构增加理解与修改负担','Q39'),7:('长时间尝试方向仍不对','重新提供优化线索与方向','Q15')},
         notes=['用详设限定实现','准备资料和比较依据','理解代码后具体反馈','工具验证与人工判断交替','沉淀随文档迭代形成'],
         refs=['Q01','Q06','Q09','Q15','Q34','Q39']),
    dict(id='employee-learning', role='employee', mode='learning', title='企业员工 · 开发中学习',
         basis='王伟为主要案例，彭椒、郑雨豪补充学习观点',
         scenario='工作遇到问题时先找最相关知识，由 AI 快速读代码、日志帮助解释。主动学习则愿意了解背景和来龙去脉，进一步关联算子架构与流水。',
         boundary='图中工作问题路径有自述支持。主动学习的背景、架构、流水属于受访者描述的学习取向，完整执行顺序与学习成效待验证。',
         stages=['问题或主动兴趣','找到相关资料','AI 辅助理解','关联实现与运行','应用与整理'],
         activities=['工作阻塞触发学习<br>主动兴趣也可作为入口','工作中先找最相关知识<br>主动学习从背景展开','AI 快速读代码、日志<br>本人理解关键问题点','理解算子架构与流水<br>结合工具与实现解释','工作任务中应用线索<br>文档回写记录已有做法'],
         thoughts=['先解除阻塞，还是深入了解？','哪些内容与当前问题最相关？','这段抽象解释指什么？','架构、代码、流水怎样对应？','我能否在后续问题中使用？'],
         steps=[('tools','遇到工作问题'),('target','选定学习重点'),('search','找相关资料'),('document','主动补背景〔取向〕'),('desktop','AI 读代码日志'),('chat','按问题追问'),('search','理解抽象描述'),('chart','看架构流水〔取向〕'),('check','回到问题中应用'),('document','回写任务文档')],
         pains={6:('抽象词难对应实际对象','抽象描述难联系实际对象','Q27')},
         notes=['两类学习入口并存','任务影响解释范围','快速定位问题点','主动深学的顺序待验证','独立迁移效果待验证'],
         refs=['Q23','Q27','Q34'])
]

JOURNEY_EXTRA_CSS = '''
*{min-width:0;min-height:0}.stage-headings,.stage-grid,.doing-segments{grid-template-columns:repeat(5,minmax(0,1fr))}
.intro{height:190px}.intro-inner{grid-template-columns:40% 60%}.persona{gap:18px}.persona h1{font-size:25px}.knowledge{display:none}.job{margin-bottom:12px}.scenario{padding-top:12px;grid-template-columns:70px 1fr}.scenario-copy{font-size:13px}.scenario-copy p{margin-bottom:9px}.boundary{color:#6a7072}.sheet{grid-template-rows:48px 94px 82px 265px 252px}.stage-title{font-size:16px}.rail{font-size:17px}.stage-card{font-size:13px;line-height:1.5}.stage-card.thought{color:#62676b}.touch-label{font-size:12px;line-height:1.4;text-align:center}.touchpoint{width:43px;height:43px}.touch-label.pain-label{color:#a82d29;font-weight:600}.emotion-text{font-size:12px;line-height:1.4}.brands{font-size:12px;color:#686e74;font-weight:400}.bottom-note{text-align:left;font-size:12px;line-height:1.8;margin:10px 20px 22px}.journey-footer{font-size:12px;line-height:1.6;padding:6px 20px 14px;color:#6a7072}.journey .evidence-ref{border:0;padding:0;background:none;color:#526276;font-size:12px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}.journey .emotion-symbol{display:none}
'''


def journey_main(item):
    points=[]
    curve=[]
    for index, (icon, label) in enumerate(item['steps']):
        stage=index//2
        x=stage*20+(5 if index%2==0 else 14)
        pain=item['pains'].get(index)
        points.append(dict(x=x,y=65 if index%2==0 else 184,icon=icon,label=pain[0] if pain else label,red=bool(pain),lx=x-6,ly=99 if index%2==0 else 215,w=150))
        curve.append((x,198 if pain else (74 if index%2==0 else 110)))
    touch_paths=' '.join(f'M{a["x"]*10} {a["y"]} L{b["x"]*10} {b["y"]}' for a,b in zip(points,points[1:]))
    vertical=' '.join(f'M{p["x"]*10} {p["y"]+23} V265' for p in points if p['red'])
    dash=' '.join(f'M{x*10} 0 V{y}' for (x,y),p in zip(curve,points) if p['red'])
    dots=''.join(f'<span class="emotion-dot{" red" if p["red"] else ""}" style="left:{x}%;top:{y}px"></span>' for (x,y),p in zip(curve,points))
    feelings=[]
    for index,(x,y) in enumerate(curve):
        pain=item['pains'].get(index)
        text=pain[1] if pain else (item['notes'][index//2] if index%2==0 else '')
        if text:
            feelings.append(dict(x=x,y=min(220,y+18),w=175,text=text,pain=bool(pain)))
    kind=item['mode']
    task_name='touches' if kind=='task' else 'learningTouches'
    feeling_name='emotions' if kind=='task' else 'learningEmotionLabels'
    stages=''.join(f'<div class="stage-title">{i+1:02} {esc(t)}</div>' for i,t in enumerate(item['stages']))
    activities=''.join(f'<div class="stage-card"><p>{t}</p></div>' for t in item['activities'])
    thoughts=''.join(f'<div class="stage-card thought"><p>{esc(t)}</p></div>' for t in item['thoughts'])
    node_html=''.join(f'<div tabindex="0" class="touchpoint{" red" if p["red"] else ""}" style="left:{p["x"]}%;top:{p["y"]}px" title="{esc(p["label"])}"><svg viewBox="0 0 24 24" data-icon="{p["icon"]}"></svg></div><div class="touch-label{" pain-label" if p["red"] else ""}" style="left:clamp(3px,calc({p["x"]}% - 75px),calc(100% - 153px));top:{p["ly"]}px;width:150px">{esc(p["label"])}</div>' for p in points)
    feelings_html=''.join(f'<div class="emotion-text{" pain" if f["pain"] else ""}" style="left:clamp(3px,calc({f["x"]}% - 82px),calc(100% - 167px));top:{f["y"]}px;width:164px">{esc(f["text"])}</div>' for f in feelings)
    refs='　'.join(quote_button(q) for q in item['refs'])
    main=f'''<main id="{item['id']}" class="journey journey--{kind}">
<section class="intro"><div class="ribbon">{'高校学生' if item['role']=='student' else '企业员工'} · {'开发场景' if kind=='task' else '学习场景'}</div><div class="brands">访谈归纳 · 示例头像</div>
<div class="intro-inner"><div class="persona"><img alt="角色示意头像" class="avatar" src="{avatar(item['role'],kind)}"><div class="persona-copy"><h1>{item['title']}</h1><p class="job">{item['basis']}</p><div class="knowledge-label">日常使用 AI，同一角色可切换开发与学习目标</div></div></div>
<div class="scenario"><div class="scenario-label">情境</div><div class="scenario-copy"><p>{item['scenario']}</p><p class="boundary">{item['boundary']}</p></div></div></div></section>
<section class="sheet"><div class="rail rail-stages">阶段</div><div class="rail rail-site">{'开发活动' if kind=='task' else '学习活动'}</div><div class="rail rail-think">思考与疑问<br>〔研究重建〕</div><div class="rail rail-do">操作与交互<small>有材料支持的触点</small></div><div class="rail rail-feel">体验感受<br>〔定性重建〕</div>
<nav class="stage-headings">{stages}</nav><div class="stage-grid site">{activities}</div><div class="stage-grid thinking">{thoughts}</div>
<div class="doing"><div class="doing-segments"><div></div><div></div><div></div><div></div><div></div></div><svg class="touch-links" preserveAspectRatio="none" viewBox="0 0 1000 265"><path class="connection" d="{touch_paths}"></path><path class="vertical" d="{vertical}"></path></svg>{node_html}</div>
<div class="feeling"><svg class="emotion-chart" preserveAspectRatio="none" viewBox="0 0 1000 252"><polyline class="line" points="{' '.join(f'{x*10},{y}' for x,y in curve)}"></polyline><path class="dash" d="{dash}"></path></svg><div class="emotion-dots">{dots}</div>{feelings_html}</div></section>
<div class="journey-footer">原声回查　{refs}</div></main>'''
    data_script=f'const {task_name} = {json.dumps(points,ensure_ascii=False)};\nconst {feeling_name} = {json.dumps(feelings,ensure_ascii=False)};'
    # The skill validator reads its original JS object notation.
    data_script=re.sub(r'"(x|y|red|pain)":',r'\1:',data_script)
    return main,data_script


DIALOG_HTML='<dialog id="evidenceDialog"><button class="dialog-close" aria-label="关闭证据">×</button><div id="evidenceContent"></div></dialog>'
DIALOG_CSS='''
#evidenceDialog{max-width:800px;width:88vw;max-height:82vh;padding:32px;border:1px solid #dde1e7;border-radius:18px;color:#242a32;background:#fafbfc;box-shadow:0 24px 100px #0005;font-family:inherit;overflow:auto;margin:auto}#evidenceDialog::backdrop{background:#11182788;backdrop-filter:blur(6px)}#evidenceDialog h2{font-size:22px;margin:12px 0}#evidenceDialog p{font-size:16px;line-height:1.8;margin:14px 0}#evidenceDialog .meta{font-size:13px;color:#626b79;word-break:break-all}#evidenceDialog .raw{padding:18px;background:white;border-radius:12px}#evidenceDialog .dialog-close{position:absolute;right:16px;top:8px;padding:8px;border:0;background:none;font-size:25px;cursor:pointer}#evidenceDialog details{padding-top:16px;font-size:15px;line-height:1.8}#evidenceDialog summary{cursor:pointer}#evidenceDialog:focus{outline:none}
'''
DIALOG_JS='''
const interviewEvidence = QUOTE_DATA;
const evidenceDialog = document.getElementById('evidenceDialog');
function textElement(tag, value, className) {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
}
function showEvidence(identifier) {
  const item = interviewEvidence.find(quote => quote.id === identifier);
  if (!item) return;
  const content = document.getElementById('evidenceContent');
  content.replaceChildren();
  content.append(textElement('p', item.id + ' · ' + item.provenance, 'meta'));
  content.append(textElement('h2', item.participant + ' · ' + item.time));
  content.append(textElement('p', '“' + item.quote + '”', 'raw'));
  content.append(textElement('p', '来源　' + item.source + '　话轮 ' + item.turn, 'meta'));
  const details = document.createElement('details');
  details.append(textElement('summary', '查看所在话轮'));
  details.append(textElement('p', item.context));
  content.append(details);
  evidenceDialog.showModal();
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-evidence]');
  if (button) showEvidence(button.dataset.evidence);
});
evidenceDialog.querySelector('.dialog-close').onclick = () => evidenceDialog.close();
evidenceDialog.addEventListener('click', event => { if (event.target === evidenceDialog) { const rect = evidenceDialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) evidenceDialog.close(); } });
document.addEventListener('keydown', event => { if(evidenceDialog.open) event.stopImmediatePropagation(); }, true);
'''.replace('QUOTE_DATA', json.dumps(EVIDENCE['quotes'],ensure_ascii=False).replace('</','<\\/'))


def standalone_journey(role):
    mains=[]
    scripts=[]
    for item in JOURNEYS:
        if item['role']==role:
            main,script=journey_main(item)
            mains.append(main)
            scripts.append(script)
    return f'''<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{'高校学生' if role=='student' else '企业员工'}开发与学习旅程</title><style>{JOURNEY_CSS}{JOURNEY_EXTRA_CSS}{DIALOG_CSS}</style></head><body>{''.join(mains)}<p class="bottom-note">研究范围为本批六人访谈。两条旅程由研究者归纳，情绪起伏未经量表测量。阶段宽度不表示时间。点击原声编号可回查。</p>{DIALOG_HTML}<script>const icons={ICONS};document.querySelectorAll('[data-icon]').forEach(node=>node.innerHTML=icons[node.dataset.icon]||icons.document);{''.join(scripts)}{DIALOG_JS}</script></body></html>'''


for role in ['student','employee']:
    (HERE/f'journey-{role}.html').write_text(standalone_journey(role))

CHAPTERS=['研究范围','画像与旅程','协作过程','习惯与偏好','知识与学习','五项发现','设计启示']
SLIDES=[]


def add_slide(chapter,title,body,layout='analysis',note='',refs=()):
    number=len(SLIDES)+1
    tabs=''.join(f'<span class="{"active" if chapter==i else ""}">{name}</span>' for i,name in enumerate(CHAPTERS))
    references='　'.join(quote_button(q) for q in refs)
    SLIDES.append(f'''<section class="slide s-gray interview-slide {layout}" data-title="{esc(title)}" data-chapter-label="{CHAPTERS[chapter]}">
<header class="head"><div class="head-l"><div class="brand"><h1 class="ttl">{title}</h1></div><div class="subttl">{['一','二','三','四','五','六','七'][chapter]}、{CHAPTERS[chapter]}</div></div><nav class="section-tabs">{tabs}</nav></header>
<div class="body-area">{body}</div><footer class="foot"><span>{note or '基于六人访谈的定性分析 · 原声摘录未经本轮复听'}</span><span>{references}</span></footer></section>''')
    return number


def svg_node(x,y,label,kind='normal',width=174,height=65):
    fill={'normal':'#ffffff','human':'#e7edf6','ai':'#ebeafb','risk':'#fff0ed','evidence':'#e4f3ee','dark':'#252c37'}[kind]
    color='#ffffff' if kind=='dark' else '#27303d'
    lines=label.split('|')
    text=''.join(f'<tspan x="{x+width/2}" dy="{0 if i==0 else 25}">{esc(line)}</tspan>' for i,line in enumerate(lines))
    top=y+height/2-(len(lines)-1)*12.5+6
    return f'<g><rect x="{x}" y="{y}" width="{width}" height="{height}" rx="13" fill="{fill}" stroke="#ccd3dd"/><text x="{x+width/2}" y="{top}" text-anchor="middle" fill="{color}" font-size="18" font-weight="500">{text}</text></g>'


def arrow(path, color='#7d8b9c', dashed=False):
    dash_attribute = 'stroke-dasharray="6 5"' if dashed else ''
    return f'<path d="{path}" fill="none" stroke="{color}" stroke-width="2" {dash_attribute} marker-end="url(#a)"/>'


SVG_SEQUENCE = 0

def svg_wrap(body,height=440):
    global SVG_SEQUENCE
    SVG_SEQUENCE += 1
    marker_id = f'arrow-{SVG_SEQUENCE}'
    body = body.replace('url(#a)', f'url(#{marker_id})')
    return f'<svg class="research-diagram" viewBox="0 0 1000 {height}" role="img" aria-label="研究机制关系图"><defs><marker id="{marker_id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#7d8b9c"/></marker></defs>{body}</svg>'


def cycle(labels,caption='',risk_index=None):
    positions=[(42,85),(293,85),(544,85),(544,280),(293,280),(42,280)]
    count=len(labels)
    positions=positions[:count]
    edges=[]
    for i in range(count-1):
        x,y=positions[i];nx,ny=positions[i+1]
        if ny==y and nx>x: edges.append(arrow(f'M{x+174} {y+32} H{nx-8}'))
        elif ny==y: edges.append(arrow(f'M{x} {y+32} H{nx+182}'))
        else: edges.append(arrow(f'M{x+87} {y+65} V{ny-8}'))
    nodes=''.join(svg_node(x,y,label,'risk' if i==risk_index else ('human' if i in [0,count-1] else 'normal')) for i,((x,y),label) in enumerate(zip(positions,labels)))
    if count==4:
        edges.append(arrow('M544 312 H130 V160',dashed=True))
    if count>=5:
        edges.append(arrow(f'M{positions[-1][0]+87} {positions[-1][1]+65} V395 H900 V45 H130 V78',dashed=True))
    cap=f'<text x="820" y="235" text-anchor="middle" fill="#627084" font-size="17">{esc(caption)}</text>' if caption else ''
    return svg_wrap(''.join(edges)+nodes+cap)


def chain(labels,kinds=None,caption=''):
    kinds=kinds or ['normal']*len(labels)
    width=min(210,850/len(labels)-25)
    gap=35
    total=len(labels)*width+(len(labels)-1)*gap
    start=(1000-total)/2
    result=[]
    for i,label in enumerate(labels):
        x=start+i*(width+gap)
        if i:result.append(arrow(f'M{x-gap+2} 166 H{x-7}'))
        result.append(svg_node(x,130,label,kinds[i],width,80))
    result.append(f'<text x="500" y="285" text-anchor="middle" fill="#627084" font-size="20">{esc(caption)}</text>')
    return svg_wrap(''.join(result),350)


def split_layout(heading,paragraphs,visual,quotes=(),boundary=''):
    text=''.join(f'<p>{p}</p>' for p in paragraphs)
    voc=''.join(quotation(q) for q in quotes)
    boundary_html=f'<p class="boundary">{boundary}</p>' if boundary else ''
    return f'<div class="sm2"><div class="sm2-left"><h2>{heading}</h2>{text}{voc}</div><div class="figure-zone">{visual}{boundary_html}</div></div>'


def comparison_table(headers,rows):
    return '<div class="research-table"><table><thead><tr>'+''.join(f'<th>{h}</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{cell}</td>' for cell in row)+'</tr>' for row in rows)+'</tbody></table></div>'


# The original deck template supplies navigation, overview, fullscreen, and transitions.
SLIDES.append('''<section class="slide s-cover interview-cover" data-title="AI Coding 用户访谈分析"><div class="cover-text"><div class="cover-kicker">QUALITATIVE RESEARCH · 2026.11.18</div><h1>AI Coding<br>用户访谈分析</h1><p>还原开发与学习中的分工、交接和判断</p><div class="cover-scope">六位高频使用者 · 两类角色 · 四条旅程</div></div><div class="cover-graph"><div class="cover-orbit orbit-one"></div><div class="cover-orbit orbit-two"></div><div class="cover-centre">开发者<br><small>目标 · 判断 · 验收</small></div><div class="cover-satellite sat-ai">AI<br><small>实现与解释</small></div><div class="cover-satellite sat-knowledge">资料<br><small>依据与线索</small></div><div class="cover-satellite sat-tools">工具与环境<br><small>执行与反馈</small></div><div class="cover-satellite sat-others">他人<br><small>方法与经验</small></div></div><div class="cover-bottom">材料为回忆访谈，关键原声可按编号回查。</div></section>''')

add_slide(0,'回看任务如何推进，也追问知识如何被掌握',
    split_layout('谁在何时接手，凭什么继续？',[
        '按经历还原目标、方案、上下文、实现、运行、修正与沉淀，识别各参与者交替行动的信号。',
        '再对照实际做法、明确偏好与研究者解释，分析开发中的学习和可信判断。'],
        chain(['任务目标','人机交替推进','证据与判断','恢复 / 沉淀'],['human','ai','evidence','normal'],'资料、运行环境和他人贯穿过程')),
    note='材料盘点已先于综合分析完成 · 第七部分按“对设计的启示”理解')

participants=[
['梁淼城','南大大四','约 1–1.5 年 · 每天','后端原型、研究检索','模块检查、接口审阅'],
['王鹤锦','杭电研三','2022 年底起尝试 · 每天','无人机研究、mini vLLM','探针验证、学习时自己写'],
['徐立桂','南大研二','半年以上 · 每天','地图脚本、算子、知识图谱','双窗口验收、较少看源码'],
['王伟','基础软件开发工程师','约 5 个月 · 每天','算子实现、精度与性能','详设、审查、工具验收'],
['彭椒','编程语言实验室工程师','2023 年起 · 每天','测试脚本、用例','同质化委托、人工复跑'],
['郑雨豪','企业员工组 · 岗位待补','半年左右 · 每天','算子方案、实现、优化','方案审阅、数据对照'],
]
add_slide(0,'六人均每天使用 AI，任务和判断方式各有差异',comparison_table(['受访者','背景','自述使用情况','任务范围','突出做法'],participants),layout='table-page',note='企业组按用户本次分组 · 王鹤锦起点采用整理记录中的用户复听校订 · 能力与编程年限未统一测量')

add_slide(0,'八份主材料支持回忆分析，原声另回查对应 ASR',
    f'<div class="scope-map"><div class="scope-number">8<small>份主材料</small></div><div class="scope-branches"><div><strong>2 份提纲</strong><p>用于明确研究范围、提问语境和记录边界。</p></div><div><strong>6 份访谈记录</strong><p>手记与语义整理补充共同提供自述证据。</p></div></div><div class="scope-bridge">原声回查</div><div><strong>6 份对应 AI Coding ASR</strong><p>核对原句、说话者和录音位置。本轮未复听音频。</p></div></div><div class="status-line"><span>直接支持<br><small>可定位的受访者自述</small></span><span>跨案例模式<br><small>比较后形成的研究解释</small></span><span>待验证假设<br><small>需要后续任务或学习验证</small></span></div><p class="boundary">完整文件盘点、缺失与矛盾清单保留在 <a href="report.md">分析全文</a>。时间戳仅用于录音定位。</p>',
    note='提纲中的提示与问题不作为受访者观点 · 六份手记与六份 ASR 对应同一批六人')


def persona_slide(student):
    role='student' if student else 'employee'
    title='高校学生在研究验证与亲自实现之间调整分工' if student else '企业员工以交付与后续维护组织人机协作'
    name='高校学生' if student else '企业员工'
    background='梁淼城 · 王鹤锦 · 徐立桂' if student else '王伟为主 · 彭椒、郑雨豪补充差异'
    label='研究 / 实验 / 小工具 / 开源项目' if student else '算子开发 / 精度与性能 / 持续维护'
    dev='研究目标来自论文、老师讨论或项目需要。让 AI 探针验证、实现代码，再按核心逻辑、接口或结果检查。' if student else '用详设、API 与验收要求限定任务，AI 实现与测试，人工选方向、审查、补优化线索并清理结构。'
    learn='要验证方法时可交 AI 实现。为了学习时，可让 AI 列技术点并由本人逐点写代码。' if student else '工作阻塞时先找相关知识。主动学习时进一步了解背景、架构与算子流水。'
    variety='梁按模块看接口。王鹤锦为学习亲自实现。徐通常少看代码、另开窗口验收。' if student else '彭椒更集中于测试脚本与内部知识。郑雨豪更突出方案检查、换模型与数据判断。'
    q='Q20' if student else 'Q44'
    body=f'''<div class="pf-row persona-page"><aside class="pf-side"><div class="pf-portrait"><img src="{avatar(role,'learning' if student else 'task')}" alt="角色示意头像"></div><div class="pf-sb"><h2>{name}</h2><p>{background}</p></div><div class="pf-sb white"><p>{label}</p></div><p class="boundary">基于本批材料构建的研究画像，适用条件随任务变化。</p></aside><div class="pf-r"><div class="persona-band"><div class="persona-band-label">开发场景</div><p>{dev}</p></div><div class="persona-band"><div class="persona-band-label">学习场景</div><p>{learn}</p></div><div class="persona-band"><div class="persona-band-label">组内差异</div><p>{variety}</p></div>{quotation(q)}</div></div>'''
    add_slide(1,title,body,layout='persona-slide',note='头像为角色示意 · 身份与熟练度分别理解 · 画像不含未提供的年龄、资历或能力数值')


persona_slide(True)
persona_slide(False)

for item in JOURNEYS:
    columns=[]
    for i in range(5):
        pains=[pain for index,pain in item['pains'].items() if index//2==i]
        pain_html=''.join(f'<p class="journey-pain">{esc(pain[0])} {quote_button(pain[2])}</p>' for pain in pains)
        actions=' → '.join(esc(label) for _,label in item['steps'][i*2:i*2+2])
        columns.append(f'<div class="journey-column"><h2>{esc(item["stages"][i])}</h2><div class="journey-activity">{item["activities"][i]}</div><div class="journey-touch-summary">{actions}</div>{pain_html}<p class="journey-thought">{esc(item["thoughts"][i])}</p></div>')
    subtitle={'student-development':'论文与讨论形成方向，探针促成下一次判断','student-learning':'同一人在学习目标下保留亲自实现','employee-development':'审查、测试与实现反复交替','employee-learning':'问题触发与主动学习需要不同知识深度'}[item['id']]
    body=f'<p class="journey-context">{esc(item["scenario"])}</p><div class="journey-summary {item["mode"]}">{"".join(columns)}</div><div class="journey-endnote"><p>{esc(item["boundary"])}</p><a class="open-map" target="_blank" href="journey-{item["role"]}.html#{item["id"]}">打开完整可编辑旅程 ↗</a></div>'
    add_slide(1,f'{item["title"]}｜{subtitle}',body,layout='journey-page',note='下方疑问为研究者重建 · 完整旅程包含触点与定性体验曲线',refs=item['refs'][:3])

case_rows=[
['梁淼城','解释开源库 / 比较路线','架构图与文档确认','建骨架、分模块开发','停下看接口、本人运行','多项经历，精确时序待补'],
['王鹤锦','论文与老师讨论','AI 探针粗验方向','细化机制后实现','检查模块接法 / 核心逻辑','最终实验阈值与结局待补'],
['徐立桂','地图脚本 / 算子为不同任务','算子知识与环境准备','实现、后台运行','双窗口验收、对照 benchmark','多个任务不能合为一条'],
['王伟','详设与 API 文档','限定框架 / 验收与基线','AI 初版、引用代码反馈','精度性能循环、结构清理','改动回写原文档'],
['彭椒','既有测试方案 / 目标','提供内部业务上下文','工具连接服务器、多轮修复','看 Pass / 源码、手动复跑','完整任务结局待补'],
['郑雨豪','需求、功能、目标','AI 方案文档，人工选方向','实现、基于数据分析','比较基线，查用例和公式','历史数据查找受阻'],
]
add_slide(2,'六条经历保留不同起点，交接发生在具体检查对象上',comparison_table(['受访者','任务理解','方案 / 上下文','实现 / 推进','检查 / 恢复','边界 / 延续'],case_rows),layout='table-page',note='按可支持的先后关系归纳 · 表中部分单元为同一人的不同经历 / 一般做法 · 不代表统一现场观察')

# A concrete actor swimlane makes the alternation inspectable.
swim=''
for y,label in [(50,'开发者'),(148,'AI'),(246,'资料 / 工具'),(344,'运行环境')]:
    swim+=f'<rect x="0" y="{y}" width="1000" height="90" fill="{ "#f4f6f9" if y in [50,246] else "#ffffff"}"/><text x="15" y="{y+50}" font-size="18" fill="#647084">{label}</text>'
for x,label in [(135,'详设'),(350,'初版'),(565,'检查与纠正'),(780,'再次实现')]:
    swim+=f'<text x="{x+75}" y="25" text-anchor="middle" font-size="18" fill="#4c596b">{label}</text>'
swim+=arrow('M300 96 H350 V175')+arrow('M515 185 H565 V120')+arrow('M730 90 H780 V175')+arrow('M865 223 V355')+arrow('M865 355 H740 V305')+arrow('M565 300 H540 V95 H565',dashed=True)
swim+=svg_node(135,65,'准备详设|与 API 链接','human',165)
swim+=svg_node(350,160,'AI 给出|初版代码','ai',165)
swim+=svg_node(565,65,'通读 / 引用代码|提出具体问题','human',165)
swim+=svg_node(780,160,'按新方向|继续实现','ai',165)
swim+=svg_node(780,355,'执行|测试脚本','normal',165)
swim+=svg_node(565,260,'误差 / 性能|工具输出','evidence',165)
add_slide(2,'王伟的交接围绕代码与工具结果反复往返',split_layout('审查与执行相互穿插',['人把具体问题交给 AI，运行结果又成为下一轮判断依据。','这条路径由王伟自述重建，资料与工具是可检查的交接对象。'],svg_wrap(swim,440),quotes=['Q01']),note='此图展示王伟的口述做法 · 测试输出、性能值与本轮实测均未提供',refs=['Q34','Q44'])

handoff_rows=[
['方案偏离目标','人审阅方案、核心逻辑或接口','纠正 / 选择方向','梁淼城、王鹤锦、郑雨豪'],
['尝试很久仍无进展','人查看已做尝试和方向','停止后补线索','王伟'],
['输入或结果不符合需求','人看用例、业务输出、公式','改提示词 / 测试 / 代码','彭椒、郑雨豪'],
['版本或运行环境不符','环境暴露错误，人核对事实','指定环境 / 手动搜索','梁淼城、郑雨豪'],
['实现不便维护或理解','人通读代码，识别多余封装','要求清理结构','王伟、梁淼城'],
]
add_slide(2,'接手由受阻信号触发，判断对象随任务改变',comparison_table(['触发信号','谁看什么','交给下一轮的内容','案例'],handoff_rows),layout='table-page',refs=['Q15','Q18','Q19','Q43'],note='高权限下仍存在人工判断 · 介入阈值没有统一量化记录')

verify=chain(['需求 / 公式','用例与输入规则','执行与中间数据','误差 / 性能 / Pass'],['human','normal','evidence','evidence'],'人检查测试对象与标准是否匹配任务')
add_slide(2,'验证要把需求、用例和输出重新对应起来',split_layout('不同任务采用不同完成信号',['王伟看 CPU golden 误差和性能基线。彭椒看 Pass、代码并复跑。郑雨豪还检查输入规则、公式与中间数据。','原型、研究探针和生产算子的证据要求存在差异。'],verify,quotes=['Q11'],boundary='AI 可能同时生成实现和验证脚本，测试假设的独立性尚未核验。'),refs=['Q09','Q10','Q12'])

recovery=svg_wrap(
    svg_node(28,167,'受阻信号','risk',140,76)+
    arrow('M168 205 H245 V70 H310')+arrow('M245 205 H310')+arrow('M245 205 V340 H310')+
    svg_node(310,35,'环境 / 知识不符|补事实与资料','normal',245,70)+
    svg_node(310,170,'意图 / 方向不符|重述、回退或停止','normal',245,70)+
    svg_node(310,305,'模型 / 工具受限|换模型、工具或入口','normal',245,70)+
    arrow('M555 70 H650 V205 H735')+arrow('M555 205 H735')+arrow('M555 340 H650 V205')+
    svg_node(735,167,'继续交 AI 实现|重新检查结果','human',235,76)+
    arrow('M850 243 V410 H100 V250',dashed=True),440)
add_slide(2,'恢复动作改变下一轮的执行条件',split_layout('接手后，开发者常继续借助 AI',['环境错误、语义误解、实现偏离和工具停摆，触发不同恢复动作。','这些方法的成功率、尝试次数与放弃条件缺乏统一记录。'],recovery,quotes=['Q16']),refs=['Q15','Q17','Q42','Q43'])

preference_rows=[
['信息深度','徐希望先看结果，按需追问','王伟无进展时看过程，通常通读代码','展示深度随目标和异常变化'],
['来源依据','郑希望答案附来源','梁在研究时看来源，工程时更看结果','来源与结果分别支撑不同判断'],
['代码参与','王鹤锦学习时选择自己写','徐通常不看代码，梁分模块检查','身份不足以决定统一工作方式'],
['协同范围','理想协作数量未统一记录','王鹤锦因额度停止尝试，王伟一平台一项目，徐双窗口','成本、同步与控制方式共同作用'],
['知识与流程','郑认为简单任务可缩短步骤','王伟使用知识部分，彭团队维护内部 Skill','流程是否合适取决于任务条件'],
]
add_slide(3,'明确偏好、回忆做法与研究解释需要分别阅读',comparison_table(['主题','明确表达的偏好 / 选择','回忆中的实际做法','研究者解释'],preference_rows),layout='table-page',refs=['Q14','Q26','Q28','Q30'],note='同一话语可能同时表达选择与经历，表格按本轮论证用途归类 · 不把解释当受访者原话')

parallel=svg_wrap(svg_node(40,155,'多任务 / 多窗口','normal',220,75)+arrow('M260 192 H340 V75 H430')+arrow('M340 192 H430')+arrow('M340 192 V310 H430')+svg_node(430,40,'注意力切换|寻找当前任务','human',240,70)+svg_node(430,155,'跨平台改动|需要同步上下文','risk',240,75)+svg_node(430,275,'历史数据找回|支撑继续对比','evidence',240,75)+arrow('M670 75 H750 V190 H805')+arrow('M670 192 H805')+arrow('M670 310 H750 V190')+svg_node(805,155,'继续推进|或人工选择','human',165,75),390)
add_slide(3,'并行协作还需要管理注意力、改动与历史依据',split_layout('历史信息承担继续工作的作用',['郑雨豪为比较数据而翻旧对话。梁淼城描述同仓跨平台修改冲突。','徐立桂还发现开放问题的多模型互评可能持续提出改进，最终仍需本人选择。'],parallel,quotes=['Q36']),refs=['Q29','Q40'])

skill_graph=svg_wrap(svg_node(40,160,'可复用知识与方法','normal',240,80)+arrow('M280 200 H365 V90 H430')+arrow('M365 200 V300 H430')+svg_node(430,50,'王伟 / 郑雨豪|固定步骤可能偏长','risk',285,80)+svg_node(430,260,'彭椒 / 王鹤锦|业务 Skill / 常用流程','evidence',285,80)+arrow('M715 90 H790 V200 H820')+arrow('M715 300 H790 V200')+svg_node(820,160,'任务变化|需要调整','human',155,80),390)
add_slide(3,'Skill 的知识价值与流程负担在不同案例中并存',split_layout('是否采用完整流程，取决于任务',['王伟倾向使用知识部分，郑雨豪认为简单任务可缩短步骤。','彭椒的内部业务 Skill 日常够用，同时需要跟随业务更新。王鹤锦会固化反复使用的工作模式。'],skill_graph,quotes=['Q31']),refs=['Q30','Q32','Q33','Q48'],note='所有 Skill 机制与开销均为受访者经历和评价 · 未核验当前产品机制或性能')

source_graph=svg_wrap(svg_node(40,165,'当前要作的判断','human',215,80)+arrow('M255 205 H340 V70 H410')+arrow('M340 205 H410')+arrow('M340 205 V340 H410')+svg_node(410,35,'接口是否存在 / 可用|开发包、官方文档','normal',300,75)+svg_node(410,170,'复杂任务怎样完成|组合方案、业务知识、案例','normal',300,75)+svg_node(410,305,'结果是否符合目标|代码、公式、实际运行','evidence',300,75)+arrow('M710 73 H780 V205 H815')+arrow('M710 207 H815')+arrow('M710 343 H780 V205')+svg_node(815,165,'匹配版本|与任务条件','human',165,80),430)
add_slide(4,'可信判断包含来源依据与当前任务的适配',split_layout('同一来源能支持哪些判断？',['徐立桂看开发包接口，再看官方文档。王伟指出 API 文档仍可能缺少组合方案。','彭椒受内部资料可访问性限制，梁淼城也曾由第三方页面找到版本线索。'],source_graph,quotes=['Q46']),refs=['Q06','Q07','Q08','Q37'])

learning_fork=svg_wrap(svg_node(30,160,'同一开发者|王鹤锦','human',195,80)+arrow('M225 200 H290 V90 H350')+arrow('M290 200 V310 H350')+svg_node(350,45,'验证研究方法|AI 快速实现，查核心逻辑','ai',290,85)+svg_node(350,265,'学习 mini vLLM|AI 规划，本人逐点实现','normal',290,85)+arrow('M640 87 H725')+arrow('M640 307 H725')+svg_node(725,45,'判断是否支持|下一步研究','evidence',240,85)+svg_node(725,265,'判断能否理解|亲自实现 / 复现','evidence',240,85),410)
add_slide(4,'开发目标与学习目标会改变同一个人的分工',split_layout('任务推进和知识掌握分别检查',['王鹤锦明确区分验证方法与学习技术的做法。梁淼城把看过代码并能复现视为学会。','彭椒的基础到进阶再实操属于理想路径，实际学习则多由工作任务触发。'],learning_fork,quotes=['Q20']),refs=['Q21','Q24','Q47'])

understanding=chain(['意图 / 结构','核心代码 / 接口','用例 / 公式','运行结果'],['human','normal','normal','evidence'],'每一处对应关系都可能成为人工检查点')
add_slide(4,'理解 AI 结果需要把意图与具体实现联系起来',split_layout('人会选择性地检查自己需要判断的部分',['王鹤锦检查模块接法，王伟了解代码各部分，郑雨豪核对公式与测试输入，梁淼城检查核心逻辑。','徐立桂较少读代码，同时也感知细节黑盒化。长期影响仍需后续验证。'],understanding,quotes=['Q19','Q22']),refs=['Q44'],note='选择性检查来自访谈自述 · 不能据此推出理解程度、独立开发能力或长期学习效果')

memory=svg_wrap(svg_node(40,160,'任务中形成的|数据、决定与方法','normal',245,85)+arrow('M285 202 H370 V65 H435')+arrow('M370 202 H435')+arrow('M370 202 V345 H435')+svg_node(435,30,'回写详设|王伟','normal',245,75)+svg_node(435,165,'Markdown / 索引|徐立桂、彭椒','normal',245,75)+svg_node(435,310,'固化常用模式|王鹤锦、彭椒','normal',245,75)+arrow('M680 67 H765 V202 H810')+arrow('M680 202 H810')+arrow('M680 347 H765 V202')+svg_node(810,160,'找回 / 比较|复用 / 更新','evidence',155,85),435)
add_slide(4,'知识沉淀沿着任务文档、个人记录和方法复用展开',split_layout('从本次结果走向下一次任务',['王伟随修改回写最初文档，徐立桂筛选后保存 Markdown 并建立索引，王鹤锦把常用对话模式固化为 Skill。','这些材料能否帮助延迟迁移、团队共享和公共经验回流，尚未统一验证。'],memory,quotes=['Q34']),refs=['Q33','Q35','Q48'])

FINDINGS=[
    dict(id='F1',title='人工判断在方案、实现与审查之间持续往返',heading='判断工作贯穿执行',
         text='王伟的交替审查、梁淼城的模块检查、彭椒的新场景把关，显示人工判断在不同节点出现。',
         labels=['明确任务','AI 实现','检查具体对象','纠正 / 再委托'],
         quotes=['Q01','Q02'],condition='复杂算子与新场景更突出。徐立桂少看代码、分窗口验收，介入位置不同。总工时变化未测量。'),
    dict(id='F2',title='上下文需要与任务、接口组合和环境相匹配',heading='资料适用性影响执行',
         text='API 用法、内部业务事实和实际环境，是不同的上下文条件。资料齐备程度与任务可完成程度需要分别核对。',
         labels=['相关资料','版本 / 环境','接口 / 业务关系','可执行的任务条件'],
         quotes=['Q06','Q43'],condition='王伟称资料基本能找到，复杂组合仍难。同质化测试可更顺利推进。各类缺口频率未测量。'),
    dict(id='F3',title='可信判断由任务相关的运行、代码和来源共同支持',heading='证据需要支持当前判断',
         text='算子用误差和性能，测试用 Pass 和复跑。用户也检查输入规则、公式、核心逻辑与来源。',
         labels=['任务标准','用例 / 输入','执行证据','人工核对'],
         quotes=['Q09','Q11'],condition='快速探针只支持粗验。AI 自写脚本、双窗口互评的独立性与覆盖范围尚未核验。'),
    dict(id='F4',title='失败后，开发者会调整执行条件并继续借助 AI',heading='恢复沿受阻信号分支展开',
         text='停止错误方向、重写提示词、回退版本、补资料与换模型，都是材料中出现的接手动作。',
         labels=['发现受阻','识别偏差','改变条件','再次执行与检查'],
         quotes=['Q15','Q42'],condition='网络、权限与资源限制会改变恢复路径。开放问题的多模型互评可能持续发散。成功率缺少比较。'),
    dict(id='F5',title='同一人会按开发或学习目标改变 AI 分工',heading='目标影响亲自参与的环节',
         text='王鹤锦为验证方法让 AI 快速实现，为学习则自己写代码。梁淼城把能复现作为掌握条件。',
         labels=['当前目标','选择 AI 分工','保留亲自参与','检查任务 / 掌握'],
         quotes=['Q20','Q21'],condition='徐立桂愿意交出细节，也感知黑盒化。学习效果、独立迁移与因果关系仍待验证。'),
]
for finding in FINDINGS:
    diagrams = {'F2': source_graph, 'F3': verify, 'F4': recovery, 'F5': learning_fork}
    diagram = diagrams.get(finding['id']) or cycle(finding['labels'])
    graphic=f'<div class="finding-status">{finding["id"]} · 跨案例模式</div>{diagram}<div class="condition"><h3>适用条件、反例与边界</h3><p>{finding["condition"]}</p></div>'
    add_slide(5,finding['title'],split_layout(finding['heading'],[finding['text']],graphic,quotes=finding['quotes']),layout='finding-page',note='结论由可定位的自述归纳 · 因果关系与总体发生率均未验证')

implication_rows=[
['F1 / F4','围绕交接点呈现任务状态','已尝试什么、为何停下、下一轮改什么','任务回放中能否准确续做'],
['F2','呈现资料的适用条件与关联','版本匹配吗，还缺哪些任务条件','能否发现版本 / 业务 / 组合缺口'],
['F3','关联验证对象、标准与输出','测了什么，结果支持哪项判断','能否识别偏离需求的用例 / 结论'],
['F5','按目标调整代做与本人参与','此刻推进工作、理解解释或亲自实现','同一人双场景回放与延迟迁移'],
['F1–F5','让关键记录可找回、修订与复用','哪些数据、决定和方法仍适用','重找历史数据并继续任务'],
]
add_slide(6,'设计启示回到交接、适配、查验和掌握目标',comparison_table(['对应发现','设计研究方向','用户需要作出的判断','后续验证'],implication_rows),layout='table-page',note='本页为基于发现提出的设计启示 · 效果仍待验证，产品形态后续再展开',refs=['Q26','Q34','Q36'])

add_slide(6,'后续研究需要补齐任务结局与独立掌握的证据',split_layout('保留三类尚未回答的问题',[
    '<b>任务结局</b>　哪些尝试最终完成、部分完成或放弃，谁作最终交付判断？',
    '<b>验证过程</b>　测试输入、脚本、原始输出与版本能否对应，发现偏差后怎样改变？',
    '<b>学习迁移</b>　任务结束后能否独立解释、复现或处理变式，亲自参与哪些环节产生差异？'],
    chain(['已有自述','任务材料回放','查验与延迟迁移','检验研究假设'],['normal','evidence','evidence','human'],'优先围绕同一段具体经历补证'),boundary='材料缺失、歧义、矛盾及专名待核对项详见分析全文。'),note='研究假设需以同类任务和相应材料继续验证 · 画像与旅程均可随证据修订')

DECK_CSS='''
.interview-slide *{min-width:0;min-height:0}.interview-slide .head{gap:2vw;align-items:flex-start;margin-bottom:2.8vh}.interview-slide .head-l{max-width:59vw;gap:1vh}.interview-slide .ttl{font-size:var(--fs-h1);line-height:1.35}.interview-slide .section-tabs{gap:2px;padding:4px;max-width:44vw;flex-wrap:wrap;border:0;background:transparent;justify-content:flex-end}.interview-slide .section-tabs span{font-size:var(--fs-xs);padding:6px 8px;white-space:nowrap}.interview-slide .section-tabs .active{background:#262e3c;color:white}.interview-slide .body-area{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;padding-bottom:5vh}.interview-slide .foot{display:flex;justify-content:space-between;align-items:center;gap:20px;font-size:var(--fs-xs);color:#748090;position:absolute;left:4vw;right:4vw;bottom:2.7vh;line-height:1.6}.interview-slide p{font-size:var(--fs-body);line-height:1.7}.interview-slide a{color:inherit;text-underline-offset:3px}.interview-slide .boundary{font-size:var(--fs-sm);line-height:1.7;color:#687586}.interview-slide .sm2{display:grid;grid-template-columns:.8fr 1.2fr;gap:3.5vw;align-items:center;max-height:100%;width:100%;flex:0 1 auto}.interview-slide .sm2-left{display:flex;flex-direction:column;justify-content:center;gap:1.5vh;max-width:none}.interview-slide .sm2-left h2{font-size:var(--fs-h2);line-height:1.4;font-weight:700}.interview-slide .sm2-left p{font-size:var(--fs-body);line-height:1.7;color:#5d6878}.interview-slide .figure-zone{display:flex;flex-direction:column;justify-content:center;gap:2vh}.interview-slide .research-diagram{width:100%;max-height:52vh;display:block;overflow:visible}.interview-slide .research-diagram text{font-family:inherit}.interview-slide blockquote{margin:1vh 0 0;padding:1.6vh 1.3vw;background:rgba(255,255,255,.66);border:1px solid #fff;border-radius:13px;box-shadow:0 6px 22px #26355006}.interview-slide blockquote p{font-size:var(--fs-body);color:#283342;line-height:1.65}.interview-slide blockquote footer{margin-top:1vh}.evidence-ref{font-family:inherit;font-size:var(--fs-xs);color:#596b85;padding:0;border:0;background:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;text-align:left}.evidence-ref:hover{color:#3836a2}.interview-slide .foot .evidence-ref{font-size:var(--fs-xs)}.interview-slide .research-table{max-height:100%;width:100%;overflow:auto;background:rgba(255,255,255,.6);border:1px solid #fff;border-radius:16px;padding:1vh 1.6vw}.interview-slide table{width:100%;border-collapse:collapse;font-size:var(--fs-body);line-height:1.65;text-align:left}.interview-slide th{font-size:var(--fs-sm);font-weight:500;color:#7b8697;padding:1.8vh 1vw;border-bottom:1px solid #cfd6df}.interview-slide td{padding:2vh 1vw;border-bottom:1px solid #dbe0e7;vertical-align:top}.interview-slide td:first-child{font-weight:650;white-space:nowrap;color:#273849}.interview-slide tr:last-child td{border-bottom:0}.interview-slide .scope-map{display:grid;grid-template-columns:.7fr 1.3fr .65fr 1.25fr;gap:3vw;align-items:center;padding:3vh 0 5vh}.interview-slide .scope-number{font-size:clamp(90px,10vw,150px);font-weight:300;letter-spacing:-.06em}.interview-slide .scope-number small{display:block;font-size:var(--fs-body);letter-spacing:0;font-weight:400}.interview-slide .scope-branches>div+div{margin-top:3vh;padding-top:3vh;border-top:1px solid #bfc7d4}.interview-slide .scope-map strong{font-size:var(--fs-h2);display:block;margin-bottom:1vh}.interview-slide .scope-bridge{border-top:1px solid #9aa7ba;text-align:center;font-size:var(--fs-sm);color:#6e7a8b;padding-top:1vh}.interview-slide .status-line{display:grid;grid-template-columns:repeat(3,1fr);gap:3vw;border-top:1px solid #c9d0da;padding:3vh 0}.interview-slide .status-line span{font-size:var(--fs-h3);font-weight:650}.interview-slide .status-line small{font-size:var(--fs-sm);font-weight:400;color:#6a7585;display:inline-block;margin-top:1vh}.interview-slide .pf-row{display:grid;grid-template-columns:.65fr 1.7fr;gap:3vw;align-items:center;flex:0 1 auto}.interview-slide .pf-side{padding:2vh 1.4vw;background:#f1f2f4;border-radius:16px;display:flex;flex-direction:column;gap:1.4vh}.interview-slide .pf-portrait{height:20vh;width:100%;overflow:hidden;display:flex;justify-content:center}.interview-slide .pf-portrait img{height:100%;width:auto;object-fit:contain}.interview-slide .pf-side h2{font-size:var(--fs-h2);margin-bottom:.8vh}.interview-slide .pf-side p{font-size:var(--fs-body)}.interview-slide .pf-side .boundary{font-size:var(--fs-sm)}.interview-slide .pf-sb.white{padding:1.3vh 1vw;background:#fff;border-radius:10px}.interview-slide .pf-r{display:flex;flex-direction:column;gap:2vh}.interview-slide .persona-band{display:grid;grid-template-columns:7em 1fr;gap:1.5vw;padding:2vh 0;border-bottom:1px solid #c9d1dc}.interview-slide .persona-band-label{font-size:var(--fs-h3);font-weight:650}.interview-slide .journey-context{max-width:76em;margin-bottom:3vh;color:#616d7d}.interview-slide .journey-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.interview-slide .journey-column{display:flex;flex-direction:column;background:rgba(255,255,255,.58);border-bottom:3px solid #229c9c}.interview-slide .journey-summary.learning .journey-column{border-color:#d38a3f}.interview-slide .journey-column h2{font-size:var(--fs-h3);background:#8e959c;color:white;clip-path:polygon(0 0,94% 0,100% 50%,94% 100%,0 100%,5% 50%);padding:1.7vh .9vw;text-align:center;min-height:7vh;display:grid;place-items:center}.interview-slide .journey-activity{font-size:var(--fs-body);padding:2vh 1.1vw;line-height:1.7;border-bottom:1px solid #d1d9e1;min-height:12vh}.interview-slide .journey-touch-summary{font-size:var(--fs-sm);color:#486a78;padding:2vh 1.1vw;line-height:1.6;min-height:9vh}.interview-slide .journey-column .journey-pain{font-size:var(--fs-sm);color:#a82d29;padding:0 1.1vw 1.5vh;line-height:1.6}.interview-slide .journey-thought{font-size:var(--fs-sm);padding:2vh 1.1vw;margin-top:auto;background:#ffffff75;color:#657180;line-height:1.6;min-height:9vh}.interview-slide .journey-endnote{display:flex;align-items:center;justify-content:space-between;gap:3vw;margin-top:3vh}.interview-slide .journey-endnote p{font-size:var(--fs-sm);line-height:1.7;color:#6b7685;max-width:72%}.interview-slide .open-map{font-size:var(--fs-sm);padding:1.2vh 1.2vw;border-radius:999px;border:1px solid #aebaca;text-decoration:none;white-space:nowrap}.interview-slide .finding-status{font-size:var(--fs-sm);color:#626ca0;letter-spacing:.04em}.interview-slide .condition{padding-top:2vh;border-top:1px solid #c9d1dd}.interview-slide .condition h3{font-size:var(--fs-sm);font-weight:650;margin-bottom:.8vh}.interview-slide .condition p{font-size:var(--fs-body);line-height:1.65;color:#677384}.interview-cover{background:radial-gradient(ellipse at 80% 30%,#273e54 0%,transparent 50%),linear-gradient(125deg,#11151e,#152331 65%,#14222d);color:#f3f7fa;display:flex;align-items:center;padding:7vh 6vw}.interview-cover .cover-text{position:relative;z-index:2;width:54%;}.interview-cover h1{font-size:clamp(40px,5.8vw,88px);font-weight:600;line-height:1.15;letter-spacing:-.03em;margin:3vh 0}.interview-cover .cover-kicker{font-family:'JetBrains Mono',monospace;font-size:var(--fs-sm);letter-spacing:.12em;color:#a3b3c8}.interview-cover p{font-size:var(--fs-h2);font-weight:300;line-height:1.7;color:#ccd6e2}.interview-cover .cover-scope{font-size:var(--fs-body);color:#91a5ba;margin-top:6vh}.interview-cover .cover-graph{position:absolute;right:3vw;top:15vh;width:48vw;height:68vh}.interview-cover .cover-orbit{position:absolute;border:1px solid #637d9566;border-radius:50%;left:8%;top:5%;width:82%;height:86%;transform:rotate(-18deg)}.interview-cover .orbit-two{left:22%;top:13%;width:63%;height:70%;transform:rotate(36deg)}.interview-cover .cover-centre{position:absolute;left:36%;top:34%;width:28%;height:30%;border-radius:50%;display:grid;place-content:center;text-align:center;line-height:1.7;font-size:var(--fs-h2);background:radial-gradient(circle at 30% 20%,#768b9c55,#1b314366);box-shadow:0 0 65px #86b7c124;border:1px solid #8397ad66;backdrop-filter:blur(8px)}.interview-cover small{font-size:var(--fs-sm);font-weight:300;color:#aebdcb}.interview-cover .cover-satellite{position:absolute;display:grid;place-content:center;text-align:center;line-height:1.8;border-radius:50%;width:24%;height:24%;font-size:var(--fs-h3);border:1px solid #8b9db344;background:#20364bb3}.interview-cover .sat-ai{left:65%;top:4%;background:#56558c55}.interview-cover .sat-knowledge{left:6%;top:17%}.interview-cover .sat-tools{left:70%;top:66%;background:#2e6b6755}.interview-cover .sat-others{left:15%;top:72%}.interview-cover .cover-bottom{position:absolute;bottom:5vh;left:6vw;color:#8198ae;font-size:var(--fs-sm)}
@media(max-height:760px){.interview-slide .head{margin-bottom:2vh}.interview-slide .body-area{padding-bottom:4vh}.interview-slide td{padding:1.3vh .8vw}.interview-slide th{padding:1.3vh .8vw}.interview-slide .sm2-left{gap:1vh}.interview-slide blockquote{padding:1.2vh 1.1vw}.interview-slide .persona-band{padding:1.5vh 0}.interview-slide .pf-r{gap:1.2vh}.interview-slide .research-diagram{max-height:45vh}}
@media print{html,body{height:auto;overflow:visible;scroll-snap-type:none}#controls,#navDots,#panel,#toggle{display:none!important}.slide{width:100%;height:190mm;page-break-after:always;print-color-adjust:exact;-webkit-print-color-adjust:exact}#evidenceDialog{display:none}a{text-decoration:none}.interview-slide .body-area{overflow:hidden}}
'''

TEMPLATE=(SKILLS/'report-ppt-skill/assets/deck-template.html').read_text()
start=TEMPLATE.index('<div id="deck">')+len('<div id="deck">')
end=TEMPLATE.index('<!-- 调色面板')
# The original closing deck div is replaced together with its sample slides.
report=TEMPLATE[:start]+'\n'+''.join(SLIDES)+'\n</div>\n\n'+TEMPLATE[end:]
report=report.replace('<title>汇报 PPT 模板</title>','<title>AI Coding 用户访谈分析</title>')
# Keep local viewing independent of third-party font stylesheet availability.
report=re.sub(r'<link[^>]+rel="stylesheet"[^>]*>', '', report)
report=report.replace("'HarmonyOS Sans SC','Inter','Noto Sans SC',sans-serif", "'HarmonyOS Sans SC','PingFang SC','Inter','Noto Sans SC',sans-serif")

report=report.replace('</head>',f'<style>{DECK_CSS}{DIALOG_CSS}</style></head>')
report=report.replace("let idx=0;", "let idx=0;\nlet pendingAnchor=null;")
report=report.replace("const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting", "const io=new IntersectionObserver(es=>{if(document.body.classList.contains('overview'))return;es.forEach(e=>{const observedIndex=slides.indexOf(e.target);if(pendingAnchor!==null&&observedIndex!==pendingAnchor)return;if(e.isIntersecting")
report=report.replace("if(i>=0&&i!==idx)updateCurrent(i);", "if(i>=0){pendingAnchor=null;if(i!==idx)updateCurrent(i);}")
report=report.replace("function exitOverview(){slides.forEach", "function exitOverview(){pendingAnchor=idx;slides.forEach")
report=report.replace("else setTimeout(()=>slides[idx].scrollIntoView({block:'start',behavior:'auto'}),20);", "else {slides[idx].scrollIntoView({block:'start',behavior:'instant'});updateCurrent(idx);}")
report=report.replace("behavior:'auto'", "behavior:'instant'")
report=report.replace("function go(n){ if(document.body.classList.contains('overview'))return;", "function go(n){ if(document.body.classList.contains('overview'))return; pendingAnchor=null;")
report=report.replace("updateCurrent(idx);}}", "updateCurrent(idx);requestAnimationFrame(()=>requestAnimationFrame(()=>{pendingAnchor=null;}));}}")

report=report.replace('function updateCurrent(i){','function updateCurrent(i){\n  history.replaceState(null, "", "#" + (i + 1));')
report=report.replace("if(e.target.tagName==='INPUT')return;","if(e.target.closest('input,textarea,select,[contenteditable=true]') || evidenceDialog.open)return;")
# Keep the entire runtime, then add URL restoration and evidence inspection.
report=report.replace('window.scrollTo(0,0);\nslides.forEach(paintSlide);\nupdateCurrent(0);\nif(CTRL) setActive(0);', '''
const requestedPage = Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1));
slides.forEach(paintSlide);
updateCurrent(requestedPage);
if(CTRL) setActive(requestedPage);
else { slides[requestedPage].scrollIntoView({block:'start',behavior:'instant'}); }
window.addEventListener('hashchange',()=>{ const page=(parseInt(location.hash.slice(1),10)||1)-1; go(page); });
''')
report=report.replace('</body>',DIALOG_HTML+'<script>'+DIALOG_JS+'</script></body>')
# Keyboard listener lives before the dialog script, but executes only after page load.
report=report.replace("if(e.target.tagName==='INPUT')return;", "if(e.target.tagName==='INPUT'||document.getElementById('evidenceDialog').open)return;")
def unique_svg_markers(match):
    global marker_counter
    marker_counter += 1
    svg = match.group(0)
    for marker in re.findall(r'<marker id="([^"]+)"', svg):
        unique_id = f'svg-{marker_counter}-{marker}'
        svg = svg.replace(f'id="{marker}"', f'id="{unique_id}"').replace(f'url(#{marker})', f'url(#{unique_id})')
    return svg

marker_counter = 0
report = re.sub(r'<svg\b.*?</svg>', unique_svg_markers, report, flags=re.S)
(HERE/'index.html').write_text(report)
(HERE/'page-map.json').write_text(json.dumps([dict(page=i+1,title=re.search(r'data-title="([^"]+)"',s)[1]) for i,s in enumerate(SLIDES)],ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(SLIDES)} slides, 4 journeys, {len(QUOTES)} source excerpts')
