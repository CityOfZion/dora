import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import AddressTransactionMetadata from './AddressTransactionMetadata'

describe('AddressTransactionMetadata', () => {
  test('renders transaction context and fees to four decimal places', () => {
    render(
      <MemoryRouter>
        <AddressTransactionMetadata
          transaction={{
            block: 13312604,
            events: [],
            hash: '0xtransaction',
            invocations: [],
            netfee: '0.00039524',
            notifications: [],
            sender: 'NWfQNiCVdiZP9qWJCfkyDck4qtPrS2xu5d',
            sysfee: '0.038',
            time: 0,
            transfers: [],
            vmstate: 'HALT',
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Block:', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('13312604')).toBeInTheDocument()
    expect(
      screen.getByText('Network Fee:', { exact: false }),
    ).toBeInTheDocument()
    expect(screen.getByText('0.0004 GAS')).toBeInTheDocument()
    expect(
      screen.getByText('System Fee:', { exact: false }),
    ).toBeInTheDocument()
    expect(screen.getByText('0.0380 GAS')).toBeInTheDocument()
  })
})
