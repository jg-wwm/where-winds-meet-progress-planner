import type { PropsWithChildren } from 'react'

interface SectionCardProps extends PropsWithChildren {
  title: string
}

export const SectionCard = ({ title, children }: SectionCardProps) => {
  return (
    <section
      className="wwm-card wwm-card-framed relative p-4 md:p-5"
      style={{
        backdropFilter: 'blur(8px)',
        background:
          'linear-gradient(180deg, rgba(35, 52, 47, 0.9) 0%, rgba(28, 42, 38, 0.96) 100%)',
      }}
    >
      <div className="wwm-frame-corner wwm-frame-corner-tl">
        <div className="wwm-corner-dot" />
      </div>
      <div className="wwm-frame-corner wwm-frame-corner-tr">
        <div className="wwm-corner-dot" />
      </div>
      <div className="wwm-frame-corner wwm-frame-corner-bl">
        <div className="wwm-corner-dot" />
      </div>
      <div className="wwm-frame-corner wwm-frame-corner-br">
        <div className="wwm-corner-dot" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(201,161,90,0) 0%, rgba(201,161,90,0.55) 50%, rgba(201,161,90,0) 100%)',
        }}
      />

      <div className="wwm-frame-title-row">
        <div className="wwm-frame-title-bar" />

        <h2 className="wwm-frame-title text-lg font-semibold tracking-tight text-[var(--wwm-text)]">
          {title}
        </h2>
      </div>

      <div className="wwm-frame-title-flourish" />

      <div className="wwm-frame-content">{children}</div>
    </section>
  )
}