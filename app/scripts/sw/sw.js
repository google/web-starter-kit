import workbox from 'workbox-sw';

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp(/\.(?:googleapis|gstatic)\.com$/),
  new workbox.strategies.StaleWhileRevalidate());
workbox.routing.registerRoute(
  new RegExp(/.*\.(?:edenpass)\.com$/),
  new workbox.strategies.StaleWhileRevalidate());

// self.addEventListener('push', (event) => {
//  const title = 'Get Started With Workbox';
//  const options = {
//    body: event.data.text()
//  };
//  event.waitUntil(self.registration.showNotification(title, options));
// });

workbox.precaching.precacheAndRoute([]);
