// @ts-nocheck

import React from 'react'
import { get } from 'lodash'

import './Manifest.scss'
import ExpandingPanel from '../panel/ExpandingPanel'

import { TX_STATE_TYPE_MAPPINGS } from '../../constants'

// eslint-disable-next-line
// @ts-ignore
export const Parameter = ({ parameter, hideComma }): ReactElement => (
  <React.Fragment>
    <div
      className="method-parameters"
      style={{
        background:
          (TX_STATE_TYPE_MAPPINGS[parameter.type] &&
            TX_STATE_TYPE_MAPPINGS[parameter.type].color) ||
          '#00D69D',
      }}
    >
      <span
        className="parameter-name"
        style={{
          border: `solid 1px ${
            TX_STATE_TYPE_MAPPINGS[parameter.type] &&
            TX_STATE_TYPE_MAPPINGS[parameter.type].color
          }`,
        }}
      >
        {parameter.name} :
      </span>
      <span>{parameter.type} </span>
    </div>
    {!hideComma && <span className="param-paren">,</span>}
  </React.Fragment>
)

// eslint-disable-next-line
// @ts-ignore
export const ManifestRowContents = ({ method }): ReactElement => (
  <div className="manifest-method-row-container">
    <span>
      {method.name} <span className="method-seperator">:</span>
    </span>
    {!!method.parameters.length && (
      <React.Fragment>
        <span className="param-paren">(</span>
        {/* @ts-ignore */}
        {method.parameters.map((parameter, i) => (
          <Parameter
            parameter={parameter}
            hideComma={i + 1 === method.parameters.length}
            key={i}
          />
        ))}
        <span className="param-paren">)</span>
      </React.Fragment>
    )}

    {method.returntype ? (
      <>
        {!!method.parameters.length && (
          <span className="method-seperator">:</span>
        )}
        <p
          style={{
            background: get(
              TX_STATE_TYPE_MAPPINGS[method.returntype],
              'color',
              '#00D69D',
            ),
          }}
        >
          {method.returntype}
        </p>
      </>
    ) : (
      <>
        <p />
      </>
    )}
  </div>
)

// eslint-disable-next-line
// @ts-ignore
const Manifest = ({ manifest }): ReactElement => {
  return (
    <div className="manifest-container">
      {/* <ExpandingPanel title={manifest.abi.entryPoint.name} open={false}>
        <div className="notification-panel methods-panel">
          <ManifestRowContents method={manifest.abi.entryPoint} />
        </div>
      </ExpandingPanel> */}
      {!!manifest.abi.methods.length && (
        <ExpandingPanel title="Methods" open={false}>
          <div className="notification-panel methods-panel">
            {/* @ts-ignore */}
            {manifest.abi.methods.map((method, i) => (
              <ManifestRowContents method={method} key={i} />
            ))}
          </div>
        </ExpandingPanel>
      )}
      {!!manifest.abi.events.length && (
        <>
          <br />
          <ExpandingPanel title="Events" open={false}>
            <div className="notification-panel methods-panel">
              {/* @ts-ignore */}
              {manifest.abi.events.map((method, i) => (
                <ManifestRowContents method={method} key={i} />
              ))}
            </div>
          </ExpandingPanel>
        </>
      )}
    </div>
  )
}

export default Manifest
