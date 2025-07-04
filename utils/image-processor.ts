/**
 * Extract all image URLs from text‑block JSON.
 *
 * @param input Either the JSON string you showed above or the parsed array.
 * @returns Array of URLs like ["https://utfs.io/…png", …]
 */

export function extractImageUrls(input: string | any[]): string[] {
  // 1. Normalise to an array of blocks
  const blocks: any[] = typeof input === "string" ? JSON.parse(input) : Array.isArray(input) ? input : [];

  const urls: string[] = [];

  // 2. Depth‑first walk (handles children, but still simple)
  const walk = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === "image" && node.props?.url) {
        urls.push(node.props.url);
      }
      if (Array.isArray(node.children) && node.children.length) {
        walk(node.children);
      }
    }
  };

  walk(blocks);
  return urls;
}
