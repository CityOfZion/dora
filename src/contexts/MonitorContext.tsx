import React, { createContext, useState } from 'react'

export type MonitorContent = {
  showMessage: boolean
  message: string
  stopRender: boolean
  protocol: string
  network: string
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  setStopRender: React.Dispatch<React.SetStateAction<boolean>>
  setProtocol: React.Dispatch<React.SetStateAction<string>>
  setNetwork: React.Dispatch<React.SetStateAction<string>>
}

export const MonitorContext = createContext({} as MonitorContent)

export const MonitorProvider: React.FC = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [stopRender, setStopRender] = useState<boolean>(false)
  const [protocol, setProtocol] = useState<string>('all')
  const [network, setNetwork] = useState<string>('all')

  return (
    <MonitorContext.Provider
      value={{
        message,
        showMessage,
        stopRender,
        protocol,
        network,
        setMessage,
        setShowMessage,
        setStopRender,
        setProtocol,
        setNetwork,
      }}
    >
      {children}
    </MonitorContext.Provider>
  )
}
