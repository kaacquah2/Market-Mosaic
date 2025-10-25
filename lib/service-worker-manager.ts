'use client'

// Service Worker Registration
// This script registers the service worker for push notifications

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager
  private registration: ServiceWorkerRegistration | null = null

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager()
    }
    return ServiceWorkerManager.instance
  }

  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully:', this.registration)

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              console.log('New service worker available')
              this.showUpdateNotification()
            }
          })
        }
      })

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      console.log('Service Worker unregistered:', result)
      this.registration = null
      return result
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  private showUpdateNotification() {
    // Show a notification to the user about the update
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('App Update Available', {
        body: 'A new version of the app is available. Please refresh to update.',
        icon: '/icon-192x192.png',
        tag: 'app-update'
      })
    }
  }

  // Check if push notifications are supported
  static isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  // Request notification permission
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }

    return Notification.permission
  }

  // Check notification permission
  static getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }
}

// Auto-register service worker when the module is imported
if (typeof window !== 'undefined') {
  const swManager = ServiceWorkerManager.getInstance()
  
  // Register service worker on page load
  window.addEventListener('load', () => {
    swManager.register()
  })

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && swManager.getRegistration()) {
      // Page became visible, check for updates
      swManager.getRegistration()?.update()
    }
  })
}

