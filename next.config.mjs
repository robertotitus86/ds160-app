// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const allow = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://tu-dominio.vercel.app'
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: allow },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
export default nextConfig

