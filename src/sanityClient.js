import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// 🔍 Temporary debug (remove after confirming on Vercel)
console.log("[sanity env]", {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
});

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2023-01-01",

  // Use CDN in production (HTTPS), direct API in development/preview (HTTP)
  useCdn: import.meta.env.PROD,
});

// 🚨 Fail loudly if env vars are missing
if (!import.meta.env.VITE_SANITY_PROJECT_ID || !import.meta.env.VITE_SANITY_DATASET) {
  console.error(
    "[sanity] Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET. " +
    "Check your Vercel Environment Variables."
  );
}

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);

// Safe helper for images
export function safeImageUrl(source, options = {}) {
  if (!source) return null;

  // Support legacy string URLs
  if (typeof source === "string") return source;

  try {
    let img = builder.image(source);

    if (options.width) img = img.width(options.width);
    if (options.height) img = img.height(options.height);
    if (options.quality) img = img.quality(options.quality);

    return img.url();
  } catch (err) {
    console.error("[sanity] Image URL error", err);
    return null;
  }
}
