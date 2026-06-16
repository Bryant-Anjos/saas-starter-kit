import { useEffect } from 'react'

const SITE_URL = (import.meta.env.VITE_PUBLIC_URL as string | undefined) ?? 'https://your-app.example.com'

const DEFAULTS = {
  url: `${SITE_URL}/`,
  title: 'Starter App',
  description: 'A polished SaaS starting point.',
}

function set(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value)
}

interface PageMetaOptions {
  /** Path relative to site root, e.g. "/privacy" */
  path: string
  ogTitle: string
  ogDescription: string
}

/**
 * Updates canonical URL, hreflang links, and Open Graph / Twitter meta tags
 * for the current public page. Restores homepage defaults on unmount.
 */
export function usePageMeta({ path, ogTitle, ogDescription }: PageMetaOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`

    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:title"]', 'content', ogTitle)
    set('meta[property="og:description"]', 'content', ogDescription)
    set('meta[name="twitter:url"]', 'content', url)
    set('meta[name="twitter:title"]', 'content', ogTitle)
    set('meta[name="twitter:description"]', 'content', ogDescription)

    document.querySelectorAll<HTMLLinkElement>('link[hreflang]').forEach(el => {
      el.href = url
    })

    return () => {
      set('link[rel="canonical"]', 'href', DEFAULTS.url)
      set('meta[property="og:url"]', 'content', DEFAULTS.url)
      set('meta[property="og:title"]', 'content', DEFAULTS.title)
      set('meta[property="og:description"]', 'content', DEFAULTS.description)
      set('meta[name="twitter:url"]', 'content', DEFAULTS.url)
      set('meta[name="twitter:title"]', 'content', DEFAULTS.title)
      set('meta[name="twitter:description"]', 'content', DEFAULTS.description)

      document.querySelectorAll<HTMLLinkElement>('link[hreflang]').forEach(el => {
        el.href = DEFAULTS.url
      })
    }
  }, [path, ogTitle, ogDescription])
}
