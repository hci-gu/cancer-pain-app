# Pre-RT Redesign Assets

Assets in this folder were extracted from `../graphics.ai`, which is a PDF-compatible Adobe Illustrator file with 89 pages. Each production asset is exported in two forms:

- `.svg` for implementation when the vector export is clean enough.
- `.png` as a high-resolution preview/fallback.

Filenames include the Illustrator source page number as `--pNN`, so assets can be traced back to `graphics.ai`. A numbered source contact sheet is available at `source-previews/graphics-ai-pages-contact-sheet.png`.

## Folder Guide

### `logos/`

- `pre-rt-logo--p56`
- `gothenburg-university-seal--p57`

Use these in the app shell header/footer. Prefer SVG for production so circular logos do not carry the white PDF-render background.

### `status/`

- `success-check-circle--p55`

Use for submitted/success states, especially the daily form confirmation screen.

### `dashboard-cards/`

Home and daily check-in task card artwork.

- `registration-card-wide--p58`
- `initial-questionnaire-card-wide--p59`
- `study-info-card-wide--p60`
- `faq-card-wide--p61`
- `daily-form-card-wide--p62`
- `after-treatment-card-wide--p63`
- `registration-card-square--p64`
- `initial-questionnaire-card-square--p65`
- `study-info-card-square--p66`
- `faq-card-square--p67`
- `daily-form-card-square--p68`
- `after-treatment-card-square--p69`
- `registration-card-large-wide--p70`
- `calendar-card-yellow-wide--p71`
- `clouds-card-pink-wide--p72`
- `flag-card-blue-wide--p73`
- `calendar-card-yellow-alt-wide--p75`
- `flag-card-blue-alt-wide--p77`

Use square variants for compact tile layouts and wide variants for desktop/wider cards. The `large-wide`, `calendar`, `clouds`, and `flag` variants match the daily check-in dashboard states.

### `questionnaire/`

Supplemental questionnaire/help artwork.

- `help-magnifier-ribbon-wide--p3`
- `questionnaire-clipboard-broken-heart-wide--p50`

Use these if the implementation needs generic help, "learn more", or questionnaire/checklist artwork outside the specific dashboard tile set.

### `faq-categories/`

FAQ category tiles plus larger illustrative resources used inside resource pages.

- `radiation-effects-wave-card-wide--p78`
- `radiation-effects-wave-card-square--p84`
- `vaginal-dilator-card-wide--p79`
- `vaginal-dilator-card-square--p85`
- `sexual-health-card-wide--p80`
- `sexual-health-card-square--p86`
- `intimate-care-card-wide--p81`
- `intimate-care-card-square--p87`
- `violence-card-wide--p82`
- `violence-card-square--p88`
- `learn-more-card-wide--p83`
- `learn-more-card-square--p89`
- `hand-heart-care-wide--p14`
- `hand-heart-care-compact--p15`
- `sexual-health-hand-heart-large-wide--p29`
- `sexual-health-hand-heart-large-compact--p30`
- `intimate-care-category-wide--p33`
- `intimate-care-category-compact--p34`
- `intimate-care-category-card-wide--p51`
- `intimate-care-category-card-compact--p52`
- `intimate-care-warning-wide--p35`
- `intimate-care-warning-compact--p36`
- `shaving-care-category-wide--p37`
- `shaving-care-category-compact--p38`
- `sexual-health-puzzle-wide--p39`
- `sexual-health-puzzle-compact--p40`
- `sexual-health-hearts-wide--p41`
- `sexual-health-hearts-compact--p42`
- `sexual-health-hand-heart-wide--p43`
- `sexual-health-hand-heart-compact--p44`
- `sexual-health-body-card-wide--p53`
- `sexual-health-body-card-compact--p54`
- `learn-more-hearts-wide--p45`
- `learn-more-hearts-compact--p46`
- `after-treatment-clouds-card--p76`
- `violence-heart-wide--p47`
- `violence-stop-hand-wide--p48`
- `violence-mirror-silhouette-wide--p49`

The `*-card-*` files are best for category overview tiles. The larger `*-wide` illustrations are better for expanded article/accordion content.

### `medical/`

Medical and instruction illustrations for Q&A content and questionnaire help dialogs.

- `pelvic-anatomy-numbered-wide--p1`
- `pelvic-anatomy-numbered-compact--p2`
- `vaginal-adhesion-diagram-wide--p4`
- `vaginal-adhesion-closeup-wide--p5`
- `vaginal-stenosis-scale-wide--p6`
- `vaginal-stenosis-scale-compact--p7`
- `hormone-magnifier-wide--p8`
- `hormone-magnifier-compact--p9`
- `iud-illustration-wide--p10`
- `iud-illustration-compact--p11`
- `pregnancy-test-question-wide--p12`
- `pregnancy-test-question-compact--p13`
- `how-to-use-video-scene--p16`
- `lubricant-and-intimate-oil--p17`
- `dilator-insertion-position--p18`
- `dilator-insertion-arrow--p19`
- `dilator-insertion-duration--p20`
- `dilator-size-comparison-wide--p21`
- `dilator-measuring-in-mirror--p22`
- `therapy-timing-timeline-wide--p23`
- `therapy-timing-timeline-vertical--p24`
- `dilator-length-measurement-wide--p27`
- `dilator-length-measurement-compact--p28`
- `dilator-depth-cap-indicator-wide--p31`
- `dilator-depth-cap-indicator-compact--p32`

Use compact variants in narrow cards/modals and wide variants in desktop accordion content. `how-to-use-video-scene--p16` is a still illustration, not a playable video asset.

### `source-previews/`

- `graphics-ai-pages-contact-sheet.png`
- `extracted-assets-contact-sheet.png`

Numbered preview of all 89 Illustrator pages and a contact sheet of the extracted assets. These are documentation-only.

## Implementation Notes

- Do not use full screenshots from `../screens/` as production UI assets.
- Prefer SVG for React/Vite imports where possible.
- If an SVG renders with unexpected text or clipping in the browser, use the matching PNG fallback.
- Keep image alt text tied to the semantic content, not the filename.
- The exported PNGs are intentionally high resolution and trimmed to their visible art bounds.
