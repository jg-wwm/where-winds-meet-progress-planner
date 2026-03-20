import { useEffect, useMemo, useState } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import type { Character } from '../../features/planner/plannerTypes'
import { SectionCard } from '../shared/SectionCard'
import {
  getMaterialLabel,
  getSkillById,
} from '../../features/planner/skillCatalogHelpers'
import { calculateIronSummary } from '../../features/planner/ironPlanner'
import { calculateUpgradePath } from '../../features/planner/calculateUpgradePath'
import { materialIcons } from '../../features/planner/materialIcons'
import { skillIcons } from '../../features/planner/skillIcons'
import { calculateMaterialBreakdown } from '../../features/planner/farmingPriority'
import { ironIcons } from '../../features/planner/ironIcons'

// #region Helpers
const formatIronLabel = (ironId: string) => {
  if (ironId === 'darkgold_iron_nanlu') {
    return 'Darkgold Iron Nanlu'
  }

  const match = ironId.match(/^ebon_iron_lv(\d+)$/)

  if (match) {
    return `Ebon Iron Lv${match[1]}`
  }

  return ironId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const parseNonNegativeInteger = (value: string) => {
  const digitsOnly = value.replace(/[^\d]/g, '')
  return digitsOnly === '' ? 0 : Number(digitsOnly)
}
const fieldClass =
  'rounded-lg border border-[var(--wwm-border)] bg-[rgba(12,22,20,0.78)] px-3 py-2 text-sm text-[var(--wwm-text)] outline-none transition-all duration-200'

const pillButtonClass =
  'rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200'

const panelClass =
  'rounded-2xl border border-[var(--wwm-border)] bg-[linear-gradient(180deg,rgba(28,45,66,0.92)_0%,rgba(18,32,48,0.98)_100%)] shadow-[var(--wwm-shadow-sm)]'

const softPanelClass =
  'rounded-xl border border-[var(--wwm-border)] bg-[linear-gradient(180deg,rgba(38,58,84,0.88)_0%,rgba(24,39,58,0.95)_100%)] shadow-[var(--wwm-shadow-sm)]'

  const renderIconImage = (src: string, alt: string, size = 36) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      display: 'block',
      flexShrink: 0,
    }}
  />
)
  // #endregion

interface CharacterViewProps {
  character: Character
  onResetSkill: (skillId: Character['skills'][number]['id']) => void
  onShowToast?: (input: {
    title: string
    message?: string
    tone?: 'success' | 'error' | 'info' | 'warning'
    durationMs?: number
  }) => void
  onUpdateWorldLevel: (worldLevel: number) => void
  onUpdateMaterialInventory: (
    materialId: keyof Character['inventory']['materials'],
    value: number,
  ) => void
  onUpdateIronInventory: (
    ironId: keyof Character['inventory']['iron'],
    value: number,
  ) => void
  onUpdateSkill: (
    skillId: Character['skills'][number]['id'],
    updates: Partial<Character['skills'][number]>,
  ) => void
}

