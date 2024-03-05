import Neo3 from '../../../../../assets/icons/neo3.svg'
import { ArrowForwardIos } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../../constants'
import TransactionTime from './TransactionTime'
import AddressTransactionMobileRow from './AddressTransactionMobileRow'
import AddressTransactionTransfer from './AddressTransactionTransferRow'
import React from 'react'
import { AddressTransaction } from '../AddressTransaction'
import useWindowWidth from '../../../../../hooks/useWindowWidth'

interface Props {
  transaction: AddressTransaction
  chain: string
  network: string
}

const AddressTransactionsCard: React.FC<Props> = (props: Props) => {
  const { transaction, chain, network } = props
  const width = useWindowWidth()

  const isMobileOrTablet = width <= 1200

  return (
    <div className="address-transactions__table--row">
      {!isMobileOrTablet && (
        <div className="address-transactions__table--chain">
          <div className="address-transactions__table--logo">
            <img src={Neo3} alt="token-logo" />
          </div>
          <div>Neo N3</div>
        </div>
      )}
      <div className="address-transactions__table--content">
        <div className="address-transactions__table--hash">
          {isMobileOrTablet ? (
            <Link
              className="horiz justify-between weight-1"
              to={`${ROUTES.WALLET.url}/${chain}/${network}/${transaction.hash}`}
            >
              <div className="horiz">
                <div className="address-transactions__table--logo">
                  <img src={Neo3} alt="token-logo" />
                </div>
                <div className="title">Neo N3</div>
              </div>
              <ArrowForwardIos style={{ color: '#d355e7' }} />
            </Link>
          ) : (
            <>
              <div className="horiz">
                <label>ID</label>{' '}
                <Link
                  className="hash"
                  to={`${ROUTES.TRANSACTION.url}/${chain}/${network}/${transaction.hash}`}
                >
                  <span>{transaction.hash}</span>
                </Link>
              </div>
              <TransactionTime time={transaction.time} />
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
              transaction={transaction}
              chain={chain}
              network={network}
            />
          ) : (
            <AddressTransactionTransfer
              transfers={transaction.transfers}
              chain={chain}
              network={network}
              notifications={transaction.notifications}
            />
          )}
          <div className="horiz weight-1">
            <div className="address-transactions__table--balloon">
              Notifications: <span>{transaction.notifications.length}</span>
            </div>
            <div className="address-transactions__table--balloon">
              Invocations: <span>{transaction.invocations.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressTransactionsCard
