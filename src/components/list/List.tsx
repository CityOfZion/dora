import React, { ReactElement } from 'react'
import { uniqueId } from 'lodash-es'
import classNames from 'classnames'

import './List.scss'

type ColumnType = {
  name: string
  accessor: string
  style?: {}
}

type ListProps = {
  columns: Array<ColumnType>
  data: Array<{ [key: string]: string | number | Array<string> }>
  handleRowClick: (data: {}) => void
  isLoading: boolean
  rowId: string
  withoutPointer?: boolean
}

export const List = ({
  columns,
  data,
  handleRowClick,
  isLoading,
  rowId,
  withoutPointer = false,
}: ListProps): ReactElement => {
  const sortedByAccessor = data.map(data => {
    interface Sorted {
      id: string | number | Array<string>
      [key: string]: string | number | Array<string>
    }
    const sorted = {} as Sorted
    columns.forEach(column => {
      sorted[column.accessor] = data[column.accessor]
      sorted.id = data[rowId]
    })
    return sorted
  })

  const gridstyle = {
    gridTemplateColumns: `repeat(${columns.length}, auto)`,
  }

  const conditionalBorderRadius = (
    index: number,
  ): { borderRadius: string } | undefined => {
    if (!index)
      return {
        borderRadius: '3px 0 0 3px',
      }
    if (index === columns.length)
      return {
        borderRadius: '0 3px 3px 0',
      }
    return undefined
  }

  const rowClass = classNames({
    'loading-table-row': isLoading,
    'without-pointer-cursor': withoutPointer,
  })

  const headerRowClass = classNames({
    'loading-table-row': isLoading,
    'data-list-column': true,
  })

  const [currentHoveredIndex, setCurrentHoveredIndex] = React.useState(-1)

  return (
    <div className="data-list-container">
      <div className="data-list" style={gridstyle}>
        {columns.map((column, i) => (
          <div
            style={{ ...conditionalBorderRadius(i), ...(column.style || {}) }}
            className={headerRowClass}
            key={column.name}
          >
            {isLoading ? '' : column.name}
          </div>
        ))}

        {sortedByAccessor.map(
          (
            data: { [key: string]: string | number | Array<string> },
            index: number,
          ) =>
            Object.keys(data).map((key, i) => {
              const hoveredClassName = `cellhovered + ${rowClass}`
              return (
                key !== 'id' && (
                  <span
                    style={conditionalBorderRadius(i)}
                    onClick={(): void => handleRowClick && handleRowClick(data)}
                    key={uniqueId()}
                    className={
                      currentHoveredIndex === index
                        ? hoveredClassName
                        : rowClass
                    }
                    onMouseEnter={(): void => setCurrentHoveredIndex(index)}
                    onMouseLeave={(): void => setCurrentHoveredIndex(-1)}
                  >
                    {isLoading ? '' : data[key]}
                  </span>
                )
              )
            }),
        )}
      </div>
    </div>
  )
}

export default List
