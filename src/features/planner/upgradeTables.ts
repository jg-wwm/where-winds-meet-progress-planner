export interface TierUpgradeRule {
  tier: 1 | 2 | 3 | 4 | 5 | 6
  ironPerRank: number
  breakthroughIron: number
  breakthroughPlant: number
}

export const tierUpgradeRules: TierUpgradeRule[] = [
  {
    tier: 1,
    ironPerRank: 2,
    breakthroughIron: 2,
    breakthroughPlant: 5,
  },
  {
    tier: 2,
    ironPerRank: 4,
    breakthroughIron: 4,
    breakthroughPlant: 15,
  },
  {
    tier: 3,
    ironPerRank: 10,
    breakthroughIron: 10,
    breakthroughPlant: 18,
  },
  {
    tier: 4,
    ironPerRank: 20,
    breakthroughIron: 20,
    breakthroughPlant: 28,
  },
  {
    tier: 5,
    ironPerRank: 32,
    breakthroughIron: 32,
    breakthroughPlant: 35,
  },
  {
    tier: 6,
    ironPerRank: 32, // placeholder until Darkgold rank pattern is confirmed
    breakthroughIron: 0,
    breakthroughPlant: 0,
  },
]