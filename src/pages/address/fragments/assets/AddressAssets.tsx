import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
  convertToArbitraryDecimals,
  toBigNumber,
} from '../../../../utils/formatter'
import { State as AddressState } from '../../../../reducers/addressReducer'
import {
  fetchAddress,
  resetAddressState,
  fetchUnclaimedGas,
} from '../../../../actions/addressActions'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'
import { getLogo } from '../../../../utils/getLogo'
import { AppThunkDispatch } from '../../../../store'

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const icon = getLogo(symbol, chain)

  return icon ? (
    <img src={icon} className="icon" alt="token-logo" />
  ) : (
    <span className="icon-not-found">N/A</span>
  )
}

interface MatchParams extends Record<string, string | undefined> {
  hash: string
  chain: string
  network: string
}

const AddressAssets: React.FC = () => {
  const { hash = '', chain = '', network = '' } = useParams<MatchParams>()
  useUpdateNetworkState()
  const dispatch = useDispatch<AppThunkDispatch>()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const { balance, isLoading, unclaimedGas } = addressState

  const navigate = useNavigate()
  function handleContractClick(contractHash: string) {
    navigate(`/contract/${chain}/${network}/${contractHash}`)
  }

  useEffect(() => {
    dispatch(fetchAddress(hash, chain))
    dispatch(fetchUnclaimedGas(hash, network))

    return () => {
      dispatch(resetAddressState())
    }
  }, [chain, dispatch, hash])

  return (
    <div id="nft-container" className="page-container">
      {unclaimedGas && unclaimedGas !== '0' && (
        <div id="unclaimed-gas-balance-container">
          <div className="balance-container">
            <div className="balance-details">
              <div className="icon-container">
                {getTransferLogo('GAS', chain)}
              </div>
              <p className="balance-infos">
                <span className="balance-symbol">Unclaimed GAS</span>
                <span className="balance-name">GasToken</span>
              </p>
            </div>
            <p className="balance-amount">
              {convertToArbitraryDecimals(
                Number(unclaimedGas || 0),
                8,
              ).toString()}
            </p>
          </div>
        </div>
      )}
      <div id="address-balance-container">
        {balance &&
          balance.map(balance => (
            <div key={balance.symbol} className="balance-container">
              <div className="balance-details">
                <div className="icon-container">
                  {getTransferLogo(balance.symbol, chain)}
                </div>
                <p
                  className="balance-infos"
                  onClick={() => handleContractClick(balance.asset)}
                >
                  <span className="balance-symbol">{balance.symbol}</span>
                  {balance.name && (
                    <span className="balance-name">{balance.name}</span>
                  )}
                </p>
              </div>
              <p className="balance-amount">
                {toBigNumber(balance.balance).toString()}
              </p>
            </div>
          ))}
      </div>

      {isLoading && (
        <div id="address-balance-container">
          <SkeletonTheme
            baseColor="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton count={5} />{' '}
          </SkeletonTheme>
        </div>
      )}
    </div>
  )
}

export default AddressAssets
