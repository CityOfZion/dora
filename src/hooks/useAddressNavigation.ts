import { useNavigate } from 'react-router-dom'

const ADDRESS_MINT = 'NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf'

export const useAddressNavigation = () => {
  const navigate = useNavigate()

  const isAddressClickable = (address?: string) => {
    return !!address && address !== 'burn'
  }

  const navigateToAddress = (
    chain: string,
    network: string,
    address?: string,
  ) => {
    if (!isAddressClickable(address)) {
      return
    }

    const addressPath = address === 'mint' ? ADDRESS_MINT : address

    navigate(`/address/${chain}/${network}/${addressPath}`)
  }

  return { navigateToAddress, isAddressClickable }
}
