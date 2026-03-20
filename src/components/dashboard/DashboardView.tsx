import type { Character } from '../../features/planner/plannerTypes'
import { SectionCard } from '../shared/SectionCard'
import { CharacterSummaryCard } from './CharacterSummaryCard'
import { calculateFarmingPriority } from '../../features/planner/farmingPriority'
import { getSkillNameById } from '../../features/planner/skillCatalogHelpers'
import { materialIcons } from '../../features/planner/materialIcons'
import { skillIcons } from '../../features/planner/skillIcons'
import { useResponsive } from '../../hooks/useResponsive'
import { ironIcons } from '../../features/planner/ironIcons'

interface DashboardViewProps {
  characters: Character[]
}

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

const getQueueIconSrc = (label: string, kind: 'material' | 'iron') => {
  if (kind === 'iron') return ironIcons.ebon_iron_lv1

  if (label === "Beauty's Plume") return materialIcons.beautys_plume
  if (label === 'Vicious Fruit') return materialIcons.vicious_fruit
  if (label === "Buddha's Tear Root") return materialIcons.buddhas_tear_root
  if (label === 'Jade Tower Pearl') return materialIcons.jade_tower_pearl
  if (label === 'Jasmine Stamen') return materialIcons.jasmine_stamen
  if (label === 'Frost Mushroom Mycelium') return materialIcons.frost_mushroom_mycelium
  if (label === 'Stormbone Bloom') return materialIcons.stormbone_bloom

  return materialIcons.vicious_fruit
}

export const DashboardView = ({ characters }: DashboardViewProps) => {
  const { isPhone } = useResponsive()

  const safeCharacters = Array.isArray(characters)
    ? characters.filter(
        (character): character is Character =>
          !!character && Array.isArray(character.skills),
      )
    : []

  const dashboardCharacter =
    safeCharacters.find((character) =>
      character.skills.some((skill) => skill.includeInFarming),
    ) ?? safeCharacters[0]

  if (!dashboardCharacter) {
    return (
      <div
        className={`grid gap-6 ${isPhone ? 'grid-cols-1' : 'grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'}`}
        style={{
          gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        <SectionCard title="Progress Summary">
          <div className="text-sm leading-6 text-[var(--wwm-text-muted)]">
            No characters have been added yet.
          </div>
        </SectionCard>

        <SectionCard title="Farming Priority Queue">
          <div className="text-sm leading-6 text-[var(--wwm-text-muted)]">
            Add a character and include skills in farming to see priorities here.
          </div>
        </SectionCard>

        <SectionCard title="Tracked Skills">
          <div className="text-sm leading-6 text-[var(--wwm-text-muted)]">
            No tracked skills yet.
          </div>
        </SectionCard>
      </div>
    )
  }

  const farmingQueue = calculateFarmingPriority(dashboardCharacter)
  const trackedSkills = dashboardCharacter.skills.filter(
    (skill) => skill.includeInFarming,
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isPhone ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      <SectionCard title="Progress Summary">
        <CharacterSummaryCard character={dashboardCharacter} />
      </SectionCard>

      <SectionCard title="Farming Priority Queue">
        {farmingQueue.length > 0 ? (
          <div className="grid gap-3">
            {farmingQueue.slice(0, 5).map((item, index) => (
              <div
                key={`${item.kind}-${item.label}`}
                className={`grid rounded-2xl border border-[var(--wwm-border)] shadow-[var(--wwm-shadow-sm)] ${
                  isPhone ? 'gap-2 p-3' : 'gap-2.5 p-3.5'
                }`}
                style={{
                  background:
                    item.kind === 'iron'
                      ? 'linear-gradient(180deg, rgba(41, 31, 15, 0.92) 0%, rgba(18, 33, 48, 0.96) 100%)'
                      : 'linear-gradient(180deg, rgba(22, 41, 44, 0.95) 0%, rgba(18, 33, 48, 0.98) 100%)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.78)] px-2 py-1 text-[11px] text-[var(--wwm-text-muted)]">
                      <span>Priority #{index + 1}</span>
                    </div>

                    <div
                      className={`flex min-w-0 items-center font-bold text-[var(--wwm-text)] ${
                        isPhone ? 'gap-2 text-[15px]' : 'gap-2.5 text-base'
                      }`}
                    >
                      <span
                        className={`inline-flex flex-shrink-0 items-center justify-center rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.82)] ${
                          isPhone ? 'h-10 w-10' : 'h-12 w-12'
                        }`}
                      >
                        {renderIconImage(
                          getQueueIconSrc(item.label, item.kind),
                          item.label,
                          isPhone ? 24 : 28,
                        )}
                      </span>

                      <span className="truncate">{item.label}</span>
                    </div>

                    {(item.usedBy?.length ?? 0) > 0 && (
                      <div
                        className={`mt-2 text-[var(--wwm-text-muted)] ${
                          isPhone ? 'text-[11px] leading-4.5' : 'text-xs leading-5'
                        }`}
                      >
                        Used by: {item.usedBy.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`text-2xl font-extrabold leading-none ${
                        item.kind === 'iron'
                          ? 'text-[var(--wwm-gold-soft)]'
                          : 'text-[var(--wwm-jade-soft)]'
                      }`}
                    >
                      {item.remaining}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--wwm-text-muted)]">
                      needed
                    </div>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--wwm-border)] bg-[rgba(11,18,32,0.9)]">
                  <div
                    className={`h-full rounded-full ${
                      item.kind === 'iron'
                        ? 'bg-[var(--wwm-gold)]'
                        : 'bg-[var(--wwm-jade)]'
                    }`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-[var(--wwm-text-muted)]">
            No materials need to be farmed for the current plan.
          </div>
        )}
      </SectionCard>

      <SectionCard title="Tracked Skills">
        {trackedSkills.length > 0 ? (
          <div className="grid gap-3">
            {trackedSkills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center justify-between rounded-2xl border border-[var(--wwm-border)] shadow-[var(--wwm-shadow-sm)] ${
                  isPhone ? 'gap-3 p-3' : 'gap-4 p-3.5'
                }`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(23, 40, 58, 0.95) 0%, rgba(18, 33, 48, 0.98) 100%)',
                }}
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2.5 text-[15px] font-bold text-[var(--wwm-text)]">
                    <span className="inline-flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full border border-[var(--wwm-border)] bg-[rgba(15,23,42,0.82)]">
  {renderIconImage(skillIcons[skill.skillId], getSkillNameById(skill.skillId), 28)}
</span>

                    <span className="truncate">{getSkillNameById(skill.skillId)}</span>
                  </div>

                  <div className="mt-1.5 text-[13px] text-[var(--wwm-text-muted)]">
                    T{skill.currentTier} R{skill.currentRank} → T{skill.targetTier} R{skill.targetRank}
                  </div>
                </div>

                <span
  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
    skill.priority === 'prime'
      ? 'bg-emerald-950 text-emerald-300'
      : 'bg-amber-950 text-amber-300'
  }`}
>
  {skill.priority === 'prime' ? 'Primary' : 'Secondary'}
</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-[var(--wwm-text-muted)]">
            No skills are currently included in farming for this character.
          </div>
        )}
      </SectionCard>
    </div>
  )
}