/** @type {import('next').NextConfig} */

// This is the jainsim.github.io user site, served from the domain root (and at
// the seema-jain.com custom domain), so basePath stays empty. NEXT_PUBLIC_BASE_PATH
// remains an escape hatch if the site ever moves under a /<repo> subpath again.
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
