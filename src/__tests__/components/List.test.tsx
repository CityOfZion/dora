import React, { ReactElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import List from '../../components/list/List'

function renderWithRouter(ui: any, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

const columns = [
  {
    name: 'Test Label',
    accessor: 'test',
    style: { backgroundColor: 'purple' },
  },
  {
    name: 'Test Label 2',
    accessor: 'test2',
    style: { backgroundColor: 'purple' },
  },
]

type RowType = {
  test: number
  test2: () => ReactElement
}

const data: RowType[] = [
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
]

describe('List Component', () => {
  test('renders without crashing and shows all rows', () => {
    const handleRowClick = vi.fn()

    // Render the List
    renderWithRouter(
      <List
        data-testid="list-container"
        columns={columns}
        data={data}
        rowId="test"
        handleRowClick={handleRowClick}
        isLoading={false}
      />,
    )

    const container = document.querySelector('.data-list')
    expect(container).toBeInTheDocument()

    // Verify all row cells are rendered
    const cells = screen.getAllByText('hello test 2')
    expect(cells.length).toBe(data.length)
  })

  test('calls handleRowClick when a row is clicked', () => {
    const handleRowClick = vi.fn()

    renderWithRouter(
      <List
        columns={columns}
        data={data}
        rowId="test"
        handleRowClick={handleRowClick}
        isLoading={false}
      />,
    )

    // Example: simulate a click on the first row
    const firstRow = screen.getAllByText(data[0].test.toString())[0]
    fireEvent.click(firstRow)

    expect(handleRowClick).toHaveBeenCalledTimes(1)
    expect(handleRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: data[0].test.toString() }),
    )
  })
})
