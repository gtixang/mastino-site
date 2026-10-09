// Демо без сервис-воркера: этот файл «выключает» старый воркер, который уже стоит в браузере
// у тех, кто открывал демо раньше (он показывал сохранённую старую версию сайта).
// Браузер замечает, что ngsw-worker.js изменился, ставит этот файл, и он:
// удаляет сохранённые копии сайта, снимает себя и один раз перезагружает открытые вкладки.
// Сама демо-сборка воркер не регистрирует (DEMO_BUILD в core/demo), поэтому повторов нет.
// На основе safety-worker.js из @angular/service-worker.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name.startsWith('ngsw:')).map((name) => caches.delete(name)),
      );
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) {
        client.navigate(client.url);
      }
    })(),
  );
});
