import NotFoundIllustration from '../../assets/icons/Illustration.svg?react'
import ButtonLink from '../button-link/ButtonLink'
import './NoResult.scss'

export const NoResult = () => {
  return (
    <div id="no-result-container">
      <NotFoundIllustration />

      <h3>
        Well would you believe it!
        <br />
        <br />
        Unfortunately we didn’t find anything that matched.
      </h3>

      <span>If you think Dora is having a bad day please let us know.</span>

      <div className="load-more-button-container">
        <ButtonLink
          href="mailto:contact@coz.io"
          lowercase
          style={{ width: 174 }}
          schema="secondary"
        >
          Contact us
        </ButtonLink>
      </div>
    </div>
  )
}
