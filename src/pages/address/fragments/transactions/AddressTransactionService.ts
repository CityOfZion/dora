import { GENERATE_BASE_URL } from '../../../../constants'

export const fetchTransaction = async (hash: string, page = 1) => {
  try {
    const response = await fetch(
      `${GENERATE_BASE_URL()}/address_txfull/${hash}/${page}`,
    )

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(error)
    return []
  }
}
