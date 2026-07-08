// Custom next/image loader for static export on GitHub Pages.
// Next doesn't prepend basePath to <Image> string srcs when images are
// unoptimized, so paths like "/projects/x.png" would 404 under /<repo>.
// This loader serves the original asset (no resizing) with the base path applied.
export default function imageLoader({ src }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (/^https?:\/\//.test(src)) return src; // leave absolute URLs untouched
  return `${base}${src}`;
}
