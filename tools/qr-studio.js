export default{
  id:'qr',name:'QR Studio',icon:'📱',
  desc:'Generate styled QR codes, download as SVG or PNG',
  mount(root){
    root.innerHTML=`
      <label>Content (URL, text, vCard…)</label>
      <textarea id="text" rows="3">https://rsdylanr.github.io/</textarea>
      <div class="grid-3">
        <div><label>Size (px)</label><input type="number" id="size" value="300" min="100" max="1000"></div>
        <div><label>Foreground</label><input type="color" id="fg" value="#000000"></div>
        <div><label>Background</label><input type="color" id="bg" value="#ffffff"></div>
      </div>
      <div class="row">
        <button id="run" class="btn">Generate</button>
        <button id="svg" class="btn small ghost">Download SVG</button>
        <button id="png" class="btn small ghost">Download PNG</button>
      </div>
      <div id="out" style="margin-top:16px;text-align:center"></div>`;

    const $=s=>root.querySelector('#'+s);
    let currentSvg=null;

    $('run').onclick=async()=>{
      const text=$('text').value;
      if(!text)return;
      $('out').innerHTML='<div class="loading">Generating</div>';
      try{
        const QRCode=await import('qrcode');
        const svg=await QRCode.toString(text,{
          type:'svg',width:+$('size').value,
          color:{dark:$('fg').value,light:$('bg').value},
          margin:2,errorCorrectionLevel:'M'
        });
        currentSvg=svg;
        $('out').innerHTML=svg;
      }catch(e){
        $('out').innerHTML=`<p class="err">${e.message}</p>`;
      }
    };

    $('svg').onclick=()=>{
      if(!currentSvg)return;
      const blob=new Blob([currentSvg],{type:'image/svg+xml'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qr.svg';a.click();
    };

    $('png').onclick=async()=>{
      const text=$('text').value;
      if(!text)return;
      try{
        const QRCode=await import('qrcode');
        const canvas=document.createElement('canvas');
        await QRCode.toCanvas(canvas,text,{
          width:+$('size').value,
          color:{dark:$('fg').value,light:$('bg').value},
          margin:2
        });
        canvas.toBlob(b=>{
          const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='qr.png';a.click();
        });
      }catch(e){alert(e.message);}
    };

    $('run').click();
  }
};
