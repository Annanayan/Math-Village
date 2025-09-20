// ========== 用户认证系统 ==========
(function initAuth() {
  const authPage = document.getElementById('auth-page');
  const mainContainer = document.querySelector('.container');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authSwitch = document.getElementById('auth-switch');
  
  // 检查是否已登录
  const currentUser = localStorage.getItem('mv_current_user');
  if (currentUser) {
    // 已登录，隐藏登录页，显示主页
    authPage?.classList.add('hidden');
    updateUserDisplay(currentUser);
  } else {
    // 未登录，显示登录页，隐藏主页
    if (mainContainer) mainContainer.style.display = 'none';
  }

  // 标签切换
  authTabs?.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      authTabs.forEach(t => t.classList.toggle('active', t === tab));
      
      if (mode === 'register') {
        registerForm?.classList.add('active');
        loginForm?.classList.remove('active');
        if (authSwitch) authSwitch.textContent = 'Login instead';
      } else {
        loginForm?.classList.add('active');
        registerForm?.classList.remove('active');
        if (authSwitch) authSwitch.textContent = 'Register instead';
      }
    });
  });

  // 切换链接
  authSwitch?.addEventListener('click', (e) => {
    e.preventDefault();
    const activeTab = document.querySelector('.auth-tab.active');
    const nextMode = activeTab?.dataset.mode === 'register' ? 'login' : 'register';
    document.querySelector(`.auth-tab[data-mode="${nextMode}"]`)?.click();
  });

  // 注册表单提交
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    // 验证密码长度
    if (password.length < 6) {
      const pwError = document.getElementById('password-error');
      if (pwError) {
        pwError.classList.add('show');
      }
      return; // 阻止提交
    }
    const errorEl = document.getElementById('username-error');

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功，自动登录
        localStorage.setItem('mv_current_user', username);
        localStorage.setItem('mv_user_token', data.token);
        enterMainApp(username);
      } else {
        // 显示错误
        if (errorEl) {
          errorEl.textContent = data.error || 'Registration failed';
          errorEl.classList.add('show');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (errorEl) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.classList.add('show');
      }
    }
  });

  // 登录表单提交
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功
        localStorage.setItem('mv_current_user', username);
        localStorage.setItem('mv_user_token', data.token);
        enterMainApp(username);
      } else {
        // 显示错误
        if (errorEl) {
          errorEl.textContent = data.error || 'Login failed';
          errorEl.classList.add('show');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (errorEl) {
        errorEl.textContent = 'Network error. Please try again.';
        errorEl.classList.add('show');
      }
    }
  });


  // 清除密码错误提示
  document.getElementById('reg-password')?.addEventListener('input', () => {
    const pwError = document.getElementById('password-error');
    if (pwError && pwError.classList.contains('show')) {
      if (document.getElementById('reg-password').value.length >= 6) {
        pwError.classList.remove('show');
      }
    }
  });
  document.getElementById('login-username')?.addEventListener('input', () => {
    document.getElementById('login-error')?.classList.remove('show');
  });

  // 进入主应用
  function enterMainApp(username) {
    authPage?.classList.add('hidden');
    if (mainContainer) mainContainer.style.display = 'flex';
    updateUserDisplay(username);
  }

  // 更新用户显示
  function updateUserDisplay(username) {
    const profileSpan = document.querySelector('.header-profile span');
    if (profileSpan) {
      profileSpan.textContent = username;
    }
  }

  // 添加登出功能
  window.logoutUser = function() {
    localStorage.removeItem('mv_current_user');
    localStorage.removeItem('mv_user_token');
    location.reload();
  };
})();

// 设置处下拉菜单-登出
document.getElementById('settings-icon')?.addEventListener('click', () => {
  document.querySelector('.settings-dropdown')?.classList.toggle('hidden');
});

// =======================
// 侧栏按钮 & 页面切换
// =======================
const buttons  = document.querySelectorAll(".nav-btn");
const contents = document.querySelectorAll(".content");

