import { useEffect } from 'react'

const DEFAULT_TITLE = 'Starter App'

export function usePageTitle(title = DEFAULT_TITLE) {
  useEffect(() => {
    document.title = title
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}
