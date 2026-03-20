import { calculateUpgradePath } from './calculateUpgradePath'
import { getFarmableIronTier } from './ironRules'
import type { Character, IronId } from './plannerTypes'

export interface IronSummary {
  exactNeeded: Record<IronId, number>
  inventory: Record<IronId, number>
  shortfall: Record<IronId, number>
  farmableIronTier: 1 | 2 | 3 | 4 | 5
  farmableIronNeeded: number
  rolledUpLowerTierShortfall: number
  lowerTierReplacementSources: IronId[]
}

const emptyIronTotals = (): Record<IronId, number> => ({
  ebon_iron_lv1: 0,
  ebon_iron_lv2: 0,
  ebon_iron_lv3: 0,
  ebon_iron_lv4: 0,
  ebon_iron_lv5: 0,
  darkgold_iron_nanlu: 0,
})

const ebonIronIds: IronId[] = [
  'ebon_iron_lv1',
  'ebon_iron_lv2',
  'ebon_iron_lv3',
  'ebon_iron_lv4',
  'ebon_iron_lv5',
]

const ironTierMap: Record<IronId, number> = {
  ebon_iron_lv1: 1,
  ebon_iron_lv2: 2,
  ebon_iron_lv3: 3,
  ebon_iron_lv4: 4,
  ebon_iron_lv5: 5,
  darkgold_iron_nanlu: 999,
}

const farmableIronIdMap: Record<1 | 2 | 3 | 4 | 5, IronId> = {
  1: 'ebon_iron_lv1',
  2: 'ebon_iron_lv2',
  3: 'ebon_iron_lv3',
  4: 'ebon_iron_lv4',
  5: 'ebon_iron_lv5',
}

export const calculateIronSummary = (character: Character): IronSummary => {
  const exactNeeded = emptyIronTotals()

  for (const skill of character.skills) {
    if (!skill.includeInFarming) continue

    const result = calculateUpgradePath(skill)

    for (const ironId of Object.keys(result.ironNeeded) as IronId[]) {
      exactNeeded[ironId] += result.ironNeeded[ironId]
    }
  }

  const inventory: Record<IronId, number> = {
    ebon_iron_lv1: character.inventory.iron.ebon_iron_lv1,
    ebon_iron_lv2: character.inventory.iron.ebon_iron_lv2,
    ebon_iron_lv3: character.inventory.iron.ebon_iron_lv3,
    ebon_iron_lv4: character.inventory.iron.ebon_iron_lv4,
    ebon_iron_lv5: character.inventory.iron.ebon_iron_lv5,
    darkgold_iron_nanlu: character.inventory.iron.darkgold_iron_nanlu,
  }

  const shortfall = emptyIronTotals()

  for (const ironId of Object.keys(exactNeeded) as IronId[]) {
    shortfall[ironId] = Math.max(exactNeeded[ironId] - inventory[ironId], 0)
  }

  const farmableIronTier = getFarmableIronTier(character.worldLevel)
  const farmableIronId = farmableIronIdMap[farmableIronTier]

  let rolledUpLowerTierShortfall = 0
  const lowerTierReplacementSources: IronId[] = []

  for (const ironId of ebonIronIds) {
    const tier = ironTierMap[ironId]

    if (tier < farmableIronTier && shortfall[ironId] > 0) {
      rolledUpLowerTierShortfall += shortfall[ironId]
      lowerTierReplacementSources.push(ironId)
    }
  }

  const farmableIronNeeded = Math.max(
    exactNeeded[farmableIronId] + rolledUpLowerTierShortfall - inventory[farmableIronId],
    0,
  )

  return {
    exactNeeded,
    inventory,
    shortfall,
    farmableIronTier,
    farmableIronNeeded,
    rolledUpLowerTierShortfall,
    lowerTierReplacementSources,
  }
}