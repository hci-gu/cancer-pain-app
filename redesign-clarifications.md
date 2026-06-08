It is clear enough to start implementation, but not fully clear enough to implement the redesign “fully” without a few product decisions.

  Potential Clarifications

  1. Q&A routing and category model
     The report says to “add a route or route state” for Q&A categories, but does not decide the URL structure. Current app only has /about, and Q&A
     resources are loaded from PocketBase via resourcesAtom.
     Clarify whether this should become /qa, /resources, /about/questions, or stay inside /about.
    Answer: Currently the webapp only has an /about route, the redesign proposes a new /faq page that links to sub pages around FAQ categories.

  2. Q&A category-to-data mapping
     The redesign has six illustrated category tiles, but current ResourceCollection only exposes id, name, description, and resources in web/src/
     state.tsx:129. There is no slug, color, icon/image, or category artwork metadata.
     Clarify whether category tile artwork/colors should be hard-coded in React by collection name/id, or added to PocketBase.
    Answer: I think we can implement this without updating the pocketbase model alot, we already have "resourceCollection" which has the "visible_on_questions_and_answers".
    We just need to add so that resourceCollection can have an image asset to display it, and we use these as the links to subpages for FAQ items.

  3. Study info vs Q&A separation
     Current /about contains hard-coded study text and then all Q&A accordions in web/src/pages/about/index.tsx:1. The redesign treats “Information om
     studien” and “Frågor och svar” more like separate areas.
     Clarify whether /about should only be study information, with Q&A moved elsewhere.
    Answer: yes we move all FAQ items to the new /faq page, and remove these from updated about page. The about page has some hardcoded links to specific FAQ items.

  4. Home dashboard card behavior
     The report lists cards for registration date, initial questionnaire, study info, Q&A, daily form, and after treatment. Current home maps these
     somewhat differently in web/src/pages/home/index.tsx:40: treatment start, baseline form, daily form, and treatment end placeholder.
     Clarify exact card actions/completion states, especially Q&A and “after radiation treatment”.
    Answer: The dashboard is mostly cards that are just links to subpages, but the "registration date" and "baseline form" ( top 2 cards ) have a finished state
    with a checkmark to mark them as completed. 

  5. Daily check-in route
     The report says /forms is “likely” the daily dashboard, but current /forms lists all questionnaires in web/src/pages/form/forms.tsx:108.
     Clarify whether /forms should be fully repurposed, or whether the generic questionnaire list must remain available somewhere.
     Answer: /forms is no longer needed. instead we have this new page /check-in which contains links to 4 separate places:
        - just filling in daily form for todays date
        - link to /form/history to fill in the daily form for a previous day
        - two bottom are links to forms for filling in start/end date for radiation treatments, ( these links should also contain finished state ).

  6. Questionnaire progress counts
     Current form progress counts every rendered page, including section pages, from useQuestions() in web/src/pages/form/index.tsx:37. The report
     examples use counts like 32/37 and daily 6-8 depending on follow-ups.
     Clarify whether progress should count only answerable questions or also section/intro pages.
    Answer: we can leave this behaviour unchanged, just focus on the visual redesign here.

  7. Intro screen copy source
     The report specifies intro pages for initial and daily forms, but does not say whether their text comes from PocketBase section questions,
     questionnaire descriptions, or hard-coded copy per questionnaire ID.
    Answer: We should update the questionnaire model for this to add an intro text which is a richText type.

  8. Submitted success navigation
     Current submit immediately navigates to /forms or history in web/src/pages/form/index.tsx:244. The redesign wants a success panel first.
     Clarify the close-button target for each form type: baseline/initial, daily today, daily historical date, treatment-end form.
    Answer: All questionnaires should navigate to a new success page after completion so it's a more defined step after answering. This is a new page.

  9. Resource media handling
     The report includes medical diagrams and a video example, but current resources render PocketBase HTML strings in web/src/components/
     resource.tsx:97. Clarify whether local redesign assets should be injected by frontend mapping, or whether PocketBase resource HTML/data will be
     updated to reference them. Also clarify whether the “how-to video” is an actual video or only the provided still illustration.
    Answer: Pocketbase resources will be updated to include any info/data inside the html of the resource, so stuff like videos etc are just embedded in the html.

  10. Violence / escape action scope
     Current escape behavior is tied to specific questionnaire section IDs and one resource collection ID in web/src/pages/form/index.tsx:166 and web/
     src/components/resourceCollection.tsx:85. The report says long safety/violence questions need an always-visible escape action.
     Clarify exactly which questions/resources should show it.
    Answer: This logic already exists in the app, just visuals that needs updating.

  Everything else is fairly clear: visual system, asset handling, shell/component direction, form mechanics to preserve, responsive targets, and QA
  expectations are well specified. The biggest missing pieces are route decisions and whether new visual/category/resource metadata should live in code
  or PocketBase.