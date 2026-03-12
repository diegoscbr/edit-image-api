const ALLOWED_DOMAINS = [
  "creative-insights-images-prod.creative.alliplatform.com",
  "replicate.delivery",
  "pbxt.replicate.delivery",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const imageUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
    return res
      .status(403)
      .json({ error: `Domain not allowed: ${parsedUrl.hostname}` });
  }

  try {
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Upstream error: ${upstream.status}` });
    }

    const contentLength = upstream.headers.get("content-length");
    if (contentLength && Number.parseInt(contentLength, 10) > MAX_SIZE) {
      return res.status(413).json({ error: "Image exceeds 10MB limit" });
    }

    const contentType = upstream.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await upstream.arrayBuffer());

    if (buffer.length > MAX_SIZE) {
      return res.status(413).json({ error: "Image exceeds 10MB limit" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
}
