importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuración pública de Firebase en el Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDrqGUWFh2RekszJT1p0Y_u3gsTzzKsHHQ",
  authDomain: "senzoly.firebaseapp.com",
  projectId: "senzoly",
  storageBucket: "senzoly.firebasestorage.app",
  messagingSenderId: "203577861663",
  appId: "1:203577861663:web:332b10190711ad672c172a"
});

const messaging = firebase.messaging();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación recibida en segundo plano:', payload);
  const notificationTitle = payload.notification?.title || 'Senzoly';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/faviconsenzoly.png',
    badge: '/faviconsenzoly.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
