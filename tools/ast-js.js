export default{
  id:'ast',name:'AST Visualizer',icon:'🌳',
  desc:'Parse JavaScript into an interactive syntax tree',
  async mount(root){
    root.innerHTML=`
      <label>JavaScript code</label>
      <textarea id="code" rows="10" placeholder="const x = 1 + 2;"></textarea>
      <div class="row"><button id="parse" class="btn">Parse</button></div>
      <div id="stats"></div>
      <div id="tree" class="tree" style="margin-top:12px"></div>`;

    const $=s=>root.querySelector('#'+s);

    $('parse').onclick=async()=>{
      const code=$('code').value;
      if(!code.trim()){$('tree').innerHTML='<span style="color:var(--text-dim)">Enter code first</span>';return;}
      try{
        const{parse}=await import('acorn');
        const ast=parse(code,{ecmaVersion:'latest',sourceType:'module',locations:true});
        $('stats').innerHTML=`<div class="stat"><div class="stat-value">${ast.body.length}</div><div class="stat-label">Top-level nodes</div></div>`;
        $('tree').innerHTML=renderNode(ast,'program',0);
        $('tree').querySelectorAll('.node').forEach(n=>{
          n.onclick=e=>{
            e.stopPropagation();
            const range=n.dataset.range;
            if(!range)return;
            const[s,e2]=range.split(',').map(Number);
            $('code').focus();
            $('code').setSelectionRange(s,e2);
          };
        });
      }catch(e){
        $('tree').innerHTML=`<p class="err">${e.message}</p>`;
      }
    };

    function renderNode(node,key,depth){
      if(node===null||typeof node!=='object'){
        return `<span class="val">${JSON.stringify(node)}</span>`;
      }
      if(Array.isArray(node)){
        return node.map((n,i)=>`<div style="margin-left:16px">${renderNode(n,'['+i+']',depth+1)}</div>`).join('');
      }
      const type=node.type||(node.name?'Identifier':null);
      const loc=node.start!=null?node.start+','+node.end:'';
      const keys=Object.keys(node).filter(k=>k!=='type'&&k!=='start'&&k!=='end'&&k!=='loc');
      const label=type?`<span class="type">${type}</span>`:`<span class="type">${key||'node'}</span>`;
      if(!keys.length)return label;
      const children=keys.map(k=>{
        const v=node[k];
        if(v&&typeof v==='object'){
          return `<div style="margin-left:16px"><span class="key">${k}</span>: ${renderNode(v,k,depth+1)}</div>`;
        }
        return `<div style="margin-left:16px"><span class="key">${k}</span>: <span class="val">${JSON.stringify(v)}</span></div>`;
      }).join('');
      return `<span class="node" data-range="${loc}" title="${loc}">${label}</span>${depth<4?'':'<span></span>'}${children?`<div>${children}</div>`:''}`;
    }
  }
};
