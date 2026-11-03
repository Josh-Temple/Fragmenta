#!/usr/bin/env node
// Offline comparison SVG contact-sheet generator. No network or deployment.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/composition-guides.json');
const raw=fs.readFileSync(file,'utf8'),catalog=JSON.parse(raw);
const target=process.argv.includes('--out')?process.argv[process.argv.indexOf('--out')+1]:path.join(os.tmpdir(),'fragmenta-composition-review');
const out=path.resolve(target);
const hash=crypto.createHash('sha256').update(raw).digest('hex');
const palette=['#241e18','#77716b','#b6aca1','#c9c0b4','#b13c29'];
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const attr=o=>Object.entries(o).map(([k,v])=>' '+k+'="'+esc(v)+'"').join('');
const elem=(tag,p,body)=>'<'+tag+attr(p)+(body===undefined?'/>' :'>'+body+'</'+tag+'>');
function shape(s){
 const [k,...v]=s;
 if(k==='rect')return elem('rect',{x:v[0],y:v[1],width:v[2],height:v[3],fill:palette[v[4]]});
 if(k==='circle')return elem('circle',{cx:v[0],cy:v[1],r:v[2],fill:palette[v[3]]});
 if(k==='line')return elem('line',{x1:v[0],y1:v[1],x2:v[2],y2:v[3],stroke:palette[v[4]],'stroke-width':v[5],'stroke-linecap':'square'});
 if(k==='poly')return elem('polygon',{points:v[0],fill:palette[v[1]]});
 if(k==='text')return elem('text',{x:v[0],y:v[1],fill:palette[v[3]],'font-size':v[4],'font-family':'sans-serif','font-weight':600,'aria-hidden':'true'},esc(v[2]));
 throw Error('unknown shape: '+k);
}
function svg(g,v){
 const title=g.titleJa+'・'+(g.id==='C-110'?(v==='example'?'画風A':'画風B'):(v==='example'?'配置例':'対照例'));
 return '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="150" viewBox="0 0 240 150" role="img"'+attr({'aria-label':title})+'>'
 +'<title>'+esc(title)+'</title><rect x="0" y="0" width="240" height="150" fill="#f1e9de"/>'
 +g.diagram[v].map(shape).join('')+'</svg>';
}
const style='<style>body{margin:16px;font-family:system-ui,sans-serif;color:#241e18;background:#f5f4f1}'
+'.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}article{background:#fff;border:1px solid #aaa;padding:8px;break-inside:avoid}'
+'h2{font-size:15px;margin:0 0 5px}h3{font-size:12px;margin:0 0 4px}'
+'.pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pair svg{width:100%;height:auto}'
+'p{font-size:11px;line-height:1.3;margin:3px 0}.note{color:#6d4940}'
+'@page{size:A3 landscape;margin:8mm}@media print{body{margin:0}}</style>';
function card(g){
 return '<article id="'+esc(g.id)+'"><h2>'+esc(g.id+' '+g.titleJa)+'</h2><div class="pair">'
 +'<div><h3>配置例</h3>'+svg(g,'example')+'</div><div><h3>対照例</h3>'+svg(g,'comparison')+'</div></div>'
 +'<p>比較：'+esc(g.comparisonPoint)+'</p>'
 +(g.diagramNote?'<p class="note">限界：'+esc(g.diagramNote)+'</p>':'')+'</article>';
}
if(catalog.guides.length!==120||catalog.categories.length!==10)throw Error('Inventory changed');
const renderer=fs.readFileSync(path.join(root,'components/CompositionDiagram.tsx'),'utf8');
for(const k of ['rect','circle','line','poly','text'])if(!renderer.includes("kind === '"+k+"'"))throw Error('Renderer changed: '+k);
for(const color of palette)if(!renderer.includes(color))throw Error('Palette changed: '+color);
fs.mkdirSync(out,{recursive:true});
const headers=['id','title','checked_at_jst','reviewer_role','check_method','example_visual','comparison_visual','explanation_match','variable_isolation','small_screen_legibility','terminology_risk','source_status','finding','severity','fix_commit','post_fix_result','sheet','data_sha256'];
const quote=s=>'"'+String(s??'').replace(/"/g,'""')+'"';
const csv=[headers.map(quote).join(',')],pages=[];
for(let i=0;i<catalog.categories.length;i++){
 const cat=catalog.categories[i],items=catalog.guides.filter(g=>g.categoryId===cat.id);
 if(items.length!==12)throw Error('12 entries expected: '+cat.id);
 const name='contact-sheet-'+String(i+1).padStart(2,'0')+'.html';pages.push(name);
 const html='<!doctype html><html lang="ja"><meta charset="utf-8"><title>構図 '+esc(cat.label)+'</title>'+style
 +'<h1>構図 接触シート '+(i+1)+' / '+esc(cat.label)+'</h1><p>入力SHA256: '+hash+' ／ 自動生成であり目視完了の証拠ではありません</p>'
 +'<main class="grid">'+items.map(card).join('')+'</main></html>';
 fs.writeFileSync(path.join(out,name),html,'utf8');
 for(const g of items){
   const row={id:g.id,title:g.titleJa,checked_at_jst:'',reviewer_role:'B',check_method:'automated',example_visual:'NOT_RUN',
    comparison_visual:'NOT_RUN',explanation_match:'NOT_RUN',variable_isolation:'NOT_RUN',small_screen_legibility:'NOT_RUN',
    terminology_risk:'NOT_RUN',source_status:'NOT_CHECKED_BY_B',finding:'',severity:'',fix_commit:'',post_fix_result:'NOT_RUN',
    sheet:name,data_sha256:hash};
   csv.push(headers.map(k=>quote(row[k])).join(','));
 }
}
if(csv.length!==121)throw Error('Review row count mismatch');
fs.writeFileSync(path.join(out,'review-template.csv'),csv.join('\n')+'\n','utf8');
fs.writeFileSync(path.join(out,'index.html'),'<meta charset="utf-8"><h1>構図 120項目・240 SVG</h1><ul>'+pages.map(x=>'<li><a href="'+x+'">'+x+'</a></li>').join('')+'</ul>','utf8');
let screenshots=0,error=null;
if(process.argv.includes('--capture')){
 const chrome=process.env.CHROMIUM_BIN||process.env.CHROME_BIN||'chromium';
 for(const name of pages){
  const r=spawnSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run',
   '--hide-scrollbars','--window-size=1300,1750','--screenshot='+path.join(out,name.replace('.html','.png')),
   pathToFileURL(path.join(out,name)).href],{timeout:25000,encoding:'utf8'});
  if(r.status!==0){error='capture failed at '+name+': '+String(r.error?.message||r.stderr||r.status).slice(0,250);break;}
  screenshots++;
 }
}
const report={input_sha256:hash,items:120,svg_generated:240,pages:10,screenshots,actual_human_visual_review:0,
 checklist_status:'NOT_RUN',error};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({output:out,...report},null,2));
if(error)process.exitCode=2;
