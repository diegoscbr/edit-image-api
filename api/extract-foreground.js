import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// CORS origins — update with your actual frontend URLs
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://automated-creative-e10d7.web.app",
  "https://automated-creative-e10d7.firebaseapp.com",
];

function getCorsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const cors = getCorsHeaders(origin);

  // Set CORS headers on every response
  Object.entries(cors).forEach(([key, value]) => res.setHeader(key, value));

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl } = req.body;
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ error: "imageUrl (string) is required" });
  }

  try {
    const output = await replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      { input: { image: imageUrl } }
    );

    // output is a URL string pointing to the transparent PNG
    const url = typeof output === "string" ? output : String(output);

    return res.status(200).json({ url });
  } catch (err) {
    console.error("Replicate error:", err);
    return res.status(502).json({
      error: "Background removal failed",
      detail: err.message || String(err),
    });
  }
}
