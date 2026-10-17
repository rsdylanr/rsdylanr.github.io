export default{id:'color',name:'Color Converter',icon:'🎨',description:'Convert between HEX, RGB, HSL',mount(root){
root.innerHTML=['<div class="color-preview" id="preview"></div>','<div class="row"><input type="color" id="picker" value="#3498db"></div>','<div class="grid-3"><div><label>HEX</label><input id="hex" value="#3498db"></div><div><label>RGB</label><input id="rgb" value="52, 152, 219"></div><div><label>HSL</label><input id="hsl" value="204, 70%, 53%"></div></div>'].join('');
const $=id=>root.querySelector('#'+id);
function h2r(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function r2h(r,g,b){return'#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function r2hsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}return[Math.round(h*360),Math.round(s*100),Math.round(l*100)];}
function upd(h){const[r,g,b]=h2r(h);const[hh,s,l]=r2hsl(r,g,b);$('hex').value=h;$('rgb').value=r+', '+g+', '+b;$('hsl').value=hh+', '+s+'%, '+l+'%';$('preview').style.background=h;$('picker').value=h.length===7?h:r2h(r,g,b);}
$('picker').oninput=()=>upd($('picker').value);
$('hex').oninput=()=>{const v=$('hex').value;if(/^#?[0-9a-f]{3,6}$/i.test(v))upd(v.startsWith('#')?v:'#'+v);};
$('rgb').oninput=()=>{const m=$('rgb').value.match(/(\d+)\D+(\d+)\D+(\d+)/);if(m)upd(r2h(+m[1],+m[2],+m[3]));};
$('hsl').oninput=()=>{const m=$('hsl').value.match(/(\d+)\D+(\d+)\D+(\d+)/);if(!m)return;const[h,s,l]=[+m[1],+m[2]/100,+m[3]/100];const c=(1-Math.abs(2*l-1))*s;const x=c*(1-Math.abs((h/60)%2-1));const m2=l-c/2;let rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];rgb=rgb.map(v=>Math.round((v+m2)*255));upd(r2h(rgb[0],rgb[1],rgb[2]));};
upd('#3498db');}};