export const CharacterView = ({
  character,
  onResetSkill,
  onShowToast,
  onUpdateWorldLevel,
  onUpdateMaterialInventory,
  onUpdateIronInventory,
  onUpdateSkill,
}: CharacterViewProps) => {
  // #region Derived planner data
  const ironSummary = calculateIronSummary(character)
  const materialBreakdown = calculateMaterialBreakdown(character)
  // #endregion

  // #region Local UI state
  const [activeSubTab, setActiveSubTab] = useState<'setup' | 'planner'>('setup')
  const [skillSearch, setSkillSearch] = useState('')
  const [materialFilter, setMaterialFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [arenaOnly, setArenaOnly] = useState(false)
  const [selectedSkillRowId, setSelectedSkillRowId] = useState<string | null>(
    character.skills[0]?.id ?? null,
  )
  // #endregion

  const { isPhone, isTablet } = useResponsive()

  // #region Reset selected skill when character changes
  useEffect(() => {
  setSelectedSkillRowId((currentSelectedSkillRowId) => {
    const selectedStillExists = character.skills.some(
      (skill) => skill.id === currentSelectedSkillRowId,
    )

    if (selectedStillExists) {
      return currentSelectedSkillRowId
    }

    return character.skills[0]?.id ?? null
  })
}, [character.id, character.skills])
  // #endregion

  // #region Skill list data
  const skillRows = useMemo(() => {
    return character.skills
      .map((skill) => {
        const meta = getSkillById(skill.skillId)
        return meta ? { skill, meta } : null
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
  }, [character.skills])

  const availableMaterials = useMemo(() => {
    return Array.from(new Set(skillRows.map((row) => row.meta.materialId)))
  }, [skillRows])

  const availableCategories = useMemo(() => {
    return Array.from(new Set(skillRows.map((row) => row.meta.category)))
  }, [skillRows])

  const filteredSkillRows = useMemo(() => {
    return skillRows
      .filter(({ meta }) => {
        const matchesSearch =
          skillSearch.trim() === '' ||
          meta.name.toLowerCase().includes(skillSearch.toLowerCase())

        const matchesMaterial =
          materialFilter === 'all' || meta.materialId === materialFilter

        const matchesCategory =
          categoryFilter === 'all' || meta.category === categoryFilter

        const matchesArena = !arenaOnly || meta.tags.includes('Arena')

        return matchesSearch && matchesMaterial && matchesCategory && matchesArena
      })
      .sort((a, b) => {
        const aIncluded = a.skill.includeInFarming ? 1 : 0
        const bIncluded = b.skill.includeInFarming ? 1 : 0

        if (aIncluded !== bIncluded) {
          return bIncluded - aIncluded
        }

        const priorityRank = (priority: 'prime' | 'secondary') =>
          priority === 'prime' ? 0 : 1

        const aPriority = priorityRank(a.skill.priority)
        const bPriority = priorityRank(b.skill.priority)

        if (
          a.skill.includeInFarming &&
          b.skill.includeInFarming &&
          aPriority !== bPriority
        ) {
          return aPriority - bPriority
        }

        return a.meta.name.localeCompare(b.meta.name)
      })
  }, [skillRows, skillSearch, materialFilter, categoryFilter, arenaOnly])

  const includedSkillCount = skillRows.filter(
    (row) => row.skill.includeInFarming,
  ).length

  const primeSkillCount = skillRows.filter(
    (row) => row.skill.includeInFarming && row.skill.priority === 'prime',
  ).length

  const primeSkillRows = filteredSkillRows.filter(
    (row) => row.skill.includeInFarming && row.skill.priority === 'prime',
  )

  const secondarySkillRows = filteredSkillRows.filter(
    (row) => row.skill.includeInFarming && row.skill.priority === 'secondary',
  )

  const otherSkillRows = filteredSkillRows.filter(
    (row) => !row.skill.includeInFarming,
  )
  // #endregion

  // #region Selected skill data
  const selectedSkillRow =
    filteredSkillRows.find((row) => row.skill.id === selectedSkillRowId) ??
    filteredSkillRows[0] ??
    skillRows[0] ??
    null

  const selectedSkillUpgrade = selectedSkillRow
    ? calculateUpgradePath(selectedSkillRow.skill)
    : null

  const selectedSkillIronEntries = selectedSkillUpgrade
    ? Object.entries(selectedSkillUpgrade.ironNeeded).filter(([, value]) => value > 0)
    : []

  const selectedSkillSteps = selectedSkillUpgrade?.steps ?? []
  // #endregion

  // #region Skill list renderer
 const renderSkillList = (
  rows: typeof filteredSkillRows,
  title: string,
) => {
  if (rows.length === 0) return null

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 px-1">
        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(201,161,90,0.0)_0%,rgba(201,161,90,0.45)_100%)]" />
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--wwm-gold-soft)]">
          {title}
        </div>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(201,161,90,0.45)_0%,rgba(201,161,90,0.0)_100%)]" />
      </div>

      {rows.map(({ skill, meta }) => {
        const isSelected = selectedSkillRow?.skill.id === skill.id

        const statusLabel = skill.includeInFarming
          ? skill.priority === 'prime'
            ? 'Primary'
            : 'Secondary'
          : 'Off'

        const statusStyles = skill.includeInFarming
          ? skill.priority === 'prime'
            ? {
                background: 'rgba(16, 88, 63, 0.78)',
                color: 'var(--wwm-jade-soft)',
              }
            : {
                background: 'rgba(92, 67, 24, 0.8)',
                color: 'var(--wwm-gold-soft)',
              }
          : {
              background: 'rgba(15, 23, 42, 0.55)',
              color: 'var(--wwm-text-muted)',
            }

        const compactTags = meta.tags.slice(0, 2)

        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => setSelectedSkillRowId(skill.id)}
            className="rounded-xl border p-3 text-left transition-all duration-200"
            style={{
              borderColor: isSelected
                ? 'rgba(201, 161, 90, 0.42)'
                : 'rgba(138, 114, 69, 0.18)',
              background: isSelected
                ? 'linear-gradient(180deg, rgba(72, 56, 34, 0.94) 0%, rgba(33, 48, 68, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(36, 57, 82, 0.9) 0%, rgba(22, 36, 54, 0.96) 100%)',
              color: 'var(--wwm-text)',
              boxShadow: isSelected ? 'var(--wwm-shadow-sm)' : 'none',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {renderIconImage(skillIcons[skill.skillId], meta.name,36)}
                <span className="truncate text-sm font-semibold text-[var(--wwm-text)]">
                  {meta.name}
                </span>
              </div>

              <span
                className="flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-bold"
                style={statusStyles}
              >
                {statusLabel}
              </span>
            </div>

            <div className="mt-1.5 text-[11px] leading-5 text-[var(--wwm-text-muted)]">
              {meta.category} • {getMaterialLabel(meta.materialId)}
              {compactTags.length > 0 && ` • ${compactTags.join(' • ')}`}
            </div>
          </button>
        )
      })}
    </div>
  )
}
  // #endregion

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isPhone ? '20px' : '24px',
        overflowX: 'hidden',
        minWidth: 0,
      }}
    >
      {/* ===== CHARACTER HEADER ===== */}
    <SectionCard title={character.name}>
      <div className="grid gap-3 text-sm text-[var(--wwm-text-muted)]">
        <div
          className={`items-center gap-3 ${
            isPhone ? 'grid grid-cols-[auto_auto] justify-start' : 'flex flex-wrap'
          }`}
        >
          <div className="text-[var(--wwm-text)] font-medium">Solo Mode Level</div>

          <select
            id="world-level"
            value={character.worldLevel}
            onChange={(event) => onUpdateWorldLevel(Number(event.target.value))}
            className={fieldClass}
          >
            {Array.from({ length: 13 }, (_, index) => index + 1).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <span className="rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.45)] px-3 py-1 text-xs text-[var(--wwm-gold-soft)]">
            {includedSkillCount} included
          </span>

          <span className="rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.45)] px-3 py-1 text-xs text-[var(--wwm-jade-soft)]">
            {primeSkillCount} primary
          </span>
        </div>

        <div className="text-sm leading-6 text-[var(--wwm-text-muted)]">
          Update your build setup and review material requirements.
        </div>
      </div>
    </SectionCard>

      {/* ===== SUB TABS ===== */}
      <div
  style={{
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '8px',
    borderRadius: '18px',
    background: 'rgba(12, 22, 20, 0.58)',
    border: '1px solid rgba(201,161,90,0.16)',
    backdropFilter: 'blur(8px)',
    width: 'fit-content',
    boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
  }}
>
  {[
    { id: 'setup', label: 'Setup' },
    { id: 'planner', label: 'Planner' },
  ].map((tab) => {
        const isActive = activeSubTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as 'setup' | 'planner')}
              className={pillButtonClass}
style={{
  minWidth: '120px',
  borderColor: isActive
    ? 'rgba(201, 161, 90, 0.42)'
    : 'rgba(255,255,255,0.08)',
  background: isActive
    ? 'linear-gradient(180deg, rgba(74, 58, 38, 0.96) 0%, rgba(55, 42, 26, 0.98) 100%)'
    : 'rgba(255,255,255,0.06)',
  color: isActive ? 'var(--wwm-gold-soft)' : 'rgba(248,245,238,0.88)',
  boxShadow: isActive ? '0 8px 18px rgba(0,0,0,0.16)' : 'none',
}}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ===== SETUP TAB ===== */}
      {activeSubTab === 'setup' && (
        <>
          <SectionCard title="Mystic Skills">
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet
                    ? 'minmax(0, 1fr)'
                    : 'minmax(320px, 420px) minmax(0, 1fr)',
                  gap: '20px',
                  alignItems: 'start',
                }}
              >
                {/* ===== LEFT COLUMN: SKILL LIST + FILTERS ===== */}
                <div
  style={{
    display: 'grid',
    gap: '12px',
    alignContent: 'start',
    minHeight: 0,
  }}
>
                 <div className={`${softPanelClass} grid gap-3 ${isPhone ? 'p-3.5' : 'p-3'}`}>
  <input
    type="text"
    value={skillSearch}
    onChange={(event) => setSkillSearch(event.target.value)}
    placeholder="Search mystic skills..."
    className={fieldClass}
  />

  <select
    value={materialFilter}
    onChange={(event) => setMaterialFilter(event.target.value)}
    className={fieldClass}
  >
    <option value="all">All Materials</option>
    {availableMaterials.map((materialId) => (
      <option key={materialId} value={materialId}>
        {getMaterialLabel(materialId)}
      </option>
    ))}
  </select>

  <select
    value={categoryFilter}
    onChange={(event) => setCategoryFilter(event.target.value)}
    className={fieldClass}
  >
    <option value="all">All Categories</option>
    {availableCategories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <label className="inline-flex items-center gap-2 text-sm text-[var(--wwm-text)]">
    <input
      type="checkbox"
      checked={arenaOnly}
      onChange={(event) => setArenaOnly(event.target.checked)}
    />
    Arena only
  </label>
</div>

                 <div className="mb-1 flex items-center justify-between gap-3 px-1 text-xs text-[var(--wwm-text-muted)]">
  <span>
    Showing {filteredSkillRows.length} of {skillRows.length}
  </span>
  <span>
    {includedSkillCount} included • {primeSkillCount} primary
  </span>
</div>
            <div
  style={{
    display: 'grid',
    gap: '10px',
    maxHeight: isTablet ? '420px' : 'min(560px, calc(100vh - 320px))',
    overflowY: 'auto',
    paddingRight: '4px',
    alignContent: 'start',
    minHeight: 0,
  }}
>
                    {renderSkillList(primeSkillRows, 'Primary Skills')}
                    {renderSkillList(secondarySkillRows, 'Secondary Skills')}
                    {renderSkillList(otherSkillRows, 'Other Mystic Skills')}

                    {filteredSkillRows.length === 0 && (
                      <div
                        style={{
                          borderRadius: '12px',
                          background: '#1e293b',
                          padding: '14px',
                          color: '#94a3b8',
                          fontSize: '14px',
                        }}
                      >
                        No skills match the current filters.
                      </div>
                    )}
                  </div>
                </div>

                {/* ===== RIGHT COLUMN: SELECTED SKILL CARD ===== */}
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  {selectedSkillRow ? (
                    <div
                      className={`${panelClass} ${isPhone ? 'p-4' : 'p-5'}`}
                    style={{
                    maxWidth: isTablet ? '100%' : '760px',
                    width: '100%',
                    minWidth: 0,
                    overflow: 'hidden',
                    backdropFilter: 'blur(6px)',
                  }}
                >

      {/* ===== SKILL HEADER ===== */}
  <div
    className={`flex items-center font-bold text-[var(--wwm-text)] ${
      isPhone ? 'gap-2.5 text-[20px]' : 'gap-3 text-[24px]'
    }`}
  >
  {renderIconImage(
    skillIcons[selectedSkillRow.skill.skillId],
    selectedSkillRow.meta.name,
    isPhone ? 42 : 50,
  )}
  {selectedSkillRow.meta.name}
</div>

<div className="mt-2 text-sm text-[var(--wwm-text-muted)]">
  {selectedSkillRow.meta.category} • {getMaterialLabel(selectedSkillRow.meta.materialId)}
</div>

<div className="mt-3 flex flex-wrap gap-2">
  {selectedSkillRow.meta.tags.map((tag) => (
    <span
      key={tag}
      className="rounded-full px-3 py-1 text-xs font-medium"
      style={{
        background:
  tag === 'Arena'
    ? 'rgba(92, 67, 24, 0.78)'
    : 'rgba(21, 36, 56, 0.62)',
        color: tag === 'Arena' ? 'var(--wwm-gold-soft)' : 'var(--wwm-text)',
        border: '1px solid var(--wwm-border)',
      }}
    >
      {tag}
    </span>
  ))}
</div>

                      <div
                        style={{
                          marginTop: '20px',
                          display: 'grid',
                          gap: '18px',
                        }}
                      >
                        {/* ===== CURRENT / TARGET ===== */}
<div
  className="grid gap-4"
  style={{
    gridTemplateColumns: isPhone
      ? '1fr'
      : 'repeat(auto-fit, minmax(240px, 280px))',
  }}
>
  <div className={`${softPanelClass} p-4`}>
    <div className="mb-2 text-lg text-[var(--wwm-text-muted)]">
      Current Tier/Rank
    </div>

    <div className="flex flex-wrap gap-2">
      <select
        value={selectedSkillRow.skill.currentTier}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            currentTier: Number(
              event.target.value,
            ) as Character['skills'][number]['currentTier'],
          })
        }
        className={fieldClass}
      >
        {[1, 2, 3, 4, 5, 6].map((tier) => (
          <option key={tier} value={tier}>
            T{tier}
          </option>
        ))}
      </select>

      <select
        value={selectedSkillRow.skill.currentRank}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            currentRank: Number(
              event.target.value,
            ) as Character['skills'][number]['currentRank'],
          })
        }
        className={fieldClass}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rank) => (
          <option key={rank} value={rank}>
            R{rank}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className={`${softPanelClass} p-4`}>
    <div className="mb-2 text-lg text-[var(--wwm-text-muted)]">
      Target Tier/Rank
    </div>

    <div className="flex flex-wrap gap-2">
      <select
        value={selectedSkillRow.skill.targetTier}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            targetTier: Number(
              event.target.value,
            ) as Character['skills'][number]['targetTier'],
          })
        }
        className={fieldClass}
      >
        {[1, 2, 3, 4, 5, 6].map((tier) => (
          <option key={tier} value={tier}>
            T{tier}
          </option>
        ))}
      </select>

      <select
        value={selectedSkillRow.skill.targetRank}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            targetRank: Number(
              event.target.value,
            ) as Character['skills'][number]['targetRank'],
          })
        }
        className={fieldClass}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rank) => (
          <option key={rank} value={rank}>
            R{rank}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

                        {/* ===== PRIORITY + TRACKING ===== */}
<div
  className="grid gap-4"
  style={{
    gridTemplateColumns: isPhone
      ? '1fr'
      : isTablet
        ? 'minmax(0, 1fr)'
        : 'minmax(300px, 440px) minmax(180px, 220px)',
  }}
>
  <div className={`${softPanelClass} p-4`}>
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-[72px] text-lg text-[var(--wwm-text-muted)]">
        Priority
      </div>

      <select
        value={selectedSkillRow.skill.priority}
        disabled={!selectedSkillRow.skill.includeInFarming}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            priority:
              event.target.value as Character['skills'][number]['priority'],
          })
        }
        className={fieldClass}
        style={{
          width: '120px',
          opacity: selectedSkillRow.skill.includeInFarming ? 1 : 0.5,
          cursor: selectedSkillRow.skill.includeInFarming
            ? 'pointer'
            : 'not-allowed',
        }}
      >
        <option value="prime">Primary</option>
        <option value="secondary">Secondary</option>
      </select>

      <div
        className={`text-[var(--wwm-text-dim)] ${
          isPhone ? 'max-w-none text-[11px] leading-5' : 'max-w-[220px] text-[11px] leading-5'
        }`}
      >
        Primary skills are prioritized first when calculating farming needs.
      </div>
    </div>
  </div>

  <div className={`${softPanelClass} p-4`}>
    <div className="text-lg text-[var(--wwm-text-muted)]">
      Planner Tracking
    </div>

    <label className="mt-3 inline-flex flex-wrap items-center gap-2 text-sm text-[var(--wwm-text)]">
      <input
        type="checkbox"
        checked={selectedSkillRow.skill.includeInFarming}
        onChange={(event) =>
          onUpdateSkill(selectedSkillRow.skill.id, {
            includeInFarming: event.target.checked,
          })
        }
      />
      Included
    </label>

    <div className="mt-4">
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            `Reset "${selectedSkillRow.meta.name}" back to T1 R0 and remove it from planning?`,
          )

          if (!confirmed) {
            return
          }

          onResetSkill(selectedSkillRow.skill.id)

          onShowToast?.({
            title: 'Skill reset',
            message: `${selectedSkillRow.meta.name} was reset to T1 R0 and removed from planning.`,
            tone: 'success',
          })
        }}
        className={pillButtonClass}
        style={{
          borderColor: 'rgba(201, 161, 90, 0.35)',
          background:
            'linear-gradient(180deg, rgba(74, 58, 38, 0.94) 0%, rgba(55, 42, 26, 0.98) 100%)',
          color: 'var(--wwm-gold-soft)',
        }}
      >
        Reset Skill
      </button>
    </div>
  </div>
