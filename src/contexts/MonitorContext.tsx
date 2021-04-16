import React, { createContext, useState } from 'react'

export type MonitorContent = {
  showMessage: boolean
  message: string
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

export const MonitorContext = createContext({} as MonitorContent)

export const MonitorProvider: React.FC = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <MonitorContext.Provider
      value={{ message, showMessage, setMessage, setShowMessage }}
    >
      {children}
    </MonitorContext.Provider>
  )
}
