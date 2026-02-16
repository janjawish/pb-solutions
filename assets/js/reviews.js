(async () => {
  const mount = document.getElementById("reviewsCarousel");
  if (!mount) return;

  try {
    const res = await fetch("/api/reviews.json", { cache: "no-store" });
    if (!res.ok) throw new Error("No endpoint");
    const data = await res.json();

    const track = document.createElement("div");
    track.className = "reviews-track";

    (data.reviews || []).slice(0, 10).forEach((r) => {
      const el = document.createElement("div");
      el.className = "review-card";
      el.innerHTML = `
        <p>⭐️ ${r.rating} — ${esc(r.text || "")}</p>
        <div class="meta">${esc(r.author_name || "Client")} • ${esc(r.relative_time_description || "")}</div>
      `;
      track.appendChild(el);
    });

    mount.innerHTML = `
      <div style="padding:14px;border-bottom:1px solid rgba(255,255,255,.10)">
        <strong>Avis Google</strong>
        <span class="mini" style="margin-left:10px">Note : ${data.rating} / 5 • ${data.user_ratings_total} avis</span>
      </div>
    `;
    mount.appendChild(track);

  } catch (e) {
    // fallback si pas d'API : ne rien faire (ou laisse tes avis statiques)
  }

  function esc(str){
    return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }
})();