</div>

                        {/* ===== UPGRADE SUMMARY / ESTIMATES / STEPS ===== */}
                        <div
                          style={{
                            marginTop: '4px',
                            paddingTop: '16px',
                            borderTop: '1px solid #334155',
                            display: 'grid',
                            gap: '14px',
                          }}
                        >
                          {/* ===== UPGRADE SUMMARY ===== */}
<div className={`${softPanelClass} p-4`}>
  <div className="mb-3 text-sm font-semibold tracking-wide text-[var(--wwm-gold-soft)]">
    Upgrade Summary
  </div>

  <div className="grid gap-2 text-sm leading-6 text-[var(--wwm-text-muted)]">
    <div>
      <strong className="text-[var(--wwm-text)]">Path:</strong>{' '}
      T{selectedSkillRow.skill.currentTier} R{selectedSkillRow.skill.currentRank}
      {' → '}
      T{selectedSkillRow.skill.targetTier} R{selectedSkillRow.skill.targetRank}
    </div>

    <div>
      <strong className="text-[var(--wwm-text)]">Material:</strong>{' '}
      {getMaterialLabel(selectedSkillRow.meta.materialId)}
    </div>

    <div>
      <strong className="text-[var(--wwm-text)]">Category:</strong>{' '}
      {selectedSkillRow.meta.category}
    </div>
  </div>
