import { PublicClient, parseAbi } from 'viem'
import { minerPoolAndGCAAbi } from '../../constants/abis/MinerPoolAndGCA.abi'
import { addresses } from '../../constants/addresses'

/**
 * Get weekly rewards for a given week range
 * @param client - the viem client
 * @param weekStart - the start week
 * @param weekEnd - the end week(inclusive)
 */
export type GetWeeklyRewardsForWeeksArgs = {
  client: PublicClient
  weekStart: number
  weekEnd: number
}

type RewardCallResult = {
  inheritedFromLastWeek: boolean
  amountInBucket: BigInt
  amountToDeduct: BigInt
}
export type RewardWithWeekSerialized = {
  amountInBucket: string
  amountToDeduct: string
  weekNumber: number
}
export async function getWeeklyRewardsForWeeksMulticall({
  client,
  weekStart,
  weekEnd,
}: GetWeeklyRewardsForWeeksArgs) {
  const contract = {
    address: addresses.gcaAndMinerPoolContract,
    abi: minerPoolAndGCAAbi,
  }
  // @ts-ignore
  const results = await client.multicall({
    contracts: Array.from({ length: weekEnd - weekStart + 1 }, (_, i) => ({
      ...contract,
      functionName: 'reward',
      args: [weekStart + i],
    })),
  });

  const rewards: RewardWithWeekSerialized[] = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.error) {
      // console.error(result.error)
      continue
    }
    // @ts-ignore
    const res = result.result! as RewardCallResult
    rewards.push({
      amountInBucket: res.amountInBucket.toString(),
      amountToDeduct: res.amountToDeduct.toString(),
      weekNumber: weekStart + rewards.length,
    })
  }

  return rewards
}