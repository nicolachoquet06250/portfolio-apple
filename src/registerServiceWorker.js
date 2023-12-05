/* eslint-disable no-console */

import { register } from 'register-service-worker'
import {showRefreshPageNotification} from "@/hooks/pwa.js";

if (process.env.NODE_ENV === 'production') {
  register(`sw.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
      showRefreshPageNotification.value = false;
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')

      // // A wild service worker has appeared in reg.installing!
      // const newWorker = reg.installing;
      //
      // newWorker.addEventListener('statechange', () => {
      //   // Has network.state changed?
      //   switch (newWorker.state) {
      //     case 'installed':
      //       if (navigator.serviceWorker.controller) {
      //         // new update available
      //         // showUpdateBar();
      //         console.log('show update')
      //       }
      //       // No update available
      //       break;
      //   }
      // });
    },
    updated () {
      console.log('New content is available; please refresh.');
      showRefreshPageNotification.value = true;
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
