import { LinkButton } from '../components/ui/Button'
import { WovenDivider } from '../components/ui/WovenDivider'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found', 'This page could not be found.')
  return (
    <div className="wrap flex min-h-[60dvh] flex-col items-start justify-center py-20">
      <p className="t-label text-muted">404</p>
      <h1 className="t-display mt-3 max-w-3xl">This thread has come loose.</h1>
      <p className="t-lead mt-5 max-w-[50ch] text-muted">The page you are looking for does not exist or has moved. Let us take you back to the weave.</p>
      <WovenDivider className="mt-8 w-48" />
      <div className="mt-8 flex flex-wrap gap-3"><LinkButton to="/">Home</LinkButton><LinkButton to="/sarees" variant="outline">All sarees</LinkButton></div>
    </div>
  )
}
