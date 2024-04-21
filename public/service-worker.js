// service-worker.js
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
    console.log('Service worker installed');
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/src/index.js',
                '/src/App.js',
                '/src/index.css',
                '/src/Components/CarMasterPage.js',
                '/src/Components/CarDetailsPage.js',
                '/src/Components/CarContext.js',
                '/src/Components/UserDetailsPage.js',
                '/src/Components/UserContext.js',
                '/src/Components/UserMasterPage.js',
            ]);
        })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
});

function saveRequestToIndexedDB(request) {
    return new Promise(function (resolve, reject) {
        // Convert ReadableStream to JSON
        // if the request does not have a body, add only the URL and the method
        if (!request.clone().body) {
            const openRequest = indexedDB.open('pendingActions', 1);

            openRequest.onupgradeneeded = function (e) {
                const db = e.target.result;
                db.createObjectStore('actions', {autoIncrement: true, keyPath: 'id'});
            };

            openRequest.onsuccess = function (e) {
                const db = e.target.result;
                const transaction = db.transaction(['actions'], 'readwrite');
                const objectStore = transaction.objectStore('actions');

                // Save the request in the IndexedDB
                console.log('Saving the request to the IndexedDB', request.url, request.method);
                const saveRequest = objectStore.add({
                    url: request.url,
                    method: request.method
                });

                saveRequest.onsuccess = function () {
                    resolve();
                };

                saveRequest.onerror = function () {
                    reject();
                };
            };

            openRequest.onerror = function () {
                reject();
            };
            return;
        }
        request.clone().json().then((body) => {
            // Open the IndexedDB
            const openRequest = indexedDB.open('pendingActions', 1);

            openRequest.onupgradeneeded = function (e) {
                const db = e.target.result;
                db.createObjectStore('actions', {autoIncrement: true, keyPath: 'id'});
            };

            openRequest.onsuccess = function (e) {
                const db = e.target.result;
                const transaction = db.transaction(['actions'], 'readwrite');
                const objectStore = transaction.objectStore('actions');

                // Save the request in the IndexedDB
                console.log('Saving the request to the IndexedDB', request.url, request.method, body);
                const saveRequest = objectStore.add({
                    url: request.url,
                    method: request.method,
                    data: body
                });

                saveRequest.onsuccess = function () {
                    resolve();
                };

                saveRequest.onerror = function () {
                    reject();
                };
            };

            openRequest.onerror = function () {
                reject();
            };
        });
    });
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    // We got a response from the server.
                    const resClone = res.clone();
                    // Open a new cache
                    caches.open('v1').then((cache) => {
                        // Put the fetched response in the cache
                        console.log('Caching the response for', event.request.url)
                        cache.put(event.request, resClone);
                    });
                    return res;
                })
                .catch((err) => {
                    // Network request failed, try to get it from the cache.
                    console.log('Network request failed, trying to get the response from the cache for', event.request.url);
                    return caches.match(event.request);
                })
        );
    }
    if (event.request.method !== 'GET') {
        event.respondWith(
            fetch(event.request.clone())
                .catch((error) => {
                    // Generate a temporary ID for the user
                    const tempId = Date.now().toString();
                    return saveRequestToIndexedDB(event.request)
                        .then(() => {
                            return new Response(JSON.stringify({
                                message: 'The request has been saved and will be re-sent when the connection is restored.',
                                id: tempId
                            }), {
                                headers: {'Content-Type': 'application/json'}
                            });
                        });
                })
        );
    }
});


function syncPendingActions() {
    return new Promise(function (resolve, reject) {
        // Get the pending actions from the IndexedDB
        const openRequest = indexedDB.open('pendingActions', 1);

        openRequest.onsuccess = function (e) {
            const db = e.target.result;
            const transaction = db.transaction(['actions'], 'readonly');
            const objectStore = transaction.objectStore('actions');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function (e) {
                const actions = e.target.result;

                // Try to send all the pending actions to the server
                Promise.all(actions.map(function (action) {
                    console.log('Re-sending the request to the server', action.url, action.method, JSON.stringify(action.data));
                    return fetch(`${action.url}`, {
                        method: action.method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(action.data)
                    });
                })).then(function () {
                    // If all the requests were successful, clear the actions store
                    const transaction = db.transaction(['actions'], 'readwrite');
                    const objectStore = transaction.objectStore('actions');
                    const clearRequest = objectStore.clear();

                    clearRequest.onsuccess = function () {
                        resolve();
                    };
                    clearRequest.onerror = function () {
                        reject(new Error('Failed to clear the actions store'));
                    };
                }).catch(function (error) {
                    console.error('Failed to re-send the request to the server', error);
                    reject(new Error('Failed to re-send the request to the server: ' + error.message));
                });
            };

            getAllRequest.onerror = function () {
                reject(new Error('Failed to get the pending actions'));
            };
        };

        openRequest.onerror = function () {
            reject();
        };
    });
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('sync', function (event) {
    if (event.tag === 'syncPendingActions') {
        event.waitUntil(syncPendingActions());
    }
});