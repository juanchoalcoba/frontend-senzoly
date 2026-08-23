import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { API_URL } from './api';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDrqGUWFh2RekszJT1p0Y_u3gsTzzKsHHQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "senzoly.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "senzoly",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "senzoly.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "203577861663",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:203577861663:web:332b10190711ad672c172a",
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || "BM80rZtagjYbyNA8VtzJSmMfUxVaXMG7Bxxsk8I39kr9JC9i-6nzKNnDdU6oRhQp7ZqtKiohXfjlQbWNPD3m3C0";

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

    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
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
