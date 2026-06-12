import Image from 'next/image'

type AppLoadingScreenProps = {
  message?: string
}

export function AppLoadingScreen({ message }: AppLoadingScreenProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message ?? 'Loading vibe.ibl.ai'}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="animate-app-logo relative size-20">
          <Image
            src="/logo.png"
            alt="vibe.ibl.ai"
            width={80}
            height={80}
            priority
            className="size-20 object-contain"
          />
        </div>
        {message ? (
          <p className="text-sm text-gray-400">{message}</p>
        ) : null}
      </div>
    </div>
  )
}
