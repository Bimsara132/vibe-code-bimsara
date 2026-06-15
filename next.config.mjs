import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const isGithubPages = process.env.GITHUB_PAGES === 'true'

function dedup(packageName) {
  try {
    const entry = require.resolve(packageName)
    const marker = `node_modules/${packageName}`
    const idx = entry.lastIndexOf(marker)
    if (idx !== -1) return entry.slice(0, idx + marker.length)
    return undefined
  } catch {
    return undefined
  }
}

const resolveAliases = {}
const dataLayerDir = dedup('@iblai/data-layer')
if (dataLayerDir) resolveAliases['@iblai/data-layer'] = dataLayerDir
const rtkDir = dedup('@reduxjs/toolkit')
if (rtkDir) resolveAliases['@reduxjs/toolkit'] = rtkDir
const reactReduxDir = dedup('react-redux')
if (reactReduxDir) resolveAliases['react-redux'] = reactReduxDir

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGithubPages
    ? {
        output: 'export',
        basePath: '/vibe-frontend',
        trailingSlash: true,
      }
    : {}),
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    Object.assign(config.resolve.alias, resolveAliases)
    return config
  },
}

export default nextConfig
