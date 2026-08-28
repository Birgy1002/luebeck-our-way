(function(){
  const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
  const P=window.PLACES||[];
  const pMap=Object.fromEntries(P.map(x=>[x.id,x]));
  const labels={dontmiss:"DON'T MISS",welike:"WE LIKE",worth:"WORTH A LOOK"};
  const svg=n=>`<svg aria-hidden="true"><use href="#${n}"></use></svg>`;
  let events=[], updated=null;

  function addStyles(){
    if(document.getElementById('events-v09-style')) return;
    const st=document.createElement('style');
    st.id='events-v09-style';
    st.textContent=`
.events-home{background:linear-gradient(145deg,#E1F3F0,#FFF3CE);border:1px solid var(--line);border-radius:var(--r2);padding:20px;margin-bottom:12px}.events-home-head{margin-bottom:10px}.events-home-head h2,.event-section h2{font-family:"Manrope";font-size:23px;letter-spacing:-.03em;margin:0}.home-events-list{display:grid;gap:7px}.home-event{border:0;background:rgba(255,255,255,.72);border-radius:14px;padding:12px;text-align:left;display:grid;grid-template-columns:62px 1fr auto;gap:10px;align-items:center}.home-event-date{font-family:"Manrope";font-size:11px;line-height:1.1;font-weight:800;color:#22766F;letter-spacing:.04em}.home-event b{font-family:"Manrope";font-size:13px;display:block}.home-event small{font-size:10px;color:var(--muted);display:block;margin-top:2px}.home-event svg{width:16px;color:var(--aqua)}.event-loading{font-size:12px;color:var(--muted);padding:10px 0}.events-all-btn{margin-top:11px}.events-status{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin-bottom:14px}.events-status>div{display:flex;flex-direction:column;gap:2px}.events-status b{font-size:11px}.events-status span{font-size:10px;color:var(--muted)}.small-back-home{border:1px solid var(--line);background:var(--cream);border-radius:11px;min-height:38px;padding:0 10px;display:flex;align-items:center;gap:5px;font-size:10px;font-weight:750}.small-back-home svg{width:15px}.event-stale{border:1px solid #E4BFAE;background:#FFF0E8;color:#8A4E3C;border-radius:14px;padding:11px 13px;font-size:11px;line-height:1.5;margin-bottom:14px}.hidden{display:none!important}.event-section{margin-bottom:24px}.event-section>h2{margin-bottom:10px}.event-grid{display:grid;gap:9px}.event-card{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:16px;position:relative}.event-card-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:8px}.event-date{font-family:"Manrope";font-size:12px;font-weight:800;color:#22766F;letter-spacing:.04em}.event-category{font-size:8px;font-weight:800;letter-spacing:.08em;padding:5px 7px;border-radius:999px;background:var(--cream);color:var(--muted);text-align:right}.event-card h3{font-family:"Manrope";font-size:18px;letter-spacing:-.025em;margin:0 0 3px}.event-venue{font-size:10px;font-weight:700;color:var(--muted);margin-bottom:9px}.event-why{font-size:12px;line-height:1.5;color:#555B58;margin:0 0 11px}.event-meta-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:11px}.event-meta{font-size:9px;font-weight:750;padding:5px 7px;border-radius:999px;background:#E5F4F1;color:#246B65}.event-actions{display:flex;flex-wrap:wrap;gap:7px}.event-link,.event-place-link{border:1px solid var(--line);background:var(--cream);border-radius:11px;min-height:38px;padding:0 10px;display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-size:10px;font-weight:750}.event-link.primary{background:var(--aqua);border-color:var(--aqua);color:#fff}.event-link svg,.event-place-link svg{width:14px}.happening-box{background:linear-gradient(145deg,#E5F4F1,#FFF4D6);border:1px solid var(--line);border-radius:19px;padding:18px;margin-bottom:9px}.happening-box h2{font-family:"Manrope";font-size:21px;letter-spacing:-.025em;margin:0 0 10px}.happening-list{display:grid;gap:7px}.happening-item{border:0;background:rgba(255,255,255,.72);border-radius:12px;padding:10px 11px;display:grid;grid-template-columns:58px 1fr auto;gap:8px;align-items:center;text-align:left}.happening-item .date{font-family:"Manrope";font-size:10px;font-weight:800;color:#22766F}.happening-item b{font-size:11px}.happening-item svg{width:14px}.events-error{border:1px dashed var(--line);border-radius:14px;padding:14px;font-size:11px;color:var(--muted)}.event-card.event-focus{animation:eventFocus 1.8s ease}@keyframes eventFocus{0%{box-shadow:0 0 0 0 rgba(53,175,165,0);transform:translateY(0)}18%{box-shadow:0 0 0 5px rgba(53,175,165,.22);transform:translateY(-2px)}70%{box-shadow:0 0 0 5px rgba(53,175,165,.16);transform:translateY(-2px)}100%{box-shadow:0 0 0 0 rgba(53,175,165,0);transform:translateY(0)}}body.dark .events-home,body.dark .happening-box{background:linear-gradient(145deg,#25413F,#4B4330)}body.dark .home-event,body.dark .happening-item{background:rgba(41,49,58,.8)}body.dark .event-why{color:#C4CDD2}@media(min-width:700px){.event-grid{grid-template-columns:1fr 1fr}.events-home{padding:24px}}`;
    document.head.appendChild(st);
  }

  function addMarkup(){
    if(!qs('.events-home')){
      const grid=qs('#home .home-grid');
      if(grid){
        const s=document.createElement('section');
        s.className='events-home';
        s.innerHTML=`<div class="section-head events-home-head"><div><p class="eyebrow">WHAT'S ON</p><h2>Current picks</h2></div><span class="count-pill" id="eventUpdatedHome">Loading…</span></div><div id="homeEvents" class="home-events-list"><div class="event-loading">Loading current event picks…</div></div><button class="inline-btn events-all-btn" data-view="events">View all events ${svg('arrow-right')}</button>`;
        grid.insertAdjacentElement('afterend',s);
      }
    }
    if(!qs('#events')){
      const map=qs('#mapview');
      if(map){
        const s=document.createElement('section');
        s.id='events'; s.className='view';
        s.innerHTML=`<div class="page-head"><div><p class="eyebrow">WHAT'S ON</p><h1>Lübeck Event Radar</h1></div><span class="big-number" id="eventsActiveCount">00</span></div><div class="events-status"><div><b id="eventUpdated">Loading current picks…</b><span>Curated, not complete.</span></div><button class="small-back-home" data-view="home">${svg('arrow-left')}Home</button></div><div id="eventStaleWarning" class="event-stale hidden"></div><section class="event-section"><p class="eyebrow">HIGHLIGHT TICKER</p><h2>Don't miss</h2><div id="eventsHighlights" class="event-grid"></div></section><section class="event-section"><p class="eyebrow">NEW & NOTABLE</p><h2>Also worth a look</h2><div id="eventsNotable" class="event-grid"></div></section><section class="event-section"><p class="eyebrow">SAVE THE DATE</p><h2>Worth planning ahead</h2><div id="eventsSave" class="event-grid"></div></section>`;
        map.parentNode.insertBefore(s,map);
      }
    }
  }

  function localDateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function parseDateKey(k){const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)}
  function activeEvents(){const t=localDateKey();return events.filter(e=>(e.endDate||e.startDate)>=t).sort((a,b)=>a.startDate.localeCompare(b.startDate)||((a.priority||99)-(b.priority||99)))}
  function formatDate(e){const a=parseDateKey(e.startDate),b=parseDateKey(e.endDate||e.startDate),fmt=new Intl.DateTimeFormat('en-GB',{month:'short'}),ad=String(a.getDate()).padStart(2,'0'),bd=String(b.getDate()).padStart(2,'0'),am=fmt.format(a).toUpperCase(),bm=fmt.format(b).toUpperCase();if(e.startDate===(e.endDate||e.startDate))return `${ad} ${am}`;if(a.getMonth()===b.getMonth())return `${ad}–${bd} ${am}`;return `${ad} ${am} – ${bd} ${bm}`}
  function formatUpdated(){return updated?`Updated ${new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short'}).format(parseDateKey(updated))}`:'Update unavailable'}
  function forPlace(id){return activeEvents().filter(e=>e.placeId===id)}

  function eventCard(e){const place=e.placeId&&pMap[e.placeId]?e.placeId:null;return `<article class="event-card" id="event-${e.id}"><div class="event-card-top"><div class="event-date">${formatDate(e)}${e.time?` · ${e.time}`:''}</div><span class="event-category">${e.category}</span></div><h3>${e.title}</h3><div class="event-venue">${e.venue}</div><p class="event-why">${e.why}</p><div class="event-meta-row"><span class="event-meta">${e.booking}</span></div><div class="event-actions"><a class="event-link primary" href="${e.url}" target="_blank" rel="noopener">${svg('external')}Official info</a>${place?`<button class="event-place-link" data-open-place="${place}">${svg('pin')}Explore place</button>`:''}</div></article>`}

  function renderEvents(){
    const act=activeEvents();
    const c=qs('#eventsActiveCount'); if(c)c.textContent=String(act.length).padStart(2,'0');
    const u=qs('#eventUpdated'); if(u)u.textContent=formatUpdated();
    const uh=qs('#eventUpdatedHome'); if(uh)uh.textContent=formatUpdated();
    const groups=[['#eventsHighlights','highlight'],['#eventsNotable','notable'],['#eventsSave','save']];
    groups.forEach(([sel,sec])=>{const el=qs(sel);if(!el)return;const arr=act.filter(e=>e.section===sec).sort((a,b)=>a.startDate.localeCompare(b.startDate)||((a.priority||99)-(b.priority||99)));el.innerHTML=arr.length?arr.map(eventCard).join(''):'<div class="events-error">Currently no curated picks in this section.</div>'});
    const picks=act.filter(e=>e.section==='highlight').sort((a,b)=>(a.priority||99)-(b.priority||99)).slice(0,3),home=qs('#homeEvents');
    if(home)home.innerHTML=picks.length?picks.map(e=>`<button class="home-event" data-open-event="${e.id}"><span class="home-event-date">${formatDate(e)}</span><span><b>${e.title}</b><small>${e.venue}</small></span>${svg('arrow-right')}</button>`).join(''):'<div class="event-loading">No current picks right now.</div>';
    const warn=qs('#eventStaleWarning');if(warn&&updated){const age=Math.floor((parseDateKey(localDateKey())-parseDateKey(updated))/86400000);if(age>10){warn.textContent=`Event Radar last updated ${age} days ago. Please check the linked official programmes before making plans.`;warn.classList.remove('hidden')}else warn.classList.add('hidden')}
  }

  function openEvent(id){
    renderEvents();
    if(typeof showView==='function')showView('events');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const card=qs(`#event-${id}`);if(!card)return;card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.remove('event-focus');void card.offsetWidth;card.classList.add('event-focus');setTimeout(()=>card.classList.remove('event-focus'),1800)}));
  }

  function patchExplore(){
    window.renderExplore=function(){
      const q=(qs('#exploreSearch')?.value||'').trim().toLowerCase();
      let arr=P.filter(x=>(state.exploreTag==='All'||x.tags.includes(state.exploreTag))&&(!state.photoOnly||x.photo));
      if(q)arr=arr.filter(x=>(x.title+' '+x.short+' '+x.tags.join(' ')).toLowerCase().includes(q));
      const rank={dontmiss:0,welike:1,worth:2};
      arr.sort((a,b)=>(rank[a.tier]??99)-(rank[b.tier]??99)||a.title.localeCompare(b.title,'de',{sensitivity:'base'}));
      qs('#exploreCount').textContent=String(arr.length).padStart(2,'0');
      qs('#photoToggle').classList.toggle('active',state.photoOnly);
      qs('#exploreGrid').innerHTML=arr.map(x=>`<button class="place-card" data-open-place="${x.id}"><span class="tier ${x.tier}">${labels[x.tier]}</span><span class="corner">${svg('arrow-right')}</span><h2>${x.title}</h2><p class="short">${x.short}</p><div class="tags">${x.tags.map(t=>`<span class="tag">${t}</span>`).join('')}${x.photo?`<span class="tag photo">${svg('camera')} Photo</span>`:''}</div></button>`).join('');
    };
    const search=qs('#exploreSearch');if(search)search.oninput=window.renderExplore;
    window.renderExplore();
  }

  function patchPlace(){
    if(typeof openPlace!=='function'||window.__eventsPlacePatched)return;
    const original=openPlace;
    window.openPlace=function(id){
      original(id);
      const list=forPlace(id).slice(0,3);if(!list.length)return;
      const body=qs('#detailBody');if(!body||body.querySelector('.happening-box'))return;
      const firstSection=body.querySelector('.detail-section');if(!firstSection)return;
      const box=document.createElement('section');box.className='happening-box';
      box.innerHTML=`<p class="eyebrow">HAPPENING HERE</p><h2>Currently on</h2><div class="happening-list">${list.map(e=>`<button class="happening-item" data-open-event="${e.id}"><span class="date">${formatDate(e)}</span><b>${e.title}</b>${svg('arrow-right')}</button>`).join('')}</div>`;
      firstSection.insertAdjacentElement('afterend',box);
    };
    window.__eventsPlacePatched=true;
  }

  document.addEventListener('click',e=>{const b=e.target.closest('[data-open-event]');if(b){e.preventDefault();e.stopPropagation();openEvent(b.dataset.openEvent)}},true);
  window.addEventListener('popstate',()=>{if(location.hash==='#events'&&typeof showView==='function')showView('events',false)});

  async function fetchFreshEvents(){
    try{
      const r=await fetch('./data/events.json',{cache:'no-store'});
      if(!r.ok)throw new Error(r.status);
      const d=await r.json();
      if(!d || !Array.isArray(d.events))throw new Error('Invalid events data');
      events=d.events;
      updated=d.updated||null;
      return true;
    }catch(err){
      // Keep the last successfully loaded data instead of blanking the radar.
      console.warn('Event Radar could not be refreshed',err);
      return false;
    }
  }

  async function refreshEvents(){
    const ok=await fetchFreshEvents();
    if(ok){
      // Re-rendering also removes events that expired since the app was last open.
      renderEvents();
    }
    return ok;
  }

  function setupForegroundRefresh(){
    let lastRefreshAt=0;
    const refreshWhenVisible=()=>{
      if(document.visibilityState && document.visibilityState!=='visible')return;
      const now=Date.now();
      // iOS may fire focus + pageshow + visibilitychange together.
      if(now-lastRefreshAt<3000)return;
      lastRefreshAt=now;
      refreshEvents();
    };
    document.addEventListener('visibilitychange',refreshWhenVisible);
    window.addEventListener('pageshow',refreshWhenVisible);
    window.addEventListener('focus',refreshWhenVisible);
  }

  async function load(){
    addStyles();addMarkup();patchExplore();patchPlace();
    await refreshEvents();
    patchPlace();
    setupForegroundRefresh();
  }

  load();
})();
