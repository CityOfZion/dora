import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import moment from 'moment'
import { Icon } from '@iconify/react'
import DateRangeIcon from '@material-ui/icons/DateRange'
import clockIcon from '@iconify/icons-simple-line-icons/clock'

import { useDispatch, useSelector } from 'react-redux'
import { State as BlockState } from '../../reducers/blockReducer'
import './Block.scss'
import { ROUTES } from '../../constants'
import { fetchBlock } from '../../actions/blockActions'
import BlockTransactionsList from '../../components/transaction/BlockTransactionsList'
import ExpandingPanel from '../../components/panel/ExpandingPanel'
import { disassemble } from '../../utils/disassemble'
import { neo3Disassemble } from '../../utils/neo3-disassemble'

import Breadcrumbs from '../../components/navigation/Breadcrumbs'
import BackButton from '../../components/navigation/BackButton'
import Copy from '../../components/copy/Copy'
import useUpdateNetworkState from '../../hooks/useUpdateNetworkState'
import { formatDate, formatTime, formatHours } from '../../utils/time'

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const Block: React.FC<Props> = (props: Props) => {
  useUpdateNetworkState(props)
  const { hash, chain } = props.match.params
  const dispatch = useDispatch()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const { block, isLoading } = blockState

  console.log({ chain })

  console.log(block && block.witnesses && block?.witnesses[0].verification)

  useEffect(() => {
    dispatch(fetchBlock(hash))
  }, [dispatch, hash])

  return (
    <div id="Block" className="page-container">
      <div className="inner-page-container">
        <Breadcrumbs
          crumbs={[
            {
              url: ROUTES.HOME.url,
              label: 'Home',
            },
            {
              url: ROUTES.BLOCKS.url,
              label: 'Blocks',
            },
            {
              url: '#',
              label: 'Block information',
              active: true,
            },
          ]}
        />

        <BackButton url={ROUTES.BLOCKS.url} text="back to blocks" />

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
                  <span id="time-details-row">
                    <div>
                      {!isLoading && block && (
                        <>
                          <DateRangeIcon
                            style={{ color: '#7698A9', fontSize: 20 }}
                          />
                          {formatDate(block.time)}
                        </>
                      )}
                    </div>
                    <div>
                      {!isLoading && block && (
                        <>
                          <Icon
                            icon={clockIcon}
                            style={{ color: '#7698A9', fontSize: 18 }}
                          />
                          {formatHours(block.time)}
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
                  <Copy text={block ? block.hash : ''} />
                </div>
              </div>

              <div className="detail-tile-row full-width-tile-row">
                <div className="detail-tile">
                  <label>MERKLE ROOT</label>
                  <span>{!isLoading && block && block.merkleroot} </span>
                  <Copy text={block ? block.merkleroot : ''} />
                </div>
              </div>

              <div className="detail-tile-row full-width-tile-row">
                <div className="detail-tile">
                  <label>NEXT CONSENSUS</label>
                  <span>{!isLoading && block && block.nextconsensus} </span>
                  <Copy text={block ? block.nextconsensus : ''} />
                </div>
              </div>
            </div>
          </div>

          {block && !!block.tx.length && (
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
                <div className="script-label-and-copy-row">
                  <label>INVOCATION SCRIPT</label>{' '}
                  {chain === 'neo2' ? (
                    <Copy text={block ? block.script?.invocation : ''} />
                  ) : (
                    <Copy
                      text={
                        block && block.witnesses
                          ? block.witnesses[0].invocation
                          : ''
                      }
                    />
                  )}
                </div>
                <span>
                  {chain === 'neo2'
                    ? !isLoading && block && block.script?.invocation
                    : !isLoading &&
                      block &&
                      block.witnesses &&
                      block.witnesses[0].invocation}
                </span>
              </div>
              <div className="detail-tile script-tile">
                <div className="script-label-and-copy-row">
                  <label>VERIFICATION SCRIPT</label>

                  {chain === 'neo2' ? (
                    <Copy text={block ? block.script?.verification : ''} />
                  ) : (
                    <Copy
                      text={
                        block && block.witnesses
                          ? block.witnesses[0].verification
                          : ''
                      }
                    />
                  )}
                </div>
                <span>
                  {chain === 'neo2'
                    ? !isLoading && block && block.script?.verification
                    : !isLoading &&
                      block &&
                      block.witnesses &&
                      block.witnesses[0].verification}
                </span>
              </div>
            </div>
          </ExpandingPanel>

          <div style={{ margin: '24px 0' }}>
            <ExpandingPanel title="DISASSEMBLED SCRIPT" open={false}>
              <div className="script-tile-row">
                <div className="detail-tile script-tile">
                  <label>INVOCATION SCRIPT</label>
                  <span>
                    {!isLoading && block && chain === 'neo2'
                      ? disassemble(block.script?.invocation) || ''
                      : block?.witnesses &&
                        neo3Disassemble(block?.witnesses[0].invocation)}
                  </span>
                </div>
                <div className="detail-tile script-tile">
                  <label>VERIFICATION SCRIPT</label>
                  <span>
                    {!isLoading && block && chain === 'neo2'
                      ? disassemble(block.script?.verification) || ''
                      : block?.witnesses &&
                        neo3Disassemble(block?.witnesses[0].verification)}
                  </span>
                </div>
              </div>
            </ExpandingPanel>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Block)
