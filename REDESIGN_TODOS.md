# Pre-RT Redesign TODOs

Source of truth: `redesign-report.html`.

Use this file as the redesign progress tracker. Mark tasks complete with `[x]` as work lands. Keep visual and behavioral changes tied to the screenshot references in `redesign/screens/`, but use production assets from copied files under `web/src/assets/redesign/`, not from cropped screenshots.

## Ground Rules

- [ ] Do not implement Android/browser chrome from the mobile screenshots.
- [ ] Do not crop full-screen files from `redesign/screens/` into production UI.
- [ ] Do not import production runtime assets directly from `redesign/assets/`; copy selected assets into the frontend first.
- [ ] Keep current questionnaire progress-count behavior unchanged.
- [ ] Keep current violence/escape-action scope logic unchanged; only restyle it.
- [ ] Keep PocketBase resource HTML as the source for embedded media, videos, diagrams, and article content.
- [ ] Skip "Efter studien" and 3/6/12 month follow-up flows in this implementation pass.

## Phase 0 - Inventory and Baseline

- [x] Review `redesign-report.html` end to end.
- [x] Review `redesign/assets/README.md` and the asset contact sheet.
- [ ] Open the core screenshot references before implementation:
  - [ ] `redesign/screens/home-study-overview-mobile.png`
  - [ ] `redesign/screens/home-study-overview-desktop.png`
  - [ ] `redesign/screens/daily-check-in-overview-mobile.png`
  - [ ] `redesign/screens/daily-check-in-overview-desktop.png`
  - [ ] `redesign/screens/initial-form-intro-mobile.png`
  - [ ] `redesign/screens/daily-form-vaginal-dilator-intro-mobile.png`
  - [ ] `redesign/screens/daily-form-radiation-today-question-desktop.png`
  - [ ] `redesign/screens/daily-form-question-list-drawer-mobile.png`
  - [ ] `redesign/screens/daily-form-length-measurement-help-desktop.png`
  - [ ] `redesign/screens/daily-form-submitted-desktop.png`
  - [ ] `redesign/screens/about-study-information-desktop.png`
  - [ ] `redesign/screens/faq-category-overview-desktop.png`
  - [ ] `redesign/screens/faq-vaginal-dilator-accordion-desktop.png`
- [x] Snapshot the current routes and behavior before changing them:
  - [x] `/`
  - [x] `/forms`
  - [x] `/forms/:id`
  - [x] `/forms/:id/history`
  - [x] `/about`
  - [x] `/profile`
- [x] Identify the current questionnaire IDs used by the app:
  - [x] Daily questionnaire: `sdzkpd49ndccf5b`
  - [x] Baseline/initial questionnaire: `u6917wm639q1d01`
  - [x] Treatment-end questionnaire ID from current code/data: `p8ow7xj8h4uuv43`
- [ ] Confirm local verification commands work:
  - [ ] `cd web && pnpm lint`
  - [x] `cd web && pnpm build`
  - [ ] `cd pocketbase && go test ./...`

## Phase 1 - Data Model and Frontend Types

- [x] Add a PocketBase migration in `pocketbase/migrations/` for `questionnaires.introText`.
- [x] Configure `questionnaires.introText` as rich text or equivalent HTML-capable content.
- [x] Add a PocketBase migration field for FAQ category tile artwork on `resourceCollection`.
- [x] Keep using `resourceCollection.visible_on_questions_and_answers` for FAQ category inclusion.
- [x] Do not seed category labels, ordering, or artwork in this redesign pass.
- [x] Update frontend `Questionnaire` types in `web/src/state.tsx` with `introText`.
- [x] Map `questionnaire.introText` in `mapQuestionnaire`.
- [x] Update frontend `ResourceCollection` types with the new image asset field.
- [x] Map the new `resourceCollection` image asset field in `mapResourceCollection`.
- [x] Confirm expanded PocketBase queries still include data needed for questions, resources, follow-ups, and resource collections.
- [x] Document any required PocketBase data-entry follow-up for FAQ tile images and intro copy.

Data-entry follow-up: PocketBase records still need FAQ category image assignments and questionnaire `introText` content. This migration only adds the fields.

## Phase 2 - Asset Pipeline

