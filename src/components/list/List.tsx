import React, { ReactText } from 'react'
import uniqueId from 'lodash/uniqueId'
import classNames from 'classnames'
import { ReactComponent as ArrowSortSVG } from '../../assets/icons/arrow-sort.svg'
import { SORT_OPTION } from '../../reducers/nodeReducer'
import './List.scss'
import { Link } from 'react-router-dom'

interface HeaderCell {
  styleHeader?: React.CSSProperties
  classNameHeader?: string
  nameColumn?: React.Key | null
  isLoading?: boolean
  orderData?: boolean
  sortOpt?: SORT_OPTION
  callbalOrderData?: (field: SORT_OPTION) => void
}
const HeaderCell: React.FC<HeaderCell> = ({
  styleHeader,
  classNameHeader,
  nameColumn,
  isLoading,
  orderData,
  sortOpt,
  callbalOrderData,
}) => {
  return (
    <div
      style={styleHeader}
      className={`${classNameHeader} header-cell-container`}
      key={nameColumn}
      onClick={(e): void => {
        e.preventDefault()
        callbalOrderData && sortOpt && callbalOrderData(sortOpt)
      }}
    >
      {isLoading ? '' : nameColumn}
      {orderData ? (
        <div className="data-list-arrow-sort">
          <ArrowSortSVG />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export type ColumnType = {
  name: string
  accessor: string
  style?: {}
  sortOpt?: SORT_OPTION
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
  callbalOrderData?: (nameColumn: SORT_OPTION) => void
  paddingCell?: { paddingValue: string; indexesColumns: number[] }
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
  orderData,
  callbalOrderData,
  paddingCell,
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

  const adjustPaddingStyle = (
    index: number,
  ):
    | {
        padding: string
      }
    | undefined => {
    if (paddingCell) {
      const verify = paddingCell.indexesColumns.find(
        indexColumn => indexColumn === index,
      )
      if (typeof verify !== 'undefined' && verify >= 0) {
        return {
          padding: paddingCell.paddingValue,
        }
      }
    }
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

  return (
    <div className="data-list-container">
      {countConfig && <div className="data-list-count-stats"> </div>}
      <div className="data-list" style={gridstyle}>
        {columns.map((column, i) => {
          return orderData ? (
            <HeaderCell
              classNameHeader={headerRowClass}
              styleHeader={{
                ...conditionalBorderRadius(i),
                ...(column.style || {}),
              }}
              key={column.name}
              nameColumn={column.name}
              isLoading={isLoading}
              orderData={orderData}
              sortOpt={column.sortOpt}
              callbalOrderData={callbalOrderData}
            />
          ) : (
            <div
              style={{
                ...conditionalBorderRadius(i),
                ...(column.style || {}),
              }}
              className={headerRowClass}
              key={column.name}
            >
              {isLoading ? '' : column.name}
            </div>
          )
        })}

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

              return !paddingCell
                ? key !== 'id' &&
                    key !== 'href' &&
                    key !== 'chain' &&
                    (typeof data.href === 'string' || generateHref ? (
                      <Link
                        to={conditionalHref()}
                        style={conditionalBorderRadius(
                          i,
                          true,
                          data.id,
                          data.chain,
                        )}
                        onClick={(): void =>
                          handleRowClick && handleRowClick(data)
                        }
                        key={uniqueId()}
                        className={rowClass}
                      >
                        {renderCellData(isLoading, data[key])}
                      </Link>
                    ) : (
                      <div
                        id="non-link-list-cell-container"
                        style={conditionalBorderRadius(
                          i,
                          true,
                          data.id,
                          data.chain,
                        )}
                        onClick={(): void =>
                          handleRowClick && handleRowClick(data)
                        }
                        key={uniqueId()}
                        className={rowClass}
                      >
                        {renderCellData(isLoading, data[key])}
                      </div>
                    ))
                : key !== 'id' &&
                    key !== 'href' &&
                    key !== 'chain' &&
                    (!data.href.toString().startsWith('#') || generateHref ? (
                      <Link
                        to={conditionalHref()}
                        style={{
                          ...conditionalBorderRadius(
                            i,
                            true,
                            data.id,
                            data.chain,
                          ),
                          ...adjustPaddingStyle(i),
                        }}
                        onClick={(): void =>
                          handleRowClick && handleRowClick(data)
                        }
                        key={uniqueId()}
                        className={rowClass}
                      >
                        {renderCellData(isLoading, data[key])}
                      </Link>
                    ) : (
                      <div
                        id="non-link-list-cell-container"
                        style={conditionalBorderRadius(
                          i,
                          true,
                          data.id,
                          data.chain,
                        )}
                        onClick={(): void =>
                          handleRowClick && handleRowClick(data)
                        }
                        key={uniqueId()}
                        className={rowClass}
                      >
                        {renderCellData(isLoading, data[key])}
                      </div>
                    ))
            }),
        )}
      </div>
    </div>
  )
}

export default List
