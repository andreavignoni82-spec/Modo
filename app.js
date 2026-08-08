
const defaultState = {
  profiles: {
    gabriele: {name:"Gabriele", emoji:"🧑", total:120, used:0, weighted:0},
    giorgio: {name:"Giorgio", emoji:"👦", total:90, used:0, weighted:0},
    giulia: {name:"Giulia", emoji:"👧", total:75, used:0, weighted:0}
  },
  logs:[]
};
let state = JSON.parse(localStorage.getItem("modoState") || "null") || structuredClone(defaultState);
let current = null;
let activity = {label:"Video", weight:1};
let running = false, startedAt = null, interval = null;

const $ = s => document.querySelector(s);
function save(){ localStorage.setItem("modoState", JSON.stringify(state)); }
function show(id){ document.querySelectorAll(".view").forEach(v=>v.classList.remove("active")); $(id).classList.add("active"); }
function fmt(min){ const m=Math.max(0,Math.round(min)); return m>=60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m} min`; }

function renderProfiles(){
  const wrap=$("#profiles"); wrap.innerHTML="";
  Object.entries(state.profiles).forEach(([id,p])=>{
    const remain=Math.max(0,p.total-p.weighted);
    const b=document.createElement("button");
    b.className="profile-card";
    b.innerHTML=`<div class="avatar">${p.emoji}</div><strong>${p.name}</strong><small>${fmt(remain)} disponibili</small>`;
    b.onclick=()=>openSession(id);
    wrap.appendChild(b);
  });
}
function openSession(id){
  current=id; const p=state.profiles[id];
  $("#avatar").textContent=p.emoji; $("#sessionName").textContent=p.name;
  updateSessionUI(); show("#sessionView");
}
function updateSessionUI(){
  const p=state.profiles[current];
  const remain=Math.max(0,p.total-p.weighted);
  $("#remainingText").textContent=fmt(remain);
  $("#usedText").textContent=`Usati: ${fmt(p.weighted)}`;
  $("#totalText").textContent=`Budget: ${fmt(p.total)}`;
  $("#progressBar").style.width=`${Math.min(100,(p.weighted/p.total)*100)}%`;
}
document.querySelectorAll(".activity").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".activity").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    activity={label:btn.dataset.label, weight:Number(btn.dataset.weight)};
  };
});
document.querySelectorAll(".quick-actions button").forEach(btn=>{
  btn.onclick=()=>consume(Number(btn.dataset.min));
});
function consume(minutes){
  if(!current)return;
  const p=state.profiles[current];
  p.used += minutes;
  p.weighted += minutes*activity.weight;
  state.logs.push({who:current, activity:activity.label, minutes, weighted:minutes*activity.weight, at:new Date().toISOString()});
  save(); updateSessionUI();
}
$("#startTimerBtn").onclick=()=>{
  if(running){ stopTimer(); return; }
  running=true; startedAt=Date.now();
  $("#startTimerBtn").textContent="Ferma timer";
  interval=setInterval(()=>{
    const sec=Math.floor((Date.now()-startedAt)/1000);
    $("#timerStatus").textContent=`Sessione ${activity.label}: ${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
  },250);
};
function stopTimer(){
  if(!running)return;
  const minutes=(Date.now()-startedAt)/60000;
  clearInterval(interval); interval=null; running=false;
  $("#startTimerBtn").textContent="Avvia sessione reale";
  $("#timerStatus").textContent=`Registrati ${Math.max(1,Math.round(minutes))} min`;
  consume(Math.max(1,minutes));
}
$("#endSessionBtn").onclick=()=>{ stopTimer(); current=null; renderProfiles(); show("#homeView"); };
$("#backBtn").onclick=()=>{ if(running) stopTimer(); current=null; renderProfiles(); show("#homeView"); };
$("#parentBtn").onclick=()=>{ renderParent(); show("#parentView"); };
$("#parentBackBtn").onclick=()=>{ renderProfiles(); show("#homeView"); };
function renderParent(){
  const wrap=$("#parentCards"); wrap.innerHTML="";
  Object.entries(state.profiles).forEach(([id,p])=>{
    const recent=state.logs.filter(x=>x.who===id);
    const card=document.createElement("div");
    card.className="parent-card";
    card.innerHTML=`<div class="parent-card-head"><h3>${p.emoji} ${p.name}</h3><span>${Math.round((p.weighted/p.total)*100)}%</span></div>
    <div class="metric">${fmt(p.weighted)} / ${fmt(p.total)}</div>
    <div class="muted">Tempo reale registrato: ${fmt(p.used)} · Eventi: ${recent.length}</div>`;
    wrap.appendChild(card);
  });
}
$("#resetBtn").onclick=()=>{ localStorage.removeItem("modoState"); state=structuredClone(defaultState); renderParent(); };
$("#familyModeBtn").onclick=()=>openModal("Modalità famiglia","Nel prototipo questa modalità non consuma il budget personale dei bambini.",()=>{});
function openModal(title,text,confirm){
  $("#modalTitle").textContent=title; $("#modalText").textContent=text; $("#modal").classList.remove("hidden");
  $("#modalConfirm").onclick=()=>{ $("#modal").classList.add("hidden"); confirm(); };
}
$("#modalCancel").onclick=()=>$("#modal").classList.add("hidden");
renderProfiles();
document.querySelector('.activity[data-label="Video"]').classList.add("selected");