- [x] Create `web/src/assets/redesign/`.
- [x] Copy selected logo assets:
  - [x] `logos/pre-rt-logo--p56.svg`
  - [x] `logos/gothenburg-university-seal--p57.svg`
- [x] Copy selected status assets:
  - [x] `status/success-check-circle--p55.svg`
- [x] Copy home dashboard card assets from `redesign/assets/dashboard-cards/`.
- [x] Copy daily check-in card assets from `redesign/assets/dashboard-cards/`.
- [x] Copy FAQ category tile assets from `redesign/assets/faq-categories/`.
- [x] Copy medical/help diagram assets needed by questionnaire dialogs from `redesign/assets/medical/`.
- [x] Copy supplemental questionnaire/help assets from `redesign/assets/questionnaire/` if used.
- [x] Prefer SVG imports; use PNG only when SVG rendering is wrong.
- [x] Keep decorative card art `alt=""` and `aria-hidden="true"`.
- [ ] Provide useful alt text or adjacent explanation for medical diagrams.

## Phase 3 - Visual Tokens and Shared UI Foundations

- [x] Update `web/src/index.css` theme variables to match the redesign palette:
  - [x] Page background `#F8EDED`
  - [x] Header/footer pink `#F8B5BB`
  - [x] Control teal `#9FDED8`
  - [x] Text dark teal `#06484C`
  - [x] Yellow card `#E9CB62`
  - [x] Coral card `#F58F7D`
  - [x] Blue card `#92C5D4`
  - [x] Pink card `#F698BE`
- [x] Update global foreground, card, border, destructive, primary, and radius tokens.
- [x] Add semantic utility classes only where Tailwind tokens are not enough.
- [x] Ensure typography uses dark teal, heavy headings, compact body copy, and no negative letter spacing.
- [x] Standardize primary buttons as soft teal rounded pills.
- [x] Standardize danger/abort action as saturated pink-red.
- [ ] Standardize focus-visible states for card links, buttons, chips, and dialogs.
- [ ] Ensure all fixed-format tiles/cards have stable dimensions or aspect ratios to prevent layout shift.

## Phase 4 - App Shell and Navigation

- [x] Refactor authenticated `RootPage` into reusable shell components.
- [x] Build `StudyAppShell`.
- [x] Build `StudyFooter`.
- [x] Replace the old sticky generic header with a full-width pink top bar.
- [x] Add Pre-RT identity/logo treatment from the redesign assets.
- [x] Add optional breadcrumb support for nested pages.
- [x] Center desktop content at the redesign widths, usually 640-760px inside the 912px artboard reference.
- [x] Keep mobile content tight and card-based around the 409px screenshot reference.
- [x] Replace the fixed dark footer with the pink footer strip and GU seal/contact copy.
- [x] Avoid fixed footer placement on long content pages unless content spacing accounts for it.
- [x] Update authenticated navigation:
  - [x] Home links to `/`
  - [x] Daily check-in links to `/check-in`
  - [x] Study information links to `/about`
  - [x] Q&A links to `/faq`
  - [x] Profile remains `/profile`
- [x] Remove the old generic `/forms` list from the primary navigation.
- [x] Keep login, OTP, and unauthenticated flows working even though they are not redesigned in the report.

## Phase 5 - Routing

- [x] Add route `/check-in`.
- [x] Keep route `/forms/:id`.
- [x] Keep route `/forms/:id/history`.
- [x] Add route `/form/success`.
- [x] Keep route `/about`.
- [x] Add route `/faq`.
- [x] Add route `/faq/mer`.
- [x] Add route `/faq/:collectionId`.
- [x] Register `/faq/mer` before `/faq/:collectionId` if route matching could treat `mer` as a collection ID.
- [x] Keep route `/profile`.
- [x] Decide what `/forms` should do after redesign:
  - [x] Remove from navigation.
  - [x] Redirect to `/check-in`, or keep as an unlinked compatibility page if needed.
- [x] Verify direct links from SMS/reminders to `/forms/:id?date=...` still work.

## Phase 6 - Home Dashboard

- [x] Replace `HomeTodoItem` with `StudyTaskCard`.
- [x] Implement `StudyTaskCard` support for:
  - [x] Title
  - [x] Illustration
  - [x] Background color
  - [x] Completion state
  - [x] Disabled state
  - [x] Short status text
  - [x] Link action
  - [x] Button action
  - [x] Top-right checkmark
