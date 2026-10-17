export default{id:'text-stats',name:'Text Statistics',icon:'📊',description:'Count characters, words, lines, sentences',mount(root){
root.innerHTML=['<textarea id="text" rows="12" placeholder="Paste or type text…"></textarea>','<div class="stats-grid" id="stats"></div>'].join('');
const $=id=>root.querySelector('#'+id);
function s(){const t=$('text').value;const c=t.length;const cs=t.replace(/\s/g,'').length;const w=t.trim()?t.trim().split(/\s+/).length:0;const l=t?t.split('\n').length:0;const se=(t.match(/[.!?]+/g)||[]).length;const p=t.trim()?t.trim().split(/\n\s*\n/).filter(x=>x.trim()).length:0;const avg=w?Math.round(cs/w):0;const rm=Math.ceil(w/200);const items=[['Characters',c],['No spaces',cs],['Words',w],['Lines',l],['Sentences',se],['Paragraphs',p],['Avg word len',avg],['Read time',rm+' min']];$('stats').innerHTML=items.map(([k,v])=>'<div class="stat"><div class="stat-value">'+v+'</div><div class="stat-label">'+k+'</div></div>').join('');}
$('text').oninput=s;s();}};
