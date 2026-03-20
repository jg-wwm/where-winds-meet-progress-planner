export type FarmableIronTier = 1 | 2 | 3 | 4 | 5

export const getFarmableIronTier = (worldLevel: number): FarmableIronTier => {
  if (worldLevel <= 4) return 1
  if (worldLevel <= 6) return 2
  if (worldLevel <= 8) return 3
  if (worldLevel <= 11) return 4
  return 5
}