- [x] Redesign `/` using `home-study-overview-mobile.png` and `home-study-overview-desktop.png`.
- [x] Show "Valkommen till studien!" and a short thank-you/introduction.
- [x] Render home cards:
  - [x] Registration date
  - [x] Initial questionnaire
  - [x] Read study information
  - [x] Q&A
  - [x] Daily form
  - [x] After radiation treatment
- [x] Drive state from `userDataAtom`, `readAboutPageAtom`, and `useAnswers`.
- [x] Show completed checkmarks only on:
  - [x] Registration date card
  - [x] Baseline/initial questionnaire card
- [x] Link study information card to `/about`.
- [x] Link Q&A card to `/faq`.
- [x] Link daily form/check-in card to `/check-in`.
- [x] Keep after-radiation/follow-up card visually present only as required by the dashboard, without implementing future follow-up flows.

## Phase 7 - Daily Check-In Dashboard

- [ ] Build `CheckInPage` for `/check-in`.
- [ ] Reuse current questionnaire data and answer-state logic from `web/src/pages/form/forms.tsx` where useful.
- [ ] Redesign using `daily-check-in-overview-mobile.png` and `daily-check-in-overview-desktop.png`.
- [ ] Render exactly four entry cards:
  - [ ] Daily form for today
  - [ ] Previous-day daily form/history
  - [ ] Treatment start date status
  - [ ] Treatment end date form
- [ ] Link today's daily form to the existing daily questionnaire route.
- [ ] Link previous-day daily form to `/forms/sdzkpd49ndccf5b/history` unless the daily questionnaire ID changes.
- [ ] Read treatment start status from `user.treatmentStart`.
- [ ] Do not make treatment start a user-completed questionnaire.
- [ ] Link treatment end to the existing treatment-end questionnaire flow.
- [ ] Show treatment end finished state after its questionnaire is completed.
- [ ] Ensure `/check-in` replaces `/forms` in the user-facing flow.

## Phase 8 - Questionnaire Shell and Intro Flow

- [ ] Build `QuestionnaireShell`.
- [ ] Move progress, form header, question list trigger, floating navigation, and full-screen scroller into the shell.
- [ ] Header shows "Se alla fragor".
- [ ] Header shows progress bar.
- [ ] Header shows progress count like `1/2`, `3/8`, or `32/37`.
- [ ] Keep current progress-count behavior unchanged.
- [ ] Render intro screens from `questionnaire.introText`.
- [ ] Do not hard-code intro copy by questionnaire ID.
- [ ] Do not derive intro copy from section-question text.
- [ ] Support initial questionnaire intro content: 37 questions, about 20 minutes.
- [ ] Support daily vaginal dilator intro content: 6-8 questions, about 1-2 minutes depending on follow-ups.
- [ ] Keep cached form-state restore behavior after reload.
- [ ] Keep auto-scroll/restore-to-last-answered behavior unless the redesigned shell intentionally replaces it.
- [ ] Keep direct access to `/forms/:id?date=...` working.

## Phase 9 - Question Cards and Answer Controls

- [ ] Build `QuestionCard` around current `QuestionSelector` behavior.
- [ ] Center question body in a white panel on desktop.
- [ ] Make question body nearly full-width on mobile.
- [ ] Render section intro screens, normal questions, long instructions, info icons, question numbers, and required markers.
- [ ] Add the horizontal divider under question titles.
- [ ] Rework `Select.tsx` into an `AnswerChipGroup`.
- [ ] Render single-choice answers as chip buttons.
- [ ] Render multiple-choice answers as chip buttons.
- [ ] Preserve `react-hook-form` field values and validation.
- [ ] Preserve dependency logic and follow-up visibility.
- [ ] Preserve current auto-advance behavior after option selection.
- [ ] Ensure chips expose selected state to screen readers.
- [ ] Update visual treatment of the violence/escape action without changing scope logic.
- [ ] Confirm long Swedish labels do not overflow chips or cards on mobile.

## Phase 10 - Question List Dialog and Help Dialogs

