const {escape:e,link,para,mark,crumbs,statuses}=require('./html.mjs');
const {sections,items,labels,compositionPurposes,byId,indexRow}=require('./catalog.cjs');
const {results}=require('./list.mjs');
const names=Object.entries(sections);
const searchIcon='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
const themeIcon='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>';
function header(path) {
 const nav=[['/','展示室'],['/composition','構図'],['/styles','スタイル'],['/browse','UI'],['/tools','ツール'],['/knowledge','知識台帳']];
 return '<a class="skip" href="#main">本文へ移動</a><header class="mast"><a class="wordmark" href="/" aria-label="Fragmenta ホーム">Fragmenta<span>.</span></a><nav aria-label="主なページ">'+nav.map(([url,label])=>link(url,label,path===url||url!=='/'&&path.startsWith(url+'/')?'aria-current="page"':'')).join('')+'</nav><div class="utilities"><a href="/search" aria-label="検索" data-search>'+searchIcon+'</a><button type="button" data-theme aria-label="明暗を切り替える">'+themeIcon+'</button></div></header>';
}
const footer='<footer class="quiet-footer"><a href="/">Fragmenta.</a><nav aria-label="資料"><a href="/collections">コレクション</a><a href="/guide">使い方</a><a href="/licenses">権利・利用条件</a><a href="/llms.txt">AI向け索引</a></nav></footer><nav class="mobile-nav" aria-label="モバイル操作"><a href="/">展示室</a><a href="/composition">図鑑</a><a href="/search" data-search>検索</a><a href="/tools">ツール</a></nav><dialog id="search-dialog" aria-labelledby="search-title"><form method="dialog"><button class="close" aria-label="検索を閉じる">閉じる ×</button></form><h2 id="search-title">図鑑を検索</h2><form action="/search" role="search"><label for="dialog-q">名称・ID・用途</label><div class="input-row"><input type="search" name="q" id="dialog-q" placeholder="三分割法、swiss、文字の余白"><button>検索</button></div></form></dialog>';
const coordinates=[['solitude',19,23],['calm',25,67],['grouping',50,78],['depth',68,28],['sequence',79,64]];
function compass(){
 return '<aside class="compass"><h2>意図から探す</h2><p>配置で伝えたい印象</p><div class="map"><span class="axis top">広がり</span><span class="axis bottom">まとまり</span><span class="axis left">静</span><span class="axis right">動</span>'+coordinates.map(([id,x,y])=>{const p=compositionPurposes.find(v=>v.id===id);return '<a style="left:'+x+'%;top:'+y+'%" href="/composition?purpose='+id+'" aria-label="'+e(p.titleJa)+'の構図を探す"><i></i><b>'+e(p.titleJa)+'</b></a>';}).join('')+'</div><small>位置は編集上の目安です。</small><details><summary>目的を一覧で選ぶ</summary><div class="purpose-list">'+compositionPurposes.map(p=>link('/composition?purpose='+p.id,p.titleJa)).join('')+'</div></details></aside>';
}
function home() {
 const groups=['composition','styles','browse'];
 return '<div class="home-heading"><p class="eyebrow">Design atlas</p><h1>デザインの展示室</h1></div><div class="exhibit">'+compass()+'<section class="exhibit-section" aria-label="図鑑を選ぶ"><div class="exhibit-track">'+groups.map(s=>'<a class="exhibit-card" href="/'+s+'"><img width="300" height="200" alt="" src="/art/home/'+s+'.svg"><span><span><small lang="en">'+sections[s][1]+'</small><strong>'+sections[s][0]+'</strong></span><span aria-hidden="true">↗</span></span></a>').join('')+'</div><div class="carousel-controls"><button data-slide="-1" aria-label="前の図鑑">←</button><span aria-live="polite" id="slide-count">1 / 3</span><button data-slide="1" aria-label="次の図鑑">→</button></div></section></div><div class="home-index">'+['tools','knowledge','collections'].map(s=>link('/'+s,sections[s][0]+'　↗')).join('')+'</div>';
}
function options(values){return values.map(([v,t])=>'<option value="'+e(v)+'">'+e(t)+'</option>').join('');}
function listing(section,page=1){
 const search=section==='search',rows=items.filter(i=>search||i.section===section).map(indexRow);
 const visual=['composition','styles','browse'].includes(section),s=sections[section]||['横断検索','Search'];
 const categories=[...new Set(rows.map(x=>x.category).filter(Boolean))];
 const label=search?'名称・ID・用途':s[0]+'を検索';
 const filters='<form class="filter-form" role="search" action="/'+section+'"><label>'+label+'<span class="input-row"><input name="q" type="search" placeholder="名称・用途で探す"><button>検索</button></span></label>'+
 (!search&&categories.length?'<label>分類<select name="category"><option value="">すべての分類</option>'+options(categories.map(id=>[id,labels[id]||id]))+'</select></label>':'')+
 (search?'<label>図鑑<select name="section"><option value="">すべての図鑑</option>'+options(names.map(([id,n])=>[id,n[0]]))+'</select></label><label>掲載状態<select name="status"><option value="">すべての状態</option>'+options(Object.entries(statuses))+'</select></label>':'')+
 (section==='composition'?'<label>目的<select name="purpose"><option value="">すべての目的</option>'+options(compositionPurposes.map(p=>[p.id,p.titleJa]))+'</select></label>':'')+'</form>';
 const addons={browse:[['/collections','用途別コレクション'],['/upcoming','UIパターンの企画']],tools:[['/tools/upcoming','ツールの企画']],knowledge:[['/composition','構図の比較図鑑']]};
 return '<div data-list="'+section+'" data-page="'+page+'" data-visual="'+visual+'">'+crumbs([['展示室','/'],[s[0]]])+'<div class="title-row"><div><p class="eyebrow">'+s[1]+'</p><h1>'+s[0]+'</h1></div><span class="count" role="status" id="result-count">'+rows.length+' 件</span></div><div class="catalog-bar"><details class="filter"'+(search?' open':'')+'><summary>'+searchIcon+' 検索・絞り込み</summary>'+filters+'</details><div class="bar-end">'+(section==='composition'?'<button id="xray" aria-pressed="false">補助線 <span lang="en">X-Ray</span></button>':'')+'<div class="legend">'+[...new Set(rows.map(r=>r.status))].map(s=>mark(s)).join('')+'</div></div></div><div id="active-filters"></div><div id="results">'+results(rows,section,page,new URLSearchParams(),visual)+'</div>'+(addons[section]?'<nav class="article-links">'+addons[section].map(([url,t])=>link(url,t+' →')).join('')+'</nav>':'')+'</div>';
}
module.exports={header,footer,home,listing,compass};

