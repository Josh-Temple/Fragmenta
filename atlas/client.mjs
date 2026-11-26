import {canonicalLocation} from './paths.mjs';
import {results,selectRows} from './list.mjs';
import {escape as e,link,statuses} from './html.mjs';
const $=(sel,base=document)=>base.querySelector(sel), all=(s,base=document)=>Array.from(base.querySelectorAll(s));
const data=id=>JSON.parse($(id)?.textContent||'null');
function theme(){
 const button=$('[data-theme]');
 function sync(){button.setAttribute('aria-label',getComputedStyle(document.documentElement).colorScheme==='dark'?'ライト表示に切り替える':'ダーク表示に切り替える');}
 sync();matchMedia('(prefers-color-scheme: dark)').addEventListener('change',sync);
 button.addEventListener('click',()=>{const t=getComputedStyle(document.documentElement).colorScheme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('fragmenta-theme',t);}catch{}sync();});
}
function searchDialog(){
 const dialog=$('#search-dialog');let opener=null;
 function open(el){if(dialog.open)return;opener=el;dialog.showModal();$('#dialog-q').focus();}
 all('[data-search]').forEach(a=>a.addEventListener('click',ev=>{if(ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;ev.preventDefault();open(a);}));
 document.addEventListener('keydown',ev=>{
   if(ev.isComposing||ev.keyCode===229||ev.defaultPrevented||ev.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   if(ev.key==='/'&&!ev.ctrlKey&&!ev.metaKey||(ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();open(document.activeElement);}
 });
 dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();}});
}
function gallery(){
 const root=$('[data-list]');if(!root)return;
 const section=root.dataset.list, form=$('.filter-form'),q=new URLSearchParams(location.search),visual=root.dataset.visual==='true';
 if(section==='search')$('.filter').open=true;
 for(const control of form.elements)if(control.name)control.value=q.get(control.name)||'';
 const filters=$('.filter'),summary=$('summary',filters);
 filters.addEventListener('keydown',ev=>{if(ev.key==='Escape'){filters.open=false;summary.focus();}});
 let cache,revision=0;
 function fetchData(){return cache??=Promise.all(['/catalog/index/'+section+'.json','/catalog/filters.json'].map(async url=>{const res=await fetch(url);if(!res.ok)throw Error('index');return res.json();})).catch(error=>{cache=undefined;throw error;});}
 async function apply(params,p,focus=false) {
   const version=++revision;
   try{
     const [rows,meta]=await fetchData();if(version!==revision)return;
     const selected=selectRows(rows,params,meta.purposes);
     const links=new URLSearchParams(params);
     const matched=meta.purposes.find(v=>v.titleJa===params.get('q')?.trim());
     if(matched&&!links.has('purpose'))links.set('purpose',matched.id);
     $('#results').innerHTML=results(selected,section,p,links,visual);
     document.dispatchEvent(new Event('atlas-results'));
     $('#result-count').textContent=selected.length+' 件 / '+rows.length+' 件';
     const tags=['q','category','purpose','section','status'].filter(k=>params.get(k)).map(k=>{const v=params.get(k);return k==='purpose'?(meta.purposes.find(p=>p.id===v)?.titleJa||v):(meta.labels[v]||statuses[v]||v);});
     $('#active-filters').innerHTML=tags.length?'<p>'+tags.map(e).join(' · ')+'　'+link('/'+section,'条件を解除')+'</p>':'';
     if(focus){$('#result-count').tabIndex=-1;$('#result-count').focus();}
   }catch{$('#result-count').textContent='索引を読み込めませんでした。もう一度検索してください。';}
 }
 function formSubmit(){
   const params=new URLSearchParams();for(const [k,v] of new FormData(form))if(String(v).trim())params.set(k,String(v).trim());
   const url='/'+section+(params.size?'?'+params:'');history.pushState({},'',url);apply(params,1,true);
   if(innerWidth<700&&section!=='search')filters.open=false;
 }
 form.addEventListener('submit',ev=>{ev.preventDefault();formSubmit();});
 form.addEventListener('change',ev=>{if(ev.target.tagName==='SELECT')formSubmit();});
 const current=()=>Number(new URLSearchParams(location.search).get('page')||location.pathname.match(/\/page\/(\d+)$/)?.[1]||1);
 const initial=new URLSearchParams(location.search);if(initial.size)apply(initial,current());
 window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);for(const c of form.elements)if(c.name)c.value=p.get(c.name)||'';apply(p,current());});
 root.addEventListener('click',ev=>{const a=ev.target.closest('.pager a');if(!a||ev.ctrlKey||ev.metaKey||ev.shiftKey)return;
   const u=new URL(a.href);if(!u.search&&!location.search&&section!=='search')return;
   ev.preventDefault();history.pushState({},'',u);apply(u.searchParams,current(),true);});
 const xray=$('#xray');xray?.addEventListener('click',()=>{const on=xray.getAttribute('aria-pressed')!=='true';xray.setAttribute('aria-pressed',String(on));root.classList.toggle('show-guides',on);});
}
function detail(){
 const tabNav=$('.view-tabs:not(.anchor-views)');
 if(tabNav){
   const tabs=all('[data-view]',tabNav);
   function select(){const id=location.hash.slice(1);if(id==='sources'){document.getElementById('sources').scrollIntoView();}const active=tabs.find(a=>a.dataset.view===id)||tabs[0];for(const tab of tabs){const on=tab===active;tab.setAttribute('aria-current',on?'location':'false');document.getElementById(tab.dataset.view).hidden=!on;}}
   select();window.addEventListener('hashchange',select);
   tabs.forEach((tab,i)=>tab.addEventListener('keydown',ev=>{const delta=ev.key==='ArrowRight'?1:ev.key==='ArrowLeft'?-1:0;if(delta){ev.preventDefault();const next=tabs[(i+delta+tabs.length)%tabs.length];next.focus();next.click();}}));
 }
 const toggle=$('[data-thirds-toggle]');toggle?.addEventListener('click',()=>{const on=toggle.getAttribute('aria-pressed')!=='true';toggle.setAttribute('aria-pressed',String(on));$('[data-thirds]').classList.toggle('accent-guides',on);});
 const purpose=new URLSearchParams(location.search).get('purpose'),choice=data('#purpose-briefs')?.[purpose];
 if(choice){$('#purpose-context').innerHTML='<p><strong>'+e(choice.title)+'</strong>　'+e(choice.reason)+' '+e(choice.caution)+'</p>';$('#brief').textContent=choice.brief;$('#ai-instruction').textContent=choice.instruction;}
 all('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const el=document.getElementById(button.dataset.copy);try{await navigator.clipboard.writeText(el.textContent);button.nextElementSibling.textContent='コピーしました。';}catch{el.closest('details').open=true;const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);button.nextElementSibling.textContent='文章を選択しました。手動でコピーできます。';}}));
}
function carousel(){
 const track=$('.exhibit-track');if(!track)return;
 const slides=all('.exhibit-card',track),buttons=all('[data-slide]');
 function index(){return slides.reduce((best,s,i)=>Math.abs(s.getBoundingClientRect().left-track.getBoundingClientRect().left)<Math.abs(slides[best].getBoundingClientRect().left-track.getBoundingClientRect().left)?i:best,0);}
 function sync(){const i=track.scrollLeft+track.clientWidth>=track.scrollWidth-2?slides.length-1:index();$('#slide-count').textContent=(i+1)+' / '+slides.length;buttons[0].disabled=i===0;buttons[1].disabled=i===slides.length-1;}
 buttons.forEach(b=>b.addEventListener('click',()=>{const n=Math.max(0,Math.min(slides.length-1,index()+Number(b.dataset.slide)));track.scrollTo({left:slides[n].offsetLeft-slides[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 track.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);sync();
}
const target=canonicalLocation(location.href);
if(target)location.replace(target);
else {
 theme();searchDialog();gallery();detail();carousel();
 if($('[data-widget]')||$('[data-inspection]'))import('./widgets.tsx').then(m=>m.hydrate());
 window.addEventListener('hashchange',()=>{const url=canonicalLocation(location.href);if(url)location.replace(url);});
}

