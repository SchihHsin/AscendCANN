#!/usr/bin/env node
// Adapted from desktop-fullpage-screenshot/scripts/desktop_fullpage_capture.mjs.
// Public, signed-out evidence only; never connects to the user's browser profile.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/hsin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = path.dirname(new URL(import.meta.url).pathname);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ascend-evidence-public-'));
const targets = [
  {id:133, name:'08-public-knowledge-ascend-133', quote:'供遇到类似问题的同学/AI索引解决类似的问题'},
  {id:144, name:'02-scope-ascend-144', quote:'soc_version'},
  {id:29, name:'08-public-thread-29', quote:'PYTHONPATH'},
];
const pngSize = file => { const b=fs.readFileSync(file); return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)}; };
const context = await chromium.launchPersistentContext(profile, {
  executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless:true, viewport:{width:1440,height:900},deviceScaleFactor:1,
});
try {
  for (const target of targets.filter(item=>!process.argv[2]||item.id===Number(process.argv[2]))) {
    const page=await context.newPage();
    const url=`https://github.com/Ascend/pytorch/issues/${target.id}`;
    const prefix=path.join(out,target.name);
    try {
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
      if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
      await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});
      await page.getByText(target.quote,{exact:false}).first().waitFor({state:'visible',timeout:10000});
      const initialHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<=initialHeight+900;y+=760){await page.evaluate(v=>window.scrollTo(0,v),y);await page.waitForTimeout(160);}
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.waitForTimeout(350);
      const metrics=await page.evaluate(()=>{
        const de=document.documentElement,b=document.body;
        const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>20&&r.height>20&&s.display!=='none'&&s.visibility!=='hidden';};
        const overlays=[...document.querySelectorAll('[role="dialog"],dialog,[class*="cookie" i],[id*="cookie" i]')].filter(visible).map(el=>(el.innerText||'').slice(0,500));
        return {innerWidth:innerWidth,innerHeight:innerHeight,devicePixelRatio:devicePixelRatio,clientWidth:de.clientWidth,documentScrollWidth:de.scrollWidth,bodyScrollWidth:b.scrollWidth,scrollHeight:Math.max(de.scrollHeight,b.scrollHeight),horizontalOverflow:Math.max(de.scrollWidth,b.scrollWidth)>innerWidth,visibleCookieText:overlays.some(t=>/cookie|privacy|accept all/i.test(t)),visibleDialogs:overlays};
      });
      if(metrics.innerWidth!==1440||metrics.horizontalOverflow||metrics.visibleCookieText||metrics.visibleDialogs.length) throw new Error(`Capture rejected: ${JSON.stringify(metrics)}`);
      const full=`${prefix}-1440-full.png`,viewport=`${prefix}-1440-viewport.png`;
      await page.screenshot({path:full,fullPage:true});
      await page.screenshot({path:viewport});
      const regions=await page.evaluate(id=>{
        if(id===29){
          return [
            {id:'issuecomment-2044025963',label:'original-resolution',meaning:'2024年的排障原因与解决确认；公开评论使排障经过留存。'},
            {id:'issuecomment-3227277246',label:'later-reuse',meaning:'后来的开发者在同一线程引用 PYTHONPATH 建议并确认解决；展示公共经验被后续任务实际复用。'},
          ].map(item=>{
            const anchor=document.getElementById(item.id)||document.querySelector(`[data-testid="${item.id}"]`);
            if(!anchor) throw new Error(`Comment anchor absent: ${item.id}`);
            let region=anchor;
            while(region&&!region.querySelector('.markdown-body'))region=region.parentElement;
            if(!region||region===document.body) throw new Error(`Comment body absent: ${item.id}`);
            const r=region.getBoundingClientRect();
            let bottom=r.bottom, quote=region.innerText, confirmationUrl=null;
            if(item.label==='original-resolution'){
              const following=[...document.querySelectorAll('[id^="issuecomment-"]')].filter(el=>el.getBoundingClientRect().top>r.top+2).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
              let confirmation=following;
              while(confirmation&&!confirmation.querySelector('.markdown-body'))confirmation=confirmation.parentElement;
              if(confirmation?.innerText.includes('问题解决了')){
                bottom=confirmation.getBoundingClientRect().bottom;
                quote+='\n\n'+confirmation.innerText;
                confirmationUrl=`https://github.com/Ascend/pytorch/issues/29#${following.id}`;
              } else throw new Error('Original author confirmation not found next to reply');
            }
            return {label:item.label,meaning:item.meaning,quote,sourceUrl:`https://github.com/Ascend/pytorch/issues/29#${item.id}`,confirmationUrl,clip:{x:Math.max(0,Math.floor(r.x-8)),y:Math.max(0,Math.floor(r.y+scrollY-8)),width:Math.min(1440-Math.max(0,Math.floor(r.x-8)),Math.ceil(r.width+16)),height:Math.ceil(bottom-r.top+16)}};
          });
        }
        const nodes=[...document.querySelectorAll('.markdown-body')];
        const body=nodes.find(el=>id===133?el.innerText.includes('供遇到类似问题'):el.innerText.includes('Current environment'));
        if(!body) throw new Error('Issue markdown body not found');
        const br=body.getBoundingClientRect();
        const rect=(top,bottom)=>({x:Math.max(0,Math.floor(br.x-8)),y:Math.max(0,Math.floor(top+scrollY-8)),width:Math.ceil(br.width+16),height:Math.ceil(bottom-top+16)});
        if(id===133){
          const p=[...body.querySelectorAll('p,li,em')].filter(el=>el.innerText.includes('供遇到类似问题')).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
          const r=p.getBoundingClientRect();
          const lastIntro=[...body.querySelectorAll('p')].find(el=>el.innerText.includes('同一文件在 MindStudio'));
          const fix=[...body.querySelectorAll('p')].find(el=>el.innerText.includes('可以执行的修复方案'));
          const env=[...body.querySelectorAll('p')].find(el=>el.innerText.trim()==='环境信息');
          const result=[{label:'opening',meaning:'作者明确主动公开问题、分析和解决方案，供同学与 AI 索引；只证明这条公开回流路径存在。',quote:p.innerText,clip:rect(r.top,r.bottom)}];
          if(lastIntro)result.push({label:'opening-context',meaning:'作者信息、公开贡献目的与问题现象；可作为第08问题页的主截图。',quote:p.innerText,clip:rect(r.top-60,lastIntro.getBoundingClientRect().bottom)});
          if(fix&&env)result.push({label:'fix',meaning:'帖子提供三条可执行修复步骤，展示公开经验中存在可复用的修正方案。未由本机复现。',quote:body.innerText.slice(body.innerText.indexOf('可以执行的修复方案'),body.innerText.indexOf('环境信息')),clip:rect(fix.getBoundingClientRect().top,env.getBoundingClientRect().top-12)});
          return result;
        }
        const pre=[...body.querySelectorAll('pre')].find(el=>el.innerText.includes('PyTorch: 2.10.0+cpu'));
        const heading=[...body.querySelectorAll('h1,h2,h3,h4')].find(el=>el.innerText.includes('Current environment'));
        const expected=[...body.querySelectorAll('h1,h2,h3,h4')].find(el=>el.innerText.includes('Expected behavior'));
        const list=expected?.parentElement?.nextElementSibling?.tagName==='UL'?expected.parentElement.nextElementSibling:expected?.nextElementSibling;
        const items=[{label:'environment',meaning:'作者提供 PyTorch、torch_npu、CANN、NPU 型号与 soc_version，展示适用条件需要组合判断。',quote:pre.innerText,clip:rect(heading.getBoundingClientRect().top,pre.getBoundingClientRect().bottom)}];
        const what=[...body.querySelectorAll('h1,h2,h3,h4')].find(el=>el.innerText.includes('What happened'));
        const minimal=[...body.querySelectorAll('h1,h2,h3,h4')].find(el=>el.innerText==='Minimal repro');
        if(what&&minimal)items.push({label:'failure',meaning:'作者说明将 soc_version 104 暂时当 A2 绕过检查后仍然出现算子失败；没有记录 AI 参与。',quote:body.innerText.slice(body.innerText.indexOf('What happened'),body.innerText.indexOf('Minimal repro')),clip:rect(what.getBoundingClientRect().top,minimal.getBoundingClientRect().top-12)});
        if(expected&&list)items.push({label:'scope-request',meaning:'作者请求澄清支持范围，并提醒不能只把 104 映射成 A2 作为方案。',quote:list.innerText,clip:rect(expected.getBoundingClientRect().top,list.getBoundingClientRect().bottom)});
        return items;
      },target.id);
      for(const region of regions){
        region.screenshot=`${prefix}-${region.label}-clip.png`;
        await page.screenshot({path:region.screenshot,fullPage:true,clip:region.clip});
        region.savedImage=pngSize(region.screenshot);
      }
      const size=pngSize(full);
      if(size.width!==1440||Math.abs(size.height-metrics.scrollHeight)>4)throw new Error(`Saved dimension mismatch ${JSON.stringify(size)}`);
      const meta={url:page.url(),title:await page.title(),viewport:{width:1440,height:900,deviceScaleFactor:1},capturedAt:new Date().toISOString(),browserMetrics:metrics,loginState:'signed out; public GitHub issue',stateNote:'Independent temporary Playwright Chrome profile. No page content, styling or overlays modified. Full-page lazy-load scroll completed. Clips are browser screenshots of actual DOM regions.',screenshot:full,viewportScreenshot:viewport,savedImage:size,viewportSavedImage:pngSize(viewport),regions};
      fs.writeFileSync(`${prefix}-1440-meta.json`,JSON.stringify(meta,null,2)+'\n');
      process.stdout.write(JSON.stringify(meta)+'\n');
    } catch(error){
      const failure={url,capturedAt:new Date().toISOString(),error:error.message};
      fs.writeFileSync(`${prefix}-capture-failure.json`,JSON.stringify(failure,null,2)+'\n');
      process.stdout.write(JSON.stringify(failure)+'\n');
    } finally { await page.close(); }
  }
} finally { await context.close(); }
