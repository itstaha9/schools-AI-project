const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const faDigits = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const toast = message => { const t=$('#toast'); $('p',t).textContent=message; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'),2800); };
const people = [
 {name:'مریم احمدی',role:'معاون',dept:'معاونت آموزشی',status:'فعال',initial:'م'},
 {name:'علی رضایی',role:'معلم',dept:'پایه هشتم',status:'فعال',initial:'ع'},
 {name:'زهرا محمدی',role:'معلم',dept:'پایه هفتم',status:'فعال',initial:'ز'},
 {name:'آرین کریمی',role:'دانش‌آموز',dept:'پایه هشتم · کلاس ۲',status:'فعال',initial:'آ'}
];
const evaluations = [
 {name:'مریم احمدی',role:'معاون',period:'مهر ۱۴۰۵',score:'۹۲ از ۱۰۰',status:'ثبت‌شده'},
 {name:'علی رضایی',role:'معلم',period:'مهر ۱۴۰۵',score:'۸۸ از ۱۰۰',status:'ثبت‌شده'},
 {name:'زهرا محمدی',role:'معلم',period:'مهر ۱۴۰۵',score:'—',status:'در انتظار'},
 {name:'آرین کریمی',role:'دانش‌آموز',period:'مهر ۱۴۰۵',score:'—',status:'در انتظار'}
];
let tasks=[
 {title:'بررسی گزارش ماهانه پایه هشتم',desc:'بررسی و تأیید گزارش‌های ثبت‌شده',owner:'مدیریت آموزشی',status:'در انتظار',date:'۵ آبان'},
 {title:'تکمیل برنامه فعالیت‌های پرورشی',desc:'هماهنگی برنامه‌های ماه جاری',owner:'معاونت پرورشی',status:'در حال انجام',date:'۷ آبان'},
 {title:'ثبت جمع‌بندی ماهانه کلاس',desc:'تهیه خلاصه عملکرد کلاس',owner:'کادر آموزشی',status:'تکمیل‌شده',date:'۲ آبان'}
];
const statusClass = s => s==='ثبت‌شده'||s==='فعال'||s==='تکمیل‌شده'?'status-done':s==='در انتظار'?'status-review':'status-new';
function renderPeople(){
 const q=($('#peopleSearch')?.value||'').trim().toLowerCase(), role=$('#roleFilter')?.value||'all';
 const list=people.filter(p=>(role==='all'||p.role===role)&&(p.name+' '+p.role+' '+p.dept).toLowerCase().includes(q));
 $('#peopleTable').innerHTML=list.map(p=>`<tr><td><div class="person-cell"><div class="person-avatar">${p.initial}</div><div><strong>${p.name}</strong><small>عضو مدرسه</small></div></div></td><td>${p.role}</td><td>${p.dept}</td><td><span class="status-pill ${statusClass(p.status)}">${p.status}</span></td><td><button class="row-action" data-person="${p.name}">مشاهده / ویرایش</button></td></tr>`).join('')||'<tr><td colspan="5">موردی پیدا نشد.</td></tr>';
 $('#peopleCount').textContent=faDigits(list.length)+' عضو در فهرست';
 $$('[data-person]').forEach(b=>b.addEventListener('click',()=>openPersonEdit(b.dataset.person)));
}
function renderEvaluations(){
 const f=$('#evalFilter')?.value||'all';
 const list=evaluations.filter(e=>f==='all'||e.status===f);
 $('#evalTable').innerHTML=list.map(e=>`<tr><td><div class="person-cell"><div class="person-avatar">${e.name[0]}</div><strong>${e.name}</strong></div></td><td>${e.role}</td><td>${e.period}</td><td>${e.score}</td><td><span class="status-pill ${statusClass(e.status)}">${e.status}</span></td></tr>`).join('')||'<tr><td colspan="5">موردی برای نمایش نیست.</td></tr>';
}
function renderTasks(){
 const groups=[['در انتظار','در انتظار بررسی'],['در حال انجام','در حال انجام'],['تکمیل‌شده','تکمیل‌شده']];
 $('#taskBoard').innerHTML=groups.map(([status,label])=>`<section class="task-column"><div class="task-col-head"><strong>${label}</strong><span>${faDigits(tasks.filter(t=>t.status===status).length)}</span></div>${tasks.filter(t=>t.status===status).map(t=>`<article class="task-card"><h4>${t.title}</h4><p>${t.desc}</p><div class="task-meta"><span>♙ ${t.owner}</span><span>◷ ${t.date}</span></div><select aria-label="وضعیت ${t.title}" data-task="${t.title}"><option ${status==='در انتظار'?'selected':''}>در انتظار</option><option ${status==='در حال انجام'?'selected':''}>در حال انجام</option><option ${status==='تکمیل‌شده'?'selected':''}>تکمیل‌شده</option></select></article>`).join('')||'<p style="color:#758198;font-size:10px">فعلاً موردی وجود ندارد.</p>'}</section>`).join('');
 $$('[data-task]').forEach(sel=>sel.addEventListener('change',()=>{const t=tasks.find(x=>x.title===sel.dataset.task);if(t){t.status=sel.value;renderTasks();toast('وضعیت فعالیت به‌روزرسانی شد.');}}));
}
function navigate(id){
 const page=$('#'+id);if(!page)return;
 $$('.page').forEach(p=>p.classList.remove('active-page'));page.classList.add('active-page');
 $$('.nav-item').forEach(a=>a.classList.toggle('active',a.dataset.page===id));
 const active=$(`[data-page="${id}"]`);$('#crumbTitle').textContent=active?active.textContent.replace(/[◫♙◎▤▥▦⚙]/g,'').trim():page.querySelector('h1')?.textContent||'پنل مدیریت';
 history.replaceState(null,'','#'+id);$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
 if(id==='people')renderPeople();if(id==='evaluations')renderEvaluations();if(id==='tasks')renderTasks();
}
$$('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.dataset.page)}));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.goto)));
$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#peopleSearch').addEventListener('input',renderPeople);$('#roleFilter').addEventListener('change',renderPeople);$('#evalFilter').addEventListener('change',renderEvaluations);
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim();if(!q)return;const found=people.find(p=>(p.name+' '+p.role+' '+p.dept).includes(q));if(found){navigate('people');$('#peopleSearch').value=q;renderPeople()}else{navigate('people');$('#peopleSearch').value=q;renderPeople();toast('نتیجه جست‌وجو در اعضای مدرسه بررسی شد.')}}});
function openModal(title,desc,fields,onSubmit){
 $('#modalTitle').textContent=title;$('#modalDesc').textContent=desc;
 $('#modalForm').innerHTML=fields.map(f=>`<div class="form-field ${f.wide?'wide':''}"><label for="${f.id}">${f.label}</label>${f.type==='select'?`<select id="${f.id}" ${f.required?'required':''}>${f.options.map(o=>`<option>${o}</option>`).join('')}</select>`:f.type==='textarea'?`<textarea id="${f.id}" rows="3" placeholder="${f.placeholder||''}" ${f.required?'required':''}></textarea>`:`<input id="${f.id}" type="${f.type||'text'}" placeholder="${f.placeholder||''}" ${f.required?'required':''}>`}</div>`).join('')+`<button class="primary-btn form-submit" type="submit">ثبت اطلاعات <span>←</span></button>`;
 $('#modalForm').onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(fields.map(f=>[f.id,$('#'+f.id).value.trim()]));onSubmit(values);closeModal();};
 $('#modalBackdrop').classList.add('open');setTimeout(()=>$('#modalForm input, #modalForm select')?.focus(),100);
}
function closeModal(){$('#modalBackdrop').classList.remove('open')}
$('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function openPersonEdit(name){
 const p=people.find(x=>x.name===name);if(!p)return;
 openModal('ویرایش عضو','این تغییر فقط در همین پیش‌نمایش ذخیره می‌شود.',[{id:'personName',label:'نام و نام خانوادگی',placeholder:p.name,required:true},{id:'personRole',label:'نقش',type:'select',options:['مدیر','معاون','معلم','دانش‌آموز']},{id:'personDept',label:'بخش / پایه',placeholder:p.dept,required:true}],v=>{p.name=v.personName;p.role=v.personRole;p.dept=v.personDept;p.initial=p.name[0];renderPeople();toast('اطلاعات عضو در پیش‌نمایش به‌روز شد.');});
}
function addPerson(){openModal('افزودن عضو جدید','اطلاعات اولیه عضو را وارد کنید.',[{id:'personName',label:'نام و نام خانوادگی',placeholder:'مثلاً سارا احمدی',required:true},{id:'personRole',label:'نقش',type:'select',options:['معاون','معلم','دانش‌آموز','مدیر']},{id:'personDept',label:'بخش / پایه',placeholder:'مثلاً پایه هفتم',required:true}],v=>{people.unshift({name:v.personName,role:v.personRole,dept:v.personDept,status:'فعال',initial:v.personName[0]});renderPeople();toast('عضو جدید به فهرست نمایشی اضافه شد.');});}
$('#addPerson').addEventListener('click',addPerson);
function addEvaluation(){openModal('ثبت ارزیابی ماهانه','یک ارزیابی نمونه در فهرست ثبت کنید.',[{id:'evalName',label:'نام عضو',placeholder:'نام و نام خانوادگی',required:true},{id:'evalRole',label:'نقش عضو',type:'select',options:['معاون','معلم','دانش‌آموز','مدیر']},{id:'evalPeriod',label:'دوره ارزیابی',type:'select',options:['مهر ۱۴۰۵','آبان ۱۴۰۵','آذر ۱۴۰۵']},{id:'evalScore',label:'امتیاز از ۱۰۰',type:'number',placeholder:'مثلاً ۸۵'},{id:'evalNote',label:'توضیحات مدیر',type:'textarea',placeholder:'نکات قوت و موارد قابل بهبود...'}],v=>{evaluations.unshift({name:v.evalName,role:v.evalRole,period:v.evalPeriod,score:v.evalScore?`${faDigits(v.evalScore)} از ۱۰۰`:'در حال بررسی',status:'ثبت‌شده'});renderEvaluations();addActivity('ارزیابی جدید ثبت شد',`${v.evalName} · ${v.evalRole}`,'purple-bg','◎','ثبت‌شده');toast('ارزیابی به فهرست نمایشی اضافه شد.');});}
$('#newEvaluation').addEventListener('click',addEvaluation);$('#newEvaluation2').addEventListener('click',addEvaluation);
function addActivity(title,desc,cls,icon,status){const row=document.createElement('div');row.className='activity-row';row.innerHTML=`<div class="activity-icon ${cls}">${icon}</div><div class="activity-text"><strong></strong><p></p></div><span class="activity-time">همین حالا</span><span class="status-pill ${statusClass(status)}">${status}</span>`;$('.activity-text strong',row).textContent=title;$('.activity-text p',row).textContent=desc;$('#activityList').prepend(row);}
$('#addTask').addEventListener('click',()=>openModal('افزودن فعالیت','یک فعالیت برای پیگیری اضافه کنید.',[{id:'taskTitle',label:'عنوان فعالیت',placeholder:'عنوان کوتاه و مشخص',required:true},{id:'taskOwner',label:'مسئول پیگیری',placeholder:'مثلاً معاون آموزشی',required:true},{id:'taskDate',label:'موعد انجام',placeholder:'مثلاً ۱۰ آبان',required:true},{id:'taskDesc',label:'توضیحات',type:'textarea',placeholder:'جزئیات فعالیت...'}],v=>{tasks.unshift({title:v.taskTitle,desc:v.taskDesc||'بدون توضیحات تکمیلی',owner:v.taskOwner,status:'در انتظار',date:v.taskDate});renderTasks();toast('فعالیت جدید اضافه شد.');}));
$('#exportReport').addEventListener('click',()=>{const rows=[['نام','نقش','دوره','امتیاز','وضعیت'],...evaluations.map(e=>[e.name,e.role,e.period,e.score,e.status])];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gozaresh-arzyabi.csv';a.click();URL.revokeObjectURL(url);toast('فایل گزارش CSV آماده شد.');});
$('#saveSettings').addEventListener('click',()=>{const n=$('#schoolNameInput').value.trim();if(n){$$('.brand strong').forEach(x=>x.textContent=n.replace('مدرسه ','').trim());document.title=n+' | پنل مدیریت';toast('عنوان مدرسه در پیش‌نمایش به‌روز شد.')}});
$('#notificationBtn').addEventListener('click',()=>toast('در حال حاضر اعلان جدیدی وجود ندارد.'));
$('#helpBtn').addEventListener('click',()=>openModal('راهنمای نسخه اولیه','این نسخه، پیش‌نمایش رابط کاربری سامانه است.',[{id:'helpText',label:'چه چیزهایی آماده است؟',type:'textarea',placeholder:'نمای کلی، فهرست اعضا، ارزیابی‌ها، پیگیری فعالیت‌ها و گزارش CSV',wide:true}],()=>{}));
const initialHash=location.hash.replace('#','');if(initialHash&&$('#'+initialHash))navigate(initialHash);else{renderPeople();renderEvaluations();renderTasks();}


// Enhanced motion system for the overview dashboard.
(() => {
  const overview = document.querySelector('#overview');
  if (!overview) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateOverview = () => {
    overview.classList.remove('overview-in');
    void overview.offsetWidth;
    overview.classList.add('overview-in');
  };
  animateOverview();
  document.querySelectorAll('[data-page="overview"]').forEach(link => link.addEventListener('click', () => setTimeout(animateOverview, 40)));
  document.querySelectorAll('[data-goto="overview"]').forEach(link => link.addEventListener('click', () => setTimeout(animateOverview, 40)));
  if (reduceMotion) return;
  const hero = overview.querySelector('.hero-card');
  const visual = overview.querySelector('.hero-visual');
  if (hero && visual && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      visual.style.marginTop = `${y * 9}px`;
      visual.style.marginLeft = `${x * -10}px`;
    });
    hero.addEventListener('pointerleave', () => { visual.style.marginTop = ''; visual.style.marginLeft = ''; });
  }
  const revealItems = overview.querySelectorAll('.activity-row, .evaluation-note, .panel-heading');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); io.unobserve(entry.target); }
    }), {threshold: .12});
    revealItems.forEach((item, i) => { item.style.setProperty('--motion-index', i); io.observe(item); });
  }
})();
