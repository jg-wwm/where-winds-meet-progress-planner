import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
  clearPlannerState,
  loadPlannerState,
  savePlannerState,
  type PlannerDataShape,
} from './plannerStorage'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface UsePlannerPersistenceProps<TPlannerData extends PlannerDataShape> {
  plannerData: TPlannerData
  setPlannerData: Dispatch<SetStateAction<TPlannerData>>
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  delay?: number
}

export const usePlannerPersistence = <TPlannerData extends PlannerDataShape>({
  plannerData,
  setPlannerData,
  activeTab,
  setActiveTab,
  delay = 400,
}: UsePlannerPersistenceProps<TPlannerData>) => {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  useEffect(() => {
    const saved = loadPlannerState<TPlannerData>()

    if (saved) {
      setPlannerData(saved.plannerData)

      const savedTabIsValid =
        saved.activeTab === 'dashboard' ||
        saved.plannerData.characters.some(
          (character) => character.id === saved.activeTab,
        )

      setActiveTab(savedTabIsValid ? saved.activeTab : 'dashboard')
    }

    setHasHydrated(true)
  }, [setPlannerData, setActiveTab])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    setSaveState('saving')

    let resetTimer: number | undefined

    const saveTimer = window.setTimeout(() => {
      const success = savePlannerState<TPlannerData>({
        version: 1,
        plannerData,
        activeTab,
      })

      setSaveState(success ? 'saved' : 'error')

      if (success) {
        resetTimer = window.setTimeout(() => {
          setSaveState('idle')
        }, 1200)
      }
    }, delay)

    return () => {
      window.clearTimeout(saveTimer)

      if (resetTimer !== undefined) {
        window.clearTimeout(resetTimer)
      }
    }
  }, [plannerData, activeTab, hasHydrated, delay])

  return {
    hasHydrated,
    saveState,
    clearSavedPlannerState: clearPlannerState,
  }
}