/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Force dynamic rendering for all routes - no static generation
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Increase request timeout
  serverExternalPackages: ['@supabase/ssr'],
  
  // Configure static page generation timeout
  staticPageGenerationTimeout: 300,
  
  webpack: (config, { isServer }) => {
    // Optimize webpack build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Suppress cache serialization warnings - set infrastructure logging to only show errors
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  // Suppress webpack cache warnings in console
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.stripe.com/:path*'
      }
    ]
  }
}

export default nextConfig

