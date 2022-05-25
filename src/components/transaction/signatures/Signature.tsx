import React, { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'

import ExpandingPanel from '../../panel/ExpandingPanel'
import { Signer } from '../../../reducers/transactionReducer'
import { Box, Collapse, Flex, Text } from '@chakra-ui/react'
import Copy from '../../copy/Copy'
import { ROUTES } from '../../../constants'
import { truncateHash } from '../../../utils/formatter'
import useWindowWidth from '../../../hooks/useWindowWidth'

export const Signature: React.FC<{
  signers: Signer[]
  chain: string
  network: string
}> = ({ signers, chain, network }): ReactElement => {
  const width = useWindowWidth()
  const [isOpen, setOpen] = useState<Record<string, boolean>>({})

  const isMobile = width <= 460

  return (
    <Box my={3}>
      <ExpandingPanel
        title={<Text textTransform={`uppercase`}>Signatures</Text>}
        open={false}
      >
        {signers.map((signature, index) => (
          <Box key={signature.scopes + index}>
            <Box bg={'medium-grey-blue'} mt={3}>
              <Flex
                justifyContent={'space-between'}
                px={3}
                py={2}
                alignItems={'center'}
                overflow={'hidden'}
                flex={1}
              >
                <Text fontSize={'sm'} fontWeight={500} color={'white'}>
                  Signer
                </Text>
                <Flex
                  alignItems={'center'}
                  overflow={'hidden'}
                  flex={1}
                  justifyContent={'end'}
                >
                  <Text
                    fontSize={'sm'}
                    isTruncated
                    color={'tertiary'}
                    mx={2}
                    fontWeight={500}
                  >
                    {truncateHash(signature.account, isMobile, 15, 5)}
                  </Text>

                  <Copy text={signature.account} />
                </Flex>
              </Flex>

              <Flex
                justifyContent={'space-between'}
                alignItems={`center`}
                bg={'darkest-grey'}
                px={3}
                py={1}
                fontWeight={500}
                cursor={'pointer'}
                onClick={() =>
                  setOpen({
                    ...isOpen,
                    [signature.scopes]: !isOpen[signature.scopes],
                  })
                }
              >
                <Text color={'white'} my={1.5} fontSize={'md'}>
                  {signature.scopes}
                </Text>
                {signature.allowedcontracts && (
                  <Box>
                    {isOpen[signature.scopes] ? (
                      <Text mx={2} color={'tertiary'} fontSize={'4xl'}>
                        -
                      </Text>
                    ) : (
                      <Text mx={2} color={'tertiary'} fontSize={'4xl'}>
                        +
                      </Text>
                    )}
                  </Box>
                )}
              </Flex>
            </Box>

            {signature.allowedcontracts && (
              <Collapse in={isOpen[signature.scopes]}>
                <Box bg={`white-70`} px={3} py={4}>
                  {signature.allowedcontracts.map((it, idx) => (
                    <Flex direction={'column'} key={it}>
                      <Flex
                        minH={10}
                        alignItems={'center'}
                        bg={'white-100'}
                        mb={1}
                        overflow={'hidden'}
                        flex={1}
                      >
                        <Text color={'white-500'} mx={3}>
                          [{idx}]
                        </Text>
                        <Text
                          fontSize={'sm'}
                          isTruncated
                          color={'tertiary'}
                          fontWeight={400}
                        >
                          <Link
                            to={`${ROUTES.CONTRACT.url}/${chain}/${network}/${it}`}
                          >
                            {truncateHash(it, isMobile, 15, 5)}
                          </Link>
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        ))}
      </ExpandingPanel>
    </Box>
  )
}

export default Signature
