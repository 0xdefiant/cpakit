/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/plausible/js/script.js",
        destination: "https://plausible.io/js/script.js",
      },
      {
        source: "/plausible/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  }
};

module.exports = nextConfig;
