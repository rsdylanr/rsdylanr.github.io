import {openDB} from '../lib/idb.js';
import {download,debounce,esc} from '../lib/util.js';

export default{
  id:'learned',name:'Learned Compressor',icon:'🧠',
  desc:'Side-by-side editor that watches your compression and learns the mapping',
  async mount(root){
    const db=await openDB('compressor',1,{upgrade:d=>d.createObjectStore('pairs',{keyPath:'from'})});
    let pairs=await db.all('pairs');
    pairs.sort((a,b)=>b.count-a.count);

    root.innerHTML=`
      <div class="split">
        <div class="pane"><label>Original</label><textarea id="left" rows="14" placeholder="Paste the original text…"></textarea></div>
        <div class="pane"><label>Compressed <span id="savings" class="chip"></span></label><textarea id="right" rows="14" placeholder="Manually compress on this side…"></textarea></div>
      </div>
      <div class="row">
        <button id="apply" class="btn">Apply learned → Original</button>
        <button id="export" class="btn small ghost">Export pairs</button>
        <button id="import" class="btn small ghost">Import pairs</button>
        <button id="clear" class="btn small danger">Clear all</button>
        <span id="count" class="chip"></span>
      </div>
      <div class="stats-grid" id="stats"></div>
      <div id="pairs" style="margin-top:16px"></div>`;

    const L=root.querySelector('#left'),R=root.querySelector('#right');
    const learnDebounced=debounce(learn,1200);

    function renderPairs(){
      root.querySelector('#count').textContent=pairs.length+' pairs';
      const top=pairs.slice(0,15).map(p=>
        `<div class="result-row"><code>${esc(p.from)}</code><span>→</span><code>${esc(p.to)}</code><span class="chip">${p.count}×</span></div>`
      ).join('');
      root.querySelector('#pairs').innerHTML=top||'<p style="color:var(--text-dim);font-size:13px">No pairs learned yet — start editing the Compressed pane.</p>';
    }

    function updateStats(){
      const l=L.value,r=R.value;
      const charsL=l.length,charsR=r.length,bytesL=new Blob([l]).size,bytesR=new Blob([r]).size;
      const pct=charsL?((charsL-charsR)/charsL*100):0;
      root.querySelector('#savings').textContent=charsL?`${pct.toFixed(1)}%`:'';
      root.querySelector('#savings').className='chip '+(pct>0?'good':'warn');
      root.querySelector('#stats').innerHTML=[
        ['Chars',charsL+' → '+charsR,pct>0?'good':''],
        ['Bytes',bytesL+' → '+bytesR,pct>0?'good':''],
        ['Ratio',charsL?(charsR/charsL*100).toFixed(1)+'%':'—',''],
        ['Tokens~',Math.ceil(charsL/4)+' → '+Math.ceil(charsR/4),''],
        ['Words',wordCount(l)+' → '+wordCount(r),'']
      ].map(([k,v,c])=>`<div class="stat"><div class="stat-value">${esc(v)}</div><div class="stat-label">${k}</div></div>`).join('');
    }

    function wordCount(t){return t.trim()?t.trim().split(/\s+/).length:0;}

    async function learn(){
      const l=L.value,r=R.value;
      if(!l||!r)return;
      const {diffWords}=await import('diff');
      const changes=diffWords(l,r);
      let changed=false;
      for(let i=0;i<changes.length;i++){
        const c=changes[i];
        if(c.removed){
          let removed=c.value,i2=i+1;
          while(i2<changes.length&&changes[i2].removed){removed+=changes[i2].value;i2++;}
          let added='';
          while(i2<changes.length&&changes[i2].added){added+=changes[i2].value;i2++;}
          const from=removed.trim(),to=added.trim();
          if(from&&to&&from.length>to.length&&from.length>=3&&to.length>=1&&from.length<80){
            const existing=pairs.find(p=>p.from===from);
            if(existing){
              if(existing.to===to){existing.count++;await db.put('pairs',existing);changed=true;}
            }else{
              const np={from,to,count:1};pairs.push(np);await db.put('pairs',np);changed=true;
            }
          }
          i=i2-1;
        }
      }
      if(changed){
        pairs.sort((a,b)=>b.count-a.count);
        renderPairs();
      }
    }

    L.oninput=updateStats;
    R.oninput=()=>{updateStats();learnDebounced();};

    root.querySelector('#apply').onclick=()=>{
      let text=L.value;
      const sorted=[...pairs].sort((a,b)=>b.from.length-a.from.length);
      for(const p of sorted){
        const re=new RegExp('\\b'+p.from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi');
        text=text.replace(re,p.to);
      }
      R.value=text;
      updateStats();
    };

    root.querySelector('#export').onclick=()=>{
      download('compressor-pairs.json',JSON.stringify(pairs,null,2),'application/json');
    };

    root.querySelector('#import').onclick=()=>{
      const inp=document.createElement('input');inp.type='file';inp.accept='.json';
      inp.onchange=async()=>{
        const f=inp.files[0];if(!f)return;
        const arr=JSON.parse(await f.text());
        for(const p of arr){
          const existing=pairs.find(x=>x.from===p.from);
          if(existing){existing.count+=p.count||1;existing.to=p.to;await db.put('pairs',existing);}
          else{const np={from:p.from,to:p.to,count:p.count||1};pairs.push(np);await db.put('pairs',np);}
        }
        pairs.sort((a,b)=>b.count-a.count);
        renderPairs();
      };
      inp.click();
    };

    root.querySelector('#clear').onclick=async()=>{
      if(!confirm('Clear all learned pairs?'))return;
      await db.clear('pairs');pairs=[];renderPairs();
    };

    renderPairs();updateStats();
  }
};
