/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@worldcoin/idkit',
    '@worldcoin/idkit-core',
    '@selfxyz/qrcode',
    '@selfxyz/core',
    'react-shadow',
  ],
}

export default nextConfig 