// =======================
// 侧栏按钮 & 页面切换
// =======================
const buttons  = document.querySelectorAll(".nav-btn");
const contents = document.querySelectorAll(".content");

// 先把 Home 设为激活
document.getElementById("MainPage")?.classList.add("active");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.content; // 目标 section 的 id

    // 切换按钮高亮
    buttons.forEach(b => b.classList.toggle("active", b === btn));

    // 切换页面显示
    contents.forEach(page => {
      page.classList.toggle("active", page.id === id);
    });
  });
});

// =======================
// 魔法棒：主题切换（合并成一个）
// =======================
const themes = ['theme-night', 'theme-fantasy', 'theme-dark'];
let currentThemeIndex = -1;
function toggleTheme() {
  themes.forEach(t => document.body.classList.remove(t));
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  document.body.classList.add(themes[currentThemeIndex]);
}
window.toggleTheme = toggleTheme;



// ===== Daily Practice 3D Map (dp3d) =====
(function initDailyPractice3D(){
const section = document.getElementById('Daily Practice');
if (!section) return;
const stage = section.querySelector('.dp3d-stage');
if (!stage) return;


// 1) Configure stations & Voiceflow links here
// Replace the placeholder URL(s) with your real Voiceflow prototype links per topic.
const VF = 'https://creator.voiceflow.com/prototype/67c20b63d2f15c9ea5e63754';
const stationData = {
numbers: { icon:'🔢', title:'Number Sense', description:'Master the fundamentals of numbers and counting. This station covers basic number recognition, counting, and relationships.', url: VF },
addition: { icon:'➕', title:'Addition', description:'Add with confidence: single- and multi-digit practice.', url: VF },
subtraction: { icon:'➖', title:'Subtraction', description:'Take away and compare: single- and multi-digit practice.', url: VF },
multiplication:{ icon:'✖️', title:'Multiplication', description:'Discover repeated addition. Learn tables and strategies.', url: VF },
division: { icon:'➗', title:'Division', description:'Share equally and divide. Practice facts and long division.', url: null },
fractions: { icon:'🧩', title:'Fractions', description:'Understand parts of a whole and compare fractions.', url: null },
decimals: { icon:'🔸', title:'Decimals', description:'Explore decimals and their relation to fractions.', url: null },
geometry: { icon:'📐', title:'Geometry', description:'Shapes, angles, and spatial reasoning.', url: null },
algebra: { icon:'🔤', title:'Algebra', description:'Variables, expressions, and equations.', url: null },
statistics: { icon:'📊', title:'Statistics', description:'Collect, analyze, and interpret data.', url: null },
};


// 2) Modal elements
const modal = document.getElementById('dp3d-modal');
const modalIcon = document.getElementById('dp3d-modal-icon');
const modalTitle = document.getElementById('dp3d-modal-title');
const modalDesc = document.getElementById('dp3d-modal-desc');
const btnClose = document.getElementById('dp3d-close');
const btnStart = document.getElementById('dp3d-start');
const progressText = document.getElementById('dp3d-progress-text');
const progressFill = section.querySelector('.dp3d-progress-fill');


let currentTopic = null;


function openModal(){ modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); currentTopic = null; }


function showStationModal(topic){
const data = stationData[topic]; if (!data) return;
currentTopic = topic;
modalIcon.textContent = data.icon;
modalTitle.textContent = data.title;
modalDesc.textContent = data.description;
btnStart.disabled = !data.url;
btnStart.textContent = data.url ? 'Start Practice' : 'Coming Soon';
openModal();
}


function showLockedModal(){
currentTopic = null;
modalIcon.textContent = '🔒';
})();



