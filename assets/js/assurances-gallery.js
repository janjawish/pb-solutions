(() => {
  const list = window.ASSURANCES_LOGOS || [];
  if (!list.length) return;

  const track = document.getElementById("logoTrack");
  const grid  = document.getElementById("logoGrid");

  const basePath = "assets/img/assurances/";

  // Helper HTML
  const item = (l) => `
    <div class="logo-item" title="${esc(l.name)}">
      <img src="${basePath}${encodeURIComponent(l.file)}"
           alt="Assurance ${esc(l.name)}"
           loading="lazy" decoding="async">
    </div>
  `;

  const card = (l) => `
    <div class="logo-card" title="${esc(l.name)}">
      <img src="${basePath}${encodeURIComponent(l.file)}"
           alt="Logo ${esc(l.name)}"
           loading="lazy" decoding="async">
    </div>
  `;

  // Ticker always if track exists
  if (track) {
    const html = list.map(item).join("");
    track.innerHTML = html + html; // duplicate for infinite loop

    // Speed adapts to number of logos
    const duration = Math.min(52, Math.max(22, list.length * 2.4));
    track.style.animationDuration = `${duration}s`;
  }

  // Grid only if present on page (assurances.html)
  if (grid) {
    grid.innerHTML = list.map(card).join("");
  }

  function esc(str){
    return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }
})();
