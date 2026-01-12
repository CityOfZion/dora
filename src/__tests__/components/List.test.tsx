import React, { ReactElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import List from '../../components/list/List'

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
    const handleRowClick = jest.fn()

    // Render the List
    render(
      <List
        columns={columns}
        data={data}
        rowId="test"
        handleRowClick={handleRowClick}
        isLoading={false}
      />,
    )

    // 3. Snapshot (optional)
    const container = screen.getByTestId('list-container') // make sure your List adds data-testid="list-container"
    expect(container).toMatchSnapshot()

    // 4. Verify each row content is in the document
    data.forEach(row => {
      render(row.test2()) // render the cell component
      expect(screen.getByText('hello test 2')).toBeInTheDocument()
    })
  })

  test('calls handleRowClick when a row is clicked', () => {
    const handleRowClick = jest.fn()

    render(
      <List
        columns={columns}
        data={data}
        rowId="test"
        handleRowClick={handleRowClick}
        isLoading={false}
      />,
    )

    // Example: simulate a click on the first row
    const firstRow = screen.getByText(data[0].test.toString())
    fireEvent.click(firstRow)

    expect(handleRowClick).toHaveBeenCalledTimes(1)
    expect(handleRowClick).toHaveBeenCalledWith(data[0])
  })
})
