addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

const BUCKET_NAME = "image-repo-charles"
const BUCKET_URL = `http://storage.googleapis.com/${BUCKET_NAME}`

async function serveAsset(event) {
  const url = new URL(event.request.url)
  const cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    response = await fetch(`${BUCKET_URL}${url.pathname}`)
    const headers = { "cache-control": "public, max-age=144000"}
    response = new Response(response.body, { ...response, headers })
    event.waitUntil(cache.put(event.request, response.clone()))
  }

  return response
}
/**
 * @param {event} event
 */
async function handleRequest(event) {
  if (event.request.method === "GET") {
    let response = await serveAsset(event)
    if (response.status >= 400) {
      response = new Response(response.statusText, { status: response.status })
    }
    return response
  } else {
    return new Response("Method not allowed", { status: 405 })
  }
}
