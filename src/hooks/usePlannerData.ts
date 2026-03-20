import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { createEmptyPlannerData } from '../features/planner/plannerDefaults'
import type { PlannerData } from '../features/planner/plannerTypes'

export const usePlannerData = (): {
  plannerData: PlannerData
  setPlannerData: Dispatch<SetStateAction<PlannerData>>
} => {
  const [plannerData, setPlannerDataState] = useState<PlannerData>(() =>
    createEmptyPlannerData(),
  )

  const setPlannerData = useCallback<Dispatch<SetStateAction<PlannerData>>>(
    (value) => {
      setPlannerDataState((current) => {
        if (typeof value === 'function') {
          const next = value(current)

          return {
            ...next,
            updatedAt: new Date().toISOString(),
          }
        }

        return value
      })
    },
    [],
  )

  return {
    plannerData,
    setPlannerData,
  }
}