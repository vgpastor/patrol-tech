importScripts('./ngsw-worker.js');

self.addEventListener('sync', function(event) {
  console.log("Evento de sincronización:", event, event.tag === 'sync-scans');
  if (event.tag === 'sync-scans') {
    event.waitUntil(syncScans().catch(error => {
      console.error('Sync Task failed:', error);
    }));
  }
});


async function syncScans() {
  let db;
  try {
    console.log('Sincronizando scans...');
    db = await openDB('sync-db','sync-scans');
    const records = await getAllRecords(db, 'sync-scans');

    if (records.length === 0) {
      console.log('No records found to sync');
      return;
    }

    console.log('Scans pendientes:', records.length);
    for (const record of records) {
      console.log("Scan sincronizado init:", record);

      const result = await fetch('https://api.patroltech.online/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record.data),
      });

      if (result.ok) {
        await deleteRecord(db, 'sync-scans', record.id);
        console.log("Scan sincronizado y borrado:", record);
        continue;
      }
      throw new Error('Error al sincronizar el scan', record);
    }

    // Notificar a la aplicación principal que la sincronización ha terminado
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({type: 'SYNC_COMPLETED'}));
    });
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    throw error;
  }
}

// Llamar a la función de sincronización al iniciar el service worker y cada minuto
self.addEventListener('install', (event) => {
  console.log('Service worker personalizado instalado');
  event.waitUntil(syncScans());
//   Prevent other service workers to install
  self.skipWaiting();
});

// Escuchar mensajes de la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_SCANS') {
    syncScans();
  }
});



function openDB(name,storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);

    request.onerror = event => reject('Error opening database');

    request.onsuccess = event => resolve(event.target.result);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      // Crea el object store si no existe
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

function getRecord(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onerror = event => reject('Error fetching record');

    request.onsuccess = event => {
      const record = event.target.result;
      resolve(record);
    };
  });
}

function getAllRecords(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = event => reject('Error fetching records');

    request.onsuccess = event => {
      const records = event.target.result;
      resolve(records);
    };
  });
}

function deleteRecord(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = event => reject('Error deleting record');

    request.onsuccess = event => resolve();
  });
}


self.addEventListener('periodicsync', (event) => {
  console.log("Evento de sincronización periódica:", event, event.tag);
  if (event.tag === 'login-sync') {
    event.waitUntil(loginSync());
  }
});

async function loginSync() {
  localStorage.removeItem('patrollerIdentifier');
}



const CACHE_NAME = 'api-cache-v1';
const API_BASE_URL = 'https://api.patroltech.online/api/';

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(API_BASE_URL) && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

          // Estrategia "stale-while-revalidate":
          // Devuelve la caché inmediatamente si existe, pero actualiza la caché en segundo plano
          return cachedResponse || fetchPromise;
        }).catch(() => {
          // Si no hay caché y la red falla, devuelve una respuesta de error
          return new Response(JSON.stringify({ error: 'No data available' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
    );
  }
});

// Limpieza de caché antigua
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

