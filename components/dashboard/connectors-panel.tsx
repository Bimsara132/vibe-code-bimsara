'use client'

import * as React from 'react'
import {
  ExternalLink,
  Search,
  Settings,
  X,
} from 'lucide-react'

import { useOnyxUI } from '@/components/onyx-shell-context'
import { cn } from '@/lib/utils'

type ConnectorStatus = 'enabled' | 'new'

type AppConnector = {
  id: string
  name: string
  description: string
  status: ConnectorStatus
  category: string
  icon?: string
  iconBg?: string
}

const connectorLogo = (slug: string) =>
  `https://assets.lovable.dev/img/connectors/${slug}.svg`

type HeroConnectorBadge = {
  slug: string
  label: string
}

const HERO_MARQUEE_TOP: HeroConnectorBadge[] = [
  { slug: 'posthog', label: 'PostHog' },
  { slug: 'stripe', label: 'Stripe' },
  { slug: 'slack', label: 'Slack' },
  { slug: 'gmail', label: 'Gmail' },
  { slug: 'supabase', label: 'Supabase' },
  { slug: 'hubspot', label: 'HubSpot' },
  { slug: 'shopify', label: 'Shopify' },
  { slug: 'telegram', label: 'Telegram' },
  { slug: 'discord', label: 'Discord' },
  { slug: 'microsoft_teams', label: 'Teams' },
]

const HERO_MARQUEE_MIDDLE: HeroConnectorBadge[] = [
  { slug: 'linear', label: 'Linear' },
  { slug: 'google_calendar', label: 'Google Calendar' },
  { slug: 'firecrawl', label: 'Firecrawl' },
  { slug: 'airtable', label: 'Airtable' },
  { slug: 'elevenlabs', label: 'ElevenLabs' },
  { slug: 'bigquery', label: 'BigQuery' },
  { slug: 'openai', label: 'OpenAI' },
  { slug: 'figma', label: 'Figma' },
  { slug: 'github', label: 'GitHub' },
  { slug: 'explorium', label: 'Explorium' },
]

const HERO_MARQUEE_BOTTOM: HeroConnectorBadge[] = [
  { slug: 'asana', label: 'Asana' },
  { slug: 'perplexity', label: 'Perplexity' },
  { slug: 'notion', label: 'Notion' },
  { slug: 'twitch', label: 'Twitch' },
  { slug: 'ashby', label: 'Ashby' },
  { slug: 'snowflake', label: 'Snowflake' },
  { slug: 'inngest', label: 'Inngest' },
  { slug: 'databricks', label: 'Databricks' },
  { slug: 'salesforce', label: 'Salesforce' },
  { slug: 'twilio', label: 'Twilio' },
]

function HeroConnectorBadgePill({ slug, label }: HeroConnectorBadge) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <img
        src={connectorLogo(slug)}
        alt=""
        className="size-4 shrink-0 object-contain"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
      <span className="whitespace-nowrap text-[12px] font-normal text-ibl-neutral">{label}</span>
    </span>
  )
}

function HeroMarqueeRow({
  badges,
  direction,
  faded = false,
}: {
  badges: HeroConnectorBadge[]
  direction: 'left' | 'right'
  faded?: boolean
}) {
  const loop = [...badges, ...badges]

  return (
    <div className={cn('overflow-hidden', faded && 'opacity-45')}>
      <div
        className={cn(
          'flex w-max items-center gap-2',
          direction === 'left' ? 'connectors-hero-marquee-left' : 'connectors-hero-marquee-right',
        )}
      >
        {loop.map((badge, index) => (
          <HeroConnectorBadgePill key={`${badge.slug}-${index}`} {...badge} />
        ))}
      </div>
    </div>
  )
}

function ConnectorsHeroBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative mb-6 overflow-hidden px-6 py-6">
      <div className="relative mx-auto mb-5 h-[118px] w-full overflow-hidden rounded-xl bg-[#fafafa]">
        <div className="absolute inset-0 flex flex-col justify-center gap-2">
          <HeroMarqueeRow badges={HERO_MARQUEE_TOP} direction="left" faded />
          <HeroMarqueeRow badges={HERO_MARQUEE_MIDDLE} direction="right" />
          <HeroMarqueeRow badges={HERO_MARQUEE_BOTTOM} direction="left" faded />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#fafafa] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[#fafafa] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fafafa] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fafafa] to-transparent sm:w-24" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h3 className="text-[20px] font-semibold tracking-tight text-ibl-neutral sm:text-[22px]">
          Build from what you already use
        </h3>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[#9ca3af]">
          Connectors let your vibe.ibl.ai app talk to external tools like Stripe, Slack, and
          Google. Ask the agent to get started.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 text-[12px] font-medium text-ibl-neutral shadow-sm transition-colors hover:bg-neutral-50"
          >
            View the docs
            <ExternalLink className="size-3" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-7 items-center rounded-md border border-neutral-200 bg-white px-2.5 text-[12px] font-medium text-ibl-neutral shadow-sm transition-colors hover:bg-neutral-50"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

const CATEGORIES = [
  { id: 'marketing', label: 'Marketing', count: 8 },
  { id: 'messaging', label: 'Messaging', count: 7 },
  { id: 'productivity', label: 'Productivity', count: 37 },
  { id: 'sales', label: 'Sales', count: 5 },
  { id: 'google', label: 'Google', count: 10 },
  { id: 'microsoft', label: 'Microsoft', count: 8 },
] as const

const APP_CONNECTORS: AppConnector[] = [
  {
    id: 'cloud-ai',
    name: 'Cloud AI',
    description: 'Run AI workloads in your app',
    status: 'enabled',
    category: 'productivity',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Set up payments',
    status: 'enabled',
    category: 'sales',
    icon: 'https://assets.lovable.dev/img/connectors/stripe.svg',
  },
  {
    id: 'paddle',
    name: 'Paddle',
    description: 'Sell software globally',
    status: 'enabled',
    category: 'sales',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your store',
    status: 'new',
    category: 'sales',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    id: 'algolia',
    name: 'Algolia',
    description: 'Power search in your app',
    status: 'new',
    category: 'productivity',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Share and authenticate',
    status: 'enabled',
    category: 'marketing',
    iconBg: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'Run open-source models',
    status: 'new',
    category: 'productivity',
    iconBg: 'bg-neutral-100 text-neutral-700',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send updates to channels',
    status: 'enabled',
    category: 'messaging',
    icon: 'https://assets.lovable.dev/img/connectors/slack.svg',
  },
]

type SidebarFilter = 'enabled' | 'all' | (typeof CATEGORIES)[number]['id']

function ConnectorIcon({ connector }: { connector: AppConnector }) {
  if (connector.icon) {
    return (
      <img
        src={connector.icon}
        alt=""
        className="size-8 rounded-lg border border-black/[0.06] bg-white object-contain p-1"
      />
    )
  }

  return (
    <span
      className={cn(
        'flex size-8 items-center justify-center rounded-lg text-xs font-semibold',
        connector.iconBg ?? 'bg-neutral-100 text-neutral-700',
      )}
    >
      {connector.name.slice(0, 1)}
    </span>
  )
}

function ConnectorCard({ connector }: { connector: AppConnector }) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-left transition-colors hover:bg-neutral-50"
    >
      <ConnectorIcon connector={connector} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium text-ibl-neutral">
            {connector.name}
          </span>
          {connector.status === 'enabled' ? (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              Enabled
            </span>
          ) : (
            <span className="shrink-0 text-[11px] font-medium text-[#2563eb]">New</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12px] text-[#9ca3af]">{connector.description}</p>
      </div>
    </button>
  )
}

function SidebarFilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-[13px] transition-colors',
        active
          ? 'bg-neutral-100 font-medium text-ibl-neutral'
          : 'text-ibl-neutral hover:bg-neutral-50',
      )}
    >
      <span>{label}</span>
      {count !== undefined ? (
        <span className="text-[12px] text-[#9ca3af]">{count}</span>
      ) : null}
    </button>
  )
}

export function ConnectorsPanel() {
  const { setConnectorsOpen } = useOnyxUI()
  const [query, setQuery] = React.useState('')
  const [filter, setFilter] = React.useState<SidebarFilter>('all')
  const [heroDismissed, setHeroDismissed] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConnectorsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setConnectorsOpen])

  const filteredConnectors = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return APP_CONNECTORS.filter((connector) => {
      const matchesQuery =
        !q ||
        connector.name.toLowerCase().includes(q) ||
        connector.description.toLowerCase().includes(q)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'enabled' && connector.status === 'enabled') ||
        connector.category === filter
      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  const enabledCount = APP_CONNECTORS.filter((c) => c.status === 'enabled').length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Connectors"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      <div className="pointer-events-auto absolute inset-x-0 top-14 bottom-0 grid grid-cols-[220px_1fr] overflow-hidden rounded-none bg-white shadow-none md:top-[196px] md:right-[10px] md:bottom-[10px] md:rounded-[10px] md:border md:border-neutral-200 md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <aside className="flex min-h-0 flex-col border-r border-neutral-200 bg-[#fafafa] p-3">
          <div className="relative mb-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white pr-3 pl-9 text-[13px] text-ibl-neutral outline-none placeholder:text-[#9ca3af] focus-visible:border-neutral-300"
              aria-label="Search connectors"
            />
          </div>

          <div className="space-y-0.5">
            <SidebarFilterButton
              label="Enabled"
              count={enabledCount}
              active={filter === 'enabled'}
              onClick={() => setFilter('enabled')}
            />
            <SidebarFilterButton
              label="All"
              count={75}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
          </div>

          <p className="mt-4 mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-[#9ca3af] uppercase">
            Categories
          </p>
          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
            {CATEGORIES.map((category) => (
              <SidebarFilterButton
                key={category.id}
                label={category.label}
                count={category.count}
                active={filter === category.id}
                onClick={() => setFilter(category.id)}
              />
            ))}
          </div>

          <div className="mt-3 space-y-2 border-t border-neutral-200 pt-3">
            <div className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2">
              <p className="text-[12px] text-ibl-neutral">Missing a connector?</p>
              <button
                type="button"
                className="mt-1 text-[12px] font-medium text-[#2563eb] hover:underline"
              >
                Request
              </button>
            </div>
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-ibl-neutral transition-colors hover:bg-neutral-100"
            >
              <Settings className="size-4 shrink-0 text-neutral-500" strokeWidth={1.75} />
              Admin settings
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <h2 className="text-[15px] font-semibold text-ibl-neutral">Connectors</h2>
            <button
              type="button"
              onClick={() => setConnectorsOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100"
              aria-label="Close connectors"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {!heroDismissed ? (
              <ConnectorsHeroBanner onDismiss={() => setHeroDismissed(true)} />
            ) : null}

            <div className="mb-4">
              <h3 className="text-[15px] font-semibold text-ibl-neutral">App connectors</h3>
              <p className="mt-0.5 text-[13px] text-[#9ca3af]">
                Add functionality to your apps. Configured once by admins, available to your
                workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredConnectors.map((connector) => (
                <ConnectorCard key={connector.id} connector={connector} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
