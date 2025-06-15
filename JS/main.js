if ("serviceWorker" in navigator) {
  console.log("Service Workers are supported in this browser.");

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => {
        console.log("ServiceWorker registration successful with scope: ", reg);
      })
      .catch((err) => {
        console.log("Service Worker registration failed: ", err);
      });
  });
} else {
  console.warn("Service Workers are not supported in this browser.");
}

// ...................
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the automatic prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show the install button
  const installBtn = document.getElementById("install-btn");
  if (installBtn) {
    installBtn.style.display = "inline-flex";
    installBtn.classList.add("active");

    installBtn.addEventListener("click", () => {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          installBtn.style.display = "none";
        } else {
          console.log("User dismissed the install prompt");
          // Keep the button visible if user dismisses
          installBtn.style.display = "inline-flex";
        }
        deferredPrompt = null;
      });
    });
  }
});

// Handle successful installation
window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
  const installBtn = document.getElementById("install-btn");
  if (installBtn) {
    installBtn.style.display = "none";
  }
});
