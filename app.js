
const P = window.PLACES, G = window.GASTRO, W = window.WALKS;
const pMap = Object.fromEntries(P.map(x=>[x.id,x]));
const gMap = Object.fromEntries(G.map(x=>[x.id,x]));
let state={
  view:"home",
  exploreTag:"All",
  photoOnly:false,
  foodTag:"All",
  mapMode:"all",
  detailFrom:"home",
  activeDetail:null,
  returnTarget:null,
  map:null,
  markers:[],
  walkLine:null
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const icon=n=>`<svg aria-hidden="true"><use href="#${n}"></use></svg>`;
const tierLabel={dontmiss:"DON'T MISS",welike:"WE LIKE",worth:"WORTH A LOOK"};
const statusLabel={wedgo:"WE'D GO",totry:"TO TRY"};

function showView(v,push=true){
  state.view=v; $$(".view").forEach(x=>x.classList.toggle("active",x.id===v));
  $$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===v));
  if(v==="detail") $$(".nav").forEach(x=>x.classList.remove("active"));
  window.scrollTo({top:0,behavior:"instant"});
  if(v==="mapview") setTimeout(initMap,50);
  if(push) history.pushState({view:v},"","#"+v);
}
document.addEventListener("click",e=>{
  const v=e.target.closest("[data-view]"); if(v){ if(v.dataset.foodFilter){state.foodTag=v.dataset.foodFilter;renderFood()} showView(v.dataset.view);return;}
  const pw=e.target.closest("[data-open-place]"); if(pw){openPlace(pw.dataset.openPlace);return;}
  const gf=e.target.closest("[data-open-food]"); if(gf){openFood(gf.dataset.openFood);return;}
  const ww=e.target.closest("[data-open-walk]"); if(ww){openWalk(ww.dataset.openWalk);return;}
});
$("#detailBack").onclick=()=>{
  const target=state.returnTarget;
  if(target?.type==="walk"){
    openWalk(target.id,false);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      window.scrollTo({top:target.scrollY||0,behavior:"instant"});
    }));
    return;
  }
  showView(target?.view || state.detailFrom || "home");
};

function renderExploreChips(){
  const tags=["All","Art","Architecture","History","Literature","Water","Green"];
  $("#exploreChips").innerHTML=tags.map(t=>`<button class="chip ${state.exploreTag===t?"active":""}" data-explore-tag="${t}">${t}</button>`).join("");
  $$("#exploreChips [data-explore-tag]").forEach(b=>b.onclick=()=>{state.exploreTag=b.dataset.exploreTag;renderExploreChips();renderExplore();});
}
function renderExplore(){
  const q=$("#exploreSearch").value.trim().toLowerCase();
  let arr=P.filter(x=>(state.exploreTag==="All"||x.tags.includes(state.exploreTag))&&(!state.photoOnly||x.photo));
  if(q) arr=arr.filter(x=>(x.title+" "+x.short+" "+x.tags.join(" ")).toLowerCase().includes(q));
  $("#exploreCount").textContent=String(arr.length).padStart(2,"0");
  $("#photoToggle").classList.toggle("active",state.photoOnly);
  $("#exploreGrid").innerHTML=arr.map(x=>`
    <button class="place-card" data-open-place="${x.id}">
      <span class="tier ${x.tier}">${tierLabel[x.tier]}</span>
      <span class="corner">${icon("arrow-right")}</span>
      <h2>${x.title}</h2><p class="short">${x.short}</p>
      <div class="tags">${x.tags.map(t=>`<span class="tag">${t}</span>`).join("")}${x.photo?`<span class="tag photo">${icon("camera")} Photo</span>`:""}</div>
    </button>`).join("");
}
$("#exploreSearch").oninput=renderExplore;
$("#photoToggle").onclick=()=>{state.photoOnly=!state.photoOnly;renderExplore()};
$("#homePhotoBtn").onclick=()=>{state.exploreTag="All";state.photoOnly=true;renderExploreChips();renderExplore();showView("explore")};

