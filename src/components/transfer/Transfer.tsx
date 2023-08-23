import React from 'react'
import uniqueId from 'lodash/uniqueId'

import { ReactComponent as TransferArrow } from '../../assets/icons/transfer-arrow.svg'
import txBackgroundCubes from '../../assets/tx_mask.svg'
import txBackgroundCubesMobile from '../../assets/cubes.png'
import txRightCube from '../../assets/tx_right_cubes.svg'
import txCube from '../../assets/tx_cube.svg'

import './Transfer.scss'
import { getLogo } from '../../utils/getLogo'
import { DetailedTransaction } from '../../reducers/transactionReducer'
import { useHistory } from 'react-router-dom'
import { convertToArbitraryDecimals } from '../../utils/formatter'
import { Box, Flex, Img, SimpleGrid, Text } from '@chakra-ui/react'
import useWindowWidth from '../../hooks/useWindowWidth'

type Transfer = {
  from: string
  name: string
  to: string
  amount: string | number
  symbol: string
}

type Props = {
  transfers: Array<Transfer>
  network: string
  transaction: DetailedTransaction
  chain: string
}

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const icon = getLogo(symbol, chain)

  return icon && <img src={icon} className="icon" alt="token-logo" />
}

const Transfer = ({ transfers = [], network, transaction, chain }: Props) => {
  const width = useWindowWidth()
  const history = useHistory()

  const isMobileOrTablet = width <= 990

  function handleAddressClick(address: string) {
    history.push(`/address/${chain}/${network}/${address}`)
  }

  function getNetworkFee() {
    return String(convertToArbitraryDecimals(Number(transaction.netfee), 8))
  }

  function getSystemfee() {
    return String(convertToArbitraryDecimals(Number(transaction.sysfee), 8))
  }

  function getSize() {
    return transaction.size.toLocaleString()
  }

  return (
    <SimpleGrid columns={[1, 1, 1, 3]} gap={2} className="transfer-container">
      <Flex
        flexDir={'column'}
        p={4}
        bg={'white-50'}
        pos={'relative'}
        overflow={'hidden'}
        mb={5}
      >
        <Text
          fontWeight={700}
          fontSize={'xs'}
          textAlign={'left'}
          color={'medium-grey'}
        >
          SENT FROM
        </Text>
        <Box className="asset-transfer-details-container">
          {transfers.map(
            (transfer: Transfer) =>
              transfer.from && (
                <Flex
                  maxW={'100%'}
                  boxSizing={'border-box'}
                  key={uniqueId()}
                  className="asset-transfer-detail-container"
                >
                  <Text
                    maxW={'inherit'}
                    flex={1}
                    isTruncated
                    textOverflow={'clip'}
                    textAlign={'center'}
                    color={'tertiary'}
                    mb={4}
                    onClick={() => handleAddressClick(transfer.from)}
                    cursor={'pointer'}
                    zIndex={2}
                  >
                    {transfer.from}
                  </Text>
                  <Flex className="transfer-amount-container" mb={2}>
                    {getTransferLogo(transfer.symbol, chain)}
                    <Text>{transfer.amount}</Text>
                    <Text>{transfer.name}</Text>
                  </Flex>
                </Flex>
              ),
          )}
        </Box>
        {isMobileOrTablet ? (
          <Img
            pos={'absolute'}
            src={txCube}
            alt="tx-background-cubes"
            transform={'rotateZ(90deg)'}
            bottom={'-15px'}
            right={'31%'}
            w={120}
          />
        ) : (
          <Img
            pos={'absolute'}
            src={txCube}
            alt="tx-background-cubes"
            right={0}
            top={170}
            w={120}
          />
        )}
      </Flex>

      <Flex
        className="transfer-column"
        flexDir={['row', 'column']}
        justifyContent={['center', 'unset']}
        alignItems={'center'}
        maxH={'100%'}
        boxSizing={'border-box'}
        overflow={'hidden'}
        pos={'relative'}
        mb={5}
        py={5}
      >
        {isMobileOrTablet ? (
          <Img
            src={txBackgroundCubesMobile}
            alt="tx-background-cubes"
            pos={'absolute'}
            right={['8%', '15%']}
            minH={'100%'}
            w={['60%', '40%']}
            top={0}
          />
        ) : (
          <Img
            src={txBackgroundCubes}
            alt="tx-background-cubes"
            pos={'absolute'}
            top={0}
            w={450}
            maxW={'unset'}
          />
        )}

        {isMobileOrTablet ? (
          <Flex
            transform={'rotateZ(90deg)'}
            justifyContent={'center'}
            w={'60px'}
            m={0}
            py={0}
            px={3}
            flex={1}
          >
            <TransferArrow />
          </Flex>
        ) : (
          <TransferArrow />
        )}

        <Flex
          mt={5}
          flexDir={'column'}
          flex={[3, 1]}
          letterSpacing={'-0.56px'}
          fontSize={'sm'}
          fontWeight={600}
          lineHeight={'23px'}
        >
          <Flex mb={2}>
            <Text color={'medium-grey'} letterSpacing={'normal'}>
              Network fee:
            </Text>
            <Text mx={2}>{getNetworkFee()} GAS</Text>
          </Flex>
          <Flex mb={2}>
            <Text color={'medium-grey'} letterSpacing={'normal'}>
              System fee:
            </Text>
            <Text mx={2}>{getSystemfee()} GAS</Text>
          </Flex>
          <Flex mb={2}>
            <Text color={'medium-grey'} letterSpacing={'normal'}>
              Data size:
            </Text>
            <Text mx={2}>{getSize()} bytes</Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        flexDir={'column'}
        p={4}
        bg={'white-50'}
        pos={'relative'}
        overflow={'hidden'}
        mb={5}
      >
        <Text
          fontWeight={700}
          fontSize={'xs'}
          textAlign={'left'}
          color={'medium-grey'}
        >
          SENT TO
        </Text>
        {isMobileOrTablet ? (
          <Img
            src={txCube}
            pos={'absolute'}
            alt="tx-background-cubes"
            top={['-15px', '-15px', '-15px', 'auto']}
            right={'18%'}
            w={120}
          />
        ) : (
          <Img
            src={txRightCube}
            pos={'absolute'}
            alt="tx-background-cubes"
            w={230}
            left={'-5px'}
          />
        )}
        <Box className="asset-transfer-details-container">
          {transfers.map(
            (transfer: Transfer) =>
              transfer.to && (
                <Flex
                  maxW={'100%'}
                  boxSizing={'border-box'}
                  key={uniqueId()}
                  className="asset-transfer-detail-container"
                >
                  <Text
                    maxW={'inherit'}
                    flex={1}
                    isTruncated
                    textOverflow={'clip'}
                    textAlign={'center'}
                    color={'tertiary'}
                    mb={4}
                    onClick={() => handleAddressClick(transfer.to)}
                    cursor={'pointer'}
                    zIndex={2}
                  >
                    {transfer.to}
                  </Text>
                  <Flex className="transfer-amount-container" mb={2}>
                    {getTransferLogo(transfer.symbol, chain)}
                    <Text>{transfer.amount}</Text>
                    <Text>{transfer.name}</Text>
                  </Flex>
                </Flex>
              ),
          )}
        </Box>
      </Flex>
    </SimpleGrid>
  )
}

export default Transfer
