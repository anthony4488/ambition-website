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
      // 2026-09-28: the Haynes funnels replace the old ad landing pages (Anthony
      // signed off). Temporary (307) so reverting is one deletion. Query strings
      // (utm_*, fbclid) are carried across by Next automatically. Old links that
      // asked for the online program land on the online funnel, not the Sydney one.
      { source: "/apply", has: [{ type: "query", key: "program", value: "online" }], destination: "/athlete-v2", permanent: false },
      { source: "/apply", destination: "/apply-v2", permanent: false },
      { source: "/athlete", destination: "/athlete-v2", permanent: false },
    ];
  },
};

export default nextConfig;
