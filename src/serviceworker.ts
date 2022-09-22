const fetchThenCache = async (request: RequestInfo) => {
	const [responseFromNetwork, cache] = await Promise.all([
		fetch(request),
		caches.open("v1"),
	]);
	// response may be used only once
	// we need to save clone to put one copy in cache
	// and serve second one
	await cache.put(request, responseFromNetwork.clone());
	return responseFromNetwork;
};

const networkFirst = async (request: RequestInfo) =>
	// First try to get the resource from the network
	fetchThenCache(request)
		// Then try the cache
		.catch(() => caches.match(request))
		.then(
			(cacheResponse) =>
				cacheResponse ??
				// Finally we have to respond with something...
				new Response("Network error happened", {
					status: 408,
					headers: { "Content-Type": "text/plain" },
				})
		);

self.addEventListener("install", (event) => {
	// At time of writing TS does not have good support for the InstallEvent type
	const installEvent = event as Event & {
		waitUntil: (promise: Promise<unknown>) => unknown;
	};
	installEvent.waitUntil(
		caches
			.open("v1")
			.then((cache) =>
				cache.addAll([
					"/learn-braille/",
					"/learn-braille/index.html",
					"/learn-braille/index.js",
					"/learn-braille/styles.css",
				])
			)
	);
});

/**
 * Listen for request events
 */
self.addEventListener("fetch", (event) => {
	// At time of writing TS does not have good support for the FetchEvent type
	const fetchEvent = event as Event & {
		request: RequestInfo;
		respondWith: (response: Response | Promise<Response>) => void;
	};
	fetchEvent.respondWith(networkFirst(fetchEvent.request));
});