// =======================
// Math Tutor UI 逻辑（修复版）
// =======================
(function initMathTutor() {
  const messages = document.getElementById('mv-messages');
  const form = document.getElementById('mv-form');
  const input = document.getElementById('mv-input');
  if (!messages || !form || !input) return;

  // 更新为你的后端地址
  const ENDPOINT = 'http://localhost:3000/chat';

  // 保持 AI Assistant 页面激活
  function keepAssistantActive() {
    const assistant = document.getElementById('AI Assistant');
    if (!assistant) return;
    document.querySelectorAll('.content').forEach(sec => {
      sec.classList.toggle('active', sec === assistant);
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.content === 'AI Assistant');
    });
  }

  // 格式化消息内容（处理 LaTeX 和换行）
  function formatContent(text) {
    // 处理换行符
    let formatted = text.replace(/\n/g, '<br>');
    
    // 处理 LaTeX 公式
    // 替换 $$ ... $$ 为块级公式
    formatted = formatted.replace(/\$\$(.*?)\$\$/g, '<div class="math-block">\\[$1\\]</div>');
    
    // 替换 $ ... $ 为行内公式
    formatted = formatted.replace(/\$(.*?)\$/g, '<span class="math-inline">\\($1\\)</span>');
    
    // 处理 \frac 等常见 LaTeX 命令（如果没有被 $ 包围）
    formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-inline">\\(\\frac{$1}{$2}\\)</span>');
    
    // 加粗步骤标题
    formatted = formatted.replace(/\*\*(Step \d+:.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return formatted;
  }

  // 生成消息行
  function addRow(role, text, typing = false) {
    const row = document.createElement('div');
    row.className = `mv-row ${role === 'user' ? 'mv-row-user' : 'mv-row-assistant'}`;

    const avatar = document.createElement('div');
    avatar.className = 'mv-avatar';
    avatar.innerHTML = role === 'user'
      ? '<i class="fas fa-user"></i>'
      : '<i class="fas fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'mv-bubble';
    
    if (typing) {
      bubble.innerHTML = `
        <span class="mv-typing">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>`;
    } else {
      // 使用 innerHTML 而不是 textContent 来支持 HTML 格式
      bubble.innerHTML = role === 'assistant' ? formatContent(text) : text;
    }

    row.appendChild(avatar);
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  async function ask(question) {
    keepAssistantActive();
    addRow('user', question);
    const bubble = addRow('assistant', '', true);

    try {
      const resp = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: `You are a friendly math tutor for teens. 
                Format your responses clearly:
                - Use ** for bold text (e.g., **Step 1:**)
                - Use $ for inline math (e.g., $x = 5$)
                - Use $$ for display math (e.g., $$x^2 + y^2 = z^2$$)
                - Use line breaks between steps
                - Show work step by step
                - Explain reasoning clearly`
            },
            { role: 'user', content: question }
          ]
        })
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      
      // 使用格式化后的内容
      bubble.innerHTML = formatContent(data.content || '(No response)');

      // 触发 MathJax 重新渲染
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([bubble]).catch((e) => {
          console.log('MathJax rendering error:', e);
        });
      }
      
      // 确保 MathJax 处理新内容
      if (window.MathJax && MathJax.startup) {
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
      }
      
    } catch (e) {
      bubble.innerHTML = 'Network or server error. Please try again.';
      console.error(e);
    } finally {
      messages.scrollTop = messages.scrollHeight;
      keepAssistantActive();
    }
  }

  // 表单提交
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    keepAssistantActive();

    const q = (input.value || '').trim();
    if (!q) return;

    input.value = '';
    ask(q);
    return false;
  });

  // Enter 发送，Shift+Enter 换行
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  document.querySelector('.mv-send')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // 配置 MathJax
  window.MathJax = {
    tex: {
      inlineMath: [['\\(', '\\)'], ['$', '$']],
      displayMath: [['\\[', '\\]'], ['$$', '$$']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    },
    startup: {
      pageReady: () => {
        return MathJax.startup.defaultPageReady().then(() => {
          console.log('MathJax 初始化完成');
        });
      }
    }
  };
})();


