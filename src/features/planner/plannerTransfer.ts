import { PLANNER_VERSION, emptyIronInventory, emptyMaterialInventory } from './plannerDefaults'
import type {
  Character,
  CharacterSkill,
  PlannerData,
  SkillPriority,
  Tier,
  Rank,
  MaterialInventory,
  IronInventory,
} from './plannerTypes'

interface PlannerExportFile {
  format: 'where-winds-meet-progress-planner'
  version: 1
  exportedAt: string
  plannerData: PlannerData
}

const CURRENT_EXPORT_FORMAT = 'where-winds-meet-progress-planner' as const
const LEGACY_EXPORT_FORMAT = 'wwm-mystic-upgrade-planner' as const

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asString = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalizeTier = (value: unknown): Tier => {
  const tier = Math.floor(asNumber(value, 1))

  if (tier <= 1) return 1
  if (tier === 2) return 2
  if (tier === 3) return 3
  if (tier === 4) return 4
  if (tier === 5) return 5
  return 6
}

const normalizeRank = (value: unknown): Rank => {
  const rank = Math.floor(asNumber(value, 0))

  if (rank <= 0) return 0
  if (rank === 1) return 1
  if (rank === 2) return 2
  if (rank === 3) return 3
  if (rank === 4) return 4
  if (rank === 5) return 5
  if (rank === 6) return 6
  if (rank === 7) return 7
  if (rank === 8) return 8
  return 9
}

const normalizePriority = (value: unknown): SkillPriority =>
  value === 'prime' ? 'prime' : 'secondary'

const normalizeMaterialInventory = (value: unknown): MaterialInventory => {
  const source = isObject(value) ? value : {}

  return {
    ...emptyMaterialInventory(),
    beautys_plume: asNumber(source.beautys_plume, 0),
    vicious_fruit: asNumber(source.vicious_fruit, 0),
    buddhas_tear_root: asNumber(source.buddhas_tear_root, 0),
    jade_tower_pearl: asNumber(source.jade_tower_pearl, 0),
    jasmine_stamen: asNumber(source.jasmine_stamen, 0),
    frost_mushroom_mycelium: asNumber(source.frost_mushroom_mycelium, 0),
    stormbone_bloom: asNumber(source.stormbone_bloom, 0),
  }
}

const normalizeIronInventory = (value: unknown): IronInventory => {
  const source = isObject(value) ? value : {}

  return {
    ...emptyIronInventory(),
    ebon_iron_lv1: asNumber(source.ebon_iron_lv1, 0),
    ebon_iron_lv2: asNumber(source.ebon_iron_lv2, 0),
    ebon_iron_lv3: asNumber(source.ebon_iron_lv3, 0),
    ebon_iron_lv4: asNumber(source.ebon_iron_lv4, 0),
    ebon_iron_lv5: asNumber(source.ebon_iron_lv5, 0),
    darkgold_iron_nanlu: asNumber(source.darkgold_iron_nanlu, 0),
  }
}

const normalizeSkill = (value: unknown, index: number): CharacterSkill | null => {
  if (!isObject(value)) {
    return null
  }

  if (typeof value.skillId !== 'string' || !value.skillId.trim()) {
    return null
  }

  return {
    id: asString(value.id, `imported-skill-${index + 1}`),
    skillId: value.skillId,
    currentTier: normalizeTier(value.currentTier),
    currentRank: normalizeRank(value.currentRank),
    targetTier: normalizeTier(value.targetTier),
    targetRank: normalizeRank(value.targetRank),
    priority: normalizePriority(value.priority),
    includeInFarming: value.includeInFarming === true,
  }
}

const normalizeCharacter = (value: unknown, index: number): Character | null => {
  if (!isObject(value)) {
    return null
  }

  const inventory = isObject(value.inventory) ? value.inventory : {}
  const rawSkills = Array.isArray(value.skills) ? value.skills : []

  return {
    id: asString(value.id, `imported-character-${index + 1}`),
    name: asString(value.name, `Character ${index + 1}`),
    worldLevel: Math.max(1, Math.floor(asNumber(value.worldLevel, 1))),
    skills: rawSkills
      .map((skill, skillIndex) => normalizeSkill(skill, skillIndex))
      .filter((skill): skill is CharacterSkill => skill !== null),
    inventory: {
      materials: normalizeMaterialInventory(inventory.materials),
      iron: normalizeIronInventory(inventory.iron),
    },
  }
}

const normalizePlannerData = (value: unknown): PlannerData => {
  if (!isObject(value)) {
    throw new Error('Import file is not valid planner data.')
  }

  const rawCharacters = Array.isArray(value.characters) ? value.characters : []

  return {
    version: asString(value.version, PLANNER_VERSION),
    updatedAt: asString(value.updatedAt, new Date().toISOString()),
    characters: rawCharacters
      .map((character, index) => normalizeCharacter(character, index))
      .filter((character): character is Character => character !== null),
  }
}

export const downloadPlannerExport = (plannerData: PlannerData) => {
  const exportPayload: PlannerExportFile = {
    format: CURRENT_EXPORT_FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    plannerData,
  }

  const json = JSON.stringify(exportPayload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `where-winds-meet-progress-planner-${new Date().toISOString().slice(0, 10)}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.URL.revokeObjectURL(url)
}

export const parsePlannerImport = (jsonText: string): PlannerData => {
  let parsed: unknown

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('That file is not valid JSON.')
  }

  if (
    isObject(parsed) &&
    (parsed.format === CURRENT_EXPORT_FORMAT ||
      parsed.format === LEGACY_EXPORT_FORMAT) &&
    'plannerData' in parsed
  ) {
    return normalizePlannerData(parsed.plannerData)
  }

  return normalizePlannerData(parsed)
}