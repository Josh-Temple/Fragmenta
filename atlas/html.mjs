const escape = value => String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const link = (url,label,attrs='') => '<a href="'+escape(url)+'" '+attrs+'>'+escape(label)+'</a>';
const para = value => value ? '<p>'+escape(value)+'</p>' : '';
const list = values => values?.length ? '<ul>'+values.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ul>' : '';
const block = (id,title,body) => '<section class="reading" id="'+id+'"><h2>'+escape(title)+'</h2>'+body+'</section>';
const statuses = {live:'実演あり',tool:'公開中',draft:'編集下書き',proposal:'企画段階',collection:'コレクション'};
const mark = (key,visible=true) => '<span class="state"><i class="mark '+key+'" aria-hidden="true"></i><span'+(visible?'':' class="visually-hidden"')+'>'+statuses[key]+'</span></span>';
const crumbs = pairs => '<nav class="crumbs" aria-label="パンくずリスト">'+pairs.map(([name,url])=>url?link(url,name):'<span aria-current="page">'+escape(name)+'</span>').join('<span aria-hidden="true">/</span>')+'</nav>';
export {escape,link,para,list,block,statuses,mark,crumbs};