- [ ] Evolve `QuestionNavigationList` into `QuestionListDialog`.
- [ ] Use centered dialog layout on desktop.
- [ ] Use near-full-height sheet/drawer layout on mobile.
- [ ] Group follow-up questions under headings.
- [ ] Highlight the active question.
- [ ] Disable inaccessible future questions.
- [ ] Jump to the selected accessible question.
- [ ] Trap focus in the dialog.
- [ ] Close dialog with Escape.
- [ ] Render question resource/help buttons for questions with resource metadata.
- [ ] Render resource/help dialogs using PocketBase resource HTML.
- [ ] Use redesign medical/help assets where the resource content requires frontend-provided imagery.
- [ ] Match the length-measurement help references on mobile and desktop.

## Phase 11 - Submission Success Flow

- [ ] Build `FormSuccessPage` for `/form/success`.
- [ ] Use `success-check-circle--p55.svg`.
- [ ] Match `daily-form-submitted-mobile.png` and `daily-form-submitted-desktop.png`.
- [ ] Show confirmation copy.
- [ ] Add close/continue CTA.
- [ ] Make close/continue always navigate to `/check-in`.
- [ ] Update questionnaire submit handler so every successful questionnaire navigates to `/form/success`.
- [ ] Remove old immediate post-submit navigation to `/forms` or history.
- [ ] Clear local cached form state after successful submission as current behavior requires.
- [ ] Verify success behavior for once, daily, weekly, and dated questionnaire occurrences where applicable.

## Phase 12 - Study Information Page

- [ ] Redesign `/about` using `about-study-information-mobile.png` and `about-study-information-desktop.png`.
- [ ] Keep `/about` as study information only.
- [ ] Remove FAQ accordions/items from `/about`.
- [ ] Remove `ResourceAccordion` usage from `/about`.
- [ ] Link general FAQ actions to `/faq`.
- [ ] Link broad "show every resource/question" actions to `/faq/mer`.
- [ ] Do not create specific FAQ item anchor links in this pass.
- [ ] Preserve `readAboutPageAtom` behavior if it drives home completion/state.

## Phase 13 - FAQ and Resource Pages

- [ ] Build `FaqPage` for `/faq`.
- [ ] Load `resourceCollection` records where `visible_on_questions_and_answers = true`.
- [ ] Render the six colored illustrated category tiles from the screenshot.
- [ ] Use the new `resourceCollection` image asset field for category tile art.
- [ ] Add the "Om du vill veta mer?" action.
- [ ] Link "Om du vill veta mer?" to `/faq/mer`.
- [ ] Build `FaqMorePage` for `/faq/mer`.
- [ ] Render all FAQ/resource items across visible collections on `/faq/mer`.
- [ ] Build `ResourcePage` for `/faq/:collectionId`.
- [ ] Render one selected resource collection on `/faq/:collectionId`.
- [ ] Add breadcrumb path `Start > Fragor och svar > Category` on detail pages.
- [ ] Redesign `ResourceAccordion`:
  - [ ] Teal accordion bars
  - [ ] Chevron affordance
  - [ ] White expanded content card
  - [ ] Clean long-page scrolling
- [ ] Render sanitized/expected PocketBase resource HTML.
- [ ] Preserve `<pre>` and `<post>` resource filtering by user type.
- [ ] Verify embedded media, videos, diagrams, and article content render from PocketBase HTML.

## Phase 14 - Profile and Remaining Authenticated Pages

- [ ] Apply `StudyAppShell` styling to `/profile`.
- [ ] Keep logout behavior.
- [ ] Keep treatment date display/edit behavior.
- [ ] Do not invent new profile functionality from screenshots.
- [ ] Check any remaining authenticated routes for old dark header/footer or generic shadcn visual leftovers.

## Phase 15 - Responsive Visual QA

- [ ] Run the app locally.
- [ ] Capture/check mobile viewport around 409px wide.
- [ ] Capture/check desktop viewport around 912-927px wide.
- [ ] Compare `/` against home references.
- [ ] Compare `/check-in` against daily check-in references.
- [ ] Compare initial questionnaire intro against references.
- [ ] Compare daily questionnaire intro against references.
- [ ] Compare daily question screens against references.
- [ ] Compare question drawer mobile and desktop states.
- [ ] Compare help modal mobile and desktop states.
- [ ] Compare `/form/success` against submitted references.
- [ ] Compare `/about` against study information references.
- [ ] Compare `/faq` against category overview references.
- [ ] Compare `/faq/:collectionId` against accordion/detail references.
- [ ] Confirm no text overlaps card art, footer, form controls, or viewport edges.
- [ ] Confirm long FAQ pages scroll cleanly and footer placement remains sane.
- [ ] Confirm mobile cards and buttons do not resize or shift unexpectedly on hover/focus/state changes.

