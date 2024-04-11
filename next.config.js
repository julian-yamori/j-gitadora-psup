/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    const corsHeaders = [
      { key: "Access-Control-Allow-Credentials", value: "true" },
      {
        key: "Access-Control-Allow-Origin",
        value: "https://p.eagate.573.jp",
      },
      {
        key: "Access-Control-Allow-Methods",
        value: "GET,POST,OPTIONS",
      },
      {
        key: "Access-Control-Allow-Headers",
        value: "authorization",
      },
    ];

    return [
      {
        source: "/js/load_ohp_history.js",
        headers: corsHeaders,
      },
      {
        source: "/api/load_ohp_history",
        headers: corsHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
