(function(){
  if(window.__luebeckFieldV14)return;
  window.__luebeckFieldV14=true;

  const hidden=W.find(w=>w.id==="hidden");
  const good=gMap["goodtimes"];

  if(hidden){
    const already=hidden.stops.some(s=>s.place==="hansemuseum");
    if(!already){
      hidden.stops.splice(1,0,{
        place:"hansemuseum",
        note:"Nicht nur fürs Museum: Von der Terrasse lohnt der Blick über die Trave und den Hafen. Wenn geöffnet, unbedingt auch kurz ins Burgkloster schauen – mittelalterliche Räume, Backstein und moderne Museumseinbauten funktionieren auch als kurzer Architektur-Stopp.<br><b>📷 Photo:</b> Von der Terrasse Hafen, Kräne und Backstein staffeln; im Burgkloster mit Bögen, Fenstern, Spiegelungen und Licht arbeiten.",
        food:["goodtimes"]
      });
    }
    hidden.notes=[
      "Start practical: von MUK/Media Docks zuerst zum Dunkelgrünen Gang, dann Hansemuseum/Burgkloster und Heiligen-Geist-Hospital.",
      "Gang etiquette: leise, respektvoll, keine Bewohner:innen oder privaten Fenster fotografieren.",
      "Einige Höfe und Gänge können zeitweise geschlossen sein – ein verschlossenes Tor einfach respektieren.",
      "Good Times an der Untertrave ist hier ein sinnvoller Kaffee-/Kuchen-Stopp; Terrasse schön, aber durch die Straße teilweise etwas lauter."
    ];
    hidden.googleRoute={
      origin:[53.87312,10.68683],
      waypoints:[[53.8731,10.6857],[53.86943,10.69215],[53.862137,10.681108]],
      destination:[53.8641,10.6802]
    };
  }

  if(good){
    good.status="wedgo";
    good.tags=["Coffee","Cake","Bakery","Lunch","Outdoor","Indoor"];
    good.best="Very good coffee & cake · bakery · Untertrave";
    good.take="Getestet und bleibt drin: sehr leckerer Kaffee und Kuchen; auch die herzhaften Sachen sahen gut aus. Drinnen hübsch und angenehm. Die Terrasse an der Untertrave ist schön, liegt aber nah an der Straße und kann deshalb zeitweise etwas lauter sein. Wenn man in der Ecke rund um Hansemuseum/Burgkloster etwas sucht, lohnt sich der Stopp.";
    good.indoor=3;
    good.outdoor=2;
  }

  window.stepData=function(s){
    if(s.place){const x=pMap[s.place];return {title:x.title,desc:s.note||x.short,coords:x.coords,kind:"place",place:x,food:s.food||[]}}
    if(s.food && typeof s.food==="string"){const x=gMap[s.food];return {title:x.title,desc:s.note||x.best,coords:x.coords,kind:"food",gastro:x,food:[]}}
    return {title:s.label,desc:s.note||"",coords:s.coords,kind:s.kind||"walk",food:s.food||[]}
  };

  function addStyles(){
    if(document.getElementById("walk-v14-style"))return;
    const s=document.createElement("style");
    s.id="walk-v14-style";
    s.textContent=`
      .walk-overview-section{padding-bottom:10px}
      .walk-overview-map{width:100%;height:330px;border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-top:10px;background:#e8eee9;z-index:1}
      .walk-map-caption{margin:9px 2px 0;font-size:10px;line-height:1.45;color:var(--muted)}
      .walk-overview-map .leaflet-control-attribution{font-size:7px}
      @media(min-width:700px){.walk-overview-map{height:420px}}
    `;
    document.head.appendChild(s);
  }

  function coord(c){return `${c[0]},${c[1]}`}

  function googleRouteUrl(w){
    if(w.googleRoute){
      const ways=(w.googleRoute.waypoints||[]).map(coord).join("|");
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(coord(w.googleRoute.origin))}&destination=${encodeURIComponent(coord(w.googleRoute.destination))}${ways?`&waypoints=${encodeURIComponent(ways)}`:""}&travelmode=walking`;
    }
    const pts=(w.stops||[]).map(stepData).map(d=>d.coords).filter(Boolean);
    if(pts.length<2)return "#";
    const origin=pts[0],destination=pts[pts.length-1],middle=pts.slice(1,-1);
    const picked=middle.length<=3?middle:[middle[0],middle[Math.floor((middle.length-1)/2)],middle[middle.length-1]];
    const ways=picked.map(coord).join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(coord(origin))}&destination=${encodeURIComponent(coord(destination))}${ways?`&waypoints=${encodeURIComponent(ways)}`:""}&travelmode=walking`;
  }

  function miniMarker(label,coral=false){
    return L.divIcon({
      className:"custom-marker",
      html:`<div class="walk-map-marker${coral?" food":""}">${label}</div>`,
      iconSize:[34,34],iconAnchor:[17,17]
    });
  }

  function initOverview(w){
    const el=document.getElementById("walkOverviewMap");
    if(!el||typeof L==="undefined")return;
    const m=L.map(el,{scrollWheelZoom:false,zoomControl:true,dragging:true,touchZoom:true,doubleClickZoom:true});
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap"}).addTo(m);

    const outbound=(w.stops||[]).map((s,i)=>({d:stepData(s),i})).filter(x=>x.d.coords);
    const outCoords=outbound.map(x=>x.d.coords);
    if(outCoords.length>1)L.polyline(outCoords,{color:"#168F86",weight:5,opacity:.92,lineCap:"round",lineJoin:"round"}).addTo(m);
    outbound.forEach(({d,i})=>L.marker(d.coords,{icon:miniMarker(i+1)}).addTo(m).bindPopup(`<div class="popup-title">${i+1} · ${d.title}</div>`));

    let all=[...outCoords];
    if(w.returnRoute?.length){
      const ret=w.returnRoute.map((s,i)=>({d:stepData(s),i})).filter(x=>x.d.coords);
      const retCoords=ret.map(x=>x.d.coords);
      if(retCoords.length>1)L.polyline(retCoords,{color:"#EE786A",weight:4,opacity:.9,dashArray:"9 8",lineCap:"round",lineJoin:"round"}).addTo(m);
      ret.forEach(({d,i})=>L.marker(d.coords,{icon:miniMarker(`R${i+1}`,true)}).addTo(m).bindPopup(`<div class="popup-title">R${i+1} · ${d.title}</div>`));
      all=all.concat(retCoords);
    }
    if(all.length)m.fitBounds(L.latLngBounds(all),{padding:[28,28],maxZoom:15});
    setTimeout(()=>m.invalidateSize(),80);
  }

  addStyles();

  const baseOpenWalk=window.openWalk;
  window.openWalk=function(id,push=true){
    baseOpenWalk(id,push);
    const w=W.find(x=>x.id===id);
    if(!w)return;
    setTimeout(()=>{
      const body=document.getElementById("detailBody");
      if(!body)return;
      const routeSection=[...body.querySelectorAll(".detail-section")].find(s=>s.querySelector(".walk-steps"));
      if(routeSection && !document.getElementById("walkOverviewMap")){
        const sec=document.createElement("section");
        sec.className="detail-section walk-overview-section";
        sec.innerHTML=`<p class="eyebrow">MAP OVERVIEW</p><h2>The whole walk</h2><div id="walkOverviewMap" class="walk-overview-map"></div><p class="walk-map-caption">Alle Stopps in der Reihenfolge des Walks. Türkis = Walk; Coral = Scenic Return.</p>`;
        routeSection.parentNode.insertBefore(sec,routeSection);
        initOverview(w);
      }

      const actions=body.querySelector(".actions");
      if(actions && !actions.querySelector("[data-google-walk]")){
        const oldPrimary=actions.querySelector("#showWalkMap");
        if(oldPrimary){
          oldPrimary.classList.remove("primary");
          oldPrimary.innerHTML=`${icon("map")}App map`;
        }
        const a=document.createElement("a");
        a.className="action primary";
        a.dataset.googleWalk="1";
        a.href=googleRouteUrl(w);
        a.target="_blank";
        a.rel="noopener";
        a.innerHTML=`${icon("map")}Open Map`;
        actions.insertBefore(a,actions.firstChild);
      }
    },30);
  };

  if(typeof renderFood==="function")renderFood();
})();
