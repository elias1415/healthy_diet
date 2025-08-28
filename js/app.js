
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.add('hidden'));
  const t=document.getElementById(id); if(t){t.classList.remove('hidden');}
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('tab-active'));
  document.querySelector(`.nav-btn[data-target="${id}"]`)?.classList.add('tab-active');
  document.querySelectorAll('[role="tab"]').forEach(el=>el.setAttribute('aria-selected','false'));
  document.querySelector(`[role="tab"][data-target="${id}"]`)?.setAttribute('aria-selected','true');
  localStorage.setItem('currentSection', id);
}
document.addEventListener('click', e=>{
  const btn=e.target.closest('.nav-btn'); if(!btn) return;
  e.preventDefault(); showSection(btn.dataset.target);
});
// Theme
const root=document.body;
const themeBtn=document.getElementById('toggleTheme');
function applyTheme(t){ root.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
themeBtn?.addEventListener('click', ()=>{
  const cur=root.getAttribute('data-theme')||'light';
  applyTheme(cur==='light'?'dark':'light');
  themeBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme')==='dark'));
});
// Counters (local only)
const VISIT_KEY='totalVisits';
if(!sessionStorage.getItem('counted')){
  const t=parseInt(localStorage.getItem(VISIT_KEY)||'0')+1;
  localStorage.setItem(VISIT_KEY, String(t));
  sessionStorage.setItem('counted','1');
}
function incTabs(){ const n=parseInt(localStorage.getItem('openTabs')||'0')+1; localStorage.setItem('openTabs', String(n)); }
function decTabs(){ const n=Math.max(parseInt(localStorage.getItem('openTabs')||'1')-1,0); localStorage.setItem('openTabs', String(n)); }
window.addEventListener('beforeunload', decTabs);
function updateCounters(){
  const tv = localStorage.getItem(VISIT_KEY)||'0';
  const an = localStorage.getItem('openTabs')||'1';
  const tvEl=document.getElementById('totalVisits'); const anEl=document.getElementById('activeNow');
  if(tvEl) tvEl.textContent = tv; if(anEl) anEl.textContent = an;
}
window.addEventListener('storage', updateCounters);
// YT lazy-load
function initYT(){
  document.querySelectorAll('.yt.thumb').forEach(div=>{
    const id=div.dataset.yt;
    const img=new Image();
    img.src=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    img.alt='معاينة الفيديو'; img.loading='lazy'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover';
    div.appendChild(img);
    div.addEventListener('click', ()=>{
      const iframe=document.createElement('iframe');
      iframe.width='100%'; iframe.height='100%';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen=true; iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1`;
      div.replaceWith(iframe);
    }, {once:true});
  });
}
document.addEventListener('DOMContentLoaded', ()=>{
  applyTheme(localStorage.getItem('theme')||'light');
  const last=localStorage.getItem('currentSection')||'foods';
  showSection(last); incTabs(); updateCounters(); initYT();
});
