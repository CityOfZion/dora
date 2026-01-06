import React, { useState } from 'react'
import Check from '@mui/icons-material/Check'
import FileCopy from '@mui/icons-material/FilterNone'
// eslint-disable-next-line
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

import './Copy.scss'

type CopyProps = {
  text: string
}

const Copy: React.FC<CopyProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyText = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text); // modern Clipboard API
      setCopied(true);
      setTimeout(() => setCopied(false), 750);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <span onClick={copyText} style={{ cursor: 'pointer', display: 'inline-flex', width: 19, justifyContent: 'center' }}>
      {copied ? (
        <Check style={{ width: 19, color: '#D355E7' }} />
      ) : (
        <FileCopy id="copy-icon" style={{ width: 16, color: '#D355E7' }} />
      )}
    </span>
  );
};

export default Copy
