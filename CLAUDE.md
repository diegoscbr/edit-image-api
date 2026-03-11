# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lightweight Vercel serverless API that proxies Replicate's background removal model (`lucataco/remove-bg`). It receives an image URL from the Alli Studio frontend and returns a transparent PNG URL. No database.

**Tech Stack:** Vercel serverless functions, Replicate JS client, Node.js (ES modules)

## Architecture

Single serverless function at `api/extract-foreground.js`:
- Receives `POST { "imageUrl": "..." }`
- Calls Replicate's `remove-bg` model
- Returns `{ "url": "..." }` (transparent PNG)
- CORS configured for localhost dev ports (5173, 5174) and Firebase-hosted production origins

## Commands

```bash
npm install              # Install dependencies
vercel dev               # Run locally (requires REPLICATE_API_TOKEN in .env)
vercel deploy            # Deploy to Vercel
vercel deploy --prod     # Deploy to production
```

## Environment Variables

- `REPLICATE_API_TOKEN` — Replicate API key (set via `vercel env add` or `.env` for local dev)

## Key Decisions

- ES module syntax (`"type": "module"` in package.json)
- `maxDuration: 30` in `vercel.json` to allow Replicate processing time
- CORS whitelist approach (not wildcard) — update `ALLOWED_ORIGINS` in the handler when adding new frontend origins
