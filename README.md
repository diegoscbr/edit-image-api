# Edit Image API

Lightweight Vercel serverless function for background removal via Replicate.

## Endpoint

`POST /api/extract-foreground`

**Body:** `{ "imageUrl": "https://..." }`
**Response:** `{ "url": "https://..." }` — transparent PNG

## Setup

1. `npm install`
2. `vercel env add REPLICATE_API_TOKEN`
3. `vercel deploy`

## Environment Variables

- `REPLICATE_API_TOKEN` — your Replicate API key
