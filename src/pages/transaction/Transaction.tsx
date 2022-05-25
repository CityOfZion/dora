import React, { useEffect, useState, useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  State as TransactionState,
  DetailedTransaction,
} from '../../reducers/transactionReducer'
import './Transaction.scss'
import {
  GENERATE_BASE_URL,
  NEO_HASHES,
  GAS_HASHES,
  neo3_getAddressFromSriptHash,
  ROUTES,
} from '../../constants'
import { fetchTransaction } from '../../actions/transactionActions'
import { convertToArbitraryDecimals } from '../../utils/formatter'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { TransactionN2 } from '../../components/transaction/TransactionN2'
import { TransactionN3 } from '../../components/transaction/TransactionN3'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import BackButton from '../../components/navigation/BackButton'
import { ReactComponent as TransactionIcon } from '../../assets/icons/invocation.svg'
import { Box, Flex, Text } from '@chakra-ui/react'

export type ParsedTransfer = {
  name: string
  amount: string | number
  to: string
  from: string
  symbol: string
}

const parseAbstractData = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers: ParsedTransfer[] = []

  if (transaction.items) {
    transaction.items.inputs.forEach(({ address, value, asset }) => {
      let name = ''
      if (NEO_HASHES.includes(asset)) {
        name = 'NEO'
      } else if (GAS_HASHES.includes(asset)) {
        name = 'GAS'
      }

      transfers.push({
        name,
        amount: value,
        to: '',
        from: address,
        symbol: name,
      })
    })

    transaction.items.outputs.forEach(({ address, value, asset }) => {
      let name = ''
      if (NEO_HASHES.includes(asset)) {
        name = 'NEO'
      } else if (GAS_HASHES.includes(asset)) {
        name = 'GAS'
      }

      transfers.push({
        name,
        amount: value,
        to: address,
        from: '',
        symbol: name,
      })
    })

    for (const token of transaction.items.tokens) {
      const { scripthash, amount, to, from } = token
      const response = await fetch(`${GENERATE_BASE_URL()}/asset/${scripthash}`)
      const json = await response.json()
      const { name, symbol } = json

      const amountWithDecimals = convertToArbitraryDecimals(
        Number(amount),
        json.decimals,
      )

      transfers.push({
        name,
        amount: amountWithDecimals,
        to,
        from,
        symbol,
      })
    }
  }

  return transfers
}

const parseNeo3TransactionData = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers: ParsedTransfer[] = []

  if (transaction.notifications) {
    for (const notification of transaction.notifications) {
      if (notification.state.type === 'Array') {
        const isTransfer = notification.event_name === 'Transfer'

        if (isTransfer) {
          const assetResponse = await fetch(
            `${GENERATE_BASE_URL('neo3')}/asset/${notification.contract}`,
          )
          const assetJson = await assetResponse.json()
          const { symbol, decimals, name } = assetJson
          const integerNotfication = notification.state.value.find(
            value => value.type === 'Integer',
          )
          const amount = integerNotfication ? integerNotfication.value : 0
          const from_address = neo3_getAddressFromSriptHash(
            notification?.state?.value[0]?.value || '',
          )
          const to_address = neo3_getAddressFromSriptHash(
            notification?.state?.value[1]?.value || '',
          )
          transfers.push({
            name,
            symbol,
            amount: convertToArbitraryDecimals(Number(amount), decimals),
            to: to_address,
            from: from_address,
          })
        }
      }
    }
  }
  return transfers
}

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Transaction: React.FC<Props> = (props: Props) => {
  const { hash, chain, network } = props.match.params
  const dispatch = useDispatch()
  const transferArr: ParsedTransfer[] = []
  const [transfers, setTransfers] = useState(transferArr)
  const [localLoadComplete, setLocalLoadComplete] = useState(false)

  const transactionState = useSelector(
    ({ transaction }: { transaction: TransactionState }) => transaction,
  )
  const { transaction } = transactionState

  const parseTransfers = useCallback(
    async (transaction: DetailedTransaction) => {
      let parsedTransfers: ParsedTransfer[]

      if (chain === 'neo3') {
        parsedTransfers = await parseNeo3TransactionData(transaction)
      } else {
        parsedTransfers = await parseAbstractData(transaction)
      }

      setTransfers(parsedTransfers)
      setLocalLoadComplete(true)
    },
    [],
  )

  useUpdateNetworkState(props)

  useEffect(() => {
    dispatch(fetchTransaction(hash, chain))

    return (): void => {
      setTransfers([])
    }
  }, [chain, dispatch, hash])

  useEffect(() => {
    if (transaction) {
      parseTransfers(transaction)
    }
  }, [transaction])

  return (
    <Box id="Transaction" className="page-container" maxW={'100vw'}>
      <Flex className="inner-page-container" flexDir={'column'} px={4}>
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: ROUTES.TRANSACTIONS.url,
              label: 'Transactions',
            },
            {
              url: '#',
              label: 'Transaction info',
              active: true,
            },
          ]}
        />

        <BackButton
          mb={6}
          url={ROUTES.TRANSACTIONS.url}
          text="back to transactions"
        />

        <Flex alignItems={'center'} mb={10}>
          <TransactionIcon width={22} height={23} />
          <Text ml={2} fontSize={26} fontWeight={700} lineHeight={10}>
            Transaction Information
          </Text>
        </Flex>

        {transaction && localLoadComplete ? (
          <>
            {chain === 'neo2' ? (
              <TransactionN2
                chain={chain}
                network={network}
                transaction={transaction}
                transfers={transfers}
              />
            ) : (
              <TransactionN3
                chain={chain}
                network={network}
                transaction={transaction}
                transfers={transfers}
              />
            )}
          </>
        ) : (
          <SkeletonTheme
            color="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <div
              style={{
                height: '210px',
                display: 'grid',
                gridTemplateColumns: '1fr 240px 1fr',
                columnGap: '24px',
                gridTemplateRows: '1fr',
              }}
            >
              <Skeleton height={'100%'} />
              <Skeleton height={'100%'} />
              <Skeleton height={'100%'} />
            </div>

            <div className="section-label">DETAILS</div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                columnGap: '2px',
                rowGap: '2px',
                gridTemplateRows: 'repeat(2, 100px)',
              }}
            >
              <Skeleton height={'100%'} />
              <Skeleton height={'100%'} />
              <Skeleton height={'100%'} />
              <Skeleton height={'100%'} />
            </div>
            <Skeleton height={'50px'} style={{ margin: '5px 0' }} />
          </SkeletonTheme>
        )}
      </Flex>
    </Box>
  )
}

export default withRouter(Transaction)
