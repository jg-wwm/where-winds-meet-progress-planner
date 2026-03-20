import { getSkillMaterialById } from './skillCatalogHelpers'
import { tierUpgradeRules } from './upgradeTables'
import type { CharacterSkill, IronId, MaterialId } from './plannerTypes'

export interface UpgradePathStep {
  label: string
  materialNeeded: number
  ironNeeded: Record<IronId, number>
}

export interface UpgradePathResult {
  materialId: MaterialId
  materialNeeded: number
  ironNeeded: Record<IronId, number>
  steps: UpgradePathStep[]
}

const emptyIronTotals = (): Record<IronId, number> => ({
  ebon_iron_lv1: 0,
  ebon_iron_lv2: 0,
  ebon_iron_lv3: 0,
  ebon_iron_lv4: 0,
  ebon_iron_lv5: 0,
  darkgold_iron_nanlu: 0,
})

const getIronIdForTier = (tier: number): IronId => {
  switch (tier) {
    case 1:
      return 'ebon_iron_lv1'
    case 2:
      return 'ebon_iron_lv2'
    case 3:
      return 'ebon_iron_lv3'
    case 4:
      return 'ebon_iron_lv4'
    case 5:
      return 'ebon_iron_lv5'
    case 6:
      return 'darkgold_iron_nanlu'
    default:
      return 'ebon_iron_lv1'
  }
}

const getRuleForTier = (tier: number) => {
  const rule = tierUpgradeRules.find((entry) => entry.tier === tier)

  if (!rule) {
    throw new Error(`No upgrade rule found for tier ${tier}`)
  }

  return rule
}

export const calculateUpgradePath = (skill: CharacterSkill): UpgradePathResult => {
  const materialId = getSkillMaterialById(skill.skillId)

  if (!materialId) {
    throw new Error(`No material found for skill ${skill.skillId}`)
  }

  const ironNeeded = emptyIronTotals()
  const steps: UpgradePathStep[] = []
  let materialNeeded = 0

  let tier = skill.currentTier
  let rank = skill.currentRank

  while (
    tier < skill.targetTier ||
    (tier === skill.targetTier && rank < skill.targetRank)
  ) {
    const rule = getRuleForTier(tier)
    const ironId = getIronIdForTier(tier)

    if (rank < 9) {
      const targetRankForThisTier = tier === skill.targetTier ? skill.targetRank : 9
      const ranksToGain = targetRankForThisTier - rank

      if (ranksToGain > 0) {
        const stepIron = emptyIronTotals()
        const ironForStep = rule.ironPerRank * ranksToGain

        stepIron[ironId] = ironForStep
        ironNeeded[ironId] += ironForStep

        steps.push({
          label: `Tier ${tier}: Rank ${rank} → ${targetRankForThisTier}`,
          materialNeeded: 0,
          ironNeeded: stepIron,
        })

        rank = targetRankForThisTier
        continue
      }
    }

    if (rank === 9 && tier < skill.targetTier) {
      const stepIron = emptyIronTotals()

      stepIron[ironId] = rule.breakthroughIron
      ironNeeded[ironId] += rule.breakthroughIron
      materialNeeded += rule.breakthroughPlant

      steps.push({
        label: `Breakthrough: Tier ${tier} → Tier ${tier + 1}`,
        materialNeeded: rule.breakthroughPlant,
        ironNeeded: stepIron,
      })

      tier += 1
      rank = 0
      continue
    }

    break
  }

  return {
    materialId,
    materialNeeded,
    ironNeeded,
    steps,
  }
}