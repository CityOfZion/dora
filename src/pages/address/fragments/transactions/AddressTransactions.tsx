import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { fetchTransaction } from './AddressTransactionService'
import './AddressTransactions.scss'
import { AddressTransaction, Incovation, Transfer } from './AddressTransaction'
import Button from '../../../../components/button/Button'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { convertToArbitraryDecimals } from '../../../../utils/formatter'
import AddressTransactionsCard from './fragments/AddressTransactionCard'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import {
  Notification,
  TransactionEnhanced,
  Transfer as TransferDoraTS,
} from '@cityofzion/dora-ts/dist/interfaces/api/neo/interface'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

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

  function convertTransferAmounts(tfxs: TransferDoraTS[], data: any) {
    return tfxs.map(({ scripthash, amount, from, to }) => {
      const { symbol, decimals } = data.get(scripthash)
      const convertedAmount = convertToArbitraryDecimals(
        Number(amount),
        Number(decimals),
      )

      return {
        from,
        to,
        scripthash,
        amount: convertedAmount,
        symbol: symbol,
      } as Transfer
    })
  }

  async function convertToAddressTransactions(
    items: TransactionEnhanced[],
  ): Promise<AddressTransaction[]> {
    // first collect all script hashes from the transfers
    const script_hashes = []
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].transfers.length; j++) {
        script_hashes.push(items[i].transfers[j].scripthash)
      }
    }
    // then filter them
    const unique_hashes = script_hashes.filter((v, i, a) => a.indexOf(v) === i)
    // then request the symbol + decimals for the unique script hashes
    const data = await Promise.all(
      unique_hashes.map(async scripthash => {
        const { symbol, decimals } = await NeoRest.asset(scripthash, network)
        return [scripthash, symbol, decimals]
      }),
    )
    // finally store them in a map for easy lookup
    const datamap = new Map()
    data.forEach(entry => {
      datamap.set(entry[0], { symbol: entry[1], decimals: entry[2] })
    })

    return items.map(item => {
      const transfers = convertTransferAmounts(item.transfers, datamap)
      return {
        ...item,
        invocations: item.invocations as Incovation[],
        notifications: item.notifications as Notification[],
        time: Number(item.time),
        transfers,
      } as AddressTransaction
    })
  }

  useEffect(() => {
    setIsLoading(true)
    const populate = async () => {
      const { items = [], totalCount } = await fetchTransaction(
        hash,
        currentPage,
      )

      const newItems = await convertToAddressTransactions(items)

      populateRecords(newItems)

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
