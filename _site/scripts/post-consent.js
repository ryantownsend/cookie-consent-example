// we have to wrap our code in an async IIFE in order to use `await`
(async () => {
  // our 'fake' function that only executes if consent is set
  const loadTrackingScripts = async () => {
    const notice = document.createElement("p");
    notice.innerHTML = `
      <strong>Consent has been set:</strong> <small>(this message is added by the callback)</small><br />
      Marketing = ${(await cookieStore.get("consent-marketing"))?.value || "false"}<br />
      Analytics = ${(await cookieStore.get("consent-analytics"))?.value || "false"}
    `;
    document.body.appendChild(notice);
  }

  // read whether consent is necessary (assume anything but "false" is true)
  const consentNecessary = "false" !== (await cookieStore.get("consent-necessary"))?.value;
  // check if we have consent choices set already
  const hasConsent = await cookieStore.get("consent-timestamp");

  // on page load, if we have consent already (or don't need it), load tracking scripts
  if (hasConsent || !consentNecessary) {
    loadTrackingScripts();
  // if we don't have consent, set up a listener for when it's given
  } else {
    // we use an AbortController to stop listening once consent is set
    const cookieStoreAbortController = new AbortController();
    // listen for cookie changes
    window.cookieStore.addEventListener("change", event => {
      for (const change of event.changed) {
        if (change.name.startsWith("consent-timestamp")) {
          // stop listening for cookie changes
          cookieStoreAbortController.abort();
          // load tracking scripts now consent is given
          loadTrackingScripts();
          // stop looping
          break;
        }
      }
    }, { signal: cookieStoreAbortController.signal });
  }
})()
