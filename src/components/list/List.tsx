import React, { ReactText, useRef } from 'react'
import uniqueId from 'lodash/uniqueId'
import classNames from 'classnames'
import {ReactComponent as ArrowSortSVG} from '../../assets/icons/arrow-sort.svg'
import './List.scss'

type ColumnType = {
  name: string
  accessor: string
  style?: {}
}

type ListProps = {
  columns: Array<ColumnType>
  // eslint-disable-next-line
  // @ts-ignore
  data: Array<{ [key: string]: string | number | React.FC<{}>; href?: string }>
  handleRowClick?: (data: {
    [key: string]: string | number | React.FC<{}>
  }) => void
  generateHref?: (data: {
    [key: string]: string | number | React.FC<{}>
  }) => string
  isLoading: boolean
  rowId: string
  withoutPointer?: boolean
  leftBorderColorOnRow?:
    | string
    | ((
        id: string | number | void | React.FC<{}>,
        chain?: string | number | React.FC<{}>,
      ) => string)

  countConfig?: {
    total?: number
    label: string
  }
  orderData?: boolean
}

export const List: React.FC<ListProps> = ({
  columns,
  data,
  handleRowClick,
  generateHref,
  isLoading,
  rowId,
  withoutPointer = false,
  leftBorderColorOnRow = '',
  countConfig,
  orderData
}) => {
  const sortedByAccessor = data.map(data => {
    interface Sorted {
      id: string
      href: string
      [key: string]: string | number | React.FC<{}>
    }

    const sorted = {} as Sorted
    columns.forEach(column => {
      sorted[column.accessor] = data[column.accessor]
      sorted.id = String(data[rowId])
      sorted.href = data.href || '#'
      sorted.chain = data.chain
    })
    return sorted
  })

  const gridstyle = {
    gridTemplateColumns: `repeat(${columns.length}, auto)`,
  }

  const conditionalBorderRadius = (
    index: number,
    shouldReturnBorderLeftStyle?: boolean,
    id?: string | number | React.FC<{}>,
    chain?: string | number | React.FC<{}>,
  ): { borderRadius: string } | undefined => {
    if (!index) {
      const border = {
        borderRadius: '3px 0 0 3px',
        borderLeft: '',
      }
      if (shouldReturnBorderLeftStyle && leftBorderColorOnRow) {
        border.borderLeft = `solid 3px ${
          typeof leftBorderColorOnRow === 'function'
            ? leftBorderColorOnRow(id, chain)
            : leftBorderColorOnRow
        }`
      }
      return border
    }
    if (index === columns.length) {
      const border = {
        borderRadius: '0 3px 3px 0',
      }
      return border
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

  // const [currentHoveredIndex, setCurrentHoveredIndex] = React.useState(-1)

  const renderCellData = (
    isLoading: boolean,
    data: string | number | React.FC<{}>,
  ): ReactText | React.ReactNode => {
    const cellProps = {}
    if (isLoading) return undefined
    if (typeof data === 'function') return data(cellProps)
    return data
  }

  const refArrowButton = useRef<HTMLButtonElement>(null)

  const handleArrowButton = () => {
    alert(refArrowButton.current?.value)
  }

  return (
    <div className="data-list-container">
      {countConfig && (
        <div className="data-list-count-stats">
          {' '}
          {countConfig.label} 1 to {data.length}{' '}
          {!!countConfig.total
            ? `of ${countConfig.total.toLocaleString()}`
            : null}
        </div>
      )}
      <div className="data-list" style={gridstyle}>
        {columns.map((column, i) => (
          <div
            style={{
              ...conditionalBorderRadius(i),
              ...(column.style || {}),
            }}
            className={headerRowClass}
            key={column.name}
          >
            {isLoading ? '' : column.name}
            {orderData ? <button ref={refArrowButton} id={column.name} onClick={(e) => {
              e.preventDefault();
              handleArrowButton()
            }} className="data-list-arrow-sort">
              <ArrowSortSVG/>
            </button> : <></>}
          </div>
        ))}

        {sortedByAccessor.map(
          (
            data: {
              [key: string]: string | number | React.FC<{}>
            },
            index: number,
          ) =>
            Object.keys(data).map((key, i) => {
              const conditionalHref = (): string => {
                if (typeof data.href === 'string' && data.href !== '#') {
                  return data.href
                }
                if (generateHref) {
                  return generateHref(data)
                }
                return '#'
              }

              return (
                key !== 'id' &&
                key !== 'href' &&
                key !== 'chain' &&
                // TODO: this should probably be using the <Link/> component
                (typeof data.href === 'string' || generateHref ? (
                  <a
                    href={conditionalHref()}
                    style={conditionalBorderRadius(
                      i,
                      true,
                      data.id,
                      data.chain,
                    )}
                    onClick={(): void => handleRowClick && handleRowClick(data)}
                    key={uniqueId()}
                    className={rowClass}
                  >
                    {renderCellData(isLoading, data[key])}
                  </a>
                ) : (
                  <div
                    id="non-link-list-cell-container"
                    style={conditionalBorderRadius(
                      i,
                      true,
                      data.id,
                      data.chain,
                    )}
                    onClick={(): void => handleRowClick && handleRowClick(data)}
                    key={uniqueId()}
                    className={rowClass}
                  >
                    {renderCellData(isLoading, data[key])}
                  </div>
                ))
              )
            }),
        )}
      </div>
    </div>
  )
}

export default List
