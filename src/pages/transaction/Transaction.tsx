import React, { useEffect, useState, useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  State as TransactionState,
  DetailedTransaction,
} from '../../reducers/transactionReducer'
import './Transaction.scss'
import { neo3_getAddressFromSriptHash, ROUTES } from '../../constants'
import { fetchTransaction } from '../../actions/transactionActions'
import { convertToArbitraryDecimals } from '../../utils/formatter'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { TransactionN3 } from '../../components/transaction/TransactionN3'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import BackButton from '../../components/navigation/BackButton'
import { ReactComponent as TransactionIcon } from '../../assets/icons/invocation.svg'
import { Box, Flex, Text } from '@chakra-ui/react'
import { u } from '@cityofzion/neon-js'
import { NeoRESTApi } from '@cityofzion/dora-ts/dist/api'
import { store } from '../../store'

const NeoRest = new NeoRESTApi({
  doraUrl: 'https://dora.coz.io',
  endpoint: '/api/v2/neo3',
})

export type ParsedTransfer = {
  name: string
  amount: string | number
  to: string
  from: string
  symbol: string
}
const parseNeo3TransactionData = async (
  transaction: DetailedTransaction,
): Promise<ParsedTransfer[]> => {
  const transfers: ParsedTransfer[] = []

  if (transaction.notifications) {
    for (const notification of transaction.notifications) {
      if (notification.state.type === 'Array') {
        const isTransfer = notification.event_name === 'Transfer'

        if (
          !notification.state.value ||
          !Array.isArray(notification.state.value)
        )
          continue

        if (isTransfer) {
          const { network } = store.getState().network
          const asset = await NeoRest.asset(notification.contract, network)
          const { symbol, decimals, name } = asset
          let amount = 0

          const integerNotification = notification.state.value.find(
            value => value.type === 'Integer',
          )

          if (integerNotification) {
            amount = integerNotification.value as unknown as number
          } else {
            // fix for contracts that don't adhere to NEP-17 standard
            // and emit ByteString instead of Integer
            const amountStackItem = notification.state.value[2]

            if (amountStackItem.type === 'ByteString') {
              const hexstr = Buffer.from(
                String(amountStackItem.value),
                'base64',
              ).toString('hex')
              const value = u.BigInteger.fromHex(hexstr, true)
              // not taking decimals into account as it is also not done
              // when the notification is of type Integer
              amount = parseInt(value.toDecimal(0))
            }
          }

          const from_address = neo3_getAddressFromSriptHash(
            String(notification.state.value[0].value),
          )
          const to_address = neo3_getAddressFromSriptHash(
            String(notification.state.value[1].value),
          )
          transfers.push({
            name,
            symbol,
            amount: convertToArbitraryDecimals(
              Number(amount),
              Number(decimals),
            ),
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
      const parsedTransfers: ParsedTransfer[] = await parseNeo3TransactionData(
        transaction,
      )

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

        <BackButton mb={6} text="back to transactions" />

        <Flex alignItems={'center'} mb={10}>
          <TransactionIcon width={22} height={23} />
          <Text ml={2} fontSize={26} fontWeight={700} lineHeight={10}>
            Transaction Information
          </Text>
        </Flex>

        {transaction && localLoadComplete ? (
          <>
            <TransactionN3
              chain={chain}
              network={network}
              transaction={transaction}
              transfers={transfers}
            />
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
