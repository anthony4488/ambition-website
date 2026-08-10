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
  async redirects() {
    return [
      // E-signature page retired — route any old /policy links to the terms page.
      { source: "/policy", destination: "/agreement", permanent: false },
    ];
  },
};

export default nextConfig;
