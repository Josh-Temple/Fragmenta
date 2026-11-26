export function canonicalLocation(input) {
 const u=new URL(input), legacy=u.hash.startsWith('#/'),route=legacy?new URL(u.hash.slice(1),u.origin):u;
 if(route.origin!==u.origin)return null;
 let path=route.pathname.replace(/\/+$/,'')||'/';
 const q=new URLSearchParams(route.search);
 if(path==='/composition') {
   const id=q.get('id'), atlas=q.get('view')==='atlas';
   if(id&&!atlas)path+='/'+encodeURIComponent(id);
   q.delete('id');q.delete('view');
 }
 if(path==='/styles'&&q.has('style')){const id=q.get('style');q.delete('style');if(id)path+='/'+encodeURIComponent(id);}
 if(path.startsWith('/a/'))path='/p/'+path.slice(3);
 if(path==='/saved')path='/collections';
 if(path==='/settings')path='/';
 const dest=path+(q.size?'?'+q.toString():'')+route.hash;
 // Compare decoded query semantics so Japanese text and %20/+ do not trigger reload loops.
 if(!legacy&&path===u.pathname&&q.toString()===u.searchParams.toString())return null;
 return dest;
}

