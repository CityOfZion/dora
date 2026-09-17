import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import AddressTransactionNotificationEvent from './AddressTransactionNotificationEvent'

describe('AddressTransactionNotificationEvent', () => {
  test('presents a contract notification with its labeled fields', () => {
    render(
      <MemoryRouter>
        <AddressTransactionNotificationEvent
          event={{
            contractHash: '0xe874a4e395b13f4f4229ce5f807666fb14992428',
            contractName: 'Monopoly',
            type: 'PropertyPurchase',
            fields: [
              { label: 'Game ID', value: '1' },
              { label: 'Cost', value: '25' },
            ],
          }}
          chain="neo3"
          network="mainnet"
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('PropertyPurchase')).toBeInTheDocument()
    expect(screen.getByText('Monopoly')).toBeInTheDocument()
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Cost')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
