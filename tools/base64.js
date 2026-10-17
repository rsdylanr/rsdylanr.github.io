export default{id:'base64',name:'Base64',icon:'🔐',description:'Encode/decode Base64 (UTF-8 safe)',mount(root){
root.innerHTML=['<div class="grid-2"><div><label>Input</label><textarea id="input" rows="10" placeholder="Enter text…"></textarea></div><div><label>Output</label><textarea id="output" rows="10" readonly></textarea></div></div>','<div class="row"><button id="enc" class="btn">Encode →</button><button id="dec" class="btn">← Decode</button><button id="copy" class="btn small">Copy</button></div>'].join('');
const $=id=>root.querySelector('#'+id);
$('enc').onclick=()=>{try{const bytes=new TextEncoder().encode($('input').value);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));$('output').value=btoa(bin);}catch(e){$('output').value='Error: '+e.message;}};
$('dec').onclick=()=>{try{const bin=atob($('input').value.trim());const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);$('output').value=new TextDecoder().decode(bytes);}catch(e){$('output').value='Error: '+e.message;}};
$('copy').onclick=()=>navigator.clipboard.writeText($('output').value);}};