## Phase 16 - Functional QA

- [ ] Answer chips update `react-hook-form` values correctly.
- [ ] Follow-up questions appear only when dependency values match.
- [ ] Question drawer jumps to selected accessible question.
- [ ] Cached form state restores after reload.
- [ ] Progress count behavior matches the current app behavior.
- [ ] Every successful questionnaire submission lands on `/form/success`.
- [ ] Success page close/continue returns to `/check-in`.
- [ ] Existing questionnaire IDs continue to work, including daily form `sdzkpd49ndccf5b`.
- [ ] Baseline form `u6917wm639q1d01` completion state remains correct.
- [ ] `questionnaire.introText` rich text renders on intro screens.
- [ ] FAQ category tiles render from `resourceCollection` records with `visible_on_questions_and_answers` and the new image asset field.
- [ ] PocketBase migration adds model fields without seeding labels, order, or artwork.
- [ ] `/check-in` treatment start status reflects `user.treatmentStart`, not a questionnaire answer.
- [ ] Resources render sanitized/expected HTML from PocketBase.
- [ ] `<pre>` and `<post>` resource filtering still works by user type.
- [ ] `/check-in` replaces old generic `/forms` list in navigation.
- [ ] `/about` no longer renders FAQ accordions.
- [ ] `/faq` renders category overview and "Om du vill veta mer?" action.
- [ ] `/faq/mer` renders all FAQ/resource items across visible collections.
- [ ] `/faq/:collectionId` renders one resource collection detail page.
- [ ] `/forms/sdzkpd49ndccf5b/history` is reachable from the previous-day daily form card.
- [ ] After-study and 3/6/12 month follow-up routes are not implemented.

## Phase 17 - Accessibility QA

- [ ] All cards used as links/buttons have keyboard focus states.
- [ ] All icon-only controls have accessible names.
- [ ] Question chips expose selected state to screen readers.
- [ ] Dialogs trap focus.
- [ ] Dialogs close with Escape.
- [ ] Color is not the only signal for completion, danger, disabled, or selected states.
- [ ] Medical diagrams have useful alt text or nearby explanatory text.
- [ ] Decorative illustration assets are hidden from assistive tech.
- [ ] Touch targets are large enough on mobile.
- [ ] Page headings and landmarks remain coherent after route shuffling.

## Phase 18 - Build, Test, and Handoff

- [ ] Run `cd web && pnpm lint`.
- [ ] Run `cd web && pnpm build`.
- [ ] Run `cd pocketbase && go test ./...`.
- [ ] Run any available browser/e2e checks.
- [ ] Review the final diff for unrelated changes.
- [ ] Update this tracker with completed tasks.
- [ ] Note any remaining PocketBase data-entry requirements:
  - [ ] FAQ category artwork assignments
  - [ ] Questionnaire intro rich text
  - [ ] FAQ category ordering/labels if not already present in data
- [ ] Note any known visual deviations from screenshot references.
- [ ] Note any intentional behavior deviations from the report.
- [ ] Confirm `redesign-clarifications.md` deletion, if still present in git status, is unrelated or intentionally handled separately.

## Final Acceptance

- [ ] Authenticated app uses the new Pre-RT visual shell.
- [ ] Home page is a redesigned illustrated workflow dashboard.
- [ ] `/check-in` is the primary daily/treatment workflow dashboard.
- [ ] Generic `/forms` list is removed from primary experience.
- [ ] Questionnaires use redesigned intro, progress, question, chip, drawer, help, and navigation treatments.
- [ ] All questionnaire submissions go through `/form/success`.
- [ ] `/about` contains study information only.
- [ ] `/faq`, `/faq/mer`, and `/faq/:collectionId` implement the new FAQ/resource experience.
- [ ] Profile retains existing behavior while matching the new shell.
- [ ] PocketBase schema supports questionnaire intro rich text and FAQ category tile images.
- [ ] Visual QA passes at mobile and desktop reference widths.
- [ ] Functional, routing, data, and accessibility QA items are complete.
