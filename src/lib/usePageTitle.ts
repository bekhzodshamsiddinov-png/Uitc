import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — United IT Clubs` : 'United IT Clubs — IT akademiya, Namangan'
  }, [title])
}
