export type SkillPriority = 'prime' | 'secondary'

export type MaterialId =
  | 'beautys_plume'
  | 'vicious_fruit'
  | 'buddhas_tear_root'
  | 'jade_tower_pearl'
  | 'jasmine_stamen'
  | 'frost_mushroom_mycelium'
  | 'stormbone_bloom'

export type IronId =
  | 'ebon_iron_lv1'
  | 'ebon_iron_lv2'
  | 'ebon_iron_lv3'
  | 'ebon_iron_lv4'
  | 'ebon_iron_lv5'
  | 'darkgold_iron_nanlu'

export type Tier = 1 | 2 | 3 | 4 | 5 | 6
export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface SkillCatalogEntry {
  id: string
  name: string
  materialId: MaterialId
  category: string
  tags: string[]
}
export interface CharacterSkill {
  id: string
  skillId: string
  currentTier: Tier
  currentRank: Rank
  targetTier: Tier
  targetRank: Rank
  priority: SkillPriority
  includeInFarming: boolean
}

export interface MaterialInventory {
  beautys_plume: number
  vicious_fruit: number
  buddhas_tear_root: number
  jade_tower_pearl: number
  jasmine_stamen: number
  frost_mushroom_mycelium: number
  stormbone_bloom: number
}

export interface IronInventory {
  ebon_iron_lv1: number
  ebon_iron_lv2: number
  ebon_iron_lv3: number
  ebon_iron_lv4: number
  ebon_iron_lv5: number
  darkgold_iron_nanlu: number
}

export interface Character {
  id: string
  name: string
  worldLevel: number
  skills: CharacterSkill[]
  inventory: {
    materials: MaterialInventory
    iron: IronInventory
  }
}

export interface PlannerData {
  version: string
  updatedAt: string
  characters: Character[]
}