import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, BoxProps, Button, Flex, Text } from '@chakra-ui/react'

interface Props extends BoxProps {
  text: string
  url?: string
  fallbackUrl?: string
}

const BackButton: React.FC<Props> = ({
  text,
  url,
  fallbackUrl,
  ...props
}): ReactElement => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (url) {
      navigate(url)
      return
    }

    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    if (fallbackUrl) {
      navigate(fallbackUrl)
    }
  }

  return (
    <Box {...props}>
      <Button m={0} p={0} onClick={handleClick}>
        <Flex
          bg={'tertiary'}
          borderRadius={16}
          pl={3}
          pr={6}
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
