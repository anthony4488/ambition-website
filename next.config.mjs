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
  // Security headers (security check 2026-10-03): no framing by other sites (clickjacking), no MIME sniffing,
  // trimmed referrers, and no camera/mic/location access (nothing on the site uses them).
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  async redirects() {
    return [
      // E-signature page retired — route any old /policy links to the terms page.
      { source: "/policy", destination: "/agreement", permanent: false },
      // 2026-09-28: the Haynes funnels replace the old ad landing pages (Anthony
      // signed off). Temporary (307) so reverting is one deletion. Query strings
      // (utm_*, fbclid) are carried across by Next automatically. Old links that
      // asked for the online program land on the online funnel, not the Sydney one.
      // 2026-10-02: /apply is now the choice page (face to face or online -> the matching VSL), so the two /apply
      // redirects are gone; src/app/apply/page.tsx forwards ?track= and ?program=online itself.
      { source: "/athlete", destination: "/athlete-v2", permanent: false },
    ];
  },
};

export default nextConfig;
