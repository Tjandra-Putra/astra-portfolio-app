/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["utfs.io", "vutz38vdur.ufs.sh"],
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "tjandra.xyz",
          },
        ],
        destination: "/profile/35c89c6b-98ab-487f-a295-959a18090bc6",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
