/** @type {import('next').NextConfig} */

// GitHub Pages serves this project site under /<repo>. The workflow sets
// NEXT_PUBLIC_BASE_PATH=/Misty-mountains so links/assets resolve there, while
// local `next dev` / `next build` stay at the root (empty base path).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// `output: "export"` only for builds. `next dev` (NODE_ENV=development) has a
// known bug rendering dynamic export routes on-demand ("missing
// generateStaticParams"), so we leave it off in dev and let the route render
// normally there; production still exports fully static HTML.
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,
  // Emit a fully static site into ./out for Pages (build only).
  ...(isDev ? {} : { output: "export" }),
  // Pages has no image optimizer. A custom loader serves images as-is while
  // applying basePath (which `unoptimized` would otherwise skip).
  images: { loader: "custom", loaderFile: "./image-loader.js" },
  // Serve /path/ as /path/index.html — required for static hosting.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
