/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // cover host từ Cloudinary
      },
    ],
  },
};

export default nextConfig;
