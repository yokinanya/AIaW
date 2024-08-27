import { Loading, LocalStorage } from 'quasar'
import { register } from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered (/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound(registration) {
    // console.log('New content is downloading.')
    registration.active && Loading.show({
      message: '更新中...'
    })
  },

  updated(/* registration */) {
    // console.log('New content is available; please refresh.')
    const lastReload = LocalStorage.getItem('last-reload-timestamp')
    if (lastReload && Date.now() - lastReload < 5000) {
      // Prevent infinite reloads
      return
    }
    LocalStorage.setItem('last-reload-timestamp', Date.now())
    // if directly reload without timeout, the content won't be updated. I don't know why.
    setTimeout(() => {
      location.reload()
    }, 100)
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
