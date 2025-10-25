// Service Worker for Push Notifications
// This file should be placed in the public directory as sw.js

const CACHE_NAME = 'market-mosaic-v1'
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/account',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      }
    )
  )
})

// Push event - Handle incoming push notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event)
  
  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = {
        title: 'New Notification',
        message: event.data.text() || 'You have a new notification',
        icon: '/icon-192x192.png',
        url: '/'
      }
    }
  } else {
    data = {
      title: 'New Notification',
      message: 'You have a new notification',
      icon: '/icon-192x192.png',
      url: '/'
    }
  }

  const options = {
    body: data.message,
    icon: data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/xmark.png'
      }
    ],
    requireInteraction: false,
    silent: false
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    // Open the app to the specific URL
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/')
        }
      })
    )
  } else if (event.action === 'close') {
    // Just close the notification
    console.log('Notification closed by user')
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/')
        }
      })
    )
  }
})

// Background sync event
self.addEventListener('sync', function(event) {
  console.log('Background sync event:', event.tag)
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Perform background sync tasks
      syncNotifications()
    )
  }
})

// Function to sync notifications in background
async function syncNotifications() {
  try {
    // Check for pending notifications
    const response = await fetch('/api/user-notifications?limit=10')
    const notifications = await response.json()
    
    console.log('Synced notifications:', notifications.length)
  } catch (error) {
    console.error('Error syncing notifications:', error)
  }
}

// Message event - Handle messages from main thread
self.addEventListener('message', function(event) {
  console.log('Service worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Activate event
self.addEventListener('activate', function(event) {
  console.log('Service worker activated')
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed:', event)
  
  event.waitUntil(
    // Re-subscribe to push notifications
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.VAPID_PUBLIC_KEY
    }).then(function(subscription) {
      // Send new subscription to server
      return fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      })
    })
  )
})

