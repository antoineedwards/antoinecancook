#!/bin/bash

git add .
git commit -m "$1"
git push origin main

# 1. Build the Next.js app for Cloudflare
npx @opennextjs/cloudflare build

# 2. Deploy the built output to Cloudflare Workers
npx wrangler deploy
