import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import Neo2 from '../../../../assets/icons/neo2.svg'
import Neo3 from '../../../../assets/icons/neo3.svg'
import { fetchTransaction } from './AddressTransactionService'
import './AddressTransactions.scss'
import { AddressTransaction } from './AddressTransaction'
import Button from '../../../../components/button/Button'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import useWindowWidth from '../../../../hooks/useWindowWidth'
import TransactionTime from './fragments/TransactionTime'
import AddressTransactionMobileRow from './fragments/AddressTransactionMobileRow'
import { ROUTES } from '../../../../constants'
import AddressTransactionTransfer from './fragments/AddressTransactionTransferRow'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressTransactions: React.FC<Props> = (props: Props) => {
  const { chain, network, hash } = props.match.params
  const [transactions, setTransactions] = useState([] as AddressTransaction[])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const width = useWindowWidth()

  const isMobileOrTablet = width <= 1200

  const populateRecords = (items: AddressTransaction[]) => {
    setTransactions([...transactions, ...items])
    setIsLoading(false)
  }

  const loadMore = (): void => {
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    setIsLoading(true)
    const populate = async () => {
      const { items = [], totalCount } = await fetchTransaction(
        hash,
        currentPage,
      )

      populateRecords(items)
      if (pages === 0 && items.length > 0) {
        setPages(Math.ceil(totalCount / items.length))
      }
    }

    if (hash) {
      populate()
    }
  }, [chain, network, hash, currentPage])

  return (
    <div
      id="addressTransactions"
      className="page-container address-transactions"
    >
      <div className="address-transactions__table">
        {transactions.length > 0
          ? transactions.map(it => {
              return (
                <div key={it.hash} className="address-transactions__table--row">
                  {!isMobileOrTablet && (
                    <div className="address-transactions__table--chain">
                      <div className="address-transactions__table--logo">
                        {chain === 'neo2' ? (
                          <img src={Neo2} alt="token-logo" />
                        ) : (
                          <img src={Neo3} alt="token-logo" />
                        )}
                      </div>
                      <div>{chain === 'neo2' ? 'Neo Legacy' : 'Neo N3'}</div>
                    </div>
                  )}
                  <div className="address-transactions__table--content">
                    <div className="address-transactions__table--hash">
                      {isMobileOrTablet ? (
                        <div className="horiz">
                          <div className="address-transactions__table--logo">
                            {chain === 'neo2' ? (
                              <img src={Neo2} alt="token-logo" />
                            ) : (
                              <img src={Neo3} alt="token-logo" />
                            )}
                          </div>
                          <div>
                            {chain === 'neo2' ? 'Neo Legacy' : 'Neo N3'}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="horiz">
                            <label>ID</label>{' '}
                            <Link
                              className="hash"
                              to={`${ROUTES.TRANSACTION.url}/${chain}/${network}/${it.hash}`}
                            >
                              <span>{it.hash}</span>
                            </Link>
                          </div>
                          <TransactionTime time={it.time} />
                        </>
                      )}
                    </div>

                    <div
                      className={
                        isMobileOrTablet
                          ? 'verti address-transactions__table--transfers'
                          : 'address-transactions__table--transfers'
                      }
                    >
                      {isMobileOrTablet ? (
                        <AddressTransactionMobileRow
                          transaction={it}
                          chain={chain}
                          network={network}
                        />
                      ) : (
                        <AddressTransactionTransfer
                          transfers={it.transfers}
                          chain={chain}
                          network={network}
                        />
                      )}
                      <div className="horiz weight-1">
                        <div className="address-transactions__table--balloon">
                          Notifications: <span>{it.notifications.length}</span>
                        </div>
                        <div className="address-transactions__table--balloon">
                          Invocations: <span>{it.invocations.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          : !isLoading && (
              <div className="horiz justify-center">
                <p>not found transactions</p>
              </div>
            )}

        {isLoading && (
          <SkeletonTheme
            color="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton count={15} style={{ margin: '5px 0', height: '100px' }} />
          </SkeletonTheme>
        )}

        {currentPage < pages && (
          <div className="load-more-button-container">
            <Button disabled={isLoading} primary={false} onClick={loadMore}>
              load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default withRouter(AddressTransactions)
