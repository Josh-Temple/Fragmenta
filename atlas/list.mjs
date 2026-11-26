import {escape as e,link,mark,statuses} from './html.mjs';
export const pageSize=24;
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().trim();
export function selectRows(rows,params,purposes=[]) {
  const q=norm(params.get('q')), terms=q.split(/\s+/).filter(Boolean);
  const purpose=params.get('purpose') || purposes.find(p=>norm(p.titleJa)===q)?.id;
  const cat=params.get('category'), state=params.get('status'), section=params.get('section');
  return rows.filter(r=>(!purpose||r.purposes.includes(purpose))&&(!cat||cat==='all'||r.category===cat)&&(!state||r.status===state)&&(!section||r.section===section)&&
    (!terms.length||purpose&&purposes.some(p=>p.id===purpose&&norm(p.titleJa)===q)||terms.every(t=>norm([r.title,r.id,r.summary,r.keywords,statuses[r.status]].join(' ')).includes(t))));
}
export function card(item,index,params=new URLSearchParams()) {
  const purpose=params.get('purpose'), href=item.path+(purpose&&item.purposes.includes(purpose)?'?purpose='+encodeURIComponent(purpose):'');
  return '<a class="specimen" id="card-'+e(item.id)+'" href="'+e(href)+'"><span class="plate"><img width="300" height="200" src="'+e(item.artwork)+'" alt="" loading="'+(index<4?'eager':'lazy')+'">'+
    (item.xray?'<img class="overlay" alt="" src="/art/guides/'+e(item.id)+'.svg" width="300" height="200" loading="lazy">':'')+'</span><span class="caption"><span>'+e(item.title)+'</span>'+mark(item.status,false)+'</span></a>';
}
export function pageUrl(section,p,query) {
  const qs=new URLSearchParams(query);qs.delete('page');
  const filtered=qs.size>0||section==='search';
  const path='/'+section+(!filtered&&p>1?'/page/'+p:'');
  if(filtered&&p>1)qs.set('page',String(p));
  return path+(qs.size?'?'+qs:'');
}
export function results(rows,section,p,params,visual) {
  const pageCount=Math.max(1,Math.ceil(rows.length/pageSize)), page=Math.min(pageCount,Math.max(1,Number(p)||1));
  const visible=rows.slice((page-1)*pageSize,page*pageSize);
  let content=visible.length?(visual?'<div class="tiles">'+visible.map((r,i)=>card(r,i,params)).join('')+'</div>':'<ul class="ledger">'+visible.map(r=>'<li><a id="card-'+e(r.id)+'" href="'+e(r.path+(params.get('purpose')&&r.purposes.includes(params.get('purpose'))?'?purpose='+encodeURIComponent(params.get('purpose')):''))+'"><span><strong>'+e(r.title)+'</strong><small>'+e(r.summary)+'</small></span>'+mark(r.status)+'</a></li>').join('')+'</ul>'):'<p class="empty">該当する項目がありません。検索語や分類を変更してください。</p>';
  if(pageCount>1) content+='<nav class="pager" aria-label="ページ送り">'+(page>1?link(pageUrl(section,page-1,params),'← 前のページ'):'<span></span>')+'<span>'+page+' / '+pageCount+'</span>'+(page<pageCount?link(pageUrl(section,page+1,params),'次のページ →'):'<span></span>')+'</nav>';
  return content;
}

