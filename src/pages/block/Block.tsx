import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { State as BlockState } from '../../reducers/blockReducer'
import './Block.scss'
import { ROUTES } from '../../constants'
import { fetchBlock } from '../../actions/blockActions'
import BlockTransactionsList from '../../components/transaction/BlockTransactionsList'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import ExpandingPanel from '../../components/panel/ExpandingPanel'

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Block: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const { block, isLoading } = blockState

  useEffect(() => {
    dispatch(fetchBlock(hash))
  }, [dispatch, hash])

  return (
    <div id="Block" className="page-container">
      <div className="inner-page-container">
        <div className="page-title-container">
          {ROUTES.BLOCKS.renderIcon()}
          <h1>Block Information</h1>
        </div>
        <div id="block-details-container">
          <div className="details-section">
            <div className="section-label">DETAILS</div>
            <div className="inner-details-container">
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>BLOCK INDEX</label>
                  <span>
                    {!isLoading && block && block.index.toLocaleString()}
                  </span>
                </div>
                <div className="detail-tile">
                  <label>TRANSACTIONS</label>
                  <span>{!isLoading && block && block.tx.length}</span>
                </div>
                <div className="detail-tile">
                  <label>SIZE</label>
                  <span>
                    {!isLoading && block && block.size.toLocaleString()} bytes
                  </span>
                </div>
              </div>
              <div className="detail-tile-row">
                <div className="detail-tile">
                  <label>TIME</label>
                  <span id="block-time-details-row">
                    <div>
                      {!isLoading && block && (
                        <>
                          <Calendar />
                          {moment.unix(block.time).format('MM-DD-YYYY')}
                        </>
                      )}
                    </div>
                    <div>
                      {!isLoading && block && (
                        <>
                          <Clock />
                          {moment.unix(block.time).format('HH:MM:SS')}
                        </>
                      )}
                    </div>
                  </span>
                </div>
                <div className="detail-tile">
                  <label>VERSION</label>
                  <span>{!isLoading && block && block.version}</span>
                </div>
                <div className="detail-tile">
                  <label>BLOCK TIME</label>
                  <span>{!isLoading && block && block.blocktime} seconds</span>
                </div>
              </div>
              <div
                className="detail-tile-row full-width-tile-row"
                style={{ marginTop: '4px' }}
              >
                <div className="detail-tile" style={{ marginTop: '0px' }}>
                  <label>HASH</label>
                  <span>{!isLoading && block && block.hash} </span>
                </div>
              </div>

              <div className="detail-tile-row full-width-tile-row">
                <div className="detail-tile">
                  <label>MERKLE ROOT</label>
                  <span>{!isLoading && block && block.merkleroot} </span>
                </div>
              </div>

              <div className="detail-tile-row full-width-tile-row">
                <div className="detail-tile">
                  <label>NEXT CONSENSUS</label>
                  <span>{!isLoading && block && block.nextconsensus} </span>
                </div>
              </div>
            </div>
          </div>

          {block && block.tx.length && (
            <div className="block-transactions-section">
              <div className="details-section">
                <div className="section-label">TRANSACTIONS</div>

                <BlockTransactionsList
                  loading={isLoading}
                  list={block.tx}
                  block={block}
                />
              </div>
            </div>
          )}

          <ExpandingPanel title="RAW SCRIPT" open={false}>
            <div className="script-tile-row">
              <div className="detail-tile script-tile">
                <label>INVOCATION SCRIPT</label>
                <span>{!isLoading && block && block.script.invocation} </span>
              </div>
              <div className="detail-tile script-tile">
                <label>VERIFICATION SCRIPT</label>
                <span>{!isLoading && block && block.script.verification} </span>
              </div>
            </div>
          </ExpandingPanel>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Block)
