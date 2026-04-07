import { getLastPage, usePaginationModel } from '@workday/canvas-kit-react'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

type Params = {
  loadPage: (nextPage: number) => void
  totalCount: number
}

export const usePagination = ({ loadPage, totalCount }: Params) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const perPage = 15
  // Prevents setSearchParams from being called (and pushing to history) when
  // the page change originated from a URL navigation (back/forward button).
  const isSyncingFromUrl = useRef(false)

  const page = Number(searchParams.get('page')) || 1

  const model = usePaginationModel({
    lastPage: Math.max(page, getLastPage(perPage, totalCount)),
    onPageChange: nextPage => {
      if (!isSyncingFromUrl.current) {
        // User-initiated page change: push a new history entry.
        setSearchParams(prev => {
          const next = new URLSearchParams(prev)
          next.set('page', nextPage.toString())
          return next
        })
        loadPage(nextPage)
      }
    },
    initialCurrentPage: page,
  })

  useEffect(() => {
    // When the URL page changes (e.g. browser back/forward), sync the
    // pagination model display without pushing another history entry.
    isSyncingFromUrl.current = true
    model.events.goTo(page)
    isSyncingFromUrl.current = false
  }, [page])

  return {
    perPage,
    page,
    model,
  }
}
