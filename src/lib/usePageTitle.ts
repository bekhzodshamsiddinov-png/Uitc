import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — UITC` : 'UITC — Online IT Akademiya'
  }, [title])
}
