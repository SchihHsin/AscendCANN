import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const urls=['https://ploy.ai/','https://ploy.ai/features/ai-website-builder','https://docs.ploy.ai/quick-start','https://docs.ploy.ai/site-builder','https://docs.ploy.ai/korra','https://docs.ploy.ai/tips-and-tricks','https://docs.ploy.ai/ploybooks','https://docs.ploy.ai/publishing','https://ploy.ai/library/the-joy-of-ploy-webinar-recap'];
const result=urls.map((url,i)=>{const html=execFileSync('curl',['-L','--max-time','30','-s',url],{encoding:'utf8',maxBuffer:12e6});const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,'\n').replace(/\n\s*\n/g,'\n');fs.writeFileSync(new URL(`./evidence/source-${i+1}.txt`,import.meta.url),text);return {id:i+1,url,retrieved:'2026-09-14',file:`source-${i+1}.txt`,title:html.match(/<title>(.*?)<\/title>/s)?.[1]};});
fs.writeFileSync(new URL('./evidence/sources.json',import.meta.url),JSON.stringify(result,null,2));
console.log('Archived',result.length,'public sources');
