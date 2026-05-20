# AscendOps Theme — CSS Tokens

Paste this `:root` block at the top of any `<style>` to load the full token set.

```css
:root {
  /* ====== 5 Hue Families ====== */
  --green-dark:   #37C597; --green-core:   #3BE880; --green-bright: #3BF7D1;
  --green-med:    #9DFBE8; --green-faded:  #C3EDDF; --green-light:  #EBFCF7;

  --teal-dark:    #179D8A; --teal-core:    #1AAFD0; --teal-bright:  #02CEFF;
  --teal-med:     #80E6FF; --teal-light:   #E8F7FB;

  --purple-dark:  #4F4DA7; --purple-core:  #6A67CE; --purple-bright:#A177FF;
  --purple-med:   #D0B8FF; --purple-light: #F0EFFA;

  --gold-dark:    #FD9A00; --gold-core:    #FFB900; --gold-bright:  #FFD200;
  --gold-med:     #FFE87F; --gold-light:   #FFF8E5;

  --coral-dark:   #E63838; --coral-core:   #FC636B; --coral-bright: #FF6D92;
  --coral-med:    #FFB6C8; --coral-light:  #FEEFF0;

  /* ====== Gray Scale (g1=lightest → g10=darkest) ====== */
  --g1: #F8F8F9; --g2: #EFF0F1; --g3: #E1E2E4; --g4: #CDCFD2; --g5: #B9BCC0;
  --g6: #A1A4AA; --g7: #898E95; --g8: #676D76; --g9: #495058; --g10:#1B2432;

  /* ====== Neutrals ====== */
  --white: #FFFFFF;
  --navy: #273347; --navy-title: #B3BCC4; --navy-text: #8897A3;

  /* ====== Semantic Roles ====== */
  --bg:           var(--g1);          /* page canvas */
  --card:         var(--white);       /* section card background */
  --border:       var(--g3);          /* default card/row border */
  --border-2:     var(--g4);          /* stronger border, inputs */
  --text:         var(--g10);         /* primary body text */
  --text-2:       var(--g9);          /* secondary text */
  --text-3:       var(--g6);          /* muted labels / timestamps */

  --primary:      var(--purple-core);   /* tabs, active underlines */
  --primary-2:    var(--purple-bright); /* accent CTAs, checkmarks */
  --primary-dark: var(--purple-dark);   /* hero title text */
  --primary-soft: var(--purple-light);  /* active tab bg */

  --accent:       var(--teal-core);
  --good:         var(--green-dark);    /* positive delta */
  --good-soft:    var(--green-light);
  --bad:          var(--coral-dark);    /* negative delta */
  --bad-soft:     var(--coral-light);
  --warn:         var(--gold-dark);     /* caution */
  --warn-soft:    var(--gold-light);

  /* ====== Hero Gradient ====== */
  /* Purple-med → Teal-med, soft & fresh */
  --hero-grad: linear-gradient(135deg, #D0B8FF 0%, #80E6FF 55%, #80E6FF 100%);

  /* ====== 4 Scene Card Families ====== */
  --s1-bg: var(--green-light);  --s1-fg: var(--green-dark);   /* Green  */
  --s2-bg: var(--gold-light);   --s2-fg: var(--gold-dark);    /* Gold   */
  --s3-bg: var(--coral-light);  --s3-fg: var(--coral-dark);   /* Coral  */
  --s4-bg: var(--purple-light); --s4-fg: var(--purple-dark);  /* Purple */

  /* ====== Radius ====== */
  --radius-xl: 22px;
  --radius-l:  18px;
  --radius-m:  12px;
  --radius-s:   8px;

  /* ====== Shadows ====== */
  --shadow-soft: 0 1px 2px rgba(39,51,71,.04), 0 4px 14px rgba(39,51,71,.04);
  --shadow-pop:  0 10px 30px rgba(106,103,206,.18);
}
```

## Typography imports
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

```css
/* Base type setup */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
/* All numeric displays */
.mono { font-family: 'JetBrains Mono', monospace; }
```
