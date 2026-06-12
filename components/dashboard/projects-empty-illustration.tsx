import { AudioLines, Building2, Paperclip, Plus } from 'lucide-react'

const FRONT_ANGLE = '-rotate-[12deg]'
const BACK_ANGLE = 'rotate-[8deg]'

export function ProjectsEmptyIllustration() {
  return (
    <div
      className="pointer-events-none relative mx-auto h-[220px] w-full max-w-[380px] select-none"
      aria-hidden
    >
      <div
        className={`ibl-card-gradient-blue absolute top-[3.25rem] left-1/2 h-[168px] w-[258px] -translate-x-[46%] ${BACK_ANGLE} overflow-hidden rounded-[18px] border border-ibl-soft-border/40 opacity-55 shadow-[0_8px_24px_rgba(114,132,255,0.12)]`}
      />
      <div
        className={`ibl-card-gradient-blue absolute top-9 left-1/2 h-[168px] w-[258px] -translate-x-[47%] rotate-[5deg] overflow-hidden rounded-[18px] border border-ibl-soft-border/50 opacity-70 shadow-[0_8px_22px_rgba(114,132,255,0.14)]`}
      />
      <div
        className={`ibl-card-gradient-blue absolute top-5 left-1/2 h-[168px] w-[258px] -translate-x-1/2 ${FRONT_ANGLE} overflow-hidden rounded-[18px] border border-ibl-soft-border/60 shadow-[0_14px_36px_rgba(114,132,255,0.22)]`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_28%,rgba(255,255,255,0.42)_46%,transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_72%_58%,rgba(114,132,255,0.22)_0%,transparent_68%)]" />

        <div className="absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/55 bg-white/30 px-3.5 py-2.5 shadow-[0_4px_16px_rgba(114,132,255,0.08)] backdrop-blur-sm">
          <p className="text-left text-[11px] text-ibl-neutral/55">Ask vibe.ibl.ai to...</p>
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-ibl-soft-border/50 text-ibl-neutral/65">
                <Plus className="size-3" strokeWidth={2} />
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-ibl-neutral/60">
                <Paperclip className="size-2.5" strokeWidth={2} />
                Attach
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-ibl-neutral/60">
                <Building2 className="size-2.5" strokeWidth={2} />
                Workspaces
              </span>
            </div>
            <span className="flex size-5 shrink-0 items-center justify-center text-ibl-neutral/50">
              <AudioLines className="size-3" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
