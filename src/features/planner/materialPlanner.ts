import { calculateUpgradePath } from './calculateUpgradePath'
import type { Character } from './plannerTypes'

export interface MaterialTotals {
  [materialId: string]: number
}

const emptyTotals = (): MaterialTotals => ({
  beautys_plume: 0,
  vicious_fruit: 0,
  buddhas_tear_root: 0,
  jade_tower_pearl: 0,
  jasmine_stamen: 0,
  frost_mushroom_mycelium: 0,
  stormbone_bloom: 0,
})

export function calculateMaterialTotals(character?: Character | null) {
  const primeTotals = emptyTotals()
  const allTotals = emptyTotals()

  if (!character || !Array.isArray(character.skills)) {
    return {
      primeTotals,
      allTotals,
    }
  }

  for (const skill of character.skills) {
    if (!skill?.includeInFarming) continue

    const result = calculateUpgradePath(skill)
    const material = result.materialId

    if (allTotals[material] === undefined) {
      allTotals[material] = 0
    }

    if (primeTotals[material] === undefined) {
      primeTotals[material] = 0
    }

    allTotals[material] += result.materialNeeded

    if (skill.priority === 'prime') {
      primeTotals[material] += result.materialNeeded
    }
  }

  return {
    primeTotals,
    allTotals,
  }
}