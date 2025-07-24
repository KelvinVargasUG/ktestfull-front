import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',

    productionBrowserSourceMaps: false,

    images: {
        unoptimized: true,
    },

    experimental: {
    }
}

export default nextConfig