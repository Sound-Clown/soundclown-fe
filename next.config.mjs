/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt parallel build worker — tránh lỗi flaky "Cannot find module './xxx.js'"
  // / "Failed to collect page data" khi build bằng Bun.
  experimental: {
    webpackBuildWorker: false,
  },
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
