import { useEffect } from 'react'
import { useT } from '../i18n'

export function usePageTitle(title?: string) {
  const t = useT()
  const home = t('meta.title')
  useEffect(() => {
    document.title = title ? `${title} — United IT Clubs` : home
  }, [title, home])
}
