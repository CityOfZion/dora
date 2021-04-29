import React, { createContext, useState } from 'react'

export type TFilterName = 'N3' | 'N2' | 'Default' | 'testnet' | 'mainnet'

export type MonitorContent = {
  showMessage: boolean
  message: string
  filterName: TFilterName
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  setFilterName: React.Dispatch<React.SetStateAction<TFilterName>>
}

export const MonitorContext = createContext({} as MonitorContent)

export const MonitorProvider: React.FC = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [filterName, setFilterName] = useState<TFilterName>('N3')

  return (
    <MonitorContext.Provider
      value={{
        message,
        showMessage,
        filterName,
        setMessage,
        setShowMessage,
        setFilterName,
      }}
    >
      {children}
    </MonitorContext.Provider>
  )
}
