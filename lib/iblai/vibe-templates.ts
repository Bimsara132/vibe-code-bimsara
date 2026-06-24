export type VibeTemplate = {
  id: string
  name: string
  description: string
  projectName: string
  starterPrompt: string
  useCanvas?: boolean
  image?: string
  previewClass?: string
  category: 'marketing' | 'productivity' | 'commerce' | 'data'
}

export const VIBE_TEMPLATES: VibeTemplate[] = [
  {
    id: 'landing-page',
    name: 'Landing page',
    description: 'Marketing site with hero, features, pricing, and a contact section',
    projectName: 'Landing page',
    category: 'marketing',
    previewClass: 'lovable-gradient',
    starterPrompt:
      'Build a modern landing page for a B2B SaaS product. Include a hero with headline and CTA, three feature cards, a simple pricing section with two tiers, customer logos, FAQ, and a footer. Use a clean light theme with ibl.ai-style blue accents.',
    useCanvas: true,
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS dashboard',
    description: 'Admin dashboard with sidebar nav, KPI cards, and a data table',
    projectName: 'SaaS dashboard',
    category: 'productivity',
    previewClass: 'ibl-card-gradient',
    starterPrompt:
      'Create an admin dashboard for a subscription analytics product. Add a left sidebar, top bar with search, four KPI stat cards, a line chart placeholder area, and a sortable table of recent customers with status badges. Keep the layout responsive.',
    useCanvas: true,
  },
  {
    id: 'ai-assistant',
    name: 'AI assistant app',
    description: 'Chat-style app with welcome screen and suggested prompts',
    projectName: 'AI assistant',
    category: 'productivity',
    previewClass: 'lovable-gradient',
    starterPrompt:
      'Build a chat assistant interface with a centered welcome state, four suggested prompt chips, a message list area, and a prompt input with attach and send buttons. Match a minimal vibe.ibl.ai aesthetic.',
    useCanvas: true,
  },
  {
    id: 'event-registration',
    name: 'Event registration',
    description: 'Event page with schedule, speakers, and signup form',
    projectName: 'Event registration',
    category: 'marketing',
    image: 'https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/templates/event-spark.webp',
    starterPrompt:
      'Build an event registration website for a one-day product conference. Include event date and location, agenda timeline, speaker cards, ticket tiers, and a registration form with name, email, and company fields.',
    useCanvas: true,
  },
  {
    id: 'crm-lite',
    name: 'CRM lite',
    description: 'Simple CRM to track leads, deals, and follow-ups',
    projectName: 'CRM lite',
    category: 'data',
    image: 'https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/templates/commcalc.jpg',
    starterPrompt:
      'Create a lightweight CRM dashboard. Show pipeline stages (Lead, Qualified, Proposal, Won), a kanban-style deal board, and a detail drawer for notes and next steps. Use sample data for 8 deals.',
    useCanvas: true,
  },
  {
    id: 'habit-tracker',
    name: 'Habit tracker',
    description: 'Daily habits with streaks and a calendar heatmap',
    projectName: 'Habit tracker',
    category: 'productivity',
    image: 'https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/templates/continuum.jpg',
    starterPrompt:
      'Build a calm habit tracker app with daily check-ins, streak counters, a monthly calendar heatmap, and a short insights panel showing completion rate. Support adding and editing habits.',
    useCanvas: true,
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce store',
    description: 'Product grid, cart, and checkout flow for a small shop',
    projectName: 'E-commerce store',
    category: 'commerce',
    previewClass: 'ibl-card-gradient',
    starterPrompt:
      'Create a small e-commerce storefront with a product grid, product detail modal, shopping cart sidebar, and a two-step checkout form. Use placeholder products for a lifestyle brand.',
    useCanvas: true,
  },
  {
    id: 'team-portal',
    name: 'Team portal',
    description: 'Internal hub with docs links, announcements, and quick actions',
    projectName: 'Team portal',
    category: 'productivity',
    image: 'https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/https://storage.googleapis.com/lovable-assets/templates/assetwise.jpg',
    starterPrompt:
      'Build an internal team portal homepage with welcome banner, quick action tiles (Docs, Support, Time off, Expenses), latest announcements, and a team directory list with roles.',
    useCanvas: true,
  },
]

export function getVibeTemplate(id: string) {
  return VIBE_TEMPLATES.find((template) => template.id === id)
}
