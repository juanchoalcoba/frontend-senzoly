importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuración dinámica de Firebase en el Service Worker desde la URL de registro
const urlParams = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: urlParams.get('apiKey') || '',
  authDomain: urlParams.get('authDomain') || '',
  projectId: urlParams.get('projectId') || '',
  storageBucket: urlParams.get('storageBucket') || '',
  messagingSenderId: urlParams.get('messagingSenderId') || '',
  appId: urlParams.get('appId') || '',
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
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Senzoly';
  const defaultIcon = `${self.location.origin}/faviconsenzoly.png`;
  const iconUrl = payload.notification?.icon || payload.data?.icon || defaultIcon;
  const badgeUrl = payload.notification?.badge || payload.data?.badge || defaultIcon;

  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: iconUrl,
    badge: badgeUrl,
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
