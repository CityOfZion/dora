import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'

import Manifest from './Manifest'
import { ContractManifest } from './manifestUtils'

const manifest: ContractManifest = {
  abi: {
    methods: [
      {
        name: '_deploy',
        parameters: [
          { name: 'data', type: 'Any' },
          { name: 'update', type: 'Boolean' },
        ],
        returntype: 'Void',
        offset: 0,
        safe: false,
      },
      {
        name: 'totalGames',
        parameters: [],
        returntype: 'Integer',
        offset: 10,
        safe: true,
      },
      {
        name: 'getGameJSON',
        parameters: [{ name: 'game_id', type: 'Integer' }],
        returntype: 'Map',
        offset: 20,
        safe: true,
      },
      {
        name: 'createGame',
        parameters: [],
        returntype: 'Integer',
        offset: 30,
        safe: false,
      },
      {
        name: 'purchaseProperty',
        parameters: [
          { name: 'game_id', type: 'Integer' },
          { name: 'property_id', type: 'Integer' },
          { name: 'auth_payload', type: 'Array' },
        ],
        returntype: 'Integer',
        offset: 40,
        safe: false,
      },
    ],
    events: [
      {
        name: 'PropertyUpdate',
        parameters: [{ name: 'property_id', type: 'Integer' }],
      },
      {
        name: 'GameUpdate',
        parameters: [{ name: 'game_id', type: 'Integer' }],
      },
    ],
  },
}

const signatureNames = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('.sig-name')).map(
    el => el.textContent ?? '',
  )

const groupNames = (title: string): string[] => {
  const group = screen.getByText(title).closest('.manifest-group')
  return signatureNames(group as HTMLElement)
}

const renderExpanded = (): ReturnType<typeof render> => {
  const result = render(<Manifest manifest={manifest} />)
  fireEvent.click(screen.getByRole('button', { name: 'Expand methods' }))
  fireEvent.click(screen.getByRole('button', { name: 'Expand events' }))
  return result
}

describe('Manifest', () => {
  test('groups methods by safe flag and system callbacks', () => {
    renderExpanded()

    expect(groupNames('Read-only')).toEqual(['totalGames', 'getGameJSON'])
    expect(groupNames('State-changing')).toEqual([
      'createGame',
      'purchaseProperty',
    ])
    expect(groupNames('System callbacks')).toEqual(['_deploy'])
  })

  test('renders signatures with parameters and return types', () => {
    const { container } = renderExpanded()
    const row = screen
      .getAllByText('purchaseProperty')[0]
      .closest('li') as HTMLElement

    expect(within(row).getByText('auth_payload')).toBeInTheDocument()
    expect(within(row).getAllByText('Array')[0]).toHaveClass(
      'sig-type--collection',
    )
    expect(
      screen.getByRole('button', { name: 'Copy purchaseProperty signature' }),
    ).toBeInTheDocument()
    expect(signatureNames(container)).toContain('GameUpdate')
  })

  test('search filters methods and events by name or parameter', () => {
    const { container } = renderExpanded()

    fireEvent.change(screen.getByLabelText('Search methods and events'), {
      target: { value: 'property_id' },
    })

    expect(signatureNames(container)).toEqual([
      'purchaseProperty',
      'PropertyUpdate',
    ])
    expect(container.querySelector('mark')).toHaveTextContent('property_id')
    expect(screen.getByText('1 of 5')).toBeInTheDocument()
  })

  test('shows an empty state when nothing matches', () => {
    renderExpanded()

    fireEvent.change(screen.getByLabelText('Search methods and events'), {
      target: { value: 'nothing-here' },
    })

    expect(
      screen.getByText('No methods or parameters match “nothing-here”.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('No events or parameters match “nothing-here”.'),
    ).toBeInTheDocument()
  })

  test('sorts methods and events alphabetically on request', () => {
    renderExpanded()

    fireEvent.click(screen.getByRole('button', { name: 'A–Z' }))

    expect(groupNames('Read-only')).toEqual(['getGameJSON', 'totalGames'])
    expect(
      signatureNames(document.getElementById('manifest-events') as HTMLElement),
    ).toEqual(['GameUpdate', 'PropertyUpdate'])
  })

  test('starts collapsed and expands or collapses each section', () => {
    render(<Manifest manifest={manifest} />)

    expect(screen.queryByText('Read-only')).not.toBeInTheDocument()
    expect(document.getElementById('manifest-events')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Expand methods' }))
    fireEvent.click(screen.getByRole('button', { name: 'Expand events' }))
    expect(screen.getByText('Read-only')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Collapse methods' }))
    expect(screen.queryByText('Read-only')).not.toBeInTheDocument()
    expect(document.getElementById('manifest-events')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Collapse events' }))
    expect(document.getElementById('manifest-events')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Expand methods' }))
    expect(screen.getByText('Read-only')).toBeInTheDocument()
  })

  test('shows search and sort only while methods are expanded', () => {
    render(<Manifest manifest={manifest} />)
    expect(
      screen.queryByLabelText('Search methods and events'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'A–Z' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Expand methods' }))
    fireEvent.change(screen.getByLabelText('Search methods and events'), {
      target: { value: 'property_id' },
    })
    expect(screen.getByText('1 of 5')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Collapse methods' }))
    expect(
      screen.queryByLabelText('Search methods and events'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('1 of 5')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Expand methods' }))
    expect(screen.getByLabelText('Search methods and events')).toHaveValue('')
  })
})
