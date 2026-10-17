import tools from './tools/registry.js';
const sidebar=document.getElementById('tool-list'),content=document.getElementById('content'),title=document.getElementById('tool-title'),desc=document.getElementById('tool-desc'),search=document.getElementById('search');
const savedTheme=localStorage.getItem('theme')||'dark';
document.documentElement.dataset.theme=savedTheme;
document.getElementById('theme-toggle').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);};
function renderSidebar(filter=''){sidebar.innerHTML='';const q=filter.toLowerCase();for(const t of tools){if(q&&!(t.name+' '+t.desc).toLowerCase().includes(q))continue;const a=document.createElement('a');a.href='#'+t.id;a.className='tool-link';a.dataset.id=t.id;a.innerHTML=`<span class="icon">${t.icon}</span><span>${t.name}</span>`;sidebar.appendChild(a);}const active=location.hash.slice(1);sidebar.querySelectorAll('.tool-link').forEach(e=>e.classList.toggle('active',e.dataset.id===active));}
let routeGen=0;
async function route(){const myGen=++routeGen;const id=location.hash.slice(1)||tools[0].id;const t=tools.find(x=>x.id===id)||tools[0];title.textContent=t.name;desc.textContent=t.desc;renderSidebar(search.value);content.innerHTML=`<div class="loading">Loading ${t.name}</div>`;try{const mod=await t.load();if(myGen!==routeGen)return;content.innerHTML='';await mod.default.mount(content);document.getElementById('sidebar').classList.remove('open');window.scrollTo(0,0);}catch(e){console.error(e);content.innerHTML=`<p class="err">Failed to load tool: ${e.message}</p>`;}}
search.oninput=()=>renderSidebar(search.value);
window.addEventListener('hashchange',route);
route();
document.getElementById('menu-toggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
