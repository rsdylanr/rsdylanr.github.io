import {download,fmtBytes} from '../lib/util.js';

export default{
  id:'dict',name:'Dictionary Merger',icon:'🔀',
  desc:'Upload multiple dictionary JSON files, merge, dedupe, and chunk-export',
  mount(root){
    root.innerHTML=`
      <label>Upload dictionary files (.json — array of {from,to} or object map)</label>
      <input type="file" id="files" multiple accept=".json" style="padding:8px">
      <div class="row">
        <button id="merge" class="btn">Merge all</button>
        <button id="export" class="btn small ghost">Export merged (single file)</button>
        <button id="chunk" class="btn small ghost">Export as prefix chunks (a.json, b.json…)</button>
        <button id="clear" class="btn small danger">Clear</button>
      </div>
      <div class="stats-grid" id="stats"></div>
      <label>Preview (first 20 merged pairs)</label>
      <div id="preview" class="highlight-box" style="min-height:120px"></div>`;

    const $=s=>root.querySelector('#'+s);
    const dict=new Map();

    function normalize(entry){
      // supports [{from,to}] or {"from":"to"} or {from:[to]} etc.
      if(Array.isArray(entry))return entry.map(e=>[e.from,e.to]);
      return Object.entries(entry);
    }

    function addPairs(pairsArr,source){
      let added=0,updated=0;
      for(const[from,to]of pairsArr){
        if(!from||!to)continue;
        const key=String(from);
        const val=String(to);
        const existing=dict.get(key);
        if(!existing){dict.set(key,val);added++;}
        else if(existing!==val){
          if(val.length<existing.length){dict.set(key,val);updated++;}
        }
      }
      return{added,updated};
    }

    function updateStats(files,added,updated){
      $('stats').innerHTML=[
        ['Files',files,''],
        ['Pairs',dict.size,''],
        ['Added',added,'good'],
        ['Shorter',updated,'warn']
      ].map(([k,v,c])=>`<div class="stat"><div class="stat-value">${v}</div><div class="stat-label">${k}</div></div>`).join('');
      const arr=[...dict.entries()].slice(0,20);
      $('preview').innerHTML=arr.map(([f,t])=>`<div><code>${f}</code> → <code>${t}</code></div>`).join('')||'<span style="color:var(--text-dim)">No pairs yet</span>';
    }

    $('merge').onclick=async()=>{
      const files=$('files').files;
      if(!files.length){alert('Choose files first');return;}
      let added=0,updated=0;
      for(const f of files){
        try{
          const data=JSON.parse(await f.text());
          const pairs=Array.isArray(data)?data.map(e=>[e.from,e.to]):Object.entries(data);
          const r=addPairs(pairs,f.name);
          added+=r.added;updated+=r.updated;
        }catch(e){alert(`Failed on ${f.name}: ${e.message}`);}
      }
      updateStats(files.length,added,updated);
    };

    $('export').onclick=()=>{
      const arr=[...dict.entries()].map(([from,to])=>({from,to}));
      download('merged-dict.json',JSON.stringify(arr,null,2),'application/json');
    };

    $('chunk').onclick=async()=>{
      const buckets={};
      for(const[from,to]of dict){
        const prefix=(from[0]||'#').toLowerCase();
        const key=/[a-z]/.test(prefix)?prefix:'_';
        (buckets[key]=buckets[key]||[]).push({from,to});
      }
      if(Object.keys(buckets).length===1){
        const arr=[...dict.entries()].map(([from,to])=>({from,to}));
        download('dict.json',JSON.stringify(arr,null,2),'application/json');
        return;
      }
      for(const[k,v]of Object.entries(buckets)){
        await new Promise(r=>setTimeout(r,50));
        download(`dict-${k}.json`,JSON.stringify(v,null,2),'application/json');
      }
    };

    $('clear').onclick=()=>{dict.clear();updateStats(0,0,0);};
    updateStats(0,0,0);
  }
};
