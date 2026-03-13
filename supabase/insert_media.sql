-- ============================================================
--  TNF Summit — Insert media_files metadata for uploaded assets
--  Run this in Supabase SQL Editor AFTER exposing tnf_summit schema
--  (Project Settings → API → Exposed schemas → add tnf_summit → Save)
-- ============================================================

SET search_path TO tnf_summit, public;

-- Base URL for all files
-- Format: https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/{bucket}/{path}

-- ── GALLERY IMAGES ──────────────────────────────────────────

INSERT INTO tnf_summit.media_files
  (bucket_name, file_path, file_name, original_name, mime_type, media_type,
   alt_text, caption, category, public_url, is_published, sort_order)
VALUES
(
  'tnf-gallery',
  'gallery/1773396859867_victorial-falls.jpg',
  '1773396859867_victorial-falls.jpg',
  'victorial-falls.jpg',
  'image/jpeg', 'image',
  'Victoria Falls — Summit Venue',
  'Victoria Falls, one of the Seven Natural Wonders of the World and host venue of the TNF Global Summit 2026',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396859867_victorial-falls.jpg',
  TRUE, 1
),
(
  'tnf-gallery',
  'gallery/1773396862544_elephant-hills.jpg',
  '1773396862544_elephant-hills.jpg',
  'elephant-Hills.jpg',
  'image/jpeg', 'image',
  'Elephant Hills Resort',
  'Elephant Hills Resort — official accommodation and conference venue for the TNF Global Summit 2026',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396862544_elephant-hills.jpg',
  TRUE, 2
),
(
  'tnf-gallery',
  'gallery/1773396863401_zambezi-river.jpg',
  '1773396863401_zambezi-river.jpg',
  'zambezi-river.jpg',
  'image/jpeg', 'image',
  'Zambezi River Views',
  'The iconic Zambezi River bordering Zimbabwe and Zambia, near Victoria Falls',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396863401_zambezi-river.jpg',
  TRUE, 3
),
(
  'tnf-gallery',
  'gallery/1773396864384_victorial-falls-unesco-site.jpg',
  '1773396864384_victorial-falls-unesco-site.jpg',
  'Victorial-falls-Unesco-site.jpg',
  'image/jpeg', 'image',
  'Victoria Falls UNESCO World Heritage Site',
  'Victoria Falls — a UNESCO World Heritage Site and one of Africa''s most spectacular natural attractions',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396864384_victorial-falls-unesco-site.jpg',
  TRUE, 4
),
(
  'tnf-gallery',
  'gallery/1773396865230_conferencee-facilities.jpg',
  '1773396865230_conferencee-facilities.jpg',
  'Conferencee-Facilities.jpg',
  'image/jpeg', 'image',
  'Conference Facilities at Elephant Hills Resort',
  'State-of-the-art conference facilities at the summit venue',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396865230_conferencee-facilities.jpg',
  TRUE, 5
),
(
  'tnf-gallery',
  'gallery/1773396865993_vicoria-falls-bridge.jpg',
  '1773396865993_vicoria-falls-bridge.jpg',
  'vicoria-falls-bridge.jpg',
  'image/jpeg', 'image',
  'Victoria Falls Bridge',
  'The historic Victoria Falls Bridge spanning the Zambezi River gorge between Zimbabwe and Zambia',
  'gallery',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/gallery/1773396865993_vicoria-falls-bridge.jpg',
  TRUE, 6
)
ON CONFLICT (file_path) DO NOTHING;


-- ── PARTNER / SPONSOR LOGOS ──────────────────────────────────

INSERT INTO tnf_summit.media_files
  (bucket_name, file_path, file_name, original_name, mime_type, media_type,
   alt_text, caption, category, public_url, is_published, sort_order)
VALUES
(
  'tnf-gallery',
  'sponsors/1773396866783_ilo.png',
  '1773396866783_ilo.png',
  'ILO.png',
  'image/png', 'image',
  'International Labour Organization (ILO)',
  'ILO — Strategic Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396866783_ilo.png',
  TRUE, 1
),
(
  'tnf-gallery',
  'sponsors/1773396867564_sadc_logo.png',
  '1773396867564_sadc_logo.png',
  'sadc_logo.png',
  'image/png', 'image',
  'Southern African Development Community (SADC)',
  'SADC — Regional Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396867564_sadc_logo.png',
  TRUE, 2
),
(
  'tnf-gallery',
  'sponsors/1773396868377_afcfta.png',
  '1773396868377_afcfta.png',
  'AfCFTA.png',
  'image/png', 'image',
  'African Continental Free Trade Area (AfCFTA)',
  'AfCFTA Secretariat — Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396868377_afcfta.png',
  TRUE, 3
),
(
  'tnf-gallery',
  'sponsors/1773396869444_zida-logo.png',
  '1773396869444_zida-logo.png',
  'ZIDA-LOGO.png',
  'image/png', 'image',
  'Zimbabwe Investment and Development Agency (ZIDA)',
  'ZIDA — Co-Host',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396869444_zida-logo.png',
  TRUE, 4
),
(
  'tnf-gallery',
  'sponsors/1773396870404_aicesis.png',
  '1773396870404_aicesis.png',
  'aicesis.png',
  'image/png', 'image',
  'AICESIS — International Association of Economic and Social Councils',
  'AICESIS — International Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396870404_aicesis.png',
  TRUE, 5
),
(
  'tnf-gallery',
  'sponsors/1773396871788_zctu.webp',
  '1773396871788_zctu.webp',
  'ZCTU.webp',
  'image/webp', 'image',
  'Zimbabwe Congress of Trade Unions (ZCTU)',
  'ZCTU — Labour Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396871788_zctu.webp',
  TRUE, 6
),
(
  'tnf-gallery',
  'sponsors/1773396872860_elephant-hills-logo.png',
  '1773396872860_elephant-hills-logo.png',
  'elephant-hills-logo.png',
  'image/png', 'image',
  'Elephant Hills Resort',
  'Elephant Hills Resort — Official Venue Partner',
  'sponsors',
  'https://yuwwqupyqpmkbqzvqiee.supabase.co/storage/v1/object/public/tnf-gallery/sponsors/1773396872860_elephant-hills-logo.png',
  TRUE, 7
)
ON CONFLICT (file_path) DO NOTHING;

-- ── Verify ───────────────────────────────────────────────────
SELECT category, COUNT(*) as count
FROM tnf_summit.media_files
GROUP BY category
ORDER BY category;
