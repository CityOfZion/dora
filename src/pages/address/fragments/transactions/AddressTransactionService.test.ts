import { afterEach, describe, expect, test, vi } from 'vitest'
import { fetchTransactions } from './AddressTransactionService'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchTransactions', () => {
  test('uses unified activity history and keeps transactions without transfers', async () => {
    const transaction = {
      block: 123,
      date: '2026-09-17T18:54:04.46Z',
      events: [
        {
          amount: '0',
          contractHash: '0xcontract',
          contractName: 'DataFeed',
          from: null,
          methodName: 'FeedUpdated',
          supportedStandards: null,
          to: null,
        },
      ],
      invocationCount: 1,
      networkFeeAmount: '0.0001',
      notificationCount: 1,
      systemFeeAmount: '0.001',
      transactionID: '0xtransaction',
      transactionSender: 'NAddress',
    }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ data: [transaction], nextCursor: 'next' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    const response = await fetchTransactions('NAddress', 'mainnet')

    expect(response.data).toEqual([transaction])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.coz.io/api/v2/unified/activity-history',
      expect.objectContaining({ method: 'POST' }),
    )

    const request = fetchMock.mock.calls[0][1]
    const body = JSON.parse(String(request?.body))
    expect(body).toEqual(
      expect.objectContaining({
        address: 'NAddress',
        network: 'mainnet',
        protocol: 'neo3',
        pageLimit: 15,
      }),
    )
    expect(body).not.toHaveProperty('cursor')
  })

  test('passes the cursor when loading another page', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ data: [] })))

    await fetchTransactions('NAddress', 'testnet', 'cursor-value')

    const request = fetchMock.mock.calls[0][1]
    const body = JSON.parse(String(request?.body))
    expect(body.cursor).toBe('cursor-value')
  })
})
