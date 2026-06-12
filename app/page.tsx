// Root redirect is handled in middleware.ts to avoid Next.js dev-mode
// performance.measure errors from server redirect() in this page.
export default function RootPage() {
  return null
}
