import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { CharacterView } from './components/character/CharacterView'
import { DashboardView } from './components/dashboard/DashboardView'
import { ToastProvider } from './components/feedback/ToastProvider'
import { ToastViewport } from './components/feedback/ToastViewport'
import { CharacterTabs } from './components/layout/CharacterTabs'
import { HeaderBar } from './components/layout/HeaderBar'
import {
  createEmptyCharacter,
  emptyIronInventory,
  emptyMaterialInventory,
} from './features/planner/plannerDefaults'
import type { CharacterSkill, Rank, Tier } from './features/planner/plannerTypes'
import {
  downloadPlannerExport,
  parsePlannerImport,
} from './features/planner/plannerTransfer'
import { usePlannerPersistence } from './features/planner/usePlannerPersistence'
import { useToast } from './hooks/useToast'
import { usePlannerData } from './hooks/usePlannerData'
import { Footer } from './components/layout/Footer'
import { PrivacyPolicyView } from './components/legal/PrivacyPolicyView'

const getNextCharacterName = (existingNames: string[]) => {
  let index = 1

  while (existingNames.includes(`Character ${index}`)) {
    index += 1
  }

  return `Character ${index}`
}

const clampTier = (value: number): Tier => {
  if (value <= 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  if (value === 4) return 4
  if (value === 5) return 5
  return 6
}

const clampRank = (value: number): Rank => {
  if (value <= 0) return 0
  if (value === 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  if (value === 4) return 4
  if (value === 5) return 5
  if (value === 6) return 6
  if (value === 7) return 7
  if (value === 8) return 8
  return 9
}

const applySkillGuardRails = (
  currentSkill: CharacterSkill,
  updates: Partial<CharacterSkill>,
): CharacterSkill => {
  let next: CharacterSkill = {
    ...currentSkill,
    ...updates,
  }

  next.currentTier = clampTier(next.currentTier)
  next.targetTier = clampTier(next.targetTier)
  next.currentRank = clampRank(next.currentRank)
  next.targetRank = clampRank(next.targetRank)

  const changedCurrentTier = 'currentTier' in updates
  const changedCurrentRank = 'currentRank' in updates
  const changedTargetTier = 'targetTier' in updates
  const changedTargetRank = 'targetRank' in updates

  if (next.currentTier > next.targetTier) {
    if (changedTargetTier && !changedCurrentTier) {
      next.currentTier = next.targetTier
    } else {
      next.targetTier = next.currentTier
    }
  }

  if (next.currentTier === next.targetTier && next.currentRank > next.targetRank) {
    if (changedTargetRank && !changedCurrentRank) {
      next.currentRank = next.targetRank
    } else {
      next.targetRank = next.currentRank
    }
  }

  if (next.targetTier > next.currentTier && changedTargetTier && !changedTargetRank) {
    next.targetRank = clampRank(next.targetRank)
  }

  if (next.currentTier < next.targetTier && changedCurrentTier && !changedCurrentRank) {
    next.currentRank = clampRank(next.currentRank)
  }

  return next
}

const AppShell = () => {
  const { plannerData, setPlannerData } = usePlannerData()
  const [activeTab, setActiveTab] = useState<string>('dashboard')
const [activePage, setActivePage] = useState<'planner' | 'privacy'>('planner')
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const { saveState } = usePlannerPersistence({
    plannerData,
    setPlannerData,
    activeTab,
    setActiveTab,
  })

  const activeCharacter = useMemo(
    () => plannerData.characters.find((character) => character.id === activeTab),
    [activeTab, plannerData.characters],
  )

  const handleAddCharacter = () => {
    const suggestedName = getNextCharacterName(
      plannerData.characters.map((character) => character.name),
    )

    const enteredName = window.prompt(
      'Enter a name for the new character:',
      suggestedName,
    )

    if (enteredName === null) {
      toast({
        title: 'Add character cancelled',
        tone: 'info',
        durationMs: 2200,
      })
      return
    }

    const name = enteredName.trim() || suggestedName
    const newCharacter = createEmptyCharacter(name)

    setPlannerData((current) => ({
      ...current,
      characters: [...current.characters, newCharacter],
    }))

    setActiveTab(newCharacter.id)

    toast({
      title: 'Character added',
      message: name,
      tone: 'success',
    })
  }

  const handleRenameCharacter = () => {
    if (!activeCharacter) {
      return
    }

    const enteredName = window.prompt('Rename character:', activeCharacter.name)

    if (enteredName === null) {
      toast({
        title: 'Rename cancelled',
        tone: 'info',
        durationMs: 2200,
      })
      return
    }

    const trimmedName = enteredName.trim()

    if (!trimmedName) {
      toast({
        title: 'Rename skipped',
        message: 'Character name cannot be blank.',
        tone: 'warning',
      })
      return
    }

    setPlannerData((current) => ({
      ...current,
      characters: current.characters.map((character) =>
        character.id === activeCharacter.id
          ? { ...character, name: trimmedName }
          : character,
      ),
    }))

    toast({
      title: 'Character renamed',
      message: `Renamed to ${trimmedName}`,
      tone: 'success',
    })
  }

  const handleDeleteCharacter = () => {
    if (!activeCharacter) {
      return
    }

    const deletedName = activeCharacter.name

    const confirmed = window.confirm(
      `Delete "${deletedName}"? This cannot be undone.`,
    )

    if (!confirmed) {
      toast({
        title: 'Delete cancelled',
        tone: 'info',
        durationMs: 2200,
      })
      return
    }

    setPlannerData((current) => ({
      ...current,
      characters: current.characters.filter(
        (character) => character.id !== activeCharacter.id,
      ),
    }))

    setActiveTab('dashboard')

    toast({
      title: 'Character deleted',
      message: deletedName,
      tone: 'success',
    })
  }

  const handleResetCharacter = () => {
    if (!activeCharacter) {
      return
    }

    const resetName = activeCharacter.name

    const confirmed = window.confirm(
      `Reset "${resetName}" back to a blank planner state? This will clear skills, inventory, and world level for this character.`,
    )

    if (!confirmed) {
      toast({
        title: 'Reset cancelled',
        tone: 'info',
        durationMs: 2200,
      })
      return
    }

    setPlannerData((current) => ({
      ...current,
      characters: current.characters.map((character) =>
        character.id === activeCharacter.id
          ? {
              ...character,
              worldLevel: 1,
              skills: character.skills.map((skill) => ({
                ...skill,
                currentTier: 1,
                currentRank: 0,
                targetTier: 1,
                targetRank: 0,
                priority: 'prime',
                includeInFarming: false,
              })),
              inventory: {
                materials: emptyMaterialInventory(),
                iron: emptyIronInventory(),
              },
            }
          : character,
      ),
    }))

    toast({
      title: 'Character reset',
      message: `${resetName} was cleared back to a blank planner state.`,
      tone: 'success',
    })
  }

  const handleExportJson = () => {
    downloadPlannerExport(plannerData)

    toast({
      title: 'Planner exported',
      message: `${plannerData.characters.length} character${
        plannerData.characters.length === 1 ? '' : 's'
      } included.`,
      tone: 'success',
    })
  }

  const handleImportJson = () => {
    importInputRef.current?.click()
  }

  const handleImportFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      toast({
        title: 'Import cancelled',
        tone: 'info',
        durationMs: 2200,
      })
      return
    }

    try {
      const jsonText = await file.text()
      const importedPlannerData = parsePlannerImport(jsonText)

      const confirmed = window.confirm(
        `Import planner data from "${file.name}"? This will replace your current local planner data.`,
      )

      if (!confirmed) {
        toast({
          title: 'Import cancelled',
          tone: 'info',
          durationMs: 2200,
        })
        return
      }

      setPlannerData(() => ({
        ...importedPlannerData,
      }))

      setActiveTab(importedPlannerData.characters[0]?.id ?? 'dashboard')

      toast({
        title: 'Planner imported',
        message: `${importedPlannerData.characters.length} character${
          importedPlannerData.characters.length === 1 ? '' : 's'
        } loaded from ${file.name}.`,
        tone: 'success',
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to import planner data.'

      toast({
        title: 'Import failed',
        message,
        tone: 'error',
        durationMs: 5000,
      })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#f8fafc',
      }}
    >
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportFileChange}
        style={{ display: 'none' }}
      />

      <HeaderBar
        updatedAt={plannerData.updatedAt}
        saveState={saveState}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {activePage === 'planner' ? (
  <CharacterTabs
    characters={plannerData.characters}
    activeTab={activeTab}
    onChangeTab={setActiveTab}
    onAddCharacter={handleAddCharacter}
    onRenameCharacter={handleRenameCharacter}
    onResetCharacter={handleResetCharacter}
    onDeleteCharacter={handleDeleteCharacter}
  />
) : null}

      <main
  style={{
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '20px 12px 28px',
    width: '100%',
    boxSizing: 'border-box',
  }}
>
  {activePage === 'privacy' ? (
    <PrivacyPolicyView />
  ) : activeTab === 'dashboard' ? (
    <DashboardView characters={plannerData.characters} />
  ) : activeCharacter ? (
    <CharacterView
      character={activeCharacter}
      onResetSkill={(skillRowId) => {
        setPlannerData((current) => ({
          ...current,
          characters: current.characters.map((character) =>
            character.id === activeCharacter.id
              ? {
                  ...character,
                  skills: character.skills.map((skill) =>
                    skill.id === skillRowId
                      ? {
                          ...skill,
                          currentTier: 1,
                          currentRank: 0,
                          targetTier: 1,
                          targetRank: 0,
                          priority: 'prime',
                          includeInFarming: false,
                        }
                      : skill,
                  ),
                }
              : character,
          ),
        }))
      }}
      onShowToast={toast}
      onUpdateWorldLevel={(worldLevel) => {
        setPlannerData((current) => ({
          ...current,
          characters: current.characters.map((character) =>
            character.id === activeCharacter.id
              ? { ...character, worldLevel }
              : character,
          ),
        }))
      }}
      onUpdateMaterialInventory={(materialId, value) => {
        setPlannerData((current) => ({
          ...current,
          characters: current.characters.map((character) =>
            character.id === activeCharacter.id
              ? {
                  ...character,
                  inventory: {
                    ...character.inventory,
                    materials: {
                      ...character.inventory.materials,
                      [materialId]: value,
                    },
                  },
                }
              : character,
          ),
        }))
      }}
      onUpdateIronInventory={(ironId, value) => {
        setPlannerData((current) => ({
          ...current,
          characters: current.characters.map((character) =>
            character.id === activeCharacter.id
              ? {
                  ...character,
                  inventory: {
                    ...character.inventory,
                    iron: {
                      ...character.inventory.iron,
                      [ironId]: value,
                    },
                  },
                }
              : character,
          ),
        }))
      }}
      onUpdateSkill={(skillRowId, updates) => {
        setPlannerData((current) => ({
          ...current,
          characters: current.characters.map((character) =>
            character.id === activeCharacter.id
              ? {
                  ...character,
                  skills: character.skills.map((skill) =>
                    skill.id === skillRowId
                      ? applySkillGuardRails(skill, updates)
                      : skill,
                  ),
                }
              : character,
          ),
        }))
      }}
    />
  ) : (
    <div
      style={{
        border: '1px solid #334155',
        borderRadius: '16px',
        background: '#0f172a',
        padding: '24px',
        color: '#cbd5e1',
      }}
    >
      Character not found.
    </div>
  )}
</main>

<Footer
  onOpenPrivacy={() => setActivePage('privacy')}
  onOpenPlanner={() => setActivePage('planner')}
  showBackToPlanner={activePage === 'privacy'}
/>

      <ToastViewport />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  )
}