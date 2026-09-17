import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ActivityHistoryEvent,
  ActivityHistoryItem,
  fetchTransactions,
} from './AddressTransactionService'
import './AddressTransactions.scss'
import {
  AddressTransaction,
  Incovation,
  NotificationEvent,
  NotificationEventField,
  Transfer,
} from './AddressTransaction'
import Button from '../../../../components/button/Button'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import AddressTransactionsCard from './fragments/AddressTransactionCard'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'
import { NeoRest } from '../../../../rest'
import { neo3_getAddressFromSriptHash } from '../../../../constants'

interface MatchParams extends Record<string, string | undefined> {
  hash: string
  chain: string
  network: string
}

type LogStateItem = {
  type: string
  value?: string
}

type LogNotification = {
  contract: string
  event_name: string
  state?: {
    type: string
    value?: LogStateItem[]
  }
}

type TransactionLog = {
  notifications?: LogNotification[]
}

type ContractEvent = {
  name: string
  parameters: { name: string; type: string }[]
}

const AddressTransactions: React.FC = () => {
  const { chain = '', network = '', hash = '' } = useParams<MatchParams>()
  useUpdateNetworkState()
  const [transactions, setTransactions] = useState([] as AddressTransaction[])
  const [nextCursor, setNextCursor] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  function isTransferEvent(event: ActivityHistoryEvent) {
    return (
      event.methodName.toLowerCase() === 'transfer' ||
      event.from !== null ||
      event.to !== null
    )
  }

  function formatLabel(label: string) {
    const abbreviations: Record<string, string> = {
      asid: 'Asset ID',
      cid: 'Config ID',
      eid: 'Epoch ID',
      nfid: 'Non-fungible ID',
      pid: 'Property ID',
    }

    if (abbreviations[label.toLowerCase()]) {
      return abbreviations[label.toLowerCase()]
    }

    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/\bid\b/gi, 'ID')
      .replace(/\b\w/g, character => character.toUpperCase())
  }

  function getFieldValue(
    stateItem: LogStateItem,
    parameterType?: string,
  ): NotificationEventField {
    if (parameterType === 'Hash160' && stateItem.value) {
      try {
        return {
          label: '',
          type: 'address',
          value: neo3_getAddressFromSriptHash(stateItem.value),
        }
      } catch {
        // Keep the original value when a contract emits a non-standard Hash160.
      }
    }

    return { label: '', value: stateItem.value || stateItem.type }
  }

  async function getNotificationEvents(
    items: ActivityHistoryItem[],
  ): Promise<Map<string, NotificationEvent[]>> {
    const itemsWithNotificationEvents = items.filter(item =>
      item.events.some(event => !isTransferEvent(event)),
    )
    const logs = new Map<string, TransactionLog>(
      await Promise.all(
        itemsWithNotificationEvents.map(async item => {
          try {
            const log = (await NeoRest.log(
              item.transactionID,
              network,
            )) as unknown
            return [item.transactionID, log as TransactionLog] as const
          } catch {
            return [
              item.transactionID,
              { notifications: [] as LogNotification[] },
            ] as const
          }
        }),
      ),
    )
    const nonTransferEvents = items.flatMap(item =>
      item.events.filter(event => !isTransferEvent(event)),
    )
    const contracts = new Map<string, ContractEvent[]>(
      await Promise.all(
        [...new Set(nonTransferEvents.map(event => event.contractHash))].map(
          async contractHash => {
            try {
              const contract = await NeoRest.contract(contractHash, network)
              return [
                contractHash,
                (contract.manifest.abi?.events || []) as ContractEvent[],
              ] as const
            } catch {
              return [contractHash, [] as ContractEvent[]] as const
            }
          },
        ),
      ),
    )

    return new Map(
      items.map(item => {
        const notifications = logs.get(item.transactionID)?.notifications || []
        const events = item.events
          .filter(event => !isTransferEvent(event))
          .map(event => {
            const notification = notifications.find(
              item =>
                item.contract === event.contractHash &&
                item.event_name === event.methodName,
            )
            const contractEvent =
              contracts
                .get(event.contractHash)
                ?.find(item => item.name === event.methodName) || null
            const values = notification?.state?.value || []
            const fields = values.map((value, index) => {
              const parameter = contractEvent?.parameters[index]
              return {
                ...getFieldValue(value, parameter?.type),
                label: formatLabel(parameter?.name || `Value ${index + 1}`),
              }
            })

            return {
              contractHash: event.contractHash,
              contractName: event.contractName,
              fields,
              type: event.methodName,
            }
          })

        return [item.transactionID, events] as const
      }),
    )
  }

  async function convertToAddressTransactions(
    items: ActivityHistoryItem[],
  ): Promise<AddressTransaction[]> {
    const transferEvents = items.flatMap(item =>
      item.events.filter(isTransferEvent),
    )
    const uniqueHashes = [
      ...new Set(transferEvents.map(event => event.contractHash)),
    ]
    const symbols = new Map(
      await Promise.all(
        uniqueHashes.map(async contractHash => {
          const fallback = transferEvents.find(
            event => event.contractHash === contractHash,
          )?.contractName

          try {
            const { symbol } = await NeoRest.asset(contractHash, network)
            return [contractHash, symbol] as const
          } catch {
            return [contractHash, fallback] as const
          }
        }),
      ),
    )
    const notificationEvents = await getNotificationEvents(items)

    return items.map(item => {
      const transfers = item.events.filter(isTransferEvent).map(event => {
        const standard = event.supportedStandards?.find(value =>
          /^NEP-(11|17)$/i.test(value),
        )

        return {
          from: event.from || 'mint',
          to: event.to || 'burn',
          scripthash: event.contractHash,
          amount: Number(event.amount),
          symbol: symbols.get(event.contractHash),
          type: standard ? `${standard.toUpperCase()} Transfer` : 'Transfer',
        } as Transfer
      })

      return {
        block: item.block,
        hash: item.transactionID,
        invocations: [] as Incovation[],
        invocationCount: item.invocationCount,
        netfee: item.networkFeeAmount,
        notifications: [],
        notificationCount: item.notificationCount,
        events: notificationEvents.get(item.transactionID) || [],
        sender: item.transactionSender,
        sysfee: item.systemFeeAmount,
        time: Date.parse(item.date) / 1000,
        transfers,
        vmstate: '',
      } as AddressTransaction
    })
  }

  useEffect(() => {
    let cancelled = false

    if (hash) {
      setTransactions([])
      setNextCursor(undefined)
      setIsLoading(true)

      void fetchTransactions(hash, network).then(async response => {
        const newItems = await convertToAddressTransactions(response.data)
        if (!cancelled) {
          setTransactions(newItems)
          setNextCursor(response.nextCursor || undefined)
          setIsLoading(false)
        }
      })
    }

    return () => {
      cancelled = true
    }
  }, [chain, network, hash])

  const loadMore = async () => {
    if (!nextCursor || isLoading) return

    setIsLoading(true)
    const response = await fetchTransactions(hash, network, nextCursor)
    const newItems = await convertToAddressTransactions(response.data)
    setTransactions(current => [...current, ...newItems])
    setNextCursor(response.nextCursor || undefined)
    setIsLoading(false)
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
            baseColor="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton count={15} style={{ margin: '5px 0', height: '100px' }} />
          </SkeletonTheme>
        )}

        {nextCursor && (
          <div className="load-more-button-container">
            <Button
              disabled={isLoading}
              schema="secondary"
              lowercase
              onClick={loadMore}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressTransactions
