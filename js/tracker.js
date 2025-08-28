(function(){
const TAB_KEY = 'diet_tab_';
const TAB_TTL = 60*1000;
const id = TAB_KEY + Math.random().toString(36).slice(2,9);
try{ localStorage.setItem(id, Date.now()); }catch(e){}
function heartbeat(){ try{ localStorage.setItem(id, Date.now()); }catch(e){} }
const iv = setInterval(heartbeat, 25000);
window.addEventListener('beforeunload', ()=>{ try{ localStorage.removeItem(id);}catch(e){} });
function computeActive(){
  const now = Date.now(); let active=0;
  Object.keys(localStorage).forEach(k=>{ if(k.startsWith(TAB_KEY)){ try{ const t = parseInt(localStorage.getItem(k)); if(now - t < TAB_TTL) active++; }catch(e){} } });
  const el = document.getElementById('activeNow'); if(el) el.textContent = active || 1;
}
if(!localStorage.getItem('totalVisits')) localStorage.setItem('totalVisits','0');
let tv = parseInt(localStorage.getItem('totalVisits')||'0')+1; localStorage.setItem('totalVisits', String(tv));
const tvEl = document.getElementById('totalVisits'); if(tvEl) tvEl.textContent = tv;
computeActive(); setInterval(computeActive,15000);
})();