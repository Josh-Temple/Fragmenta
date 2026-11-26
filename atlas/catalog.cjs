const {load} = require('../scripts/load-data.cjs');
const {compositionGuides,compositionCategories,compositionCatalog,compositionBrief} = load('data/composition');
const {compositionPurposes,getCompositionDiscovery,getCompositionChoices,getReview} = load('data/composition-discovery');
const {designStyles,designStyleGroups} = load('data/design-styles');
const {styleSearchAliases} = load('data/discovery');
const {definitions,getPatternKind,patternKindLabels} = load('data/definitions');
const {patternRights} = load('data/pattern-rights');
const {liveTools} = load('data/live-tools');
const {collections} = load('data/collections');
const {ideas,categories,sourceById,knowledgeReviewBrief} = load('data/knowledge');
const {plannedPatterns} = load('data/planned-patterns');
const {plannedTools} = load('data/planned-tools');
const {statuses}=require('./html.mjs');
const sections={
  composition:['構図図鑑','Composition'],styles:['デザインスタイル','Design styles'],browse:['UIパターン','UI patterns'],
  tools:['実用ツール','Tools'],collections:['コレクション','Collections'],knowledge:['知識台帳','Knowledge index'],
  upcoming:['UIパターンの企画','Pattern proposals'],'tools/upcoming':['ツールの企画','Tool proposals'],
};
const labels = Object.fromEntries([...compositionCategories,...designStyleGroups,...categories].map(c=>[c.id,c.label]));
Object.assign(labels,patternKindLabels,{writing:'文章作成',development:'開発',design:'デザイン',content:'コンテンツ'});
const items=[];
function add(section,id,title,summary,status,record,opts={}) {
  const path=opts.path || '/'+section+'/'+id;
  const artwork=['composition','styles','browse'].includes(section)?'/art/'+section+'/'+id+'.svg':undefined;
  const row={section,id,title,summary,status,path,artwork,category:opts.category,purposes:opts.purposes||[],keywords:(opts.keywords||[]).filter(Boolean).join(' '),guide:opts.guide};
  items.push({...row,record,data:opts.data||{},index:row});
}
const art=require('./art.cjs');
const english={'C-001':'Rule of thirds','C-002':'central composition centered','C-003':'symmetry symmetrical','C-004':'asymmetry asymmetrical','C-005':'diagonal','C-006':'triangle','C-007':'radial','C-008':'S curve'};
for(const g of compositionGuides){
  const choices=getCompositionChoices(g.id), discovery=getCompositionDiscovery(g);
  const sources=g.sourceIds.map(id=>({id,...compositionCatalog.sources[id]}));
  add('composition',g.id,g.titleJa,g.definition,'draft',g,{category:g.categoryId,purposes:choices.map(c=>c.purposeId),
    guide:art.guides[g.id],keywords:[english[g.id],labels[g.categoryId],...choices.map(c=>c.titleJa),g.example,g.contrast],
    data:{...g,sources,discovery:{...discovery,choices:discovery.choices.map(c=>({...c,href:'/composition/'+g.id+'?purpose='+c.purposeId}))},aiBrief:compositionBrief(g),rights:'図の制作経緯と利用条件は確認中。参考資料の権利は各出典の記載を参照。'}});
}
for(const s of designStyles) add('styles',s.id,s.ja,s.summary,'live',s,{category:s.group,keywords:[s.name,s.use,...s.features,styleSearchAliases[s.id]],data:{...s,reviewStatus:'illustrative',rights:'Fragmentaによる様式の解釈。利用条件は /licenses を参照。',selection:load('data/design-style-guidance').getStyleSelection(s),aiBrief:load('data/design-style-guidance').styleSelectionBrief(s)}});
for(const p of Object.values(definitions)) add('browse',p.id,p.title,p.description,'live',p,{path:'/p/'+p.id,category:getPatternKind(p),keywords:[...p.tags,patternKindLabels[getPatternKind(p)]],
  data:{source:p.source||null,rights:patternRights[p.id],reviewStatus:'see_item_notes',previewParameters:p.params,accessibilityNotes:p.a11yNotes,performanceNotes:p.performanceNotes,selection:load('data/pattern-selection').patternSelectionBrief(p.id)}});
for(const t of liveTools) add('tools',t.id,t.titleJa,t.description,'tool',t,{path:t.path,keywords:[t.title,...t.tags],data:{...t,rights:'利用条件は /licenses を参照。',reviewStatus:'see_tool_notes'}});
for(const c of collections) add('collections',c.id,c.title,c.description,'collection',c,{data:{...c,rights:'収録項目ごとの条件を参照。'}});
for(const k of ideas) add('knowledge',k.id,k.titleJa,k.editorial?.summary||'制作予定の知識項目。','proposal',k,{category:k.categoryId,keywords:[k.titleEn,...(k.aliases||[]),...(k.tags||[]),labels[k.categoryId],...(k.editorial?.appropriateUses||[])],
  data:{...k,sources:(k.editorial?.sourceIds||[]).map(id=>({id,...sourceById[id]})),aiBrief:knowledgeReviewBrief(k),rights:'出典ごとの利用条件を参照。項目全体の独立レビューは未完了。'}});
for(const p of plannedPatterns) add('upcoming',p.id,p.title,p.description,'proposal',p,{category:p.kind,keywords:p.tags,data:{...p,rights:'企画段階。再利用許諾の対象外。'}});
for(const p of plannedTools) add('tools/upcoming',p.id,p.titleJa,p.purpose,'proposal',p,{category:p.category,keywords:[p.title],data:{...p,rights:'企画段階。再利用許諾の対象外。'}});
const byPath=new Map(items.map(item=>[item.path,item]));
const byId=new Map(items.map(item=>[item.id,item]));
const exportPath = item => '/catalog/items'+item.path+'.json';
const indexRow = item => ({...item.index,guide:undefined,xray:Boolean(item.guide)});
function itemJson(item) {
  return {...item.data,id:item.id,title:item.title,description:item.summary,section:item.section,publicationStatus:item.status,statusLabel:statuses[item.status],canonical:'https://fragmenta-6ke.pages.dev'+item.path,licenses:'/licenses'};
}
module.exports={sections,items,byPath,byId,labels,compositionPurposes,getReview,compositionBrief,indexRow,itemJson,exportPath};