// =======================
// My Collection：预览 + 弹窗查看/编辑 + 右键菜单 + 分享 + 取消收藏
// =======================
(function initCollection(){
  const listEl   = document.getElementById('col-list');
  const filterEl = document.getElementById('col-filter');
  const newBtn   = document.getElementById('col-new-note');
  const editorEl = document.getElementById('col-editor');
  const titleEl  = document.getElementById('col-title');
  const bodyEl   = document.getElementById('col-body');
  const saveBtn  = document.getElementById('col-save');
  const cancelBtn= document.getElementById('col-cancel');

  const modalEl  = document.getElementById('col-modal');
  const modalTitle= document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalEdit = document.getElementById('modal-edit');
  const modalSave = document.getElementById('modal-save');
  const modalDelete= document.getElementById('modal-delete');
  const modalClose = document.getElementById('modal-close');

  const shareSheet= document.getElementById('share-sheet');

  const menuEl   = document.getElementById('col-menu');

  if (!listEl || !newBtn) return;

  const STORE_KEY = 'mv_collection_v1';
  const PLAZA_KEY = 'mv_plaza_posts_v1';
  let editingId = null;      // 新建/编辑用
  let viewingId = null;      // 弹窗中查看的条目

  const load = () => JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  const save = (arr) => localStorage.setItem(STORE_KEY, JSON.stringify(arr));

  const loadPlaza = () => JSON.parse(localStorage.getItem(PLAZA_KEY) || '[]');
  const savePlaza = (arr) => localStorage.setItem(PLAZA_KEY, JSON.stringify(arr));

  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  const preview = (s, n=140) => {
    const t = (s||'').replace(/\s+/g,' ').trim();
    return t.length>n ? t.slice(0,n)+'…' : t;
  };

  // —— 渲染列表（只显示预览） —— //
  function render(){
    const type = filterEl?.value || 'all';
    const data = load().filter(it => type==='all' ? true : it.type===type)
                       .sort((a,b)=> b.createdAt - a.createdAt);

    listEl.innerHTML = data.map(it => {
      const text = it.type==='note' ? (it.content || '') : (it.content || '');
      return `
      <div class="col-item" data-id="${it.id}">
        <div class="main">
          <div class="title"><strong>${escapeHtml(it.title || '(Untitled)')}</strong> <span class="tag">${it.type}</span></div>
          <div class="snippet">${escapeHtml(preview(text))}</div>
          <div class="meta">${new Date(it.createdAt).toLocaleString()}</div>
        </div>
        <div class="actions">
          ${it.type==='note' ? `<button class="btn edit" title="Edit"><i class="fas fa-pen"></i></button>` : ''}
          <button class="btn share" title="Share"><i class="fas fa-share"></i></button>
          <button class="btn del"   title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
  }

  // —— 新建/编辑 笔记（编辑器卡片） —— //
  function openEditor(note){
    editorEl.classList.remove('hidden');
    editingId = note?.id || null;
    titleEl.value = note?.title || '';
    bodyEl.innerHTML = note?.html || '';
    bodyEl.focus();
  }
  function closeEditor(){ editorEl.classList.add('hidden'); editingId = null; }

  newBtn.addEventListener('click', ()=> openEditor(null));
  cancelBtn.addEventListener('click', closeEditor);
  saveBtn.addEventListener('click', ()=>{
    const items = load();
    const now = Date.now();
    const item = {
      id: editingId || ('n_'+now),
      type:'note',
      title: titleEl.value.trim() || 'Untitled',
      html:  bodyEl.innerHTML,
      content: bodyEl.textContent,
      createdAt: editingId ? (items.find(i=>i.id===editingId)?.createdAt || now) : now,
      updatedAt: now
    };
    const idx = items.findIndex(i=>i.id===item.id);
    if (idx>=0) items[idx]=item; else items.push(item);
    save(items);
    closeEditor();
    render();
  });

  // 工具栏
  document.querySelector('.editor-toolbar')?.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    if (btn.dataset.cmd){ document.execCommand(btn.dataset.cmd,false,null); bodyEl.focus(); return; }
    if (btn.hasAttribute('data-mark')){
      const sel = window.getSelection();
      if (sel && sel.rangeCount && !sel.getRangeAt(0).collapsed){
        const r = sel.getRangeAt(0); const mark = document.createElement('mark'); r.surroundContents(mark);
      }
      bodyEl.focus(); return;
    }
    if (btn.id==='insert-checklist'){
      document.execCommand('insertHTML', false, `<ul class="checklist"><li><label><input type="checkbox"> item</label></li></ul>`);
      bodyEl.focus(); return;
    }
  });

  // —— 列表交互：单击打开弹窗；右键菜单；按钮操作 —— //
  listEl.addEventListener('click', (e)=>{
    const itemEl = e.target.closest('.col-item'); if(!itemEl) return;
    const id = itemEl.dataset.id;
    if (e.target.closest('.del'))   return delItem(id);
    if (e.target.closest('.share')) return openShare(id);
    if (e.target.closest('.edit'))  return openEditor(load().find(i=>i.id===id));
    // 点击空白/正文：打开弹窗
    openModal(id);
  });

  listEl.addEventListener('contextmenu', (e)=>{
    const itemEl = e.target.closest('.col-item'); if(!itemEl) return;
    e.preventDefault();
    const id = itemEl.dataset.id;
    const itm = load().find(i=>i.id===id);
    // 放到鼠标位置
    menuEl.style.left = `${e.pageX}px`;
    menuEl.style.top  = `${e.pageY}px`;
    menuEl.classList.remove('hidden');
    // 笔记才显示 Edit
    menuEl.querySelector('[data-act="edit"]').style.display = (itm?.type==='note') ? '' : 'none';
    menuEl.dataset.id = id;
  });
  document.addEventListener('click', ()=> menuEl.classList.add('hidden'));
  menuEl.addEventListener('click', (e)=>{
    const act = e.target.closest('button')?.dataset.act; if(!act) return;
    const id = menuEl.dataset.id;
    if (act==='open')  openModal(id);
    if (act==='edit')  openEditor(load().find(i=>i.id===id));
    if (act==='share') openShare(id);
    if (act==='delete') delItem(id);
    menuEl.classList.add('hidden');
  });

  function delItem(id){
    const items = load().filter(i=>i.id!==id); save(items); render(); // 取消收藏/删除
    // 同步 Math Stories 的星标
    syncStoryStars();
    if (modalEl && !modalEl.classList.contains('hidden') && viewingId===id) modalEl.classList.add('hidden');
  }

  // —— 弹窗逻辑 —— //
  function openModal(id){
    const it = load().find(i=>i.id===id); if(!it) return;
    viewingId = id;
    modalTitle.value = it.title || '';
    if (it.type==='note'){
      modalBody.innerHTML = it.html || '';
      modalBody.contentEditable = 'false';
      modalEdit.style.display = '';
    }else{
      modalBody.textContent = it.content || '';
      modalBody.contentEditable = 'false';
      modalEdit.style.display = 'none';
    }
    modalSave.classList.add('hidden');
    shareSheet.classList.add('hidden');
    modalEl.classList.remove('hidden');
  }
  modalClose.addEventListener('click', ()=> modalEl.classList.add('hidden'));
  modalDelete.addEventListener('click', ()=> delItem(viewingId));
  modalEdit.addEventListener('click', ()=>{
    modalBody.contentEditable = 'true';
    modalBody.focus();
    modalSave.classList.remove('hidden');
  });
  modalSave.addEventListener('click', ()=>{
    const arr = load(); const idx = arr.findIndex(i=>i.id===viewingId);
    if (idx>=0 && arr[idx].type==='note'){
      arr[idx].title   = modalTitle.value.trim() || 'Untitled';
      arr[idx].html    = modalBody.innerHTML;
      arr[idx].content = modalBody.textContent;
      arr[idx].updatedAt = Date.now();
      save(arr); render();
    }
    modalBody.contentEditable='false';
    modalSave.classList.add('hidden');
  });

  // —— 分享：系统分享 / 复制 / 分享到 Plaza —— //
  function openShare(id){
    openModal(id);               // 先打开详情
    shareSheet.classList.remove('hidden');
  }
  shareSheet.addEventListener('click', async (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const mode = btn.dataset.share;
    const it = load().find(i=>i.id===viewingId); if(!it) return;

    const shareText = `${it.title}\n\n${it.type==='note' ? (it.content||'') : (it.content||'')}`;
    const shareUrl  = location.href; // 也可以定制

    if (mode==='system'){
      if (navigator.share){
        try{ await navigator.share({ title: it.title, text: shareText, url: shareUrl }); }catch{}
      }else{
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Copied to clipboard.');
      }
    } else if (mode==='copy'){
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Copied to clipboard.');
    } else if (mode==='plaza'){
      const posts = loadPlaza();
      posts.push({ id:'pl_'+Date.now(), title: it.title, content: it.content, createdAt: Date.now() });
      savePlaza(posts);
      alert('Shared to Community Plaza.');
    }
  });


  
  // —— Math Stories：星标切换（收藏/取消收藏） —— //
  function syncStoryStars(){
    const items = load().filter(i=>i.type==='story');
    const titles = new Set(items.map(i=>i.title));
    document.querySelectorAll('.book-item').forEach(card=>{
      const title = card.querySelector('.book-title')?.textContent?.trim();
      const btn = card.querySelector('.collect-btn');
      if (!btn) return;
      if (titles.has(title)) btn.classList.add('on'); else btn.classList.remove('on');
    });
  }

  document.querySelectorAll('.book-item').forEach(card=>{
    if (card.querySelector('.collect-btn')) return;
    const btn = document.createElement('button');
    btn.className='collect-btn'; btn.title='Collect';
    btn.innerHTML = '<i class="fas fa-star"></i>';
    card.appendChild(btn);
  });

  // 绑定切换
  document.querySelectorAll('.book-item .collect-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card  = btn.closest('.book-item');
      const title = card.querySelector('.book-title')?.textContent?.trim() || 'Story';
      const items = load();
      const idx   = items.findIndex(i=>i.type==='story' && i.title===title);
      if (idx>=0){
        items.splice(idx,1);               // 取消收藏
      }else{
        items.push({ id:'s_'+Date.now(), type:'story', title, content:'Saved from Math Stories', createdAt:Date.now() });
      }
      save(items); render(); syncStoryStars();
    });
  });

  
  // —— Community Plaza：简单 feed 渲染（显示已分享的帖子） —— //
  function renderPlaza(){
    const plaza = document.getElementById('Community Plaza');
    if (!plaza) return;
    let feed = plaza.querySelector('.plaza-feed');
    if (!feed){
      feed = document.createElement('div');
      feed.className = 'plaza-feed';
      plaza.innerHTML = ''; // 如果你原来是图片，可考虑去掉这行，改成 appendChild
      plaza.appendChild(feed);
    }
    const posts = loadPlaza().sort((a,b)=>b.createdAt-a.createdAt);
    feed.innerHTML = posts.map(p=>`
      <div class="plaza-card">
        <div class="title"><strong>${escapeHtml(p.title)}</strong></div>
        <div class="body">${escapeHtml(p.content)}</div>
        <div class="meta">${new Date(p.createdAt).toLocaleString()}</div>
      </div>`).join('');
  }
  // 进入 Plaza 时刷新一下
  const plazaBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b=>b.dataset.content==='Community Plaza');
  plazaBtn?.addEventListener('click', renderPlaza);

  // —— 首次渲染 —— //
  const mcBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.dataset.content === 'My Collection');
  mcBtn?.addEventListener('click', ()=>{ render(); syncStoryStars(); });
  if (document.getElementById('My Collection')?.classList.contains('active')){ render(); syncStoryStars(); }
})();




// ========== Community Plaza：英文 UI + 星标收藏到 My Collection + hover 放大 ==========
(function initPlaza(){
  const FEED = document.getElementById('plaza-feed');
  if (!FEED) return;

  const PLAZA_KEY = 'mv_plaza_posts_v1';
  const COLLECTION_KEY = 'mv_collection_v1';

  // 工具函数
  const loadCol = () => JSON.parse(localStorage.getItem(COLLECTION_KEY) || '[]');
  const saveCol = (arr) => localStorage.setItem(COLLECTION_KEY, JSON.stringify(arr));
  const loadPlaza = () => JSON.parse(localStorage.getItem(PLAZA_KEY) || '[]');

  const rand = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;
  const NAMES = ['Mia','Leo','Ava','Noah','Sophia','Liam','Emma','Ethan','Chloe','Mason','Olivia','Lucas','Isla','Henry','Amelia','Jack','Grace','James','Zoe','Daniel'];
  const CHANS = ['r/calculus','r/ExplainTheJoke','r/confidentlyincorrect','r/askmath','r/math','r/learnmath'];
  const randName = ()=> NAMES[rand(0, NAMES.length-1)];
  const randChan  = ()=> CHANS[rand(0, CHANS.length-1)];

  const randDateAug2025 = ()=>{
    const day = rand(1,31);
    const d = new Date(2025,7,day, rand(8,22), rand(0,59));  // 2025-08
    return d.toISOString();
  };

  const fmtEN = iso => new Date(iso).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); // e.g. Aug 26, 2025
  const nShort = n => n>=1e6? (n/1e6).toFixed(1)+'M' : n>=1e3? (n/1e3).toFixed(1)+'k' : String(n);

  function avatarHTML(name){
    const initials = name.slice(0,1).toUpperCase();
    const h = rand(0,360);
    const bg = `linear-gradient(135deg, hsl(${h}deg 80% 55%), hsl(${(h+40)%360}deg 80% 45%))`;
    return `<span class="avatar" style="background:${bg}">${initials}</span>`;
  }

  // 静态种子（可以替换标题；缩略图路径已改）
  const SEEDS = [
    { title: 'Do I need to be a math expert to understand this?', thumb: 'images/p2.jpg' },
    { title: '"Thank God I\'m a math major."',                  thumb: 'images/p3.jpg' },
    { title: 'My Wife (Math Teacher) Cannot Figure This Out',   thumb: 'images/p4.jpg' },
    { title: '8 year old is obsessed with math, plz help.',     thumb: 'images/p1.jpg' },
  ].map(t => ({
    id: 'seed_' + Math.random().toString(36).slice(2),
    type: 'seed',
    title: t.title,
    channel: randChan(),
    author: randName(),
    createdAt: randDateAug2025(),
    votes: rand(1200, 48000),
    comments: rand(180, 2500),
    thumb: t.thumb
  }));

  // 来自 “My Collection → Share to Community Plaza” 的用户贴（置顶）
  const userPosts = loadPlaza().map(p => ({
    id: p.id, type: 'user',
    title: p.title || 'Shared post',
    channel: 'MathVillage',
    author: 'Anna',
    createdAt: new Date(p.createdAt || Date.now()).toISOString(),
    votes: rand(20, 120), comments: rand(0, 20),
    content: p.content || '',
    thumb: '' // 目前不带缩略图
  }));

  // 合并 & 时间倒序
  let all = [...userPosts, ...SEEDS].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));

  // 判断某条 post 是否已经收藏到 My Collection
  function isFaved(id){
    return loadCol().some(i => i.type==='post' && i.fromId===id);
  }
  function toggleFav(post){
    const arr = loadCol();
    const idx = arr.findIndex(i => i.type==='post' && i.fromId===post.id);
    if (idx>=0){
      arr.splice(idx,1); // 取消收藏
    }else{
      arr.push({
        id: 'p_' + Date.now(),
        type: 'post',
        fromId: post.id,                 // 关联 plaza 里的 id，方便同步
        title: post.title,
        content: `${post.channel} • ${post.author} • ${fmtEN(post.createdAt)}`,
        createdAt: Date.now()
      });
    }
    saveCol(arr);
  }

  // 渲染一条卡片（英文 UI + 右上角星标）
  function cardHTML(p){
    const starred = isFaved(p.id) ? 'on' : '';
    return `
      <article class="post-card" data-id="${p.id}">
        <button class="post-star ${starred}" aria-label="Save or remove">
          <i class="fas fa-star"></i>
        </button>

        <div class="post-main">
          <div class="post-head">
            ${avatarHTML(p.author)}
            <span class="chan">${p.channel}</span>
            <span class="dot"></span>
            <span>${fmtEN(p.createdAt)}</span>
          </div>
          <div class="post-title">${p.title}</div>
          <div class="post-meta">${nShort(p.votes)} votes · ${nShort(p.comments)} comments</div>
        </div>
        ${p.thumb ? `<img class="post-thumb" src="${p.thumb}" alt="" onerror="this.remove()">` : `<span></span>`}
      </article>
    `;
  }

  function render(){ FEED.innerHTML = all.map(cardHTML).join(''); }
  render();

  // 点击星标：收藏/取消收藏 + UI 同步
  FEED.addEventListener('click', (e)=>{
    const star = e.target.closest('.post-star');
    if (!star) return;
    const card = star.closest('.post-card');
    const id = card?.dataset.id;
    const post = all.find(p => p.id === id);
    if (!post) return;
    toggleFav(post);
    star.classList.toggle('on', isFaved(id));
  });

  // 切到 Plaza 页时刷新（为了反映 My Collection 的变动）
  const plazaBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b=>b.dataset.content==='Community Plaza');
  plazaBtn?.addEventListener('click', ()=>{
    // 重新读用户帖
    const refreshedUser = loadPlaza().map(p => ({
      id: p.id, type: 'user',
      title: p.title || 'Shared post',
      channel: 'MathVillage',
      author: 'Anna',
      createdAt: new Date(p.createdAt || Date.now()).toISOString(),
      votes: rand(20, 120), comments: rand(0, 20),
      content: p.content || '', thumb: ''
    }));
    all = [...refreshedUser, ...SEEDS].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    render();
  });
})();