// Home 设为激活
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
// 魔法棒：主题切换 
// =======================
const themes = ['theme-night', 'theme-fantasy', 'theme-dark'];
let currentThemeIndex = -1;
function toggleTheme() {
  themes.forEach(t => document.body.classList.remove(t));
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  document.body.classList.add(themes[currentThemeIndex]);
}
window.toggleTheme = toggleTheme;


// ===== Daily Practice - Map pins =====
(function bindPracticePins(){
  const container = document.querySelector('#Daily Practice.dp');
  if (!container) return;

  // 只给有 data-url 的钉子绑定跳转
  container.addEventListener('click', (e)=>{
    const pin = e.target.closest('.dp-pin');
    if (!pin) return;
    const url = pin.dataset.url;
    if (url) window.open(url, '_blank', 'noopener');
  });

  // 键盘可达性：Enter/Space 触发
  container.addEventListener('keydown', (e)=>{
    const pin = e.target.closest('.dp-pin');
    if (!pin) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pin.click();
    }
  });

  // 让所有钉子能被 Tab 聚焦
  container.querySelectorAll('.dp-pin').forEach(pin => pin.setAttribute('tabindex','0'));
})();

// —— Math Stories：星标切换（收藏/取消收藏） —— //
function syncStoryStars(){
  if (!window.mvCollection) return;
  const items = window.mvCollection.load().filter(i=>i.type==='story');
  const titles = new Set(items.map(i=>i.title));
  document.querySelectorAll('.book-item').forEach(card=>{
    const title = card.querySelector('.book-title')?.textContent?.trim();
    const btn = card.querySelector('.collect-btn');
    if (!btn) return;
    if (titles.has(title)) btn.classList.add('on'); else btn.classList.remove('on');
  });
}

// 全局暴露
window.syncStoryStars = syncStoryStars;

// 初始化收藏按钮
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
    if (!window.mvCollection) return;
    const card  = btn.closest('.book-item');
    const title = card.querySelector('.book-title')?.textContent?.trim() || 'Story';
    const items = window.mvCollection.load();
    const idx   = items.findIndex(i=>i.type==='story' && i.title===title);
    if (idx>=0){
      items.splice(idx,1);
    }else{
      items.push({ 
        id:'s_'+Date.now(), 
        type:'story', 
        title, 
        content:'Saved from Math Stories', 
        createdAt:Date.now() 
      });
    }
    window.mvCollection.save(items); 
    
    // 触发 My Collection 刷新（如果它是活动页面）
    if (document.getElementById('My Collection')?.classList.contains('active')){
      if (window.mvRender) window.mvRender();
    }
    syncStoryStars();
  });
});

