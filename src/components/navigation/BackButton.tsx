import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Button from '../button/Button'

import './BackButton.scss'

type Props = {
  text: string
  url: string
}

const BackButton: React.FC<Props> = ({ text, url }): ReactElement => {
  const history = useHistory()
  return (
    <div id="BackButton">
      <Button onClick={(): void => history.push(url)}>
        {' '}
        <ChevronLeftIcon /> {text}
      </Button>
    </div>
  )
}

export default BackButton
