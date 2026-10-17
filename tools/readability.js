import {esc} from '../lib/util.js';

export default{
  id:'read',name:'Readability',icon:'📖',
  desc:'Flesch-Kincaid, Gunning Fog, SMOG, ARI, Coleman-Liau',
  mount(root){
    root.innerHTML=`
      <label>Text</label>
      <textarea id="text" rows="12" placeholder="Paste text to analyze…"></textarea>
      <div id="stats"></div>`;

    const $=s=>root.querySelector('#'+s);

    function countSyllables(word){
      word=word.toLowerCase().replace(/[^a-z]/g,'');
      if(!word)return 0;
      if(word.length<=3)return 1;
      word=word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');
      const m=word.match(/[aeiouy]{1,2}/g);
      return m?m.length:1;
    }

    function analyze(text){
      if(!text.trim())return null;
      const sentences=(text.match(/[.!?]+/g)||[]).length||1;
      const words=text.match(/\b\w+\b/g)||[];
      const wc=words.length||1;
      const syllables=words.reduce((s,w)=>s+countSyllables(w),0);
      const complexWords=words.filter(w=>countSyllables(w)>=3).length;
      const chars=text.replace(/\s/g,'').length;

      const fk=206.835-1.015*(wc/sentences)-84.6*(syllables/wc);
      const fog=0.4*((wc/sentences)+100*(complexWords/wc));
      const smog=1.043*Math.sqrt(complexWords*(30/sentences))+3.1291;
      const ari=4.71*(chars/wc)+0.5*(wc/sentences)-21.43;
      const cli=0.0588*(chars/wc*100)-0.296*(sentences/wc*100)-15.8;
      const fre=206.835-1.015*(wc/sentences)-84.6*(syllables/wc);

      return{fk,fog,smog,ari,cli,fre,wc,sentences,syllables,complexWords};
    }

    function grade(v,key){
      if(key==='fre'){if(v>=90)return'A';if(v>=80)return'B';if(v>=70)return'C';if(v>=60)return'D';if(v>=30)return'E';return'F';}
      if(v<=6)return'A';if(v<=8)return'B';if(v<=10)return'C';if(v<=12)return'D';if(v<=14)return'E';return'F';
    }

    $('text').oninput=()=>{
      const r=analyze($('text').value);
      if(!r){$('stats').innerHTML='';return;}
      const rows=[
        ['Flesch Reading Ease',r.fre.toFixed(1),grade(r.fre,'fre')],
        ['Flesch-Kincaid Grade',r.fk.toFixed(1),grade(r.fk)],
        ['Gunning Fog Index',r.fog.toFixed(1),grade(r.fog)],
        ['SMOG Index',r.smog.toFixed(1),grade(r.smog)],
        ['Automated Readability',r.ari.toFixed(1),grade(r.ari)],
        ['Coleman-Liau Index',r.cli.toFixed(1),grade(r.cli)],
      ];
      $('stats').innerHTML=`
        <div class="stats-grid">
          ${rows.map(([k,v,g])=>`<div class="stat"><div class="stat-value">${v}<span class="chip">${g}</span></div><div class="stat-label">${k}</div></div>`).join('')}
        </div>
        <div class="stats-grid" style="margin-top:12px">
          <div class="stat"><div class="stat-value">${r.wc}</div><div class="stat-label">Words</div></div>
          <div class="stat"><div class="stat-value">${r.sentences}</div><div class="stat-label">Sentences</div></div>
          <div class="stat"><div class="stat-value">${r.syllables}</div><div class="stat-label">Syllables</div></div>
          <div class="stat"><div class="stat-value">${r.complexWords}</div><div class="stat-label">Complex words</div></div>
        </div>`;
    };
  }
};
