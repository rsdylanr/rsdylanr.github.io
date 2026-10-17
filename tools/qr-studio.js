async function loadQRGen(){
  if(window.qrcode)return window.qrcode;
  await new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
    s.onload=res;
    s.onerror=()=>rej(new Error('QR library CDN unavailable'));
    document.head.appendChild(s);
  });
  return window.qrcode;
}
export default{id:'qr',name:'QR Studio',icon:'📱',desc:'Generate styled QR codes, download as SVG or PNG',mount(root){
root.innerHTML=`<label>Content (URL, text, vCard…)</label><textarea id="text" rows="3">https://rsdylanr.github.io/</textarea><div class="grid-3"><div><label>Size (px)</label><input type="number" id="size" value="300" min="100" max="1000"></div><div><label>Foreground</label><input type="color" id="fg" value="#000000"></div><div><label>Background</label><input type="color" id="bg" value="#ffffff"></div></div><div class="row"><button id="run" class="btn">Generate</button><button id="svg" class="btn small ghost">Download SVG</button><button id="png" class="btn small ghost">Download PNG</button></div><div id="out" style="margin-top:16px;text-align:center"></div>`;
const $=s=>root.querySelector('#'+s);let currentSvg=null;
$('run').onclick=async()=>{const text=$('text').value;if(!text)return;$('out').innerHTML='<div class="loading">Generating</div>';try{const qrcode=await loadQRGen();const qr=qrcode(0,'M');qr.addData(text);qr.make();const fg=$('fg').value,bg=$('bg').value;const size=+$('size').value;const modules=qr.getModuleCount();const cellSize=Math.max(2,Math.floor(size/(modules+4)));let svg=qr.createSvgTag(cellSize,2);svg=svg.replace(/fill="#000000"/gi,`fill="${fg}"`).replace(/fill="#FFFFFF"/gi,`fill="${bg}"`).replace(/fill="#ffffff"/g,`fill="${bg}"`);currentSvg=svg;$('out').innerHTML=svg;}catch(e){$('out').innerHTML=`<p class="err">${e.message}</p>`;}};
$('svg').onclick=()=>{if(!currentSvg){$('run').click();return;}const blob=new Blob([currentSvg],{type:'image/svg+xml'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qr.svg';a.click();};
$('png').onclick=async()=>{if(!currentSvg){$('run').click();await new Promise(r=>setTimeout(r,500));if(!currentSvg)return;}const img=new Image();const svgBlob=new Blob([currentSvg],{type:'image/svg+xml'});const url=URL.createObjectURL(svgBlob);img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);canvas.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='qr.png';a.click();});URL.revokeObjectURL(url);};img.src=url;};
$('run').click();}};
