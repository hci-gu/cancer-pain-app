Unclear / needs decision

  1. Follow-up and “Efter studien” scope
     The sitemap includes “Efter studien” plus 3/6/12 month follow-up questionnaire flows, but the route map and implementation plan do not cover them.
     Clarify whether these are in scope now or just future map context.
    Answer: Skip for now and add later

  2. Treatment start/end cards on /check-in
     The report says /check-in has radiation start and end date forms (redesign-report.html:556), but the screenshots label both lower cards “Startdatum
     strålbehandling”. Current backend only has a treatment-end form hook via TREATMENT_END_FORM_ID (pocketbase/main.go:50) and updates
     user.treatmentEnd after that answer (pocketbase/main.go:790). There is no equivalent treatment-start form flow.
    Answer: Was a bit unclear here, the treatment-end form is there, the treatment-start does not come from a form the user has finished themselves but
    the data should exist on the user model to see if it's set or not. so treatment-start doesn't go to a questionnaire but treatment-end does.

  3. Exact previous-day history route
     The report names /form/history (redesign-report.html:757), but the current app route is /forms/:id/history (web/src/main.tsx:57). Since the daily
     questionnaire ID is currently required, decide whether to add a new hard-coded daily /form/history route or keep /forms/sdzkpd49ndccf5b/history.
     Answer: keep the current route structure.

  4. Success page close/continue behavior
     The report says all submissions go to /form/success and the submit handler should not branch (redesign-report.html:769). That is clear for
     submission, but not for what “Stäng formuläret” does afterward: return to /check-in, /, history, or use referrer/query state?
    Answer: Lets make it easy, always go back to /check-in

  5. PocketBase schema/data seeding details
     The report says add introText and a resourceCollection image field, and keep using visible_on_questions_and_answers (redesign-report.html:1132).
     The frontend already queries visible_on_questions_and_answers and sort (web/src/state.tsx:98), but the local PocketBase schema in pb_data does not
     appear to include visible_on_questions_and_answers, sort, description, or an image field on resourceCollection. Clarify exact field names/types and
     whether migrations should also seed/update category labels, order, and artwork.
    Answer: we should create a migration for updating the model, but not seed data based on artwork. This should just be noted as a required step later on.

  6. FAQ deep links from /about
     The report allows hard-coded links from about to specific FAQ items. Current resource accordions use generated title slugs and URL hashes (web/src/
     components/resourceCollection.tsx:53). Clarify which about-page links should exist and their target category/resource anchors
    Answer: needs to be figured out based on the context of the design, but one thing to clarify about FAQ here, we have the subpages for specific categories on FAQ introduced
    but there will also be a page that just contains everything, and if we link to a specific item I think we for simplicity just always link to the FAQ page that has all questions.