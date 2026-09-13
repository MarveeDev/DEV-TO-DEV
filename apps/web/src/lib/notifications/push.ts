'use client';

// Client-side Web Push helpers (Phase 4). These run only in the browser and
// talk to the authenticated backend endpoints under /api/v1/notifications/push.

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function notificationPermission(): NotificationPermission | null {
  if (!pushSupported()) return null;
  return Notification.permission;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function fetchVapidPublicKey(): Promise<string | null> {
  try {
    const res = await fetch('/api/v1/notifications/push/vapid-public-key');
    if (!res.ok) return null;
    const data = await res.json();
    return data.publicKey ?? null;
  } catch {
    return null;
  }
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  try {
    return await navigator.serviceWorker.register('/sw.js');
  } catch {
    return null;
  }
}

async function sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
  await fetch('/api/v1/notifications/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  });
}

/**
 * Requests permission (only when explicitly called by the user), registers the
 * service worker, and creates + persists a push subscription. Returns true on
 * success.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!pushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  const publicKey = await fetchVapidPublicKey();
  if (!publicKey) return false;

  const registration = await registerServiceWorker();
  if (!registration) return false;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await sendSubscriptionToBackend(subscription);
  return true;
}

/** Removes the current subscription from the browser and the backend. */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!pushSupported()) return false;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return false;

  await fetch('/api/v1/notifications/push/subscribe', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });

  await subscription.unsubscribe();
  return true;
}

export async function isPushSubscribed(): Promise<boolean> {
  if (!pushSupported()) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
}
