#!/bin/bash

echo "🚀 Deploying SB Accounting with Google Logo Fix..."
echo ""

# Step 1: Add all files
echo "📦 Adding files to git..."
git add app/layout.tsx
git add app/sitemap.ts
git add app/home/JoinTeamSection.tsx
git add public/robots.txt
git add public/manifest.json
git add scripts/google-indexing-helper.sh
git add GOOGLE_LOGO_FIX_SUMMARY.md

# Step 2: Commit
echo "💾 Committing changes..."
git commit -m "🚀 SEO: Complete Google Logo & Schema Fix

- Enhanced metadata with metadataBase
- Added comprehensive Organization schema (JSON-LD)
- Created dynamic sitemap.ts
- Added robots.txt for better crawling
- Added PWA manifest.json
- Fixed video testimonials (4th video handling)
- Added complete SEO optimization for logo in Google Search

Files modified:
- app/layout.tsx: Enhanced metadata + Schema.org structured data
- app/sitemap.ts: Dynamic sitemap generation
- public/robots.txt: Search engine crawler instructions
- public/manifest.json: PWA support
- app/home/JoinTeamSection.tsx: Video availability checks

Critical for Google Search Console:
- Logo URL: https://www.sbaccounting.us/icon.png
- Sitemap URL: https://www.sbaccounting.us/sitemap.xml
- Verification: OilkVtmaBnVXLpDJzZ7wcJD5lSl7OJl6i8pjRGhkEwM"

# Step 3: Push
echo "🌐 Pushing to production..."
git push origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "⏭️  NEXT STEPS (CRITICAL!):"
echo ""
echo "1. Wait for deployment to finish (check Vercel/hosting dashboard)"
echo ""
echo "2. Verify logo is accessible:"
echo "   curl -I https://www.sbaccounting.us/icon.png"
echo ""
echo "3. Test Rich Results IMMEDIATELY:"
echo "   → https://search.google.com/test/rich-results"
echo "   → Enter: https://www.sbaccounting.us"
echo "   → Should show Organization with logo ✅"
echo ""
echo "4. Go to Google Search Console:"
echo "   → https://search.google.com/search-console"
echo "   → URL Inspection → https://www.sbaccounting.us"
echo "   → Click 'REQUEST INDEXING' ⚡"
echo ""
echo "5. Submit sitemap:"
echo "   → In Search Console → Sitemaps"
echo "   → Add: https://www.sbaccounting.us/sitemap.xml"
echo ""
echo "⏰ Logo will appear in Google Search in 3-7 days!"
echo ""
echo "📖 Full guide: GOOGLE_LOGO_FIX_SUMMARY.md"
echo ""
