import { IblaiProviders } from '@/providers/iblai-providers'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <IblaiProviders>{children}</IblaiProviders>
}
