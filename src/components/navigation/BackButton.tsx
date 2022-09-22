import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { Box, BoxProps, Button, Flex, Text } from '@chakra-ui/react'

interface Props extends BoxProps {
  text: string
  url?: string
}

const BackButton: React.FC<Props> = ({ text, url, ...props }): ReactElement => {
  const history = useHistory()

  const handleClick = () => {
    if (url) {
      history.push(url)
      return
    }

    history.goBack()
  }

  return (
    <Box {...props}>
      <Button m={0} p={0} onClick={handleClick}>
        <Flex
          bg={'tertiary'}
          borderRadius={16}
          px={3}
          py={1}
          alignItems={`center`}
        >
          <ChevronLeftIcon />
          <Text
            fontWeight={600}
            fontSize={16}
            textTransform={'capitalize'}
            mt={1}
          >
            {text}
          </Text>
        </Flex>
      </Button>
    </Box>
  )
}

export default BackButton
