'use strict';

/* eslint-env serviceworker */
/* global WorkboxSW */

// This script is added to app/third_party/ by gulp and swapped for a prod
// file name in production build.
importScripts('/third_party/workbox-sw/workbox-sw.dev.js');

self.workbox = self.workbox || {};
self.workbox.LOG_LEVEL = 0;

const workbox = new WorkboxSW();

// workbox-build will swap out the empty array with a list of files to precache.
workbox.precache([]);

// Register route for Google static files.
workbox.router.registerRoute(
  /.*(?:googleapis|gstatic)\.com/,
  workbox.strategies.staleWhileRevalidate());
