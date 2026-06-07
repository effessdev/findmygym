import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mk735iv9lwads0wx.public.blob.vercel-storage.com",
      },
    ],
  },
}

export default nextConfig
