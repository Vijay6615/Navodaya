/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,

  images: {
    dangerouslyAllowSVG: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/b5iu6h89/image/upload/**",
      },
    ],
  },
};