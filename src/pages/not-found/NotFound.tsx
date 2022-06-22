import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { State as SearchState } from '../../reducers/searchReducer'
import './NotFound.scss'
import Button from '../../components/button/Button'
import { ROUTES } from '../../constants'
import { ReactComponent as NotFoundIllustration } from '../../assets/icons/Illustration.svg'
import { clearSearchInputState } from '../../actions/searchActions'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'

const NotFound: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const searchState = useSelector(
    ({ search }: { search: SearchState }) => search,
  )

  useEffect(() => {
    return (): void => {
      dispatch(clearSearchInputState())
    }
  }, [dispatch])

  return (
    <div id="NotFound" className="page-container">
      <div className="list-wrapper">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: '#',
              label: searchState.error ? 'Search results' : 'Page not found',
              active: true,
            },
          ]}
        />
        <div className="page-title-container">
          {ROUTES.NOT_FOUND.renderIcon()}
          <h1>{ROUTES.NOT_FOUND.name}</h1>
        </div>
        <div id="inner-not-found-page-container">
          {searchState.error && (
            <div className="error-search-results-container">
              <h2>You searched for:{`${' '}`}</h2>
              <h2 id="search-results-terms"> {searchState.searchValue} </h2>
            </div>
          )}
          <NotFoundIllustration />

          <h3>
            Well would you believe it!
            <br />
            <br />
            Unfortunately we didn’t find anything that matched.
          </h3>

          <span>If you think Dora is having a bad day please let us know.</span>
          <div className="load-more-button-container">
            <a href="mailto:contact@coz.io">
              <Button primary={false}>contact us</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
