/* Public read-only project catalogue. No cookies, account tokens or private portfolio data. */
(() => {
 'use strict';
 const roots=[...document.querySelectorAll('[data-projects]')];if(!roots.length)return;
 const base=document.documentElement.dataset.projectBase||'';
 const statuses={available:'Dostupné',planned:'Plánujeme',development:'Ve vývoji',testing:'Testujeme'};
 const kinds={game:'Hra',application:'Aplikace',expansion:'Rozšíření',other:'Projekt'};
 const hosts=new Set(['www.kraken89games.online','kraken89games.online','kraken89.cz','www.kraken89.cz']);
 let projects=[],filter='all';
 function url(value){try{const u=new URL(value);return u.protocol==='https:'&&hosts.has(u.hostname)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
 function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;}
 function valid(p){return p&&typeof p.title==='string'&&p.title.length<=190&&typeof p.summary==='string'&&p.summary.length<=6000&&Object.hasOwn(statuses,p.stage)&&Object.hasOwn(kinds,p.kind)&&url(p.url);}
 function card(p,snapshot){const a=node('article',null,'card');a.dataset.stage=p.stage;a.dataset.kind=p.kind;if(typeof p.slug==='string'&&/^[a-z0-9-]+$/.test(p.slug))a.id='project-'+p.slug;
  let image=url(p.image_url);if(snapshot&&typeof p.image_local==='string'&&/^assets\/projects\/[a-z0-9-]+\.(png|jpg|webp)$/.test(p.image_local))image=base+p.image_local;
  if(image){const im=node('img');im.src=image;im.alt=p.title;im.loading='lazy';im.className='project-cover';a.append(im);}
  a.append(node('div',statuses[p.stage]+' · '+kinds[p.kind],'eyebrow'));a.append(node('h3',p.title));a.append(node('p',p.summary));if(p.version)a.append(node('p','Verze '+String(p.version).slice(0,80),'muted'));
  const link=node('a',p.stage==='available'?'Prohlédnout v herně →':'Podrobnosti plánu →','btn secondary');link.href=url(p.url);a.append(link);return a;}
 function render(snapshot){if(!projects.length){for(const root of roots)for(const card of root.querySelectorAll('article[data-stage]')){card.hidden=filter==='all'?false:filter==='planned'?card.dataset.stage==='available':!(card.dataset.stage==='available'&&card.dataset.kind===filter);}return;}for(const root of roots){let rows=projects.filter(p=>{const group=root.dataset.projects;return group==='planned'?p.stage!=='available':group==='games'?p.stage==='available'&&p.kind==='game':group==='apps'?p.stage==='available'&&p.kind==='application':filter==='all'?true:filter==='planned'?p.stage!=='available':p.stage==='available'&&p.kind===filter;});const limit=Number(root.dataset.limit)||0;if(limit)rows=rows.slice(0,limit);const frag=document.createDocumentFragment();for(const p of rows)frag.append(card(p,snapshot));if(!rows.length)frag.append(node('p','V tomto výběru zatím není zveřejněný projekt.','muted'));root.replaceChildren(frag);}}
 let snapshot=true;
 for(const b of document.querySelectorAll('[data-project-filter]'))b.addEventListener('click',()=>{filter=b.dataset.projectFilter;for(const x of document.querySelectorAll('[data-project-filter]'))x.setAttribute('aria-pressed',String(x===b));render(snapshot);});
 function message(text){for(const n of document.querySelectorAll('[data-project-status]'))n.textContent=text;}
 async function read(endpoint){const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),4500);try{const r=await fetch(endpoint,{signal:ctrl.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('unavailable');const data=await r.json();if(data.schema_version!==1||!Array.isArray(data.projects)||data.projects.length>1000||!data.projects.every(valid))throw Error('invalid');return data;}finally{clearTimeout(timer);}}
 (async()=>{try{const saved=await read(base+'data/projects.json');projects=saved.projects;render(true);}catch{/* pre-rendered snapshot remains available without JavaScript/fetch */}
  try{const live=await read('https://www.kraken89games.online/api/projects.php');projects=live.projects;snapshot=false;render(false);message('Aktuální veřejný přehled z Kraken89Games.');}
  catch{message('Uložený přehled z 17. 11. 2026. Aktuální vydání a změny ověříš v herně.');}
 })();
})();
