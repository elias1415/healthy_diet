
const POOLS={
  breakfast:["فول + خبز بر + خيار","بيض مسلوق + خبز بر + طماطم","شوفان بالحليب + تمر","زبادي بلدي + عسل + مكسرات قليلة","جبن قريش + خبز بر + زيتون"],
  snack1:["تمرتان + قهوة عربية","تفاحة + 10 لوز","زبادي يوناني صغير","موزة صغيرة","خيار وجزر"],
  lunch:["كبسة دايت بالدجاج + سلطة","دجاج مشوي + أرز بني + خضار","سمك هامور مشوي + تبولة","لحم قليل الدهن + قرصان صحي + سلطة","سليق دجاج لايت + سلطة"],
  snack2:["حفنة مكسرات","تونة بالماء + خيار","ذرة مسلوقة صغيرة","بسكويت شوفان صحي","فاكهة موسمية"],
  dinner:["شوربة عدس + سلطة","سلطة تونة + خبز بر","بيضتان + سلطة","لبنة قليلة الدسم + ورقيات","سمك مشوي + خضار سوتيه"]
};
const DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function newDay(){return{breakfast:pick(POOLS.breakfast),snack1:pick(POOLS.snack1),lunch:pick(POOLS.lunch),snack2:pick(POOLS.snack2),dinner:pick(POOLS.dinner),pinned:false};}
function genPlan(){const p={}; for(const d of DAYS)p[d]=newDay(); return p;}
function renderMeals(){
  const c=document.getElementById('weekly-plan');
  const p=JSON.parse(localStorage.getItem('weeklyPlan')||'null')||genPlan();
  localStorage.setItem('weeklyPlan',JSON.stringify(p));
  c.innerHTML=DAYS.map(d=>{
    const x=p[d];
    return `<div class="card">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-extrabold text-blue-700">${d}</h4>
        <button data-day="${d}" class="pin-btn ${x.pinned?'text-yellow-600':'text-gray-400'}" title="تثبيت/إلغاء">📌</button>
      </div>
      <ul class="text-sm text-gray-700 space-y-1">
        <li><b>فطور:</b> ${x.breakfast}</li>
        <li><b>سناك 1:</b> ${x.snack1}</li>
        <li><b>غداء:</b> ${x.lunch}</li>
        <li><b>سناك 2:</b> ${x.snack2}</li>
        <li><b>عشاء:</b> ${x.dinner}</li>
      </ul>
    </div>`;
  }).join('');
}
function shuffleAll(){
  const p=JSON.parse(localStorage.getItem('weeklyPlan'));
  for(const d of DAYS){ if(!p[d].pinned) p[d]=newDay(); }
  localStorage.setItem('weeklyPlan',JSON.stringify(p)); renderMeals();
}
function pinAll(v=true){const p=JSON.parse(localStorage.getItem('weeklyPlan')); for(const d of DAYS) p[d].pinned=v; localStorage.setItem('weeklyPlan',JSON.stringify(p)); renderMeals();}
function savePlan(){alert('تم حفظ الخطة على هذا المتصفح.');}
function clearPlan(){localStorage.removeItem('weeklyPlan'); renderMeals();}
document.addEventListener('click', e=>{
  const pin=e.target.closest('.pin-btn'); if(pin){const d=pin.dataset.day; const p=JSON.parse(localStorage.getItem('weeklyPlan')); p[d].pinned=!p[d].pinned; localStorage.setItem('weeklyPlan',JSON.stringify(p)); renderMeals();}
  if(e.target.id==='shuffleAll') shuffleAll();
  if(e.target.id==='pinAll') pinAll(true);
  if(e.target.id==='unpinAll') pinAll(false);
  if(e.target.id==='savePlan') savePlan();
  if(e.target.id==='clearPlan') clearPlan();
});
document.addEventListener('DOMContentLoaded', renderMeals);
