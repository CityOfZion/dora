import NotFoundIllustration from '../../assets/icons/Illustration.svg?react'
import Button from '../button/Button'
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
        <a href="mailto:contact@coz.io">
          <Button primary={false}>contact us</Button>
        </a>
      </div>
    </div>
  )
}
