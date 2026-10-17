import {filesFromDSL,download} from '../lib/util.js';

export default{
  id:'splitter',name:'Bundle Splitter',icon:'✂️',
  desc:'Split one giant HTML file (or DSL block) into separate index.html / app.js / styles.css',
  mount(root){
    root.innerHTML=`
      <div class="tabs" id="tabs">
        <button class="tab active" data-mode="html">HTML mode</button>
        <button class="tab" data-mode="dsl">DSL mode</button>
      </div>
      <div class="tab-panel active" data-panel="html">
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:8px">Paste a single HTML file containing inline &lt;style&gt; and &lt;script&gt; — they get extracted into separate files.</p>
      </div>
      <div class="tab-panel" data-panel="dsl">
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:8px">Paste <code>
