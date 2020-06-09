import React, { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import moment from 'moment'

import { useDispatch, useSelector } from 'react-redux'
import { State as BlockState } from '../../reducers/blockReducer'
import './Block.scss'
import { ROUTES } from '../../constants'
import { fetchBlock } from '../../actions/blockActions'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as Clock } from '../../assets/icons/clock.svg'

interface MatchParams {
  hash: string
}

type Props = RouteComponentProps<MatchParams>

const Block: React.FC<Props> = (props: Props) => {
  const { hash } = props.match.params
  const dispatch = useDispatch()
  const blockState = useSelector(({ block }: { block: BlockState }) => block)
  const { block } = blockState

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
        {block && (
          <div id="block-details-container">
            <div className="details-section">
              <div className="section-label">DETAILS</div>
              <div className="inner-details-container">
                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>BLOCK INDEX</label>
                    <span>{block.index.toLocaleString()}</span>
                  </div>
                  <div className="detail-tile">
                    <label>TRANSACTIONS</label>
                    <span>{block.tx.length}</span>
                  </div>
                  <div className="detail-tile">
                    <label>SIZE</label>
                    <span>{block.size.toLocaleString()} bytes</span>
                  </div>
                </div>
                <div className="detail-tile-row">
                  <div className="detail-tile">
                    <label>TIME</label>
                    <span id="block-time-details-row">
                      <div>
                        <Calendar />
                        {moment.unix(block.time).format('MM-DD-YYYY')}{' '}
                      </div>
                      <div>
                        <Clock />
                        {moment.unix(block.time).format('HH:MM:SS')}
                      </div>
                    </span>
                  </div>
                  <div className="detail-tile">
                    <label>VERSION</label>
                    <span>{block.version}</span>
                  </div>
                  <div className="detail-tile">
                    <label>BLOCK TIME</label>
                    <span>{block.blocktime} seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withRouter(Block)
