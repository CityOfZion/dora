import React, { ReactElement } from 'react'

import Neo2 from '../../assets/icons/neo2.svg'
import Neo3 from '../../assets/icons/neo3.svg'

const PlatformCell = ({ chain }: { chain: string | void }): ReactElement => (
  <div className="txid-index-cell">
    {chain === 'neo2' ? (
      <div className="neo2-platform-cell">
        <img src={Neo2} alt="NEO 2" />
        <span>NEO 2</span>
      </div>
    ) : (
      <div className="neo3-platform-cell">
        <img src={Neo3} alt="NEO 3" />
        <span>NEO 3</span>
      </div>
    )}
  </div>
)

export default PlatformCell