</div>
                          {/* ===== ESTIMATED MATERIALS ===== */}
<div className={`${softPanelClass} p-4`}>
  <div className="mb-3 text-sm font-semibold tracking-wide text-[var(--wwm-gold-soft)]">
    Estimated Materials
  </div>

  <div className="grid gap-3">
    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--wwm-text)]">
      {renderIconImage(
  materialIcons[selectedSkillRow.meta.materialId],
  getMaterialLabel(selectedSkillRow.meta.materialId),
  36,
)}

      <span>{getMaterialLabel(selectedSkillRow.meta.materialId)}</span>

      <span
        className="rounded-full border px-3 py-1 text-sm font-semibold"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.55)',
          color: 'var(--wwm-text)',
        }}
      >
        {selectedSkillUpgrade?.materialNeeded ?? 0}
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {selectedSkillIronEntries.length > 0 ? (
        selectedSkillIronEntries.map(([ironId, value]) => (
          <span
            key={ironId}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: 'var(--wwm-border)',
              background: 'rgba(18, 31, 47, 0.62)',
              color: 'var(--wwm-text)',
            }}
          >
            {formatIronLabel(ironId)}: {value}
          </span>
        ))
      ) : (
        <span className="text-sm text-[var(--wwm-text-muted)]">
          No iron needed for this path.
        </span>
      )}
    </div>
  </div>
