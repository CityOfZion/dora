import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import AddressTransactionTransferEvent from './AddressTransactionTransferEvent'

describe('AddressTransactionTransferEvent', () => {
  test('presents transfer data as labeled event details', () => {
    render(
      <MemoryRouter>
        <AddressTransactionTransferEvent
          transfer={{
            from: 'NZFMvLj6mxTHEn8gRGrjZDeFCDMTm96p6R',
            to: 'NN8tbpgAx8zm5BNJZEqvi71Rj2Z8LX2RHh',
            scripthash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
            amount: 40,
            symbol: 'GAS',
            type: 'NEP-17 Transfer',
          }}
          notifications={[]}
          chain="neo3"
          network="mainnet"
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('NEP-17 Transfer')).toBeInTheDocument()
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
    expect(screen.getByText('Symbol')).toBeInTheDocument()
    expect(screen.getByText('GAS')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
  })
})
