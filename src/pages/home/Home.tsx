import React, { ReactElement, useEffect } from 'react'
import moment from 'moment'

import { convertMilliseconds, getDiffInSecondsFromNow } from '../../utils/time'
import { MOCK_BLOCK_LIST_DATA, MOCK_TX_LIST_DATA } from '../../utils/mockData'
import List from '../../components/list/List'
import Button from '../../components/button/Button'
import logo from '../../assets/icons/logo.png'
import './Home.scss'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlocks } from '../../actions/blockActions'
import { fetchTransactions } from '../../actions/transactionActions'
import { State as BlockState } from '../../reducers/blockReducer'
import {
  Transaction,
  State as TxState,
} from '../../reducers/transactionReducer'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import ContractsInvocations from '../../components/contract-invocation/ContractsInvocations'

type Block = {
  index: number
  time: number
  size: number
  tx: Array<string>
  blocktime: number
  hash: string
  txCount: number
}

type ParsedBlock = {
  time: string
  index: React.FC<{}>
  transactions: number
  blocktime: string
  size: string
}

type ParsedTx = {
  time: string
  txid: React.FC<{}>
  size: string
}

const mapBlockData = (block: Block): ParsedBlock => {
  return {
    time: `${getDiffInSecondsFromNow(moment(block.time).format())} seconds ago`,
    index: (): ReactElement => (
      <div className="block-index-cell"> {block.index.toLocaleString()} </div>
    ),
    transactions: block.txCount,
    blocktime: convertMilliseconds(block.blocktime),
    size: `${block.size.toLocaleString()} Bytes`,
  }
}

const mapTransactionData = (tx: Transaction): ParsedTx => {
  return {
    time: `${getDiffInSecondsFromNow(moment(tx.time).format())} seconds ago`,
    txid: (): ReactElement => (
      <div className="txid-index-cell"> {tx.txid} </div>
    ),
    size: `${tx.size.toLocaleString()} Bytes`,
  }
}

const returnBlockListData = (
  data: Array<Block>,
  returnStub: boolean,
): Array<ParsedBlock> => {
  if (returnStub) {
    return MOCK_BLOCK_LIST_DATA.map(mapBlockData).slice(0, 8)
  } else {
    return data.map(mapBlockData).slice(0, 8)
  }
}

const returnTxListData = (
  data: Array<Transaction>,
  returnStub: boolean,
): Array<ParsedTx> => {
  if (returnStub) {
    return MOCK_TX_LIST_DATA.map(mapTransactionData).slice(0, 8)
  } else {
    return data.map(mapTransactionData).slice(0, 8)
  }
}

const Home: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const blockState = useSelector(({ block }: { block: BlockState }) => block)

  const txState = useSelector(
    ({ transaction }: { transaction: TxState }) => transaction,
  )

  useEffect(() => {
    dispatch(fetchBlocks())
    dispatch(fetchTransactions())
  }, [dispatch])

  return (
    <div id="Home" className="page-container">
      <div id="neoscan-logo-container">
        <img id="neoscan-logo" alt="neoscan-logo" src={logo} />
        <div id="welcome-text">
          <h1> welcome to neoscan </h1>{' '}
          <div id="welcome-text-underscore">_</div>
        </div>
        <span>Your home for all NEO related blockchain information</span>
      </div>

      <div className="list-row-container">
        <div className="list-wrapper">
          <div className="label-wrapper">
            <label>explore blocks</label>
            <Button
              primary
              onClick={(): void => history.push(ROUTES.BLOCKS.url)}
            >
              view all
            </Button>
          </div>
          <List
            data={returnBlockListData(blockState.list, blockState.isLoading)}
            rowId="index"
            handleRowClick={(data): void => console.log(data)}
            isLoading={blockState.isLoading}
            columns={[
              {
                name: 'Index',
                accessor: 'index',
              },
              { name: 'Time', accessor: 'time' },
              { name: 'Transactions', accessor: 'transactions' },
              { name: 'Size', accessor: 'size' },
            ]}
          />
        </div>
        <div className="list-wrapper">
          <div className="label-wrapper">
            <label>explore transactions</label>
            <Button
              primary
              onClick={(): void => history.push(ROUTES.TRANSACTIONS.url)}
            >
              view all
            </Button>
          </div>
          <List
            data={returnTxListData(txState.list, txState.isLoading)}
            rowId="index"
            handleRowClick={(data): void => console.log(data)}
            isLoading={txState.isLoading}
            columns={[
              { name: 'Transaction ID', accessor: 'txid' },
              { name: 'Size', accessor: 'size' },
              { name: 'Time', accessor: 'time' },
            ]}
          />
        </div>
      </div>

      <div id="contracts-invocations-container">
        <div className="label-wrapper">
          <label>Contract Invocations in the last 24 hourss</label>
        </div>
        <div className="invocations-list-wrapper">
          <ContractsInvocations />
        </div>
      </div>
    </div>
  )
}

export default Home
