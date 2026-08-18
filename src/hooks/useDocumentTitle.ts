import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useDocumentTitle = (titles?: string[]): void => {
  const { pathname } = useLocation()

  useEffect(() => {
    let title = 'Dora'
    const filteredTitles = titles?.filter(Boolean)

    const label =
      filteredTitles && filteredTitles.length > 0
        ? `${filteredTitles.map(currentTitle => (/^\d+$/.test(currentTitle) ? `#${currentTitle}` : currentTitle)).join(' - ')} | `
        : ''

    title = `${label}${title}`

    document.title = title
  }, [pathname, titles])
}

export default useDocumentTitle
