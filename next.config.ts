import type { NextConfig } from "next";

const securityHeaders = [
  // Legacy clickjacking backstop (no CSP frame-ancestors configured yet).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop browsers from MIME-sniffing responses away from their declared Content-Type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Avoid leaking full URLs (including any query params) to external origins on navigation.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser APIs this site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Dev-only (ignored in production builds): Next 16 blocks cross-origin
  // requests to dev assets, so opening the dev server from another device
  // via LAN IP loads bare HTML with no JS/CSS — a blank-looking page.
  // Allow the private subnet for phone/tablet testing.
  allowedDevOrigins: ["192.168.18.41", "192.168.*"],
  // Don't advertise the framework in responses.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
