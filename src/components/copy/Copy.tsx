import React, { useState } from 'react'
import Check from '@material-ui/icons/Check'
import FileCopy from '@material-ui/icons/FilterNone'
// eslint-disable-next-line
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

import './Copy.scss'

type CopyProps = {
  text: string
}

const Copy: React.FC<CopyProps> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const copyText = (): void => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 750)
  }

  return (
    <CopyToClipboard text={text}>
      {copied ? (
        <Check style={{ width: 19, color: '#D355E7' }} />
      ) : (
        <FileCopy
          onClick={copyText}
          id="copy-icon"
          style={{ width: 16, color: '#D355E7' }}
        />
      )}
    </CopyToClipboard>
  )
}

export default Copy
