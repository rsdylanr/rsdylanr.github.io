export default{id:'uuid',name:'UUID Generator',icon:'🆔',description:'Generate UUID v4',mount(root){
root.innerHTML=['<div class="row"><label>Count: <input type="number" id="count" value="5" min="1" max="1000" style="width:80px"></label><button id="gen" class="btn">Generate</button><button id="copy" class="btn small">Copy All</button></div>','<textarea id="out" rows="14" readonly></textarea>'].join('');
const $=id=>root.querySelector('#'+id);
function gen(){const n=Math.max(1,Math.min(1000,+$('count').value||1));const arr=[];for(let i=0;i<n;i++)arr.push(crypto.randomUUID());$('out').value=arr.join('\n');}
$('gen').onclick=gen;$('copy').onclick=()=>navigator.clipboard.writeText($('out').value);gen();}};
