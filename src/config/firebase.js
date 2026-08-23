import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { API_URL } from './api';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID || import.meta.env.VITE_FIREBASE_APP_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let app = null;
let messaging = null;

try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn('[Firebase Client] No se pudo inicializar Firebase en este navegador:', error.message);
}

export const requestFcmToken = async ({ tenantId = null, userId = null, customerId = null, bookingId = null } = {}) => {
  if (!messaging || typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[FCM] Notificaciones no soportadas en este dispositivo/navegador.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] Permiso de notificaciones denegado por el usuario.');
      return null;
    }

    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(firebaseConfig.apiKey || '')}&authDomain=${encodeURIComponent(firebaseConfig.authDomain || '')}&projectId=${encodeURIComponent(firebaseConfig.projectId || '')}&storageBucket=${encodeURIComponent(firebaseConfig.storageBucket || '')}&messagingSenderId=${encodeURIComponent(firebaseConfig.messagingSenderId || '')}&appId=${encodeURIComponent(firebaseConfig.appId || '')}`;
    await navigator.serviceWorker.register(swUrl);
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    if (token) {
      // Registrar token en el backend
      await fetch(`${API_URL}/public/fcm-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          tenantId,
          userId,
          customerId,
          bookingId,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'web_mobile' : 'web_desktop',
        }),
      });
      console.log('[FCM] Token de dispositivo registrado con éxito');
      return token;
    }
  } catch (error) {
    console.error('[FCM] Error al solicitar o registrar token FCM:', error);
  }
  return null;
};

export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[FCM] Notificación recibida en primer plano:', payload);
    const title = payload.notification?.title || 'Senzoly';
    const body = payload.notification?.body || '';

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/faviconsenzoly.png',
        data: payload.data || {},
      });
    }

    if (callback) callback(payload);
  });
};

export { app, messaging };