</div>

                          {/* ===== UPGRADE STEPS ===== */}
<div className={`${softPanelClass} p-4`}>
  <div className="mb-3 text-sm font-semibold tracking-wide text-[var(--wwm-gold-soft)]">
    Upgrade Steps
  </div>

  <div className="grid gap-3">
    {selectedSkillSteps.length > 0 ? (
      selectedSkillSteps.map((step, index) => {
        const stepIronEntries = Object.entries(step.ironNeeded).filter(
          ([, value]) => value > 0,
        )

        return (
          <div
            key={`${step.label}-${index}`}
            className="rounded-xl border p-3"
            style={{
              borderColor: 'var(--wwm-border)',
              background:
                'linear-gradient(180deg, rgba(24, 39, 58, 0.82) 0%, rgba(18, 31, 47, 0.92) 100%)',
            }}
          >
            <div
              className={`flex gap-3 ${
                isPhone ? 'flex-col items-stretch' : 'items-start justify-between'
              }`}
            >
              <div className="min-w-0 flex-1 text-sm font-semibold text-[var(--wwm-text)]">
                {step.label}
              </div>

              <div
                className={`flex min-w-0 flex-wrap gap-2 ${
                  isPhone ? 'justify-start' : 'justify-end'
                }`}
              >
                {step.materialNeeded > 0 && (
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: 'var(--wwm-border)',
                      background: 'rgba(74, 58, 38, 0.68)',
                      color: 'var(--wwm-text)',
                    }}
                  >
                    {renderIconImage(
  materialIcons[selectedSkillRow.meta.materialId],
  getMaterialLabel(selectedSkillRow.meta.materialId),
  16,
)}
                    {getMaterialLabel(selectedSkillRow.meta.materialId)}: {step.materialNeeded}
                  </span>
                )}

                {stepIronEntries.map(([ironId, value]) => (
                  <span
                    key={`${step.label}-${ironId}`}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: 'var(--wwm-border)',
                      background: 'rgba(18, 31, 47, 0.68)',
                      color: 'var(--wwm-text)',
                    }}
                  >
                    {formatIronLabel(ironId)}: {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })
    ) : (
      <div className="text-sm text-[var(--wwm-text-muted)]">
        No upgrade steps needed.
      </div>
    )}
  </div>
</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        borderRadius: '16px',
                        background: '#1e293b',
                        padding: '18px',
                        border: '1px solid #334155',
                        color: '#94a3b8',
                      }}
                    >
                      Select a skill from the list to edit its setup.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ===== INVENTORY ===== */}
          <SectionCard title="Inventory">
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                  gridTemplateColumns: isPhone
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(320px, 1fr))',
                }}
              >
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--wwm-gold-soft)]">
  Materials