// =======================
// Math Tutor UI 逻辑 
// =======================
(function initMathTutor() {
  const messages = document.getElementById('mv-messages');
  const form = document.getElementById('mv-form');
  const input = document.getElementById('mv-input');
  if (!messages || !form || !input) return;

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

  function formatContent(text) {
      // First, clean up any markdown artifacts from the AI
      let formatted = text
        .replace(/^\s*---+\s*$/gm, '') // Remove horizontal rules
        .replace(/^#{1,6}\s+/gm, '') // Remove markdown headers
        .replace(/\n{3,}/g, '\n\n'); // Reduce excessive line breaks to max 2
      
      // Handle LaTeX math - must be done before HTML conversion
      // Block math: $$ ... $$
      formatted = formatted.replace(/\$\$(.*?)\$\$/gs, (match, math) => {
        return `<div class="math-block">\\[${math}\\]</div>`;
      });
      
      // Inline math: $ ... $
      formatted = formatted.replace(/\$(.*?)\$/g, (match, math) => {
        return `<span class="math-inline">\\(${math}\\)</span>`;
      });
      
      // Bold text (including step headers)
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Convert newlines to <br> but not inside math blocks
      formatted = formatted.split('\n').map(line => {
        // Don't add <br> after block math or strong tags
        if (line.includes('math-block') || line.match(/^<strong>Step \d+:/)) {
          return line;
        }
        return line;
      }).join('<br>\n');
      
      // Clean up spacing around math blocks
      formatted = formatted.replace(/<br>\s*<div class="math-block">/g, '<div class="math-block">');
      formatted = formatted.replace(/<\/div>\s*<br>/g, '</div>');
      
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
      const token = localStorage.getItem('mv_user_token');
      const resp = await fetch(ENDPOINT, {
        method: 'POST',
        headers: token
          ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          : { 'Content-Type': 'application/json' },
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
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        processEscapes: false,  // Changed to false
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        processHtmlClass: 'math-inline|math-block'  // Only process our math classes
      },
      startup: {
        pageReady: () => {
          return MathJax.startup.defaultPageReady().then(() => {
            console.log('MathJax ready');
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

  window.mvCollection = { load, save }; // 全局暴露

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
  window.mvRender = render; // 暴露 render 函数到全局

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
    if (window.syncStoryStars) window.syncStoryStars();
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
  window.renderPlaza = render;

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

// ========== 用户行为追踪系统 ==========
// 将这段代码添加到你的 script.js 文件末尾

(function initTracking() {
  // 配置
  const API_BASE = 'http://localhost:3000';
  let currentPage = 'MainPage';
  let pageStartTime = Date.now();
  let lastActivityTime = Date.now();
  
  // 获取认证令牌
  function getAuthHeaders() {
    const token = localStorage.getItem('mv_user_token');
    if (!token) return null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  // 发送追踪数据
  async function trackEvent(endpoint, data) {
    const headers = getAuthHeaders();
    if (!headers) return; // 未登录不追踪
    
    try {
      await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }
  
  // 追踪页面浏览
  function trackPageView(pageName) {
    const duration = Date.now() - pageStartTime;
    
    // 发送前一个页面的浏览时长
    if (currentPage && duration > 1000) { // 只记录超过1秒的访问
      trackEvent('/track/page-view', {
        pageName: currentPage,
        duration: Math.floor(duration / 1000) // 转换为秒
      });
    }
    
    // 更新当前页面
    currentPage = pageName;
    pageStartTime = Date.now();
  }
  
  // 追踪点击事件
  function trackClick(elementId, elementType, pageName) {
    trackEvent('/track/click', {
      elementId: elementId,
      elementType: elementType,
      pageName: pageName || currentPage
    });
  }
  
  // 监听所有导航按钮点击
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pageName = btn.dataset.content;
      trackPageView(pageName);
      trackClick(btn.dataset.content, 'nav-button', 'Sidebar');
    });
  });
  
  // 监听所有按钮点击（全局代理）
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button && !button.classList.contains('nav-btn')) {
      const id = button.id || button.className || 'unknown-button';
      trackClick(id, 'button', currentPage);
    }
    
    // 追踪链接点击
    const link = e.target.closest('a');
    if (link) {
      const href = link.href || link.textContent;
      trackClick(href, 'link', currentPage);
    }
  });
  
  // 追踪 Daily Review 按钮
  const reviewBtn = document.getElementById('start-review');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      trackClick('start-review', 'review-button', 'Daily Review');
      trackEvent('/track/learning', {
        subject: 'Review',
        topic: 'Daily Review Started',
        attempted: 1,
        solved: 0
      });
    });
  }
  
  // 追踪 Math Stories 收藏
  document.addEventListener('click', (e) => {
    const collectBtn = e.target.closest('.collect-btn');
    if (collectBtn) {
      const bookItem = collectBtn.closest('.book-item');
      const title = bookItem?.querySelector('.book-title')?.textContent || 'Unknown';
      trackClick(`collect-${title}`, 'collect-button', 'Math Stories');
    }
  });
  
  // 追踪 Daily Practice 地图钉子点击
  document.addEventListener('click', (e) => {
    const pin = e.target.closest('.dp-pin');
    if (pin) {
      const url = pin.dataset.url || 'no-url';
      trackClick(`practice-pin-${url}`, 'practice-pin', 'Daily Practice');
      
      // 如果有URL，说明开始了练习
      if (pin.dataset.url) {
        trackEvent('/track/learning', {
          subject: 'Practice',
          topic: 'Daily Practice Started',
          attempted: 1,
          solved: 0
        });
      }
    }
  });
  
  // 追踪 AI Assistant 使用（修改原有的 ask 函数）
  const originalAsk = window.ask;
  if (typeof originalAsk === 'function') {
    window.ask = async function(question) {
      trackClick('ai-question-submit', 'ai-chat', 'AI Assistant');
      return originalAsk.call(this, question);
    };
  }
  
  // 追踪 My Collection 操作
  document.addEventListener('click', (e) => {
    if (e.target.closest('#col-new-note')) {
      trackClick('new-note', 'collection-action', 'My Collection');
    }
    if (e.target.closest('#col-save')) {
      trackClick('save-note', 'collection-action', 'My Collection');
      trackEvent('/track/learning', {
        subject: 'Notes',
        topic: 'Note Created',
        attempted: 1,
        solved: 1
      });
    }
    if (e.target.closest('.del')) {
      trackClick('delete-item', 'collection-action', 'My Collection');
    }
    if (e.target.closest('.share')) {
      trackClick('share-item', 'collection-action', 'My Collection');
    }
  });
  
  // 追踪 Community Plaza 互动
  document.addEventListener('click', (e) => {
    const star = e.target.closest('.post-star');
    if (star) {
      const card = star.closest('.post-card');
      const id = card?.dataset.id || 'unknown';
      trackClick(`star-post-${id}`, 'community-star', 'Community Plaza');
    }
  });
  
  // 定期发送心跳（记录在线时长）
  setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - lastActivityTime < 300000) { // 5分钟内有活动
      trackEvent('/track/page-view', {
        pageName: currentPage,
        duration: 30 // 30秒心跳
      });
    }
  }, 30000); // 每30秒
  
  // 监听用户活动（鼠标移动、键盘输入）
  let activityTimer;
  function updateActivity() {
    lastActivityTime = Date.now();
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      // 5分钟无活动，停止心跳
      lastActivityTime = 0;
    }, 300000);
  }
  
  document.addEventListener('mousemove', updateActivity);
  document.addEventListener('keypress', updateActivity);
  
  // 页面关闭时发送最后的数据
  window.addEventListener('beforeunload', () => {
    const duration = Date.now() - pageStartTime;
    if (duration > 1000) {
      // 使用 sendBeacon 确保数据发送
      const headers = getAuthHeaders();
      if (headers) {
        const data = JSON.stringify({
          pageName: currentPage,
          duration: Math.floor(duration / 1000)
        });
        navigator.sendBeacon(`${API_BASE}/track/page-view`, data);
      }
    }
  });
  
  // 初始化：记录首页访问
  if (localStorage.getItem('mv_current_user')) {
    trackPageView('MainPage');
  }
})();

