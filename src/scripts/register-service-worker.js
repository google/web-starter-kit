export async function registerSW() {
  if (!navigator.serviceWorker) {
    return;
  }

  // If on localhost - unregister any service workers
  // and don't register a new one.
  if (process.env.NODE_ENV !== 'production') {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
    }
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
