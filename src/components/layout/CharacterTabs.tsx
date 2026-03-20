import type { Character } from '../../features/planner/plannerTypes'
import { useResponsive } from '../../hooks/useResponsive'

interface CharacterTabsProps {
  characters: Character[]
  activeTab: string
  onChangeTab: (tabId: string) => void
  onAddCharacter: () => void
  onRenameCharacter: () => void
  onResetCharacter: () => void
  onDeleteCharacter: () => void
}

export const CharacterTabs = ({
  characters,
  activeTab,
  onChangeTab,
  onAddCharacter,
  onRenameCharacter,
  onResetCharacter,
  onDeleteCharacter,
}: CharacterTabsProps) => {
  const { isPhone } = useResponsive()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    ...characters.map((character) => ({
      id: character.id,
      label: character.name,
    })),
  ]

  const activeCharacter = characters.find((character) => character.id === activeTab)

  const baseActionButtonClass =
    'rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-200'

  return (
    <div
  className="border-b border-[var(--wwm-border)] bg-[rgba(7,17,26,0.7)]"
  style={{
    boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.03)',
  }}
>
      <div
        className={`mx-auto grid max-w-[1200px] gap-3 ${
          isPhone ? 'px-3 py-3' : 'px-4 py-4'
        }`}
      >
        <div
  className="flex gap-2 overflow-x-auto pb-1"
  style={{
    scrollbarWidth: 'thin',
  }}
>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className="whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  borderColor: isActive
                    ? 'rgba(216, 181, 106, 0.45)'
                    : 'rgba(146, 186, 169, 0.14)',
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(78, 58, 27, 0.96) 0%, rgba(46, 33, 14, 0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(20, 31, 43, 0.92) 0%, rgba(13, 22, 32, 0.98) 100%)',
                  color: isActive ? 'var(--wwm-gold-soft)' : 'var(--wwm-text)',
                  boxShadow: isActive
                    ? '0 0 0 1px rgba(216, 181, 106, 0.08), 0 10px 22px rgba(0,0,0,0.18)'
                    : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          className={`gap-2 ${
            isPhone ? 'grid grid-cols-2' : 'flex flex-wrap justify-end'
          }`}
        >
          <button
            type="button"
            onClick={onAddCharacter}
            className={`${baseActionButtonClass} ${isPhone ? 'w-full px-3 py-2.5' : ''}`}
            style={{
              borderColor: 'rgba(127, 214, 179, 0.35)',
              background:
                'linear-gradient(180deg, rgba(23, 65, 53, 0.94) 0%, rgba(16, 48, 40, 0.98) 100%)',
              color: 'var(--wwm-jade-soft)',
            }}
          >
            + Add Character
          </button>

          <button
            type="button"
            onClick={onRenameCharacter}
            disabled={!activeCharacter}
            className={`${baseActionButtonClass} ${isPhone ? 'flex-1' : ''}`}
            style={{
              opacity: activeCharacter ? 1 : 0.45,
              cursor: activeCharacter ? 'pointer' : 'not-allowed',
              borderColor: 'rgba(146, 186, 169, 0.18)',
              background:
                'linear-gradient(180deg, rgba(20, 31, 43, 0.92) 0%, rgba(13, 22, 32, 0.98) 100%)',
              color: 'var(--wwm-text)',
            }}
          >
            Rename
          </button>

          <button
            type="button"
            onClick={onResetCharacter}
            disabled={!activeCharacter}
            className={`${baseActionButtonClass} ${isPhone ? 'flex-1' : ''}`}
            style={{
              opacity: activeCharacter ? 1 : 0.45,
              cursor: activeCharacter ? 'pointer' : 'not-allowed',
              borderColor: 'rgba(216, 181, 106, 0.35)',
              background:
                'linear-gradient(180deg, rgba(55, 40, 18, 0.92) 0%, rgba(34, 24, 10, 0.96) 100%)',
              color: 'var(--wwm-gold-soft)',
            }}
          >
            Reset
          </button>

          <button
            type="button"
            onClick={onDeleteCharacter}
            disabled={!activeCharacter}
            className={`${baseActionButtonClass} ${isPhone ? 'flex-1' : ''}`}
            style={{
              opacity: activeCharacter ? 1 : 0.45,
              cursor: activeCharacter ? 'pointer' : 'not-allowed',
              borderColor: 'rgba(153, 74, 74, 0.45)',
              background:
                'linear-gradient(180deg, rgba(67, 21, 28, 0.94) 0%, rgba(44, 13, 18, 0.98) 100%)',
              color: '#f3b3b3',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}