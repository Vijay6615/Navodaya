/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,

  images: {
    dangerouslyAllowSVG: true,

    qualities: [72, 74, 75, 76, 78, 80],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/b5iu6h89/image/upload/**",
      },
    ],
  },
};