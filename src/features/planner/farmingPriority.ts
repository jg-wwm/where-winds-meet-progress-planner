import type { Character, MaterialId } from './plannerTypes'
import { calculateMaterialTotals } from './materialPlanner'
import { calculateIronSummary } from './ironPlanner'
import {
  getMaterialLabel,
  getSkillById,
  getSkillNameById,
} from './skillCatalogHelpers'

export interface FarmingPriorityItem {
  kind: 'material' | 'iron'
  label: string
  remaining: number
  usedBy: string[]
}

export interface MaterialBreakdownItem {
  materialId: MaterialId
  label: string
  remaining: number
  inventory: number
  totalNeeded: number
  usedBy: string[]
}

export const calculateFarmingPriority = (
  character?: Character | null,
): FarmingPriorityItem[] => {
  if (!character) {
    return []
  }

  const { allTotals } = calculateMaterialTotals(character)
  const ironSummary = calculateIronSummary(character)
  const skills = Array.isArray(character.skills) ? character.skills : []
  const materialsInventory = character.inventory?.materials ?? {}

  const materialItems = Object.entries(allTotals)
    .map(([materialId, totalNeeded]) => {
      const inventory =
        materialsInventory[
          materialId as keyof Character['inventory']['materials']
        ] ?? 0

      const remaining = Math.max(totalNeeded - inventory, 0)

      const usedBy = skills
        .filter((skill) => skill?.includeInFarming)
        .filter((skill) => {
          const meta = getSkillById(skill.skillId)
          return meta?.materialId === materialId
        })
        .map((skill) => getSkillNameById(skill.skillId))

      return {
        kind: 'material' as const,
        label: getMaterialLabel(materialId as MaterialId),
        remaining,
        usedBy,
      }
    })
    .filter((item) => item.remaining > 0)

  const ironItems: FarmingPriorityItem[] =
    ironSummary.farmableIronNeeded > 0
      ? [
          {
            kind: 'iron',
            label: `Farmable Lv${ironSummary.farmableIronTier} Ebon Iron`,
            remaining: ironSummary.farmableIronNeeded,
            usedBy: [],
          },
        ]
      : []

  return [...materialItems, ...ironItems].sort((a, b) => {
    if (a.remaining !== b.remaining) {
      return b.remaining - a.remaining
    }

    if (a.kind !== b.kind) {
      return a.kind === 'material' ? -1 : 1
    }

    return a.label.localeCompare(b.label)
  })
}

export const calculateMaterialBreakdown = (
  character?: Character | null,
): MaterialBreakdownItem[] => {
  if (!character) {
    return []
  }

  const { allTotals } = calculateMaterialTotals(character)
  const skills = Array.isArray(character.skills) ? character.skills : []
  const materialsInventory = character.inventory?.materials ?? {}

  return (Object.entries(allTotals) as Array<[MaterialId, number]>)
    .map(([materialId, totalNeeded]) => {
      const inventory =
        materialsInventory[
          materialId as keyof Character['inventory']['materials']
        ] ?? 0

      const remaining = Math.max(totalNeeded - inventory, 0)

      const usedBy = skills
        .filter((skill) => skill?.includeInFarming)
        .filter((skill) => {
          const meta = getSkillById(skill.skillId)
          return meta?.materialId === materialId
        })
        .map((skill) => getSkillNameById(skill.skillId))

      return {
        materialId,
        label: getMaterialLabel(materialId),
        remaining,
        inventory,
        totalNeeded,
        usedBy,
      }
    })
    .filter((item) => item.totalNeeded > 0 || item.inventory > 0)
    .sort((a, b) => {
      if (a.remaining !== b.remaining) {
        return b.remaining - a.remaining
      }

      if (a.totalNeeded !== b.totalNeeded) {
        return b.totalNeeded - a.totalNeeded
      }

      return a.label.localeCompare(b.label)
    })
}