function renderFoodChips(){
  const tags=["All","Coffee","Dinner","Pre-event","Quick bite","Wine","After show","To try"];
  $("#foodChips").innerHTML=tags.map(t=>`<button class="chip ${state.foodTag===t?"active":""}" data-food-tag="${t}">${t}</button>`).join("");
  $$("#foodChips [data-food-tag]").forEach(b=>b.onclick=()=>{state.foodTag=b.dataset.foodTag;renderFoodChips();renderFood();});
}
function foodMatches(x,t){if(t==="All")return true;if(t==="To try")return x.status==="totry";return x.tags.includes(t)}
function renderFood(){
  const q=$("#foodSearch").value.trim().toLowerCase();
  let arr=G.filter(x=>foodMatches(x,state.foodTag));
  if(q) arr=arr.filter(x=>(x.title+" "+x.best+" "+x.take+" "+x.tags.join(" ")).toLowerCase().includes(q));
  $("#foodCount").textContent=String(arr.length).padStart(2,"0");
  $("#foodGrid").innerHTML=arr.map(x=>`
    <button class="place-card food-card" data-open-food="${x.id}">
      <span class="status ${x.status}">${statusLabel[x.status]}</span>
      <span class="corner">${icon("arrow-right")}</span>
      <h2>${x.title}</h2>
      <div class="bestfor">${x.best}</div>
      <p class="short">${x.take}</p>
      <div class="tags">${x.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      ${(x.indoor||x.outdoor)?`<div class="atmos">${x.indoor?`<span>Indoor ${"●".repeat(x.indoor)}</span>`:""}${x.outdoor?`<span>Outdoor ${"●".repeat(x.outdoor)}</span>`:""}</div>`:""}
    </button>`).join("");
}
$("#foodSearch").oninput=renderFood;

function renderWalks(){
  $("#walkGrid").innerHTML=W.map((x,i)=>`
    <button class="walk-card ${x.mood}" data-open-walk="${x.id}">
      <span class="walk-num">0${i+1}</span>
      <p class="eyebrow">WALK 0${i+1}</p>
      <h2>${x.title}</h2><p>${x.subtitle}</p>
      <div class="tags">${x.meta.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    </button>`).join("");
}

