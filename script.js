const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function showModal(id){ const el=document.getElementById(id); if(el) el.classList.remove('hidden'); }
function closeModals(){ $$('.modal').forEach(m=>m.classList.add('hidden')); }
function toast(message){
  const t=$('#toast'); t.textContent=message; t.classList.remove('hidden');
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.add('hidden'),2600);
}

$$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$$('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>showModal(btn.dataset.modal)));
$$('[data-close]').forEach(btn=>btn.addEventListener('click',closeModals));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m) closeModals()}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});

$$('.feature-card').forEach(card=>card.addEventListener('click',()=>{
  const data={
    sources:['Multi-Source Intelligence','Knowly connects your documents, slides, audio and notes so they can be understood as one topic.'],
    actions:['Action Extraction','Knowly identifies decisions, action items, deadlines and important takeaways so you know what to do next.'],
    ask:['Ask Your Materials','Ask questions about your own materials and receive answers with the relevant source context.'],
    timeline:['Smart Timeline','For meetings and lectures, Knowly creates a searchable timeline of important moments.']
  }[card.dataset.feature];
  showModal('aboutModal');
  const modal=$('#aboutModal');
  $('h2',modal).textContent=data[0];
  $('p:not(.eyebrow)',modal).textContent=data[1];
}));

$$('.mode-tab').forEach(tab=>tab.addEventListener('click',()=>{
  $$('.mode-tab').forEach(x=>x.classList.remove('active'));
  tab.classList.add('active');
  $('#studyPanel').classList.toggle('hidden',tab.dataset.mode!=='study');
  $('#workPanel').classList.toggle('hidden',tab.dataset.mode!=='work');
}));

const fileInput=$('#fileInput');
fileInput.addEventListener('change',()=>{
  const files=[...fileInput.files];
  if(!files.length) return;
  $('#fileStatus').textContent=`${files.length} file${files.length>1?'s':''} selected: ${files.map(f=>f.name).join(', ')}`;
  buildWorkspace(files.map(f=>f.name));
  toast('Files added to your demo workspace.');
});
function buildWorkspace(names){
  const list=$('#workspaceList');
  list.innerHTML=names.map((name,i)=>`<div class="workspace-item"><span>📄 ${escapeHtml(name)}</span><span>${i%2?'Audio':'File'}</span></div>`).join('');
  $('#demoResult').classList.remove('hidden');
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

$('#loadDemo').addEventListener('click',()=>{
  buildWorkspace(['Lecture_03.pdf','Slides_Lecture03.pptx','Lecture_Recording.mp3','My_Notes.txt']);
  $('#fileStatus').textContent='Demo workspace loaded — ready to explore.';
  toast('Demo workspace loaded.');
});
$('#resetDemo').addEventListener('click',()=>{
  $('#workspaceList').innerHTML='<div class="empty-state">Your workspace is ready.<br>Upload files or load the demo.</div>';
  $('#demoResult').classList.add('hidden');
  $('#fileStatus').textContent='No files selected yet.';
  fileInput.value='';
  toast('Demo reset.');
});
$('#newWorkspace').addEventListener('click',()=>{
  $('#workspaceList').innerHTML='<div class="empty-state">New workspace created.<br>Add your materials to begin.</div>';
  $('#demoResult').classList.add('hidden');
  $('#fileStatus').textContent='New workspace ready.';
  toast('New workspace created.');
});
$('#viewInsights').addEventListener('click',()=>{
  showModal('howModal');
  $('h2', $('#howModal')).textContent='Your Knowly insights';
  const steps=$$('.modal-steps div',$('#howModal'));
  [['12','Key topics','Important concepts found across your sources.'],['5','Action items','Tasks and decisions you may need to follow up.'],['3','Important moments','Key points from your recordings and materials.']].forEach((x,i)=>{
    $('b',steps[i]).textContent=x[0]; $('strong',steps[i]).textContent=x[1]; $('p',steps[i]).textContent=x[2];
  });
});

$('#loginButton').addEventListener('click',()=>{
  const email=$('#loginEmail').value.trim();
  $('#loginNote').textContent=email ? `Demo sign-in accepted for ${email}. No real account was created.` : 'Please enter an email address for the demo.';
  if(email) toast('Demo sign-in successful.');
});
$('#subscribeButton').addEventListener('click',()=>{
  $('#subscribeNote').textContent='Premium demo activated — no payment was processed.';
  toast('Knowly Premium demo activated.');
});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=$(a.getAttribute('href'));
  if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
}));

// App screens mockup
$('#expandScreens').addEventListener('click',()=>showModal('screensModal'));
