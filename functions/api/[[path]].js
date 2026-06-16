/**
 * Cloudflare Pages Function — reverse proxy for /api/* → Railway API.
 *
 * Set the environment variable API_URL in the Cloudflare Pages dashboard to
 * the Railway service URL (e.g. https://your-api.up.railway.app).
 *
 * All headers (including Cookie/Set-Cookie) are forwarded transparently so
 * the httpOnly session cookie works correctly across the proxy.
 */
export async function onRequest({ request, env }) {
  if (!env.API_URL) {
    return new Response(JSON.stringify({ error: 'API_URL env var is not set in Cloudflare Pages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(request.url)
  const upstream = env.API_URL.replace(/\/$/, '')

  try {
    const upstreamUrl = `${upstream}${url.pathname}${url.search}`
    return await fetch(new Request(upstreamUrl, request))
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
