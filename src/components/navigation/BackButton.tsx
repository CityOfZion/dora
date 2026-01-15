import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, BoxProps, Button, Flex, Text } from '@chakra-ui/react'

interface Props extends BoxProps {
  text: string
  url?: string
}

const BackButton: React.FC<Props> = ({ text, url, ...props }): ReactElement => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (url) {
      navigate(url)
      return
    }

    navigate(-1)
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
