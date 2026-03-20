import type {
  Character,
  CharacterSkill,
  IronInventory,
  MaterialInventory,
  PlannerData,
} from './plannerTypes'
import { skillCatalog } from '../../data/skillCatalog'

export const STORAGE_KEY = 'wwm-mystic-upgrade-planner-v1'
export const PLANNER_VERSION = '1.0.0'

export const emptyMaterialInventory = (): MaterialInventory => ({
  beautys_plume: 0,
  vicious_fruit: 0,
  buddhas_tear_root: 0,
  jade_tower_pearl: 0,
  jasmine_stamen: 0,
  frost_mushroom_mycelium: 0,
  stormbone_bloom: 0,
})

export const emptyIronInventory = (): IronInventory => ({
  ebon_iron_lv1: 0,
  ebon_iron_lv2: 0,
  ebon_iron_lv3: 0,
  ebon_iron_lv4: 0,
  ebon_iron_lv5: 0,
  darkgold_iron_nanlu: 0,
})

const createId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const buildFullSkillRoster = (): CharacterSkill[] =>
  skillCatalog.map((skill, index) => ({
    id: createId(`skill-row-${index + 1}`),
    skillId: skill.id,
    currentTier: 1,
    currentRank: 0,
    targetTier: 1,
    targetRank: 0,
    priority: 'prime',
    includeInFarming: false,
  }))

export const createEmptyCharacter = (name = 'New Character'): Character => ({
  id: createId('character'),
  name,
  worldLevel: 1,
  skills: buildFullSkillRoster(),
  inventory: {
    materials: emptyMaterialInventory(),
    iron: emptyIronInventory(),
  },
})

export const createEmptyPlannerData = (): PlannerData => ({
  version: PLANNER_VERSION,
  updatedAt: new Date().toISOString(),
  characters: [],
})