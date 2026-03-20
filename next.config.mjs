/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "znfmisebkqoogpqcqguf.supabase.co",
      },
      {
        protocol: "https",
        hostname: "storage.mlcdn.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
