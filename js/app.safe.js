// app.safe.js - init wrapper and tab handling + weight storage + weekly plan render
(function(){
  function waitFor(conditionFn, interval=100, timeout=5000){
    return new Promise((resolve, reject)=>{
      const start = Date.now();
      (function check(){
        try{
          if(conditionFn()) return resolve();
          if(Date.now() - start > timeout) return reject(new Error('timeout'));
        }catch(e){ return reject(e); }
        setTimeout(check, interval);
      })();
    });
  }

  function showSection(id){
    document.querySelectorAll('section.section').forEach(s=>{
      if(s.id === id){ s.classList.remove('hidden'); s.style.display='block'; } else { s.classList.add('hidden'); s.style.display='none'; }
    });
    document.querySelectorAll('.nav-btn').forEach(b=> b.classList.toggle('tab-active', b.dataset.target===id));
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function bindTabs(){
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> showSection(btn.dataset.target || 'foods'));
    });
  }

  function renderWeeklyPlan(){
    const weekPlan = {
      'الأحد':'صدر، تراي، بطن',
      'الاثنين':'ظهر، باي',
      'الثلاثاء':'اكتاف، ترابيس، بطن',
      'الأربعاء':'افخاذ، بطات',
      'الخميس':'باي، تراي، سواعد، بطن',
      'الجمعة':'راحة',
      'السبت':'راحة'
    };
    const weeklyPlanEl = document.getElementById('weekly-plan');
    weeklyPlanEl.innerHTML = '';
    Object.keys(weekPlan).forEach(day=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<strong>${day}</strong><div>${weekPlan[day]}</div>`;
      weeklyPlanEl.appendChild(div);
    });
  }

  function initExercises(){
    const EXERCISES = [
      {group:'باي', youtube:'bA3J2H8m1t8', list:['EZ-Bar Curl','Hammer Curl','Concentration Curl']},
      {group:'تراي', youtube:'6SSQzW4Zp6k', list:['Close-Grip Bench','Overhead Extension','Tricep Dips']},
      {group:'سواعد', youtube:'someId1', list:['Wrist Curl','Reverse Curl']},
      {group:'صدر', youtube:'dQw4w9WgXcQ', list:['Bench Press','Incline Press','Cable Fly']},
      {group:'افخاذ', youtube:'aclHkVaku9U', list:['Squat','Lunge','Leg Press']},
      {group:'بطات', youtube:'SeatedCalf', list:['Seated Calf Raise','Standing Calf Raise']},
      {group:'ظهر', youtube:'X2m-5m9v1Z0', list:['Pull-ups','Bent-over Row','Deadlift']},
      {group:'اكتاف', youtube:'IODxDxX7oi4', list:['Shoulder Press','Lateral Raise','Front Raise']},
      {group:'ترابيس', youtube:'DumbbellShrugId', list:['Dumbbell Shrug','Barbell Shrug']},
      {group:'بطن', youtube:'pSHjTRCQxIw', list:['Crunches','Plank','Cable Crunch']}
    ];
    const exGrid = document.getElementById('exGrid');
    if(!exGrid) return;
    exGrid.innerHTML = '';
    EXERCISES.forEach(e=>{
      const card = document.createElement('div'); card.className='card';
      let items = '<ul>';
      e.list.forEach(i=> items += `<li>${i}</li>`);
      items += '</ul>';
      card.innerHTML = `<h3>${e.group}</h3>${items}
        <div class="yt-thumb" data-yt="${e.youtube}"><button class="btn-secondary">شغّل الفيديو</button></div>
        <div class="text-xs">٤ جولات (١٥–١٢–١٢–١٠) | راحة ٤٠ث | راحة ٢ دقيقة بين التمارين<br>
        <a target="_blank" rel="noopener" href="https://www.youtube-nocookie.com/watch?v=${e.youtube}">فتح في اليوتيوب</a></div>`;
      exGrid.appendChild(card);
    });
    document.addEventListener('click', function(e){
      const t = e.target.closest('.yt-thumb');
      if(t){
        const id = t.getAttribute('data-yt');
        if(!id) return;
        const iframe = document.createElement('iframe');
        iframe.width = '560'; iframe.height = '315';
        iframe.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen','');
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
        t.innerHTML = '';
        t.appendChild(iframe);
      }
    });
  }

  function initWeights(){
    const list = document.getElementById('weightList');
    const input = document.getElementById('weightInput');
    const addBtn = document.getElementById('addWeight');
    const weightsKey = 'weights_onefile_v1';
    function load(){
      const raw = localStorage.getItem(weightsKey);
      const arr = raw ? JSON.parse(raw) : [];
      list.innerHTML = '';
      arr.forEach(w=> {
        const li = document.createElement('li');
        li.textContent = w.date + ' — ' + w.weight + ' كغ';
        list.appendChild(li);
      });
    }
    function add(){
      const v = parseFloat(input.value);
      if(isNaN(v) || v<=0) return alert('أدخل وزن صحيح');
      const raw = localStorage.getItem(weightsKey);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({date:new Date().toLocaleDateString(), weight:v});
      localStorage.setItem(weightsKey, JSON.stringify(arr));
      input.value = '';
      load();
    }
    if(addBtn) addBtn.addEventListener('click', add);
    load();
  }

  async function init(){
    // ensure DOM ready
    await waitFor(()=> document.body, 50, 2000).catch(()=>{});
    bindTabs();
    renderWeeklyPlan();
    initExercises();
    initWeights();
    // show default
    const defaultId = document.querySelector('.nav-btn.tab-active')?.dataset.target || 'foods';
    showSection(defaultId);
  }

  // start
  document.addEventListener('DOMContentLoaded', init);
})();
