import tools from './tools/registry.js';
const sidebar=document.getElementById('tool-list'),content=document.getElementById('content'),title=document.getElementById('tool-title'),desc=document.getElementById('tool-desc');
const themeBtn=document.getElementById('theme-toggle');
const savedTheme=localStorage.getItem('theme')||'dark';
document.documentElement.dataset.theme=savedTheme;
themeBtn.onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);};
tools.forEach(t=>{const a=document.createElement('a');a.href='#'+t.id;a.className='tool-link';a.dataset.id=t.id;a.innerHTML='<span class="icon">'+t.icon+'</span><span class="label">'+t.name+'</span>';sidebar.appendChild(a);});
function route(){const id=location.hash.slice(1)||tools[0].id;const tool=tools.find(t=>t.id===id)||tools[0];title.textContent=tool.name;desc.textContent=tool.description||'';content.innerHTML='';const mount=document.createElement('div');mount.className='tool-mount';content.appendChild(mount);try{tool.mount(mount);}catch(e){mount.innerHTML='<p class="err">Error: '+e.message+'</p>';console.error(e);}document.querySelectorAll('.tool-link').forEach(a=>a.classList.toggle('active',a.dataset.id===tool.id));document.getElementById('sidebar').classList.remove('open');window.scrollTo(0,0);}
window.addEventListener('hashchange',route);route();
document.getElementById('menu-toggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
