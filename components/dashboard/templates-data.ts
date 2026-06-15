export type Template = {
  name: string
  description: string
  image?: string
  previewClass?: string
}

export const templatePreviewUrl = (path: string) =>
  `https://lovable.dev/cdn-cgi/image/width=640,f=auto,fit=scale-down/${path}`

const cdn = templatePreviewUrl

export const RESOURCE_TEMPLATES: Template[] = [
  {
    name: 'vibe.ibl.ai',
    description: 'Code-powered presentation builder',
    previewClass: 'lovable-gradient',
  },
  {
    name: 'AssetWise',
    description:
      'Track company equipment, assign assets to employees, monitor depreciation, and get AI-powered insights from a single dashboard',
    image: cdn('https://storage.googleapis.com/lovable-assets/templates/assetwise.jpg'),
  },
  {
    name: 'EventSpark',
    description:
      'Full-stack event management app with branded registration pages, attendee tracking, analytics, and a public company page',
    image: cdn('https://storage.googleapis.com/lovable-assets/templates/event-spark.webp'),
  },
  {
    name: 'CommCalc',
    description:
      'Real-time commission engine with comp plan builder, deal tracking, rep dashboards, and AI-powered data assistant',
    image: cdn('https://storage.googleapis.com/lovable-assets/templates/commcalc.jpg'),
  },
  {
    name: 'Architect Portfolio Website Template',
    description: 'Firm website & showcase',
    image: cdn(
      'https://assets.lovable.dev/templates/architect-portfolio-1-screenshot.webp',
    ),
  },
  {
    name: 'Continuum',
    description:
      'A calm, distraction-free habit tracker with streak counters, calendar heatmaps, and motivational insights',
    image: cdn('https://storage.googleapis.com/lovable-assets/templates/continuum.jpg'),
  },
  {
    name: 'Ecommerce Store Website Template',
    description: 'Premium design for webstore',
  },
  {
    name: 'Inspo Canvas',
    description:
      'Spatial canvas for collecting, arranging, and sharing visual inspiration',
    image: cdn('https://storage.googleapis.com/lovable-assets/templates/inspo.jpg'),
  },
]

export function getTemplatePreview(templateName: string) {
  return RESOURCE_TEMPLATES.find((template) => template.name === templateName)
}
