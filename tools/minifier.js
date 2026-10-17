import {esc,fmtBytes} from '../lib/util.js';

export default{
  id:'minify',name:'Minifier',icon:'🗜️',
  desc:'Terser-powered JavaScript minification with size comparison',
  mount(root){
    root.innerHTML=`
      <label>JavaScript</label>
      <textarea id="input" rows="10" placeholder="Paste JavaScript…"></textarea>
      <div class="row">
        <label><input type="checkbox" id="mangle" checked> Mangle variables</label>
        <label><input type="checkbox" id="compress" checked> Compress</label>
        <label><input type="checkbox" id="toplevel"> Toplevel mangle</label>
        <button id="run" class="btn">Minify</button>
        <button id="copy" class="btn small ghost">Copy output</button>
      </div>
      <label>Output</label>
      <textarea id="output" rows="10" readonly></textarea>
      <div class="stats-grid" id="stats"></div>`;

    const $=s=>root.querySelector('#'+s);

    $('run').onclick=async()=>{
      const code=$('input').value;
      if(!code.trim())return;
      $('output').value='// minifying…';
      try{
        const{minify}=await import('terser');
        const result=await minify(code,{
          compress:$('compress').checked,
          mangle:$('mangle').checked?{toplevel:$('toplevel').checked}:false,
          format:{comments:false}
        });
        if(result.error){throw result.error;}
        $('output').value=result.code;
        const inSize=new Blob([code]).size,outSize=new Blob([result.code]).size;
        const saved=inSize?((inSize-outSize)/inSize*100).toFixed(1):0;
        $('stats').innerHTML=[
          ['Input',fmtBytes(inSize),''],
          ['Output',fmtBytes(outSize),''],
          ['Saved',saved+'%',saved>0?'good':''],
          ['Ratio',(outSize/inSize*100).toFixed(1)+'%','']
        ].map(([k,v,c])=>`<div class="stat"><div class="stat-value">${v}</div><div class="stat-label">${k}</div></div>`).join('');
      }catch(e){
        $('output').value='// Error: '+e.message;
      }
    };
    $('copy').onclick=()=>navigator.clipboard.writeText($('output').value);
  }
};