function mapsDir(address){return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=walking`}
function mapsSearch(address){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}

function openPlace(id){
  const x=pMap[id]; if(!x)return;
  if(state.view==="detail" && state.activeDetail?.type==="walk"){
    state.returnTarget={type:"walk",id:state.activeDetail.id,scrollY:window.scrollY};
    state.detailFrom="walks";
  }else{
    state.returnTarget={type:"view",view:state.view==="detail"?"explore":state.view};
    state.detailFrom=state.returnTarget.view;
  }
  state.activeDetail={type:"place",id};
  $("#detailContext").textContent="EXPLORE";
  $("#detailBody").innerHTML=`
    <div class="detail-hero"><span class="ghost">${x.photo?icon("camera"):"L"}</span><p class="eyebrow">${tierLabel[x.tier]} · ${x.tags.join(" · ")}</p><h1>${x.title}</h1><p>${x.short}</p></div>
    <section class="detail-section"><p class="eyebrow">OUR TAKE</p><h2>Warum hier stoppen?</h2><p>${x.take}</p></section>
    ${x.photo?`<section class="detail-section"><p class="eyebrow">LOOK FOR</p><h2>Photo prompts</h2><div class="photo-prompts">${x.look.map(v=>`<div>${v}</div>`).join("")}</div></section>`:""}
    <section class="detail-section"><div class="actions">
      <a class="action primary" href="${mapsDir(x.address)}" target="_blank" rel="noopener">${icon("pin")}Directions</a>
      ${x.website?`<a class="action" href="${x.website}" target="_blank" rel="noopener">${icon("external")}Check current info</a>`:`<a class="action" href="${mapsSearch(x.address)}" target="_blank" rel="noopener">${icon("external")}Open in Maps</a>`}
    </div></section>`;
  showView("detail");
}
function openFood(id){
  const x=gMap[id]; if(!x)return;
  if(state.view==="detail" && state.activeDetail?.type==="walk"){
    state.returnTarget={type:"walk",id:state.activeDetail.id,scrollY:window.scrollY};
    state.detailFrom="walks";
  }else{
    state.returnTarget={type:"view",view:state.view==="detail"?"food":state.view};
    state.detailFrom=state.returnTarget.view;
  }
  state.activeDetail={type:"food",id};
  $("#detailContext").textContent="EAT & DRINK";
  $("#detailBody").innerHTML=`
    <div class="detail-hero food"><span class="ghost">${icon("coffee")}</span><p class="eyebrow">${statusLabel[x.status]} · ${x.kind.toUpperCase()}</p><h1>${x.title}</h1><p>${x.best}</p></div>
    <section class="detail-section"><p class="eyebrow">OUR TAKE</p><h2>When we'd go</h2><p>${x.take}</p><div class="tags">${x.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>${(x.indoor||x.outdoor)?`<div class="atmos">${x.indoor?`<span>Indoor ${"●".repeat(x.indoor)}</span>`:""}${x.outdoor?`<span>Outdoor ${"●".repeat(x.outdoor)}</span>`:""}</div>`:""}</section>
    <section class="detail-section"><div class="actions">
      <a class="action primary" href="${mapsDir(x.address)}" target="_blank" rel="noopener">${icon("pin")}Directions</a>
      ${x.website?`<a class="action" href="${x.website}" target="_blank" rel="noopener">${icon("external")}Check current info</a>`:`<a class="action" href="${mapsSearch(x.address)}" target="_blank" rel="noopener">${icon("external")}Open in Maps</a>`}
    </div></section>`;
  showView("detail");
}

function stepData(s){
  if(s.place){const x=pMap[s.place];return {title:x.title,desc:x.short,coords:x.coords,kind:"place",place:x,food:s.food||[]}}
  if(s.food && typeof s.food==="string"){const x=gMap[s.food];return {title:x.title,desc:x.best,coords:x.coords,kind:"food",gastro:x,food:[]}}
  return {title:s.label,desc:s.note||"",coords:s.coords,kind:s.kind||"walk",food:s.food||[]}
}
function stepsHTML(stops){
 return `<div class="walk-steps">${stops.map((s,i)=>{const d=stepData(s);return `
  <div class="step"><div class="step-num">${String(i+1).padStart(2,"0")}</div><div>
    <h3>${d.title}</h3><p>${d.desc}</p>
    ${d.kind==="place"?`<button class="action" style="display:inline-flex;min-height:0;padding:6px 8px;margin-top:5px" data-open-place="${d.place.id}">Details</button>`:""}
    ${d.kind==="food"?`<button class="action" style="display:inline-flex;min-height:0;padding:6px 8px;margin-top:5px" data-open-food="${d.gastro.id}">Details</button>`:""}
    ${d.food?.length?`<div class="step-food">${d.food.map(fid=>`<button data-open-food="${fid}">${gMap[fid].title}</button>`).join("")}</div>`:""}
  </div></div>`}).join("")}</div>`;
}
function openWalk(id,push=true){
  const x=W.find(w=>w.id===id); if(!x)return;
  state.detailFrom=state.view==="detail"?"walks":state.view;
  state.returnTarget={type:"view",view:"walks"};
  state.activeDetail={type:"walk",id};
  $("#detailContext").textContent="WALKS";
  $("#detailBody").innerHTML=`
    <div class="detail-hero walk"><span class="ghost">${icon("route")}</span><p class="eyebrow">${x.meta.join(" · ")}</p><h1>${x.title}</h1><p>${x.subtitle}</p></div>
    <section class="detail-section"><p class="eyebrow">WHY THIS WAY</p><h2>${x.start} → ${x.end}</h2><p>${x.intro}</p></section>
    <section class="detail-section"><p class="eyebrow">GOOD TO KNOW</p>${x.notes.map(n=>`<p>• ${n}</p>`).join("")}</section>
    <section class="detail-section"><p class="eyebrow">THE ROUTE</p><h2>Stop by stop</h2>${stepsHTML(x.stops)}
      ${x.returnRoute?`<div class="return-box"><h3>Scenic return to MUK</h3><p>Die Rückroute gehört bewusst zum Konzept – nicht einfach den kürzesten Maps-Weg nehmen.</p></div>${stepsHTML(x.returnRoute)}`:""}
    </section>
    <section class="detail-section"><div class="actions">
      <button class="action primary" id="showWalkMap">${icon("map")}Show on map</button>
      <button class="action" data-view="walks">${icon("arrow-left")}All walks</button>
    </div></section>`;
  showView("detail",push);
  setTimeout(()=>{const b=$("#showWalkMap");if(b)b.onclick=()=>{showView("mapview");$("#mapWalkSelect").value=x.id;drawSelectedWalk();}},0)
}

function renderMapWalkOptions(){
 $("#mapWalkSelect").innerHTML=`<option value="">No walk route</option>`+W.map(x=>`<option value="${x.id}">${x.title}</option>`).join("");
}
function markerIcon(kind,photo){
 const cls=kind==="food"?"food":photo?"photo":"";
 const sym=kind==="food"?"☕":photo?"⌾":"•";
 return L.divIcon({className:"custom-marker",html:`<div class="map-marker ${cls}">${sym}</div>`,iconSize:[31,31],iconAnchor:[15,15]})
}
function initMap(){
 if(typeof L==="undefined"){ $("#map").innerHTML="<div style='padding:20px'>Map could not load.</div>";return}
 if(!state.map){
  state.map=L.map("map",{scrollWheelZoom:false}).setView([53.866,10.690],14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap"}).addTo(state.map);
  P.forEach(x=>{const m=L.marker(x.coords,{icon:markerIcon("place",x.photo)});m._kind="place";m._photo=x.photo;m._id=x.id;m.bindPopup(`<div class="popup-title">${x.title}</div><div class="popup-meta">${x.tags.join(" · ")}</div><button class="popup-btn" onclick="window.openPlaceFromMap('${x.id}')">Details</button>`);m.addTo(state.map);state.markers.push(m)});
  G.forEach(x=>{const m=L.marker(x.coords,{icon:markerIcon("food",false)});m._kind="food";m._photo=false;m._id=x.id;m.bindPopup(`<div class="popup-title">${x.title}</div><div class="popup-meta">${x.best}</div><button class="popup-btn" onclick="window.openFoodFromMap('${x.id}')">Details</button>`);m.addTo(state.map);state.markers.push(m)});
 }
 setTimeout(()=>state.map.invalidateSize(),60);applyMapMode();
}
window.openPlaceFromMap=id=>openPlace(id);window.openFoodFromMap=id=>openFood(id);
function applyMapMode(){
 if(!state.map)return;state.markers.forEach(m=>{let show=state.mapMode==="all"||(state.mapMode==="places"&&m._kind==="place")||(state.mapMode==="food"&&m._kind==="food")||(state.mapMode==="photos"&&m._kind==="place"&&m._photo);if(show){if(!state.map.hasLayer(m))m.addTo(state.map)}else if(state.map.hasLayer(m))state.map.removeLayer(m)})
}
$$("[data-map-mode]").forEach(b=>b.onclick=()=>{$$("[data-map-mode]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.mapMode=b.dataset.mapMode;applyMapMode()});
function routeCoords(w){
 const items=[...w.stops,...(w.returnRoute||[])];return items.map(stepData).map(d=>d.coords).filter(Boolean)
}
function drawSelectedWalk(){
 if(!state.map)return;if(state.walkLine){state.map.removeLayer(state.walkLine);state.walkLine=null}
 const id=$("#mapWalkSelect").value;if(!id)return;const w=W.find(x=>x.id===id);const coords=routeCoords(w);state.walkLine=L.polyline(coords,{color:"#35AFA5",weight:5,opacity:.75,lineCap:"round"}).addTo(state.map);state.map.fitBounds(state.walkLine.getBounds(),{padding:[28,28]})
}
$("#mapWalkSelect").onchange=drawSelectedWalk;

$("#themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("luebeckOurWayTheme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("luebeckOurWayTheme")==="dark")document.body.classList.add("dark");

window.addEventListener("popstate",()=>{const v=location.hash.slice(1)||"home";if(["home","explore","walks","food","mapview"].includes(v))showView(v,false);else showView("home",false)});
function boot(){
 $("#homeCounts").textContent=`${P.length} places · ${W.length} walks · ${G.length} eat & drink spots`;
 renderExploreChips();renderExplore();renderFoodChips();renderFood();renderWalks();renderMapWalkOptions();
 const v=location.hash.slice(1);showView(["explore","walks","food","mapview"].includes(v)?v:"home",false);
}
boot();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
