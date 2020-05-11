import React, { ReactElement } from 'react'

import List from '../../components/list/List'
import logo from '../../assets/icons/logo.png'
import './Home.scss'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchBlocks } from '../../actions/blockActions'
import { State } from '../../reducers/blockReducer'

type GlobalState = {
  block: State
}

const MOCK_DATA = [
  {
    index: 786786,
    time: 1510884204,
    size: 686,
    tx: ['0x332090115531dac3bf046d9f68413c41f4e438d6e959738bb577ccd66c4c99d2'],
    blocktime: 21,
    hash: '0x8207fd1bec74fd2af9c52d523f6fda3525b0a2b7555298ab4bb20087415dcce1',
    txCount: 1,
  },
  {
    index: 786785,
    time: 1510884183,
    size: 686,
    tx: ['0xf580984be4c0926f9cc4486f5a0ac1d5a0652059cf6c35b7859bbc93da6e6bd7'],
    blocktime: 24,
    hash: '0xc09e2a161589c103f6e245744ed1264e5cd35ebdb79f879a7db3679d20aabe41',
    txCount: 1,
  },
  {
    index: 786784,
    time: 1510884159,
    size: 686,
    tx: ['0x5d24df9bd71e2b97f25d268b3d5d8f9ed87464868ff3db860a50782a259c45d8'],
    blocktime: 24,
    hash: '0x126f57f706fd07623aa2620e3f95cf15c0e4f42994443bccf7c5b631e93590ee',
    txCount: 1,
  },
  {
    index: 786783,
    time: 1510884135,
    size: 686,
    tx: ['0x079a3f5ac617f6100b8cdc6a8817f70ee049dfa6afd20e203c3698e12052f2e2'],
    blocktime: 27,
    hash: '0xc35390bd14c4800dad7c3acc29c00f210a12338431f784ac280f67222064d8f2',
    txCount: 1,
  },
  {
    index: 786782,
    time: 1510884108,
    size: 686,
    tx: ['0xe14820ca14a9347f9b26e71359dd5ac2ff49017fe4ba2b101967ed987b48e8c7'],
    blocktime: 26,
    hash: '0x36016ad7684ead70568de0dbef7d4ec9deb95a99a81fdb4f354c2d533babcf3d',
    txCount: 1,
  },
  {
    index: 786781,
    time: 1510884082,
    size: 888,
    tx: [
      '0x8a3b147f62f16489719d323c5f7687990466ac8f5bb8b8581043f97f56888524',
      '0xc90113a346c704d07811fa72a48d757d86019bd7e84d1d7e6c630e71b5f8e7f3',
    ],
    blocktime: 27,
    hash: '0x091f4b38a176fb05e7f6a7303a1be675e0ff7b4a77fd640f2dfd128d941f7a17',
    txCount: 2,
  },
  {
    index: 786780,
    time: 1510884055,
    size: 686,
    tx: ['0xd65073dc9bb64fedb4bb43d57fb83ea8ae354cac370f5da04eef3a877f930089'],
    blocktime: 20,
    hash: '0x221e3ef8afc7ded6fb2daa38ae0401cad47840a4a1697f954f4a43e4beb5eddd',
    txCount: 1,
  },
  {
    index: 786779,
    time: 1510884035,
    size: 686,
    tx: ['0x80de7957dd206d2038aec04a0d09db320ea118379be901171a2362284cfe8fb0'],
    blocktime: 23,
    hash: '0x53bd2d626973065615c43aed14ebabeb603a2562c6fb76e35fef0a1c92c4fedc',
    txCount: 1,
  },
  {
    index: 786778,
    time: 1510884012,
    size: 1118,
    tx: [
      '0xe8bc74f7a946c0bb88d04520fb01de974a8ae131242c00f2df560b90271f5d21',
      '0x0a954f1adc87c1dc79ef14b0b12a69d2dce1b18b2c67697bb764db3c563629f8',
    ],
    blocktime: 23,
    hash: '0x9731a6c365f2fdf9ca48eaaa2a8fbc10c47a3385bf3bc24fb7a2464736d844e0',
    txCount: 2,
  },
  {
    index: 786777,
    time: 1510883989,
    size: 686,
    tx: ['0x31bc89691305f1f0d3db6a45dd2540f08b81ee8ee84787a62ecca936722dc0e4'],
    blocktime: 20,
    hash: '0xbdf054a24d87eff1115af3c3f0ab68268882c2573b71916d0558c354541c5e5d',
    txCount: 1,
  },
  {
    index: 786776,
    time: 1510883969,
    size: 1084,
    tx: [
      '0xaf46537cb863befe87b27e91db999b006a115d87323b4bf5463968d3729d584a',
      '0x7a053c2c33b8718c570bb736e7835c8d421728c761072baa01013c8a2f33e2ad',
    ],
    blocktime: 29,
    hash: '0xf7eb2c3057c3c5715a28a41b6b5c8d7d587b3a5122fc05dd8eb29f12021eb39d',
    txCount: 2,
  },
  {
    index: 786775,
    time: 1510883940,
    size: 686,
    tx: ['0x380c72f8cb49efd7b69d156cdb942a620461be4b95980684183e84f223e5b762'],
    blocktime: 33,
    hash: '0x9be75481ff0f3d5f4e4238dc43082a02b35a4f59b0f15ae9bf096fd448068923',
    txCount: 1,
  },
  {
    index: 786774,
    time: 1510883907,
    size: 686,
    tx: ['0x139f7ea61cdc053b61292d80e20f2c8ad88a810e6c8638e8bcbd29f025f702f1'],
    blocktime: 27,
    hash: '0x150dea7e5b008ef539ee73e00d0aa0d30230341659407989fc8ad89f46144ea9',
    txCount: 1,
  },
  {
    index: 786773,
    time: 1510883880,
    size: 686,
    tx: ['0xee0490072b1cf85e8c56156a4917334ee3b64b339c11593a6e8baa50d29f6eba'],
    blocktime: 20,
    hash: '0x722f18d875df501c5de8c7b159375380e696cba225eef0ca159c41a78c255ac4',
    txCount: 1,
  },
]

const Home = (): ReactElement => {
  return (
    <div id="Home">
      <div id="neoscan-logo-container">
        <img id="neoscan-logo" alt="neoscan-logo" src={logo} />
        <div id="welcome-text">
          <h1> welcome to neoscan </h1>{' '}
          <div id="welcome-text-underscore">_</div>
        </div>
        <span>Your home for all NEO related blockchain information</span>
      </div>

      <div className="list-row-container">
        <List
          data={MOCK_DATA}
          rowId="index"
          handleRowClick={data => console.log(data)}
          isLoading={false}
          columns={[
            { name: 'Index', accessor: 'index' },
            { name: 'Time', accessor: 'time' },
          ]}
        />
      </div>
    </div>
  )
}

export default Home
