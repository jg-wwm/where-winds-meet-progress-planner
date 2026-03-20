import type { Character } from '../../features/planner/plannerTypes'
import { calculateMaterialTotals } from '../../features/planner/materialPlanner'
import { calculateIronSummary } from '../../features/planner/ironPlanner'
import { useResponsive } from '../../hooks/useResponsive'

interface CharacterSummaryCardProps {
  character: Character
}

export const CharacterSummaryCard = ({ character }: CharacterSummaryCardProps) => {
  const { isPhone } = useResponsive()

  const activeSkillCount = character.skills.filter((skill) => skill.includeInFarming).length
  const primeSkillCount = character.skills.filter(
    (skill) => skill.includeInFarming && skill.priority === 'prime',
  ).length

  const { primeTotals } = calculateMaterialTotals(character)
  const { farmableIronNeeded, farmableIronTier } = calculateIronSummary(character)

  const totalPrimeMaterialsRemaining = Object.entries(primeTotals).reduce(
    (sum, [material, total]) => {
      const inventory =
        character.inventory.materials[
          material as keyof typeof character.inventory.materials
        ] ?? 0

      return sum + Math.max(total - inventory, 0)
    },
    0,
  )

  const overallPressure = totalPrimeMaterialsRemaining + farmableIronNeeded

  const statusLabel =
    overallPressure === 0
      ? 'Ready'
      : overallPressure <= 50
        ? 'Close'
        : overallPressure <= 150
          ? 'In Progress'
          : 'Heavy Grind'

  const statusColorClass =
    overallPressure === 0
      ? 'text-emerald-300 border-emerald-600/60'
      : overallPressure <= 50
        ? 'text-sky-300 border-sky-600/60'
        : overallPressure <= 150
          ? 'text-amber-300 border-amber-600/60'
          : 'text-orange-300 border-orange-600/60'

  const pressureBarClass =
    overallPressure === 0
      ? 'bg-emerald-400'
      : overallPressure <= 50
        ? 'bg-sky-400'
        : overallPressure <= 150
          ? 'bg-amber-400'
          : 'bg-orange-400'

  return (
    <div className="grid gap-4 rounded-[18px] border border-[var(--wwm-border)] bg-[linear-gradient(180deg,rgba(18,33,48,0.98)_0%,rgba(8,19,29,0.98)_100%)] p-4 shadow-[var(--wwm-shadow-lg)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[22px] font-extrabold leading-tight tracking-tight text-[var(--wwm-text)]">
            {character.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--wwm-text-muted)]">
            Current build progress and farming needs
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.75)] px-3 py-1 text-xs font-semibold text-[var(--wwm-text)]">
            {activeSkillCount} tracked
          </span>

          <span
            className={`rounded-full border bg-[rgba(15,23,42,0.75)] px-3 py-1 text-xs font-bold ${statusColorClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          isPhone ? 'grid-cols-2' : 'grid-cols-2 xl:grid-cols-4'
        }`}
      >
        <div className={`wwm-card-soft ${isPhone ? 'p-2.5' : 'p-3'}`}>
          <div className="text-[11px] leading-4 text-[var(--wwm-text-muted)]">
            Tracked Skills
          </div>
          <div
            className={`mt-1.5 font-extrabold text-[var(--wwm-text)] ${
              isPhone ? 'text-xl' : 'text-2xl'
            }`}
          >
            {activeSkillCount}
          </div>
        </div>

        <div className={`wwm-card-soft ${isPhone ? 'p-2.5' : 'p-3'}`}>
          <div className="text-[11px] leading-4 text-[var(--wwm-text-muted)]">
            Primary Skills
          </div>
          <div
            className={`mt-1.5 font-extrabold text-[var(--wwm-jade-soft)] ${
              isPhone ? 'text-xl' : 'text-2xl'
            }`}
          >
            {primeSkillCount}
          </div>
        </div>

        <div className={`wwm-card-soft ${isPhone ? 'p-2.5' : 'p-3'}`}>
          <div className="text-[11px] leading-4 text-[var(--wwm-text-muted)]">
            Primary Materials Needed
          </div>
          <div
            className={`mt-1.5 font-extrabold text-[var(--wwm-jade-soft)] ${
              isPhone ? 'text-xl' : 'text-2xl'
            }`}
          >
            {totalPrimeMaterialsRemaining}
          </div>
        </div>

        <div className={`wwm-card-soft ${isPhone ? 'p-2.5' : 'p-3'}`}>
          <div className="text-[11px] leading-4 text-[var(--wwm-text-muted)]">
            Lv{farmableIronTier} Iron Needed
          </div>
          <div
            className={`mt-1.5 font-extrabold text-[var(--wwm-gold-soft)] ${
              isPhone ? 'text-xl' : 'text-2xl'
            }`}
          >
            {farmableIronNeeded}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2 text-xs text-[var(--wwm-text-muted)]">
          <span>Build Pressure</span>
          <span>{overallPressure}</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[var(--wwm-border)] bg-[rgba(11,18,32,0.9)]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${pressureBarClass}`}
            style={{
              width: `${Math.min(overallPressure === 0 ? 100 : overallPressure, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}