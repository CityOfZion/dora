import React, { useState } from 'react'
import Check from '@mui/icons-material/Check'
import FileCopy from '@mui/icons-material/FilterNone'
import './Copy.scss'
import Button from '../button/Button'

type CopyProps = {
  text: string
}

const Copy: React.FC<CopyProps> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const copyText = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 750)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button onClick={copyText} variant="icon" aria-label="Copy">
      {copied ? (
        <Check style={{ width: 19, color: '#D355E7' }} aria-hidden="true" />
      ) : (
        <FileCopy
          id="copy-icon"
          style={{ width: 16, color: '#D355E7' }}
          aria-hidden="true"
        />
      )}
    </Button>
  )
}

export default Copy
