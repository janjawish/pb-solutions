(() => {
  const form = document.getElementById("formulaire");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Envoi en cours…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
        status.textContent = "✅ Merci ! Votre demande a bien été envoyée. On vous rappelle rapidement.";
      } else {
        status.textContent = "❌ Erreur : impossible d’envoyer. Réessayez ou appelez le 06 66 90 13 03.";
      }
    } catch (err) {
      status.textContent = "❌ Hors connexion. Réessayez ou appelez le 06 66 90 13 03.";
    }
  });
})();
