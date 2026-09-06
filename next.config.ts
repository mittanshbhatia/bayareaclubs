import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' blob: data: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // React Fast Refresh needs eval in development only.
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  isDev
    ? "connect-src 'self' http://127.0.0.1:* http://localhost:* https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com"
    : "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
