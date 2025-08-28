
let weights=JSON.parse(localStorage.getItem('weights')||'[]'); let chart;
function addWeight(){
  const inp=document.getElementById('weightInput'); const v=parseFloat(inp.value);
  if(!v){alert('أدخل وزن صحيح'); return;}
  const e={date:new Date().toLocaleDateString('ar-SA'), weight:v};
  weights.push(e); localStorage.setItem('weights',JSON.stringify(weights));
  inp.value=''; renderWeights(); renderChart();
}
function renderWeights(){
  const ul=document.getElementById('weightList'); if(!ul) return;
  if(weights.length===0){ul.innerHTML='<li class="text-gray-400">لا قياسات بعد</li>'; return;}
  ul.innerHTML=weights.map(w=>`<li>${w.date}: <b>${w.weight} كغ</b></li>`).join('');
}
function renderChart(){
  const ctx=document.getElementById('weightChart'); if(!ctx||!window.Chart) return;
  const labels=weights.map(w=>w.date); const data=weights.map(w=>w.weight);
  if(chart){chart.destroy();}
  chart=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'الوزن',data,tension:.25}]} ,options:{responsive:true,plugins:{legend:{display:false}}}});
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('addWeight')?.addEventListener('click', addWeight);
  renderWeights(); renderChart();
});
// Calculator
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('calcBtn')?.addEventListener('click', ()=>{
    const gender=document.querySelector('input[name="gender"]:checked').value;
    const age=parseInt(document.getElementById('age').value);
    const weight=parseFloat(document.getElementById('weight').value);
    const height=parseFloat(document.getElementById('height').value);
    const activity=parseFloat(document.getElementById('activity').value);
    const goal=parseInt(document.getElementById('goal').value);
    if(!age||!weight||!height){alert('يرجى ملء جميع الحقول');return;}
    let bmr=gender==='male'?(10*weight)+(6.25*height)-(5*age)+5:(10*weight)+(6.25*height)-(5*age)-161;
    const maintenance=bmr*activity; const target=maintenance+goal;
    const bmi=weight/((height/100)**2); let status=bmi<18.5?'نحيف':bmi<25?'طبيعي':bmi<30?'زيادة وزن':'سمنة';
    const protein=Math.round((target*0.275)/4), carbs=Math.round((target*0.425)/4), fats=Math.round((target*0.3)/9);
    document.getElementById('bmr').textContent=Math.round(bmr);
    document.getElementById('maintenance').textContent=Math.round(maintenance);
    document.getElementById('target').textContent=Math.round(target);
    document.getElementById('bmi').textContent=bmi.toFixed(1);
    document.getElementById('bmi-status').textContent=status;
    document.getElementById('protein').textContent=protein+'g';
    document.getElementById('carbs').textContent=carbs+'g';
    document.getElementById('fats').textContent=fats+'g';
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('no-results').classList.add('hidden');
  });
});
