const React=require('react');
const {renderToString,renderToStaticMarkup}=require('react-dom/server');
const {StaticRouter,Routes,Route}=require('react-router-dom');
const {load}=require('../scripts/load-data.cjs');
const {escape:e,link,para,list,block,mark,crumbs}=require('./html.mjs');
const {sections,items,byId,labels,exportPath,getReview,compositionBrief}=require('./catalog.cjs');
const Diagram=load('components/CompositionDiagram').default;
const h=React.createElement;
const pageComponents={styles:['DesignStyles','/styles/:id'],browse:['AnimationDetail','/p/:id'],contrast:['ContrastTool','/tools/contrast'],typography:['TypographyTool','/tools/typography'],licenses:['Licenses','/licenses'],guide:['BestPractices','/guide']};
const json=x=>JSON.stringify(x).replaceAll('<','\\u003c');
function island(key,path,props={}) {
  const [file,route]=pageComponents[key],Page=load('pages/'+file).default;
  const markup=renderToString(h(StaticRouter,{location:path},h(Routes,null,h(Route,{path:route,element:h(Page,props)}))));
  return '<div class="widget" data-widget="'+key+'">'+markup+'</div><script type="application/json" id="widget-props">'+json(props)+'</script>';
}
const itemLink=(id,reason='')=>{const r=byId.get(id);return r?'<li>'+link(r.path,r.title)+' '+e(reason)+'</li>':'';};
function copy(text,id='brief'){
 return '<details class="copy-text"><summary>判断材料の全文</summary><pre id="'+id+'">'+e(text)+'</pre></details><button class="action" type="button" data-copy="'+id+'">指示文をコピー</button><span class="copy-status" role="status"></span>';
}
function sources(data) {
 const rows=data.sources||[];
 return (data.sourceNote?para(data.sourceNote):'')+(rows.length?'<ul class="sources">'+rows.map(s=>'<li>'+link(s.url,s.publisher+' · '+s.title)+para(s.scope)+para(s.rights)+'</li>').join('')+'</ul>':para('外部出典の登録は未完了です。'));
}
function heading(item) {
 return crumbs([['展示室','/'],[sections[item.section][0],'/'+item.section],[item.title]])+'<header class="detail-title"><p class="eyebrow">'+e(item.id)+(item.category?'　/　'+e(labels[item.category]||item.category):'')+'</p><h1 tabindex="-1">'+e(item.title)+'</h1>'+mark(item.status)+'</header>';
}
function tabs() {
 return '<nav class="view-tabs" aria-label="詳細の表示切替">'+[['visual','視覚'],['structure','構造'],['ai-code','AI・コード']].map(([id,t])=>link('#'+id,t,'data-view="'+id+'"')).join('')+'<a href="#sources">出典・権利 ↗</a></nav>';
}
const panel=(id,title,body)=>'<section class="view" id="'+id+'" aria-label="'+title+'">'+body+'</section>';
function diagram(g,variant){
 return renderToString(h(Diagram,{guide:g,variant}),{identifierPrefix:variant+'-'});
}
function composition(item) {
 const g=item.record,d=item.data.discovery;
 const a=g.id==='C-110'?'画風A':g.id==='C-119'?'元図':'配置例',b=g.id==='C-110'?'画風B':g.id==='C-119'?'検査表示':'対照例';
 const pair='<div class="pair'+(['C-093','C-119'].includes(g.id)?' stacked':'')+'" '+(g.id==='C-001'?'data-thirds':'')+'>'+[[a,'example',g.example],[b,'comparison',g.contrast]].map(([name,v,desc])=>'<figure><div class="drawing"'+(g.id==='C-119'&&v==='comparison'?' data-inspection':'')+'>'+diagram(g,v)+'</div><figcaption><strong>'+name+'</strong>'+e(desc)+'</figcaption></figure>').join('')+'</div>';
 const purpose=d.choices.map(c=>{const r=getReview(g.id,c);return '<article class="purpose-note" data-for-purpose="'+e(c.purposeId)+'"><h3>'+link('/composition?purpose='+c.purposeId,c.titleJa)+'</h3>'+para(c.reasonJa)+para(c.cautionJa)+para(r.checkJa)+'<ul>'+itemLink(r.alternativeId,r.alternativeReasonJa)+'</ul>'+(c.sourceSupport?para(c.sourceSupport.section+'　'+c.sourceSupport.scopeJa):'')+'</article>';}).join('');
 const review=d.review;
 const structure=block('principle','配置と見比べ方',para(g.definition)+para(g.comparisonPoint)+para(g.diagramNote)+para(review.checkJa)+'<ul>'+itemLink(review.alternativeId,review.alternativeReasonJa)+'</ul>')+block('use','用途と適用条件',purpose||para('個別の用途候補は編集中です。'))+
  (d.relatedComposition.length?block('related','関連する構図','<ul>'+d.relatedComposition.map(r=>itemLink(r.targetId,r.reasonJa)).join('')+'</ul>'):'')+(g.relatedLegacyIds.length?block('related-ideas','関連する企画','<ul>'+g.relatedLegacyIds.map(id=>itemLink(id)).join('')+'</ul>'):'');
 const briefs=Object.fromEntries(d.choices.map(c=>[c.purposeId,{brief:compositionBrief(g,c.purposeId),instruction:c.aiInstruction||g.aiInstruction,reason:c.reasonJa,caution:c.cautionJa,title:c.titleJa}]));
 const xray=g.id==='C-001'?'<button class="action" data-thirds-toggle aria-pressed="false">三等分の補助線を強調</button>':'';
 const visual=pair+xray+block('compare','見比べるポイント',para(g.comparisonPoint)+para(g.diagramNote));
 return heading(item)+tabs()+'<div id="purpose-context"></div>'+panel('visual','視覚',visual)+panel('structure','構造',structure)+panel('ai-code','AI・コード',block('ai','AIへの指示例','<p id="ai-instruction">'+e(g.aiInstruction)+'</p>'+copy(item.data.aiBrief)+para('この項目では配置の指示と模式図を提供しています。')))+
 block('sources','出典・権利と検証状況',para('説明・図・AI指示は編集下書きです。項目全体の根拠は未確認です。')+sources(item.data)+para(item.data.rights)+link('/licenses','権利・利用条件')+'　'+link(exportPath(item),'項目のJSON'))+
 '<script type="application/json" id="purpose-briefs">'+json(briefs)+'</script>'+(g.id==='C-119'?'<script type="application/json" id="inspection-guide">'+json(g)+'</script>':'');
}
function knowledge(item) {
 const k=item.record,d=k.editorial||{},data=item.data;
 const related=k.relations||[];
 const siblings=items.filter(x=>x.section==='knowledge'&&x.category===k.categoryId),i=siblings.indexOf(item);
 return heading(item)+block('status','現在の内容',para('企画段階。掲載中の編集稿は未レビューで、項目全体の根拠は未確認です。')+para(d.summary))+
 block('use','用途と注意点',list(d.appropriateUses)+list(d.pitfalls)+para(d.practicalExample)+para(d.implementationNotes)+para(d.accessibilityNotes))+
 block('review','制作時の確認',list(d.reviewChecks)+para(d.aiInstruction)+copy(data.aiBrief))+
 block('sources','出典・権利と検証状況',sources(data)+para(data.rights)+link('/licenses','権利・利用条件')+'　'+link(exportPath(item),'項目のJSON'))+
 block('related','関連項目','<ul>'+k.relatedIdeaIds.map(id=>itemLink(id,related.find(r=>r.targetId===id)?.reasonJa)).join('')+k.relatedExisting.map(r=>itemLink(r.id)).join('')+'</ul>')+
 '<nav class="article-links">'+(siblings[i-1]?link(siblings[i-1].path,'← '+siblings[i-1].title):'')+(siblings[i+1]?link(siblings[i+1].path,siblings[i+1].title+' →'):'')+'</nav>';
}
function detail(item){
 if(item.section==='composition') return composition(item);
 if(item.section==='knowledge') return knowledge(item);
 if(item.section==='styles'||item.section==='browse'||item.section==='tools'){
   const key=item.section==='tools'?item.path.split('/').pop():item.section;
   const related=items.filter(i=>i.section==='knowledge'&&i.record.relatedExisting.some(r=>r.id===item.id)).map(i=>({id:i.id,titleJa:i.title}));
   const props=key==='styles'?{styleId:item.id,relatedEntries:related}:key==='browse'?{relatedEntries:related}:undefined;
   const intro=crumbs([['展示室','/'],[sections[item.section][0],'/'+item.section],[item.title]]);
   return intro+'<div class="widget-meta">'+mark(item.status)+'　'+link('#sources','出典・利用条件')+'</div>'+island(key,item.path,props)+
     block('sources','出典・権利と検証状況',para(key==='browse'?item.data.selection.split('\n').filter(x=>/出典|再利用条件/.test(x)).join('　'):key==='styles'?item.data.selection.sourceScope:'計算方法・確認範囲はツール内の説明を参照してください。')+
     (item.data.source?.url?link(item.data.source.url,item.data.source.label):'')+' '+link('/licenses','権利・利用条件')+'　'+link(exportPath(item),'項目のJSON'));
 }
 if(item.section==='collections')return heading(item)+para(item.summary)+block('members','収録したUIパターン','<ul>'+item.record.patternIds.map(id=>itemLink(id)).join('')+'</ul>')+link(exportPath(item),'項目のJSON');
 const p=item.record;
 return heading(item)+para(item.summary)+block('planned','予定している操作と確認項目',Array.isArray(p.acceptance)?list(p.acceptance):para(p.acceptance))+
 block('sources','実装・出典・権利',para('制作前の企画です。実演、生成コード、個別の出典確認は今後の作業です。')+para(item.data.rights)+link('/licenses','権利・利用条件')+'　'+link(exportPath(item),'項目のJSON'));
}
module.exports={detail,diagram,island,json};