</h3>

                  <div
                    style={{
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    {Object.entries(character.inventory.materials).map(([materialId, value]) => (
                      <div
  key={materialId}
  className="flex items-center justify-between gap-3 rounded-xl border p-3"
  style={{
    borderColor: 'var(--wwm-border)',
    background:
      'linear-gradient(180deg, rgba(18, 31, 47, 0.82) 0%, rgba(11, 20, 32, 0.94) 100%)',
  }}
>
  <div
    className="flex min-w-0 flex-1 items-center gap-2 text-sm text-[var(--wwm-text)]"
  >
    {renderIconImage(
  materialIcons[materialId as keyof typeof materialIcons],
  getMaterialLabel(materialId as keyof Character['inventory']['materials']),
  36,
)}
    <span>
      {getMaterialLabel(
        materialId as keyof Character['inventory']['materials'],
      )}
    </span>
  </div>

  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    value={value}
    onChange={(event) =>
      onUpdateMaterialInventory(
        materialId as keyof Character['inventory']['materials'],
        parseNonNegativeInteger(event.target.value),
      )
    }
    className={fieldClass}
    style={{
      width: isPhone ? '88px' : '100px',
      flexShrink: 0,
    }}
  />
</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--wwm-gold-soft)]">
  Iron
</h3>

                  <div
                    style={{
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    {Object.entries(character.inventory.iron).map(([ironId, value]) => (
                     <div
  key={ironId}
  className="flex items-center justify-between gap-3 rounded-xl border p-3"
  style={{
    borderColor: 'var(--wwm-border)',
    background:
      'linear-gradient(180deg, rgba(18, 31, 47, 0.82) 0%, rgba(11, 20, 32, 0.94) 100%)',
  }}
>
  <div
  className="flex min-w-0 flex-1 items-center gap-2 text-sm"
  style={{
    color:
      ironId === 'darkgold_iron_nanlu'
        ? 'var(--wwm-gold-soft)'
        : 'var(--wwm-text)',
    fontWeight: ironId === 'darkgold_iron_nanlu' ? 600 : 400,
  }}
>
  {renderIconImage(
    ironIcons[ironId as keyof typeof ironIcons],
    formatIronLabel(ironId),
    36,
  )}
  <span>{formatIronLabel(ironId)}</span>
</div>

  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    value={value}
    onChange={(event) =>
      onUpdateIronInventory(
        ironId as keyof Character['inventory']['iron'],
        parseNonNegativeInteger(event.target.value),
      )
    }
    className={fieldClass}
    style={{
      width: isPhone ? '88px' : '100px',
      flexShrink: 0,
    }}
  />
</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* ===== PLANNER TAB ===== */}
      {activeSubTab === 'planner' && (
        <>
          <SectionCard title="Material Breakdown">
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              {materialBreakdown.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone
                      ? '1fr'
                      : 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {materialBreakdown.map((item) => {
                    const progress =
                      item.totalNeeded === 0
                        ? 100
                        : Math.min((item.inventory / item.totalNeeded) * 100, 100)

                    return (
                      <div
    key={item.materialId}
    className="rounded-xl border p-4"
    style={{
      borderColor: 'var(--wwm-border)',
      background:
        'linear-gradient(180deg, rgba(36, 57, 82, 0.9) 0%, rgba(22, 36, 54, 0.96) 100%)',
    }}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-base font-bold text-[var(--wwm-text)]">
        {renderIconImage(materialIcons[item.materialId], item.label, 36)}
        {item.label}
      </div>

      <div className="text-xs font-semibold text-[var(--wwm-text-muted)]">
        {Math.round(progress)}%
      </div>
    </div>

    <div className="mt-3 grid grid-cols-3 gap-2">
      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Need</div>
        <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
          {item.totalNeeded}
        </div>
      </div>

      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Inventory</div>
        <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
          {item.inventory}
        </div>
      </div>

      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Remaining</div>
        <div
          className="mt-1 text-lg font-bold"
          style={{
            color: item.remaining === 0 ? 'var(--wwm-jade-soft)' : 'var(--wwm-gold-soft)',
          }}
        >
          {item.remaining}
        </div>
      </div>
    </div>

    <div
      className="mt-3 h-2 overflow-hidden rounded-full border"
      style={{
        borderColor: 'var(--wwm-border)',
        background: 'rgba(13, 22, 32, 0.45)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${progress}%`,
          background:
            item.remaining === 0
              ? 'linear-gradient(90deg, var(--wwm-jade) 0%, var(--wwm-jade-soft) 100%)'
              : 'linear-gradient(90deg, #5fb0de 0%, #7fd6b3 100%)',
        }}
      />
    </div>

    {item.usedBy.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {item.usedBy.map((skillName) => (
          <span
            key={`${item.materialId}-${skillName}`}
            className="rounded-full border px-2 py-1 text-[11px]"
            style={{
              borderColor: 'var(--wwm-border)',
              background: 'rgba(18, 31, 47, 0.55)',
              color: 'var(--wwm-text)',
            }}
          >
            {skillName}
          </span>
        ))}
      </div>
    )}
  </div>
)
                  })}
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: '12px',
                    background: '#1e293b',
                    padding: '14px 16px',
                    border: '1px solid #334155',
                    fontSize: '14px',
                    color: '#94a3b8',
                  }}
                >
                  No material breakdown available for the current plan.
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title={`Ebon Iron Planner (Farmable Lv${ironSummary.farmableIronTier})`}>
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                display: 'grid',
                gap: '16px',
              }}
            >
              {(
                [
                  'ebon_iron_lv1',
                  'ebon_iron_lv2',
                  'ebon_iron_lv3',
                  'ebon_iron_lv4',
                  'ebon_iron_lv5',
                  'darkgold_iron_nanlu',
                ] as const
              ).filter((ironId) => ironSummary.shortfall[ironId] > 0).length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone
                      ? '1fr'
                      : 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {(
                    [
                      'ebon_iron_lv1',
                      'ebon_iron_lv2',
                      'ebon_iron_lv3',
                      'ebon_iron_lv4',
                      'ebon_iron_lv5',
                      'darkgold_iron_nanlu',
                    ] as const
                  )
                    .filter((ironId) => ironSummary.shortfall[ironId] > 0)
                    .map((ironId) => {
                      const need = ironSummary.exactNeeded[ironId]
                      const inventory = ironSummary.inventory[ironId]
                      const progressPercent =
                        need === 0 ? 100 : Math.min((inventory / need) * 100, 100)

                      return (
  <div
    key={ironId}
    className="rounded-xl border p-4"
    style={{
      borderColor: 'var(--wwm-border)',
      background:
        ironId === 'darkgold_iron_nanlu'
          ? 'linear-gradient(180deg, rgba(74, 58, 38, 0.88) 0%, rgba(36, 57, 82, 0.96) 100%)'
          : 'linear-gradient(180deg, rgba(36, 57, 82, 0.9) 0%, rgba(22, 36, 54, 0.96) 100%)',
    }}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-base font-bold text-[var(--wwm-text)]">
        {renderIconImage(
  ironIcons[ironId],
  ironId === 'darkgold_iron_nanlu' ? 'Darkgold Iron Nanlu' : formatIronLabel(ironId),
  36,
)}
        {ironId === 'darkgold_iron_nanlu'
          ? 'Darkgold Iron Nanlu'
          : formatIronLabel(ironId)}
      </div>

      <div className="text-xs font-semibold text-[var(--wwm-text-muted)]">
        {Math.round(progressPercent)}%
      </div>
    </div>

    <div className="mt-3 grid grid-cols-3 gap-2">
      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Need</div>
        <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
          {need}
        </div>
      </div>

      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Inventory</div>
        <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
          {inventory}
        </div>
      </div>

      <div
        className="rounded-lg border p-2"
        style={{
          borderColor: 'var(--wwm-border)',
          background: 'rgba(13, 22, 32, 0.45)',
        }}
      >
        <div className="text-[10px] text-[var(--wwm-text-muted)]">Remaining</div>
        <div
          className="mt-1 text-lg font-bold"
          style={{
            color:
              ironSummary.shortfall[ironId] === 0
                ? 'var(--wwm-jade-soft)'
                : 'var(--wwm-gold-soft)',
          }}
        >
          {ironSummary.shortfall[ironId]}
        </div>
      </div>
    </div>

    <div
      className="mt-3 h-2 overflow-hidden rounded-full border"
      style={{
        borderColor: 'var(--wwm-border)',
        background: 'rgba(13, 22, 32, 0.45)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${progressPercent}%`,
          background:
            ironSummary.shortfall[ironId] === 0
              ? 'linear-gradient(90deg, var(--wwm-jade) 0%, var(--wwm-jade-soft) 100%)'
              : ironId === 'darkgold_iron_nanlu'
                ? 'linear-gradient(90deg, var(--wwm-gold) 0%, var(--wwm-gold-soft) 100%)'
                : 'linear-gradient(90deg, #5fb0de 0%, #7fd6b3 100%)',
        }}
      />
    </div>
  </div>
)
                    })}
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: '12px',
                    background: '#1e293b',
                    padding: '14px 16px',
                    border: '1px solid #334155',
                    fontSize: '14px',
                    color: '#94a3b8',
                  }}
                >
                  No Ebon Iron farming shortfalls for the current plan.
                </div>
              )}

              <div
  className="rounded-xl border p-4"
  style={{
    borderColor: 'var(--wwm-border)',
    background:
      'linear-gradient(180deg, rgba(36, 57, 82, 0.9) 0%, rgba(22, 36, 54, 0.96) 100%)',
  }}
>
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2 text-base font-bold text-[var(--wwm-text)]">
      {renderIconImage(
  ironIcons[`ebon_iron_lv${ironSummary.farmableIronTier}` as keyof typeof ironIcons] ?? ironIcons.ebon_iron_lv1,
  `Ebon Iron Lv${ironSummary.farmableIronTier}`,
  36,
)}
      Remaining Farmable Lv{ironSummary.farmableIronTier} Iron Needed
    </div>

    <div className="text-xs font-semibold text-[var(--wwm-text-muted)]">
      {ironSummary.farmableIronNeeded === 0 ? 100 : 0}%
    </div>
  </div>

  <div className="mt-3 grid grid-cols-3 gap-2">
    <div
      className="rounded-lg border p-2"
      style={{
        borderColor: 'var(--wwm-border)',
        background: 'rgba(13, 22, 32, 0.45)',
      }}
    >
      <div className="text-[10px] text-[var(--wwm-text-muted)]">Need</div>
      <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
        {ironSummary.farmableIronNeeded}
      </div>
    </div>

    <div
      className="rounded-lg border p-2"
      style={{
        borderColor: 'var(--wwm-border)',
        background: 'rgba(13, 22, 32, 0.45)',
      }}
    >
      <div className="text-[10px] text-[var(--wwm-text-muted)]">Tier</div>
      <div className="mt-1 text-lg font-bold text-[var(--wwm-text)]">
        Lv{ironSummary.farmableIronTier}
      </div>
    </div>

    <div
      className="rounded-lg border p-2"
      style={{
        borderColor: 'var(--wwm-border)',
        background: 'rgba(13, 22, 32, 0.45)',
      }}
    >
      <div className="text-[10px] text-[var(--wwm-text-muted)]">Status</div>
      <div
        className="mt-1 text-lg font-bold"
        style={{
          color:
            ironSummary.farmableIronNeeded === 0
              ? 'var(--wwm-jade-soft)'
              : 'var(--wwm-gold-soft)',
        }}
      >
        {ironSummary.farmableIronNeeded === 0 ? 'Done' : 'Farm'}
      </div>
    </div>
  </div>

  <div
    className="mt-3 h-2 overflow-hidden rounded-full border"
    style={{
      borderColor: 'var(--wwm-border)',
      background: 'rgba(13, 22, 32, 0.45)',
    }}
  >
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{
        width: `${ironSummary.farmableIronNeeded === 0 ? 100 : 0}%`,
        background:
          ironSummary.farmableIronNeeded === 0
            ? 'linear-gradient(90deg, var(--wwm-jade) 0%, var(--wwm-jade-soft) 100%)'
            : 'linear-gradient(90deg, var(--wwm-gold) 0%, var(--wwm-gold-soft) 100%)',
      }}
    />
  </div>

  {ironSummary.rolledUpLowerTierShortfall > 0 && (
    <div className="mt-3 flex flex-wrap gap-2">
      {ironSummary.lowerTierReplacementSources.map((ironId) => {
        const tier = ironId.replace('ebon_iron_lv', '')
        return (
          <span
            key={`replacement-${ironId}`}
            className="rounded-full border px-2 py-1 text-[11px]"
            style={{
              borderColor: 'var(--wwm-border)',
              background: 'rgba(18, 31, 47, 0.55)',
              color: 'var(--wwm-text)',
            }}
          >
            Replacing Lv{tier}
          </span>
        )
      })}
    </div>
  )}
</div>

    <div
      className={`rounded-xl border p-4 ${
        isPhone ? 'text-[13px] leading-6' : 'text-sm leading-7'
      }`}
      style={{
        borderColor: 'var(--wwm-border)',
        background:
          'linear-gradient(180deg, rgba(18, 31, 47, 0.78) 0%, rgba(11, 20, 32, 0.9) 100%)',
        color: 'var(--wwm-text-dim)',
      }}
    >
  <div>
    Lower-tier Ebon iron shortages are converted into farmable Lv
    {ironSummary.farmableIronTier} Ebon iron because lower-tier Ebon iron is
    no longer directly farmable.
  </div>

  <div className="mt-2">
    Darkgold Iron Nanlu is shown separately as an unconfirmed future material
    until its use is verified.
  </div>
</div>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}