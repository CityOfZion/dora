import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom'
import { fetchTransaction } from './AddressTransactionService'
import './AddressTransactions.scss'
import {
  AddressTransaction,
  Notification,
  Transfer,
} from './AddressTransaction'
import Button from '../../../../components/button/Button'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { byteStringToAddress, ROUTES } from '../../../../constants'
import { convertToArbitraryDecimals } from '../../../../utils/formatter'
import AddressTransactionsCard from './fragments/AddressTransactionCard'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'
import { getNetworkAndProtocol } from '../../../../utils/chain'
import { NeoLegacyREST, NeoRest } from '@cityofzion/dora-ts/dist/api'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressTransactions: React.FC<Props> = (props: Props) => {
  const { chain, network, hash } = props.match.params
  useUpdateNetworkState(props)
  const [transactions, setTransactions] = useState([] as AddressTransaction[])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const populateRecords = (items: AddressTransaction[]) => {
    setTransactions([...transactions, ...items])
    setIsLoading(false)
  }

  const loadMore = (): void => {
    setCurrentPage(currentPage + 1)
  }

  const getTransfers = (invocations: Notification[]) =>
    Promise.all(
      invocations
        .filter(
          ({ state, event_name }) =>
            state.length === 3 && event_name === 'Transfer',
        )
        .map(async ({ contract, state }): Promise<Transfer> => {
          const [{ value: from }, { value: to }, { value: amount }] = state

          const [network, protocol] = getNetworkAndProtocol()
          const restAPI = protocol === 'neo3' ? NeoRest : NeoLegacyREST
          const json: any = await restAPI.asset(contract, network)

          const { symbol, decimals } = json
          const convertedAmount = convertToArbitraryDecimals(
            Number(amount),
            decimals,
          )

          const convertedFrom = from ? byteStringToAddress(from) : 'mint'
          const convertedTo = to ? byteStringToAddress(to) : 'burn'

          return {
            scripthash: contract,
            from: convertedFrom,
            to: convertedTo,
            amount: convertedAmount,
            symbol,
          }
        }),
    )

  useEffect(() => {
    setIsLoading(true)
    const populate = async () => {
      const { items = [], totalCount } = await fetchTransaction(
        hash,
        currentPage,
      )

      for (const item of items) {
        item.transfers = await getTransfers(item.notifications)
      }

      populateRecords(items)

      if (pages === 0 && items.length > 0) {
        setPages(Math.ceil(totalCount / items.length))
      }
    }

    if (hash) {
      populate()
    }
  }, [chain, network, hash, currentPage])

  if (chain === 'neo2') {
    return (
      <Redirect
        to={`${ROUTES.WALLET.url}/${chain}/${network}/${hash}/assets`}
      />
    )
  }

  return (
    <div
      id="addressTransactions"
      className="page-container address-transactions"
    >
      <div className="address-transactions__table">
        {transactions.length > 0
          ? transactions.map(it => (
              <AddressTransactionsCard
                key={it.hash}
                transaction={it}
                chain={chain}
                network={network}
              />
            ))
          : !isLoading && (
              <div className="horiz justify-center no-transaction">
                <p>No transaction to list</p>
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
