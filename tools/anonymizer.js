import {esc} from '../lib/util.js';

const PATTERNS=[
  {name:'Email',re:/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,repl:'[EMAIL]'},
  {name:'Phone (US)',re:/\(?\b\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,repl:'[PHONE]'},
  {name:'SSN',re:/\b\d{3}-\d{2}-\d{4}\b/g,repl:'[SSN]'},
  {name:'Credit card',re:/\b(?:\d[ -]?){13,16}\b/g,repl:'[CARD]'},
  {name:'IP address',re:/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,repl:'[IP]'},
  {name:'URL',re:/https?:\/\/[^\s<>"']+/g,repl:'[URL]'},
  {name:'IPv6',re:/\b(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}\b/g,repl:'[IPV6]'},
  {name:'Date',re:/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,repl:'[DATE]'},
];

export default{
  id:'anon',name:'Anonymizer',icon:'🕵️',
  desc:'Redact emails, phones, SSNs, credit cards, URLs from pasted text',
  mount(root){
    root.innerHTML=`
      <label>Input</label>
      <textarea id="input" rows="10" placeholder="Paste text with PII…"></textarea>
      <div class="row">
        ${PATTERNS.map((p,i)=>`<label style="display:flex;gap:6px;align-items:center;color:var(--text);font-size:12px"><input type="checkbox" data-i="${i}" checked> ${p.name}</label>`).join('')}
      </div>
      <div class="row"><button id="run" class="btn">Redact</button><button id="copy" class="btn small ghost">Copy</button></div>
      <label>Redacted output</label>
      <textarea id="output" rows="10" readonly></textarea>
      <div id="stats"></div>`;

    const $=s=>root.querySelector('#'+s);

    $('run').onclick=()=>{
      let text=$('input').value;
      const counts={};
      const enabled=[...root.querySelectorAll('[data-i]:checked')].map(c=>PATTERNS[+c.dataset.i]);
      for(const p of enabled){
        const matches=text.match(p.re)||[];
        counts[p.name]=matches.length;
        text=text.replace(p.re,p.repl);
      }
      $('output').value=text;
      $('stats').innerHTML=Object.entries(counts).map(([k,v])=>
        `<div class="stat"><div class="stat-value">${v}</div><div class="stat-label">${k}</div></div>`
      ).join('');
    };
    $('copy').onclick=()=>navigator.clipboard.writeText($('output').value);
  }
};
