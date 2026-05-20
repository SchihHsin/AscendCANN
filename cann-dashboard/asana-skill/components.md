# AscendOps Theme — 完整 CSS 组件规范

全量覆盖 design-options.html 所有 CSS class。
直接用下方代码块内容替换目标 HTML 的 `<style>…</style>`。
JS 渲染规范见 `references/patterns.md`。

```css
/* ============================================================
   AscendOps Theme — ascendops-theme.skill  v4
   全量覆盖 design-options.html 的 296 个 CSS class
   ============================================================ */
:root{
  --green-dark:#37C597;--green-core:#3BE880;--green-bright:#3BF7D1;
  --green-med:#9DFBE8;--green-faded:#C3EDDF;--green-light:#EBFCF7;
  --teal-dark:#179D8A;--teal-core:#1AAFD0;--teal-bright:#02CEFF;
  --teal-med:#80E6FF;--teal-light:#E8F7FB;
  --purple-dark:#4F4DA7;--purple-core:#6A67CE;--purple-bright:#A177FF;
  --purple-med:#D0B8FF;--purple-light:#F0EFFA;
  --gold-dark:#FD9A00;--gold-core:#FFB900;--gold-bright:#FFD200;
  --gold-med:#FFE87F;--gold-light:#FFF8E5;
  --coral-dark:#E63838;--coral-core:#FC636B;--coral-bright:#FF6D92;
  --coral-med:#FFB6C8;--coral-light:#FEEFF0;
  --g1:#F8F8F9;--g2:#EFF0F1;--g3:#E1E2E4;--g4:#CDCFD2;--g5:#B9BCC0;
  --g6:#A1A4AA;--g7:#898E95;--g8:#676D76;--g9:#495058;--g10:#1B2432;
  --white:#FFFFFF;
  --bg:var(--g1);--card:#fff;--border:var(--g3);--border-2:var(--g4);
  --text:var(--g10);--text-2:var(--g9);--text-3:var(--g6);
  --primary:var(--purple-core);--primary-2:var(--purple-bright);
  --primary-dark:var(--purple-dark);--primary-soft:var(--purple-light);
  --accent:var(--purple-core);
  --good:var(--green-dark);--good-soft:var(--green-light);
  --bad:var(--coral-dark);--bad-soft:var(--coral-light);
  --warn:var(--gold-dark);--warn-soft:var(--gold-light);
  /* aliases for original inline styles */
  --blue:var(--teal-core);
  --red-bg:var(--coral-light);--yellow-bg:var(--gold-light);
  --green-bg:var(--green-light);--blue-bg:var(--teal-light);
  --yellow:var(--gold-dark);--green:var(--green-dark);
  --surface:var(--g1);--muted:var(--g7);--dim:var(--g6);
  --radius-xl:22px;--radius-l:18px;--radius-m:12px;--radius-s:8px;
  --shadow-soft:0 1px 2px rgba(39,51,71,.04),0 4px 14px rgba(39,51,71,.04);
  --shadow-pop:0 10px 30px rgba(106,103,206,.18);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'Inter','PingFang SC','Microsoft YaHei',sans-serif;color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;}

/* TOPBAR */
.topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;display:flex;align-items:center;height:54px;gap:0;position:sticky;top:0;z-index:100;box-shadow:0 1px 0 var(--border),0 2px 12px rgba(106,103,206,.06);}
.tb-logo{font-size:15px;font-weight:800;letter-spacing:-.02em;background:linear-gradient(135deg,var(--purple-dark),var(--purple-bright));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.tb-sep{color:var(--g4);margin:0 8px;font-size:16px}
.tb-title{font-size:12px;color:var(--text-3);font-weight:500}
.tb-dims{display:flex;margin-left:28px}
.dim-tab{padding:0 18px;height:54px;font-size:13px;font-weight:600;color:var(--text-3);border:none;background:none;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px;font-family:inherit;transition:color .15s,border-color .15s;}
.dim-tab:hover{color:var(--text)}
.dim-tab.on{color:var(--primary);border-bottom-color:var(--primary)}
.tb-right{display:flex;align-items:center;gap:8px;margin-left:auto}
.period-pill{font-size:11px;color:var(--text-2);background:#fff;border:1px solid var(--border-2);border-radius:999px;padding:5px 12px;cursor:pointer;display:flex;align-items:center;gap:6px;font-weight:500;}
.export-btn{font-size:11px;font-weight:700;color:var(--primary);background:var(--purple-light);border:1px solid var(--purple-med);border-radius:999px;padding:6px 14px;cursor:pointer;font-family:inherit;transition:all .15s;}
.export-btn:hover{background:var(--purple-med);color:var(--purple-dark)}

/* FILTER BAR */
.filter-bar{background:#fff;border-bottom:1px solid var(--border);padding:8px 28px;display:flex;align-items:center;gap:8px;position:sticky;top:54px;z-index:99;}
.fl-lbl{font-size:10px;color:var(--text-3);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.fchip{padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;border:1px solid var(--border-2);background:#fff;color:var(--text-2);cursor:pointer;transition:all .12s;}
.fchip:hover{border-color:var(--purple-med);color:var(--primary)}
.fchip.on{background:var(--purple-light);color:var(--primary);border-color:var(--purple-med)}
.fl-sep{width:1px;height:14px;background:var(--border);margin:0 2px}

/* KPI STRIP (dev tab) */
.kpi-strip{display:grid;grid-template-columns:1fr 1fr 1fr 1.8fr;gap:14px;padding:16px 28px;flex-shrink:0}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);padding:16px 18px;transition:box-shadow .2s,border-color .2s;}
.kpi:hover{box-shadow:var(--shadow-pop);border-color:var(--purple-med)}
.kpi.border-red{border-top:3px solid var(--coral-core)}
.kpi.border-yellow{border-top:3px solid var(--gold-core)}
.kpi-lbl{font-size:10px;color:var(--text-3);margin-bottom:6px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.kpi-val{font-size:32px;font-weight:500;color:var(--text);font-family:'JetBrains Mono',monospace;letter-spacing:-.035em;line-height:1.1;}
.kpi-val span{font-size:12px;font-weight:400;color:var(--text-3);margin-left:2px;letter-spacing:0}
.kpi-val.bad{color:var(--coral-dark)}
.kpi-val.mid{color:var(--gold-dark)}
.kpi-delta{font-size:11px;color:var(--text-3);margin-top:4px;font-weight:500}
.kpi-delta.dn{color:var(--coral-dark);font-weight:700}
.kpi-delta.up{color:var(--green-dark);font-weight:700}
.conclusion-pills{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0 4px}
.cpill{padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;background:var(--coral-light);color:var(--coral-dark)}
.cpill.mid{background:var(--gold-light);color:var(--gold-dark)}

/* OVERVIEW BODY */
.ov-body{padding:16px 28px 48px;display:flex;flex-direction:column;gap:20px}
.ov-section-hdr{font-size:14px;font-weight:800;color:var(--text);letter-spacing:-.01em;display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.ov-section-hdr-line{flex:1;height:1px;background:var(--border)}

/* TOP KPI CARDS — 关键：大圆角+顶边彩色+JetBrains Mono大数字 */
.ov-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.ov-kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);padding:18px 20px;transition:box-shadow .2s,border-color .2s;position:relative;overflow:hidden;}
.ov-kpi:hover{box-shadow:var(--shadow-pop);border-color:var(--purple-med)}
.ov-kpi.border-red   {border-top:3px solid var(--coral-core);border-left:none}
.ov-kpi.border-yellow{border-top:3px solid var(--gold-core);border-left:none}
.ov-kpi.border-green {border-top:3px solid var(--green-dark);border-left:none}
.ov-kpi-lbl{font-size:11px;color:var(--text-3);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.ov-kpi-val{font-size:38px;font-weight:500;color:var(--text);font-family:'JetBrains Mono',monospace;letter-spacing:-.04em;line-height:1.1;}
.ov-kpi-val.bad{color:var(--coral-dark)}
.ov-kpi-val.mid{color:var(--gold-dark)}
.ov-kpi-val.ok{color:var(--green-dark)}
.ov-kpi-sub{font-size:11px;color:var(--text-3);margin-top:5px;font-weight:500}
.ov-kpi-sub.dn{color:var(--coral-dark);font-weight:700}
.ov-kpi-sub.up{color:var(--green-dark);font-weight:700}

/* HEALTH MATRIX — 关键：紫色表头+大圆角cell+JetBrains Mono */
/* ── Heatmap Matrix (总览 + 用户旅程 共用规则) ── */
.hm-grid{display:grid;gap:5px;margin-top:4px}
.hm-header{font-size:10px;font-weight:700;color:var(--text-3);text-align:center;padding:6px 4px;text-transform:uppercase;letter-spacing:.04em}
.hm-header.first{text-align:left;padding-left:4px}
.hm-row-label{display:flex;flex-direction:column;justify-content:center;padding:0 4px;font-size:12px;font-weight:700;color:var(--text)}
.hm-row-label small{font-size:9.5px;font-weight:500;color:var(--text-3);margin-top:1px}
/* 格子：两处共用 */
.hm-cell,.tp-heat-cell{border-radius:8px;height:38px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;border:2px solid transparent;}
.hm-cell:hover,.tp-heat-cell:hover{transform:scale(1.05);z-index:2;box-shadow:0 4px 14px rgba(106,103,206,.22)}
.hm-cell.hm-sel,.tp-heat-cell.tp-heat-sel{border-color:var(--primary);box-shadow:0 0 0 3px rgba(106,103,206,.15);transform:scale(1.06)}
/* 格子内容：两处共用 */
.hm-cell .cv,.tp-heat-cell .cv{font-size:13px;font-weight:800;letter-spacing:-.02em;font-family:'JetBrains Mono',monospace}
.hm-cell .ct,.tp-heat-cell .ct{font-size:9px;font-weight:600;opacity:.7;margin-top:1px}
/* 矩阵布局（外层）：display:grid，右列 clamp 自适应，不换行 */
/* grid-template-columns:1fr clamp(180px,22%,240px); gap:14px; align-items:start */
/* 矩阵内部：min-width 保底，overflow:auto 横向滚动 */
.hm-legend{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--text-3);font-weight:500}
.hm-grad{height:8px;width:100px;border-radius:4px;background:linear-gradient(90deg,#FEEFF0 0%,#FFB6C8 35%,#FFE87F 55%,#EBFCF7 80%,#9DFBE8 100%)}

/* OV TWO-COL CARDS */
.ov-two-col{display:grid;grid-template-columns:1.5fr 1fr;gap:14px}
.ov-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);overflow:hidden;}
.ov-card-hdr{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;}
.ov-card-hdr-title{font-size:14px;font-weight:800;flex:1;letter-spacing:-.01em}
.ov-card-hdr-badge{font-size:10px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--coral-light);color:var(--coral-dark);}

/* ACTION ITEMS */
.action-item{display:flex;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);align-items:flex-start;transition:background .12s;}
.action-item:last-child{border-bottom:none}
.action-item:hover{background:var(--g1)}
.action-num{width:24px;height:24px;border-radius:8px;background:linear-gradient(135deg,var(--purple-core),var(--purple-bright));color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-family:'JetBrains Mono',monospace;}
.action-body{flex:1;min-width:0}
.action-title{font-size:12px;font-weight:600;color:var(--text);margin-bottom:2px;line-height:1.45}
.action-meta{font-size:10px;color:var(--text-3);line-height:1.4}
.action-tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;flex-shrink:0}
.action-tag.urgent{background:var(--coral-light);color:var(--coral-dark)}
.action-tag.planned{background:var(--gold-light);color:var(--gold-dark)}

/* CUSTOMER BAR LIST */
.cust-list{padding:6px 0}
.cust-bar-row{display:flex;align-items:center;gap:8px;padding:8px 18px;border-bottom:1px solid var(--border);}
.cust-bar-row:last-child{border-bottom:none}
.cust-name{font-size:11px;font-weight:700;color:var(--text);width:34px;flex-shrink:0}
.cust-bar-track{flex:1;height:7px;background:var(--g2);border-radius:99px;overflow:hidden}
.cust-bar-fill{height:100%;border-radius:99px}
.cust-bar-fill.bad{background:linear-gradient(90deg,var(--coral-bright),var(--coral-dark))}
.cust-bar-fill.mid{background:linear-gradient(90deg,var(--gold-core),var(--gold-dark))}
.cust-bar-fill.ok{background:linear-gradient(90deg,var(--green-core),var(--green-dark))}
.cust-pct{font-size:11px;font-weight:800;width:30px;text-align:right;flex-shrink:0;font-family:'JetBrains Mono',monospace;}
.cust-pct.bad{color:var(--coral-dark)}
.cust-pct.mid{color:var(--gold-dark)}
.cust-delta{font-size:10px;width:36px;flex-shrink:0;font-weight:700;font-family:'JetBrains Mono',monospace;}
.cust-delta.dn{color:var(--coral-dark)}
.cust-delta.up{color:var(--green-dark)}
.cust-delta.flat{color:var(--text-3)}

/* SNAPSHOT ROW */
.ov-snap-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.snap-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);overflow:hidden;transition:box-shadow .2s,border-color .2s;}
.snap-card:hover{box-shadow:var(--shadow-pop);border-color:var(--purple-med)}
.snap-card-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;}
.snap-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.snap-icon.red{background:linear-gradient(135deg,var(--coral-light),var(--coral-med))}
.snap-icon.blue{background:linear-gradient(135deg,var(--teal-light),var(--teal-med))}
.snap-icon.green{background:linear-gradient(135deg,var(--green-light),var(--green-faded))}
.snap-title{font-size:13px;font-weight:800;flex:1;letter-spacing:-.01em}
.snap-body{padding:12px 16px}
.snap-big-stat{display:flex;align-items:baseline;gap:5px;margin-bottom:6px}
.snap-big-val{font-size:28px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:-.035em;}
.snap-big-val.bad{color:var(--coral-dark)}
.snap-big-val.ok{color:var(--green-dark)}
.snap-big-val.mid{color:var(--gold-dark)}
.snap-big-lbl{font-size:11px;color:var(--text-3)}
.snap-big-delta{font-size:11px;font-weight:700}
.snap-big-delta.dn{color:var(--coral-dark)}
.snap-big-delta.up{color:var(--green-dark)}
.snap-divider{height:1px;background:var(--border);margin:8px 0}
.snap-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0}
.snap-row-lbl{font-size:10px;color:var(--text-3)}
.snap-row-val{font-size:11px;font-weight:700;color:var(--text);font-family:'JetBrains Mono',monospace;}
.snap-row-val.bad{color:var(--coral-dark)}
.snap-row-val.mid{color:var(--gold-dark)}
.snap-row-val.ok{color:var(--green-dark)}

/* VOD HIGH-FREQ */
.vod-hf-list{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
/* VOD 左右布局：图表(260px)+内容卡片(flex:1)，见 patterns.md § VOD Layout */
.vod-hf-item{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-m);padding:12px 14px;display:flex;gap:10px;align-items:flex-start;transition:all .15s;}
.vod-hf-item:hover{border-color:var(--purple-med);box-shadow:var(--shadow-soft)}
.vod-hf-num{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--purple-bright),var(--purple-core));color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-family:'JetBrains Mono',monospace;}
.vod-hf-body{flex:1;min-width:0}
.vod-hf-vol{font-size:20px;font-weight:500;color:var(--purple-bright);font-family:'JetBrains Mono',monospace;letter-spacing:-.03em;}
.vod-hf-text{font-size:11px;color:var(--text);line-height:1.6;margin:3px 0}
.vod-hf-meta{font-size:10px;color:var(--text-3)}

/* MAIN BODY */
.main-body{display:flex;flex-direction:column;padding:16px 28px 48px;gap:14px}

/* SCENE LIST */
.scene-list{width:100%;display:flex;flex-direction:column;gap:8px}
#sceneListCards{display:flex;flex-wrap:wrap;gap:10px}
.sl-hdr{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;display:flex;justify-content:space-between;align-items:center;padding:0 2px;margin-bottom:8px;flex-shrink:0;}
.sort-toggle{display:flex;border:1px solid var(--border-2);border-radius:8px;overflow:hidden;flex-shrink:0;background:#fff}
.sort-btn{font-size:10px;font-weight:600;padding:4px 10px;border:none;background:#fff;color:var(--text-2);cursor:pointer;font-family:inherit;transition:all .12s;white-space:nowrap;}
.sort-btn.on{background:var(--primary);color:#fff}

/* SCENE CARDS */
.sc{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);padding:0;cursor:pointer;transition:all .2s;position:relative;width:calc(25% - 8px);min-width:160px;box-sizing:border-box;overflow:hidden;}
.sc:hover{transform:translateY(-2px);border-color:var(--purple-med);box-shadow:var(--shadow-pop)}
.sc.sel{border-color:var(--primary)!important;box-shadow:0 0 0 2px rgba(106,103,206,.2)}
.sc-top{padding:12px 14px 10px;display:flex;align-items:flex-start;gap:8px;}
.sc:nth-child(4n+1) .sc-top{background:var(--green-light)}
.sc:nth-child(4n+2) .sc-top{background:var(--gold-light)}
.sc:nth-child(4n+3) .sc-top{background:var(--coral-light)}
.sc:nth-child(4n+4) .sc-top,.sc.sel .sc-top{background:var(--purple-light)}
.sc-rank{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;background:rgba(255,255,255,.75);font-family:'JetBrains Mono',monospace;}
.sc-rank.bad{color:var(--coral-dark)}
.sc-rank.mid{color:var(--gold-dark)}
.sc-rank.ok{color:var(--green-dark)}
.sc-title{flex:1;min-width:0}
/* sc-name 颜色必须通过 JS inline style 按 grade 设置，不用 CSS 静态颜色 */
/* bad→#E63838  mid→#FD9A00  ok→#37C597 */
.sc-name{font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.sc-grade-row{display:flex;align-items:center;gap:6px}
.grade-tag{font-size:10px;font-weight:700;padding:1px 6px;border-radius:5px;background:rgba(255,255,255,.75);}
.grade-tag.bad{color:var(--coral-dark)}
.grade-tag.mid{color:var(--gold-dark)}
.grade-tag.ok{color:var(--green-dark)}
.sc-score-row{display:flex;align-items:center;gap:6px;margin:10px 14px 6px}
.sc-score{font-size:24px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:-.03em;}
.sc-score.bad{color:var(--coral-dark)}
.sc-score.mid{color:var(--gold-dark)}
.sc-score.ok{color:var(--green-dark)}
.sc-trend{font-size:11px;font-weight:700}
.sc-trend.dn{color:var(--coral-dark)}
.sc-trend.up{color:var(--green-dark)}
.sc-trend.flat{color:var(--text-3)}
.sc-spark{flex:1;height:22px;margin-left:4px}
.sc-evidence{display:flex;gap:5px;margin:0 14px 12px}
.ev-chip{font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;cursor:default}
.ev-chip.red{background:var(--coral-light);color:var(--coral-dark)}
.ev-chip.yellow{background:var(--gold-light);color:var(--gold-dark)}
.ev-chip.gray{background:var(--g2);color:var(--text-3)}

/* SCENE DETAIL */
.scene-detail{flex:1;background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);min-width:0;overflow:visible;}
.sd-hint{padding:80px 0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--text-3);font-size:13px}
.det-hdr{padding:18px 22px 14px;border-bottom:1px solid var(--border);flex-shrink:0}
.det-name-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.det-name{font-size:18px;font-weight:800;flex:1;letter-spacing:-.01em}
.det-grade{font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px}
.det-grade.bad{background:var(--coral-light);color:var(--coral-dark)}
.det-grade.mid{background:var(--gold-light);color:var(--gold-dark)}
.det-grade.ok{background:var(--green-light);color:var(--green-dark)}
.det-score{font-size:44px;font-weight:500;letter-spacing:-.04em;font-family:'JetBrains Mono',monospace;line-height:1;}
.det-score.bad{color:var(--coral-dark)}
.det-score.mid{color:var(--gold-dark)}
.det-score.ok{color:var(--green-dark)}

/* RANK CONTEXT */
.rank-ctx{display:flex;align-items:center;gap:10px;padding:10px 22px;background:var(--g1);border-bottom:1px solid var(--border);flex-shrink:0;position:relative;}
.rank-pill{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap;background:var(--coral-light);color:var(--coral-dark);}
.rank-pill.mid{background:var(--gold-light);color:var(--gold-dark)}
.rank-pill.ok{background:var(--green-light);color:var(--green-dark)}
.rank-desc{font-size:11px;color:var(--text-3);flex:1}
.rank-mini-bars{display:flex;align-items:flex-end;gap:3px;height:20px}
.rank-bar{width:10px;border-radius:3px 3px 0 0;background:var(--g3);opacity:.6}
.rank-bar.cur{opacity:1}
.rank-bar.bad{background:var(--coral-dark)}
.rank-bar.mid{background:var(--gold-dark)}
.rank-bar.ok{background:var(--green-dark)}
.rank-mean{font-size:10px;color:var(--text-3);white-space:nowrap;font-family:'JetBrains Mono',monospace;}

/* RADAR */
.radar-section{padding:14px 22px 16px;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--g1);position:relative;}
.radar-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.radar-lbl{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;flex:1}
.radar-worst{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:var(--coral-light);color:var(--coral-dark);}
.radar-body{display:flex;align-items:stretch;gap:0}
.chart-col{flex:1;min-width:0;padding-right:18px;border-right:1px solid var(--border);display:flex;flex-direction:column;gap:8px}
.radar-col{flex:1;min-width:0;padding-left:18px;display:flex;align-items:center;gap:12px}
.col-lbl{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em}
.stab-tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;align-self:flex-start}
.stab-tag.stable{background:var(--green-light);color:var(--green-dark)}
.stab-tag.moderate{background:var(--gold-light);color:var(--gold-dark)}
.stab-tag.unstable{background:var(--coral-light);color:var(--coral-dark)}
.radar-legend{display:flex;flex-direction:column;gap:7px}
.radar-dim{display:flex;align-items:center;gap:7px}
.radar-dim-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.radar-dim-lbl{font-size:10px;color:var(--text-3);flex:1;white-space:nowrap}
.radar-dim-val{font-size:12px;font-weight:800;width:28px;text-align:right;font-family:'JetBrains Mono',monospace;}

/* EVIDENCE TABS */
.ev-tabs{display:flex;border-bottom:1px solid var(--border);background:#fff}
.ev-tab{padding:10px 18px;font-size:12px;font-weight:600;color:var(--text-3);border:none;background:none;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:6px;}
.ev-tab:hover{color:var(--text)}
.ev-tab.on{color:var(--primary);border-bottom-color:var(--primary);font-weight:700}
.ev-tab .ev-tab-count{font-size:10px;font-weight:700;padding:1px 5px;border-radius:5px;background:var(--g2);color:var(--text-3);}
.ev-tab.on .ev-tab-count{background:var(--purple-light);color:var(--primary)}
.ev-panels{}
.ev-panel{display:none;padding:14px 22px 28px}
.ev-panel.on{display:block}

/* AGENT PANEL */
.agent-section-lbl{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
.agent-step-row{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);}
.agent-step-row:last-child{border-bottom:none}
.as-name{width:72px;font-size:11px;font-weight:700;color:var(--text);flex-shrink:0;padding-top:3px}
.as-right{flex:1;min-width:0}
.as-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.as-bar-track{flex:1;height:7px;background:var(--g2);border-radius:99px;overflow:hidden}
.as-bar-fill{height:100%;border-radius:99px}
.as-bar-fill.bad{background:linear-gradient(90deg,var(--coral-bright),var(--coral-dark))}
.as-bar-fill.mid{background:linear-gradient(90deg,var(--gold-core),var(--gold-dark))}
.as-bar-fill.ok{background:linear-gradient(90deg,var(--green-core),var(--green-dark))}
.as-score{font-size:12px;font-weight:800;width:32px;text-align:right;flex-shrink:0;font-family:'JetBrains Mono',monospace;}
.as-score.bad{color:var(--coral-dark)}
.as-score.mid{color:var(--gold-dark)}
.as-score.ok{color:var(--green-dark)}
.as-summary{font-size:11px;color:var(--text-2);line-height:1.6;margin-bottom:6px}
.as-summary b{font-size:9px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:3px}
.as-obs{margin-bottom:6px}
.as-obs b{font-size:9px;font-weight:700;color:var(--coral-dark);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px}
.as-obs-list{display:flex;flex-direction:column;gap:3px}
.as-obs-item{font-size:11px;color:var(--text);line-height:1.5;padding:5px 10px 5px 12px;background:var(--coral-light);border-left:2px solid var(--coral-med);border-radius:0 6px 6px 0;}
.tool-chain-row{margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}
.tool-chain-lbl{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.tool-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.tool-chip{font-size:10px;font-weight:700;padding:3px 9px;border-radius:6px;border:1px solid transparent}
.tool-chip.ok{background:var(--green-light);border-color:var(--green-faded);color:var(--green-dark)}
.tool-chip.warn{background:var(--gold-light);border-color:var(--gold-med);color:var(--gold-dark)}
.tool-chip.crit{background:var(--coral-light);border-color:var(--coral-med);color:var(--coral-dark)}
.tool-arrow{color:var(--text-3);font-size:11px}

/* STEP METRICS */
.step-metrics{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;margin-top:8px}
.step-metric{background:var(--g1);border:1px solid var(--border);border-radius:var(--radius-s);padding:8px 10px}
.step-metric-lbl{font-size:10px;color:var(--text-3);margin-bottom:4px;line-height:1.3}
.step-metric-bottom{display:flex;align-items:baseline;gap:5px}
.step-metric-val{font-size:16px;font-weight:800;font-family:'JetBrains Mono',monospace;}
.step-metric-val.bad{color:var(--coral-dark)}
.step-metric-val.mid{color:var(--gold-dark)}
.step-metric-val.ok{color:var(--green-dark)}
.step-metric-val.neutral{color:var(--text)}
.step-metric-trend{font-size:10px;font-weight:700}
.step-metric-trend.dn{color:var(--coral-dark)}
.step-metric-trend.up{color:var(--green-dark)}
.step-metric-trend.flat{color:var(--text-3)}

/* PAIN PANEL */
.pain-cat-section{margin-bottom:14px}
.pain-cat-hdr{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.cat-badge{font-size:10px;font-weight:700;padding:2px 9px;border-radius:999px;border:1.5px solid;white-space:nowrap;flex-shrink:0}
.cat-sum-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.cat-sum-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:700;border:1.5px solid;white-space:nowrap;cursor:pointer;opacity:.5;transition:opacity .15s,box-shadow .15s;}
.cat-sum-chip.on,.cat-sum-chip:hover{opacity:1}
.cat-sum-chip.on{box-shadow:var(--shadow-pop)}
.cat-sum-chip.all{background:var(--g2);color:var(--text-2);border-color:var(--g4)}
.cat-sum-chip.tool{background:var(--gold-light);color:var(--gold-dark);border-color:var(--gold-med)}
.cat-sum-chip.doc{background:var(--teal-light);color:var(--teal-dark);border-color:var(--teal-med)}
.cat-sum-chip.api{background:var(--purple-light);color:var(--purple-dark);border-color:var(--purple-med)}
.cat-sum-chip.env{background:var(--green-light);color:var(--green-dark);border-color:var(--green-faded)}
.cat-sum-n{font-weight:800;font-size:12px;font-family:'JetBrains Mono',monospace;}
.cat-badge.doc{background:#fff;color:var(--teal-dark);border-color:var(--teal-med)}
.cat-badge.tool{background:#fff;color:var(--gold-dark);border-color:var(--gold-med)}
.cat-badge.api{background:#fff;color:var(--purple-dark);border-color:var(--purple-med)}
.cat-badge.env{background:#fff;color:var(--green-dark);border-color:var(--green-faded)}
.cat-count{font-size:10px;color:var(--text-3)}
.pain-item{background:var(--g1);border:1px solid var(--border);border-radius:var(--radius-s);padding:8px 10px;margin-bottom:6px;transition:all .15s;}
.pain-item:hover{border-color:var(--purple-med);background:#fff;box-shadow:var(--shadow-soft)}
.pain-top{display:flex;align-items:flex-start;gap:8px}
.pain-score{font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;background:var(--coral-light);color:var(--coral-dark);flex-shrink:0;margin-top:1px;font-family:'JetBrains Mono',monospace;}
.pain-body{flex:1;min-width:0}
.pain-text{font-size:11px;color:var(--text);line-height:1.45;margin-bottom:2px}
.pain-meta{font-size:10px;color:var(--text-3)}
.pain-next{display:flex;align-items:center;gap:6px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--border);}
.pain-next-lbl{font-size:10px;font-weight:700;color:var(--teal-dark);text-transform:uppercase;letter-spacing:.04em;flex-shrink:0}
.pain-next-text{font-size:11px;color:var(--teal-dark);cursor:pointer;line-height:1.5}
.pain-next-text:hover{text-decoration:underline}
.pain-status{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;margin-left:auto;flex-shrink:0}
.pain-status.progress{background:var(--purple-light);color:var(--purple-dark)}
.pain-status.planned{background:var(--gold-light);color:var(--gold-dark)}

/* VOD ITEM */
.vod-item{border:1px solid var(--border);border-radius:var(--radius-m);padding:12px 14px;margin-bottom:10px;background:var(--g1);transition:all .15s;}
.vod-item:hover{border-color:var(--purple-med);background:#fff;box-shadow:var(--shadow-soft)}
.vod-vol-row{display:flex;align-items:baseline;gap:6px;margin-bottom:8px}
.vod-vol{font-size:26px;font-weight:500;color:var(--purple-bright);font-family:'JetBrains Mono',monospace;letter-spacing:-.03em;}
.vod-unit{font-size:11px;color:var(--text-3)}
.vod-trend{font-size:12px;font-weight:700}
.vod-trend.dn{color:var(--coral-dark)}
.vod-trend.flat{color:var(--gold-dark)}
.vod-quote{font-size:12px;color:var(--text-2);line-height:1.7;padding:8px 12px 8px 16px;background:#fff;border-radius:var(--radius-s);position:relative;border-left:3px solid var(--purple-med);font-style:italic;}
.vod-quote::before{display:none}
.vod-src{font-size:10px;color:var(--text-3);margin-top:6px}

/* CALLOUT + RATIONALE */
.callout-badge{display:none;position:absolute;width:18px;height:18px;border-radius:50%;background:var(--teal-core);color:#fff;font-size:9px;font-weight:700;align-items:center;justify-content:center;border:1.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);z-index:20;pointer-events:none;}
body.rat-open .callout-badge{display:flex}
body.rat-open .hl-target{transition:outline .1s}
body.hl-1 .hl-1,body.hl-2 .hl-2,body.hl-3 .hl-3,body.hl-4 .hl-4,body.hl-5 .hl-5,body.hl-6 .hl-6{outline:2px solid var(--teal-core);outline-offset:2px;border-radius:6px;}
.rat-sidebar{width:0;overflow:hidden;flex-shrink:0;position:sticky;top:100px;align-self:flex-start;transition:width .22s ease;max-height:calc(100vh - 120px)}
body.rat-open .rat-sidebar{width:264px}
.rat-sidebar-inner{width:264px;background:#fff;border:1px solid var(--border);border-left:3px solid var(--teal-core);border-radius:var(--radius-m);overflow-y:auto;max-height:calc(100vh - 160px);}
.float-rat-btn{position:fixed;bottom:22px;right:22px;z-index:300;display:flex;align-items:center;gap:7px;padding:8px 16px;background:#fff;border:1px solid var(--border);border-radius:999px;box-shadow:0 4px 16px rgba(0,0,0,.1);font-size:12px;font-weight:600;color:var(--text-2);cursor:pointer;font-family:inherit;transition:all .15s;}
.float-rat-btn:hover,.float-rat-btn.open{border-color:var(--teal-core);color:var(--teal-dark);background:var(--teal-light)}
.rat-panel-hdr{font-size:10px;font-weight:700;color:var(--teal-dark);text-transform:uppercase;letter-spacing:.07em;padding:13px 16px 10px;border-bottom:1px solid var(--border);}
.rat-item{display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border);cursor:default}
.rat-item:last-child{border-bottom:none}
.rat-item:hover,.rat-item.hl{background:var(--teal-light)}
.rat-num{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--teal-core),var(--teal-dark));color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.rat-content{}
.rat-head{font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px}
.rat-source{font-size:10px;font-weight:700;color:var(--teal-dark);background:var(--teal-light);padding:1px 6px;border-radius:5px;display:inline-block;margin-bottom:5px}
.rat-body{font-size:11px;color:var(--text-3);line-height:1.65}
.rat-pointer{font-size:10px;color:var(--teal-dark);margin-top:4px;font-weight:600}
.community-shell{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--text-3);padding:60px}
.community-shell h3{font-size:15px;font-weight:700;color:var(--text)}
.community-shell p{font-size:13px;text-align:center;max-width:400px;line-height:1.7}
.sub-tab-bar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;display:flex;position:sticky;top:54px;z-index:98}
.sub-tab{height:42px;font-size:13px;font-weight:600;color:var(--text-3);border:none;background:none;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px;padding:0 16px;font-family:inherit;transition:all .15s;}
.sub-tab:hover{color:var(--text)}
.sub-tab.on{color:var(--primary);border-bottom-color:var(--primary)}
.ov-rat-panel{position:fixed;top:90px;right:-292px;width:272px;background:#fff;border:1px solid var(--border);border-left:3px solid var(--teal-core);border-radius:var(--radius-m) 0 0 var(--radius-m);z-index:200;box-shadow:-2px 4px 20px rgba(0,0,0,.08);transition:right .22s ease;max-height:calc(100vh - 110px);overflow-y:auto;}
body.ov-rat-open .ov-rat-panel{right:0}
.role-dim{opacity:.2;filter:grayscale(.15);transition:opacity .2s,filter .2s;pointer-events:none}
.role-focus-badge{font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:var(--teal-light);color:var(--teal-dark);border:1px solid var(--teal-med);margin-left:8px;vertical-align:middle;letter-spacing:0;text-transform:none}
.layer-sec{padding:12px 0 0}
.layer-hdr{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.layer-badge{font-size:10px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.07em;flex-shrink:0}
.layer-badge.core{background:var(--coral-light);color:var(--coral-dark);border:1px solid var(--coral-med)}
.layer-badge.dev{background:var(--teal-light);color:var(--teal-dark);border:1px solid var(--teal-med)}
.layer-badge.eco{background:var(--green-light);color:var(--green-dark);border:1px solid var(--green-faded)}
.layer-hdr-title{font-size:13px;font-weight:700;color:var(--text)}
.layer-hdr-desc{font-size:11px;color:var(--text-3);margin-left:4px}
.layer-hdr-line{flex:1;height:1px;background:var(--border)}

/* TOUCHPOINT MATRIX */
.tp-layout{display:flex;gap:16px;padding:16px 28px 48px;align-items:flex-start}
.tp-matrix-wrap{flex:1;min-width:0}
.tp-detail-col{width:296px;flex-shrink:0;position:sticky;top:100px;align-self:flex-start}
.tp-detail-card{background:#fff;border:1px solid var(--border);border-left:3px solid var(--primary);border-radius:var(--radius-m);overflow:hidden}
.tp-detail-hint{padding:48px 20px;text-align:center;color:var(--text-3);font-size:12px;background:#fff;border:1px solid var(--border);border-radius:var(--radius-m);line-height:1.6}
.tp-detail-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.tp-detail-title-wrap{flex:1;min-width:0}
.tp-detail-scene{font-size:13px;font-weight:700;color:var(--text)}
.tp-detail-col-lbl{font-size:10px;color:var(--text-3);margin-top:1px}
.tp-detail-body{padding:14px 16px}
.tp-obs-lbl{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.tp-obs-item{font-size:11px;color:var(--text);line-height:1.5;padding:5px 8px 5px 10px;border-radius:0 6px 6px 0;margin-bottom:5px}
.tp-obs-item.bad{background:var(--coral-light);border-left:2px solid var(--coral-med)}
.tp-obs-item.mid{background:var(--gold-light);border-left:2px solid var(--gold-med)}
.tp-obs-item.ok{background:var(--green-light);border-left:2px solid var(--green-faded)}
.tp-cta{display:flex;align-items:center;gap:6px;margin-top:14px;padding-top:10px;border-top:1px solid var(--border);color:var(--primary);font-size:11px;font-weight:700;cursor:pointer}
.tp-cta:hover{color:var(--purple-dark);text-decoration:underline}
.tp-legend{display:flex;gap:14px;margin-top:10px}
.tp-legend-item{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text-3);font-weight:500}
.tp-legend-dot{width:9px;height:9px;border-radius:3px}
.tp-legend-dot.bad{background:var(--coral-light);border:1px solid var(--coral-med)}
.tp-legend-dot.mid{background:var(--gold-light);border:1px solid var(--gold-med)}
.tp-legend-dot.ok{background:var(--green-light);border:1px solid var(--green-faded)}

/* PAIN/ECO/VOD SHARED */
.pain-body{padding:16px 28px 48px;display:flex;flex-direction:column;gap:16px}
.pain-top-row{display:grid;grid-template-columns:1fr 1.4fr;gap:14px}
.pain-dist-row{display:flex;align-items:center;gap:10px;padding:8px 16px;border-bottom:1px solid var(--border);}
.pain-dist-row:last-child{border-bottom:none}
.pain-dist-lbl{font-size:11px;color:var(--text-2);flex:1}
.pain-dist-bar-track{width:100px;height:6px;background:var(--g2);border-radius:99px;overflow:hidden;flex-shrink:0}
.pain-dist-bar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--coral-bright),var(--coral-dark));opacity:.8}
.pain-dist-n{font-size:11px;font-weight:800;color:var(--text);width:24px;text-align:right;flex-shrink:0;font-family:'JetBrains Mono',monospace;}
.eco-body{padding:16px 28px 48px;display:flex;flex-direction:column;gap:16px}
.eco-three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.eco-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);overflow:hidden}
.eco-card-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px;font-size:14px;font-weight:800;letter-spacing:-.01em}
.eco-card-body{padding:6px 14px}
.eco-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:11px}
.eco-row:last-child{border-bottom:none}
.eco-row-lbl{color:var(--text-3)}
.eco-row-val{font-weight:700;font-family:'JetBrains Mono',monospace;}
.eco-row-val.ok{color:var(--green-dark)}
.eco-row-val.mid{color:var(--gold-dark)}
.eco-row-val.bad{color:var(--coral-dark)}
.eco-tag{font-size:9px;font-weight:700;padding:1px 6px;border-radius:5px;flex-shrink:0}
.eco-tag.new{background:var(--green-light);color:var(--green-dark)}
.eco-tag.perf{background:var(--teal-light);color:var(--teal-dark)}
.eco-tag.e2e{background:var(--gold-light);color:var(--gold-dark)}
.vod-body{padding:16px 28px 48px;display:flex;flex-direction:column;gap:16px}
.vod-two-col{display:grid;grid-template-columns:1fr 1.6fr;gap:14px}
.vod-src-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-l);overflow:hidden}
.vod-src-row{display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid var(--border);}
.vod-src-row:last-child{border-bottom:none}
.vod-src-name{font-size:11px;color:var(--text-3);width:72px;flex-shrink:0}
.vod-src-bar-track{flex:1;height:6px;background:var(--g2);border-radius:99px;overflow:hidden}
.vod-src-bar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--purple-bright),var(--purple-core));opacity:.75}
.vod-src-pct{font-size:11px;font-weight:800;color:var(--text);width:34px;text-align:right;font-family:'JetBrains Mono',monospace;}
.vod-full-item{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-m);padding:12px 14px;margin-bottom:8px}
.vod-full-hdr{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
.vod-full-rank{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,var(--purple-bright),var(--purple-core));color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;font-family:'JetBrains Mono',monospace;}
.vod-full-vol{font-size:18px;font-weight:500;color:var(--purple-bright);font-family:'JetBrains Mono',monospace;}
.vod-full-unit{font-size:10px;color:var(--text-3)}
.vod-full-body{flex:1;min-width:0}
.vod-full-quote{font-size:12px;color:var(--text-2);line-height:1.7;padding:8px 10px 8px 16px;background:var(--g1);border-radius:var(--radius-s);border-left:3px solid var(--purple-med);font-style:italic;margin-bottom:6px}
.vod-full-quote::before{display:none}
.vod-full-meta{font-size:10px;color:var(--text-3)}
```
