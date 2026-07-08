/** @type {import('next').NextConfig} */

// GitHub Pages serves this project site under /<repo>. The workflow sets
// NEXT_PUBLIC_BASE_PATH=/Misty-mountains so links/assets resolve there, while
// local `next dev` / `next build` stay at the root (empty base path).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Emit a fully static site into ./out for Pages.
  output: "export",
  // Pages has no image optimizer. A custom loader serves images as-is while
  // applying basePath (which `unoptimized` would otherwise skip).
  images: { loader: "custom", loaderFile: "./image-loader.js" },
  // Serve /path/ as /path/index.html — required for static hosting.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
