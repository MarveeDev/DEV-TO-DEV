/* DEV-TO-DEV service worker — Web Push (Phase 4). */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  const title = data.title || 'DEV-TO-DEV';
  const options = {
    body: data.body || '',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: data.tag || undefined,
    data: {
      url: data.data && data.data.url ? data.data.url : '/notifications',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) || '/notifications';

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if ('focus' in client) {
          if (client.navigate) {
            await client.navigate(targetUrl).catch(() => {});
          }
          await client.focus();
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })(),
  );
});
