import { skillCatalog } from '../../data/skillCatalog'
import type { MaterialId, SkillCatalogEntry } from './plannerTypes'

const materialLabels: Record<MaterialId, string> = {
  beautys_plume: "Beauty's Plume",
  vicious_fruit: 'Vicious Fruit',
  buddhas_tear_root: "Buddha's Tear Root",
  jade_tower_pearl: 'Jade Tower Pearl',
  jasmine_stamen: 'Jasmine Stamen',
  frost_mushroom_mycelium: 'Frost Mushroom Mycelium',
  stormbone_bloom: 'Stormbone Bloom',
}

export const getSkillById = (skillId: string): SkillCatalogEntry | undefined => {
  return skillCatalog.find((entry) => entry.id === skillId)
}

export const getSkillNameById = (skillId: string): string => {
  return getSkillById(skillId)?.name ?? skillId
}

export const getSkillMaterialById = (skillId: string) => {
  return getSkillById(skillId)?.materialId
}

export const getSkillCategoryById = (skillId: string): string => {
  return getSkillById(skillId)?.category ?? 'Unknown'
}

export const getSkillTagsById = (skillId: string): string[] => {
  return getSkillById(skillId)?.tags ?? []
}

export const getMaterialLabel = (materialId: MaterialId): string => {
  return materialLabels[materialId] ?? materialId
}