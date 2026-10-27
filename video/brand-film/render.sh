#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
npm ci --cache .cache/npm --no-audit --no-fund
npm run audio
npm run stills
npm run render
npm run render:portrait
node scripts/contact-v3.cjs
node scripts/verify-v3.cjs
