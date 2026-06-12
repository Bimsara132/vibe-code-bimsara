'use client'

const PARALLAX_FACTOR = 1.45

type LovableBackgroundProps = {
  scrollY?: number
}

export function LovableBackground({ scrollY = 0 }: LovableBackgroundProps) {
  const offset = scrollY * PARALLAX_FACTOR

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden bg-[#faf6f8] md:top-[10px] md:bottom-[10px] md:rounded-[10px]">
      <div className="pointer-events-none absolute inset-0 w-full overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <div
              className="absolute will-change-transform"
              style={{
                top: 'calc(50vh - 75vw)',
                width: '200vw',
                aspectRatio: '0.991736 / 1',
                left: 'calc(50% + 0px)',
                transform: `translate3d(-50%, ${-offset}px, 0px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src="/bg_gradient.png"
                className="absolute inset-0 h-full w-full object-contain"
                style={{ filter: 'blur(4px)' }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
