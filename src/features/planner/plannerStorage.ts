import type { Character } from './plannerTypes'
import { STORAGE_KEY } from './plannerDefaults'

export interface PlannerDataShape {
  updatedAt?: string | null
  characters: Character[]
}

export interface PlannerSaveData<
  TPlannerData extends PlannerDataShape = PlannerDataShape,
> {
  version: 1
  plannerData: TPlannerData
  activeTab: string
}

const isPlannerSaveData = (value: unknown): value is PlannerSaveData => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Partial<PlannerSaveData>

  if (data.version !== 1) {
    return false
  }

  if (typeof data.activeTab !== 'string') {
    return false
  }

  if (!data.plannerData || typeof data.plannerData !== 'object') {
    return false
  }

  if (!Array.isArray(data.plannerData.characters)) {
    return false
  }

  return true
}

export const loadPlannerState = <
  TPlannerData extends PlannerDataShape = PlannerDataShape,
>(): PlannerSaveData<TPlannerData> | null => {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)

    if (!isPlannerSaveData(parsed)) {
      console.warn('Planner save data was invalid and has been ignored.')
      return null
    }

    return parsed as PlannerSaveData<TPlannerData>
  } catch (error) {
    console.error('Failed to load planner state from localStorage.', error)
    return null
  }
}

export const savePlannerState = <
  TPlannerData extends PlannerDataShape = PlannerDataShape,
>(
  data: PlannerSaveData<TPlannerData>,
): boolean => {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save planner state to localStorage.', error)
    return false
  }
}

export const clearPlannerState = () => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear planner state from localStorage.', error)
  }
}