// ========== 学习报告展示系统 ==========
(function initLearningReport() {
  const API_BASE = 'http://localhost:3000';
  
  // 获取认证令牌
  function getAuthHeaders() {
    const token = localStorage.getItem('mv_user_token');
    if (!token) return null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  // 加载并显示学习报告
  async function loadLearningReport() {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    try {
      // 获取统计数据
      const statsResponse = await fetch(`${API_BASE}/user/stats`, {
        headers: headers
      });
      
      if (!statsResponse.ok) return;
      const stats = await statsResponse.json();
      
      // 获取学习报告
      const reportResponse = await fetch(`${API_BASE}/user/learning-report`, {
        headers: headers
      });
      
      if (!reportResponse.ok) return;
      const report = await reportResponse.json();
      
      // 在主页显示报告
      displayReport(stats, report);
      
    } catch (error) {
      console.error('Failed to load report:', error);
    }
  }
  
  // 显示报告在主页
  function displayReport(stats, report) {
    const mainPage = document.getElementById('MainPage');
    if (!mainPage) return;
    
    // 创建报告卡片
    const reportCard = document.createElement('div');
    reportCard.className = 'learning-report-card';
    reportCard.innerHTML = `
      <h2>📊 Personal Learning Report</h2>
      
      <div class="report-section">
        <h3>👤 User Profile</h3>
        <p><strong>Username:</strong> ${stats.basicInfo?.username || 'Unknown'}</p>
        <p><strong>Total Logins:</strong> ${stats.basicInfo?.login_count || 0}</p>
        <p><strong>Total Time:</strong> ${formatTime(stats.basicInfo?.total_time_spent || 0)}</p>
        <p><strong>Member Since:</strong> ${formatDate(stats.basicInfo?.created_at)}</p>
      </div>
      
      <div class="report-section">
        <h3>📈 Learning Progress</h3>
        <p><strong>Problems Attempted:</strong> ${report.summary?.total_attempted || 0}</p>
        <p><strong>Problems Solved:</strong> ${report.summary?.total_solved || 0}</p>
        <p><strong>Average Accuracy:</strong> ${(report.summary?.average_accuracy || 0).toFixed(1)}%</p>
        <p><strong>Subjects Studied:</strong> ${report.summary?.subjects_studied || 0}</p>
        <p><strong>Topics Covered:</strong> ${report.summary?.topics_covered || 0}</p>
      </div>
      
      <div class="report-section">
        <h3>🎯 Recent Activity (Last 7 Days)</h3>
        <div class="activity-chart">
          ${generateActivityChart(stats.recentLogins || [])}
        </div>
      </div>
      
      <div class="report-section">
        <h3>🌟 Most Visited Pages</h3>
        <ul class="top-pages">
          ${(stats.topPages || []).map(page => 
            `<li>${page.page_name}: ${page.visit_count} visits</li>`
          ).join('')}
        </ul>
      </div>
      
      <div class="report-section">
        <h3>🤖 AI Assistant Usage</h3>
        <p><strong>Total Questions:</strong> ${stats.aiUsage?.total_questions || 0}</p>
        <p><strong>Topics Explored:</strong> ${stats.aiUsage?.topics_covered || 0}</p>
      </div>
      
      <div class="report-section">
        <h3>💡 Personalized Recommendations</h3>
        <ul class="recommendations">
          ${(report.recommendations || []).map(rec => 
            `<li>${rec}</li>`
          ).join('')}
        </ul>
      </div>
      
      <button class="refresh-report-btn" onclick="window.loadLearningReport()">
        🔄 Refresh Report
      </button>
    `;
    
    // 替换原有内容或添加到页面
    mainPage.innerHTML = '';
    mainPage.appendChild(reportCard);
  }
  
  // 格式化时间
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  }
  
  // 格式化日期
  function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  }
  
  // 生成活动图表
  function generateActivityChart(logins) {
    if (logins.length === 0) return '<p>No recent activity</p>';
    
    const maxTime = Math.max(...logins.map(l => l.time_spent || 0));
    
    return `
      <div class="chart-container">
        ${logins.map(login => `
          <div class="chart-bar">
            <div class="bar" style="height: ${(login.time_spent / maxTime) * 100}%"></div>
            <div class="label">${login.login_date.split('-')[2]}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // 导出函数到全局
  window.loadLearningReport = loadLearningReport;
  
  // 监听主页按钮点击
  const homeBtn = document.querySelector('.nav-btn[data-content="MainPage"]');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      setTimeout(loadLearningReport, 100); // 延迟加载确保页面切换完成
    });
  }
  
  // 如果已登录且在主页，自动加载报告
  if (localStorage.getItem('mv_current_user') && document.getElementById('MainPage')?.classList.contains('active')) {
    loadLearningReport();
  }
})();

// 页面切换时的初始化
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.content;

    // 切换按钮高亮
    buttons.forEach(b => b.classList.toggle("active", b === btn));

    // 切换页面显示 - 修复逻辑
    contents.forEach(page => {
      page.classList.remove("active");
      page.classList.add("hidden");
    });
    
    const targetPage = document.getElementById(id);
    if (targetPage) {
      targetPage.classList.remove("hidden");
      targetPage.classList.add("active");
    }
    
    // 页面切换后的初始化
    if (id === 'My Collection' && window.mvRender) {
      window.mvRender();
      if (window.syncStoryStars) window.syncStoryStars();
    } else if (id === 'Math Stories' && window.syncStoryStars) {
      window.syncStoryStars();
    } else if (id === 'Community Plaza' && window.renderPlaza) {
      window.renderPlaza();
    }
  });
});
