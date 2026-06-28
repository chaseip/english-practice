# English Practice — Travel English Word-Order Drills

A small React app to help an advanced-but-rusty English learner refresh **spoken travel English** before a USA vacation. It is built directly on the Canva deck's method: **英語の語順20選 — the 20 English word-order patterns.** Every English sentence is broken into colored slots (誰が→どうする→何を→どこで→いつ), and the learner drills **filling each slot in the right order**, using example sentences from real trip moments: the **airplane, immigration, transportation, hotels, and restaurants**.

The learner studied English for years in Japan (strong reading/grammar, rusty speaking) and the Canva is bilingual, so this app keeps **Japanese on every card** as the prompt and keeps the **same colored-slot system** she already knows from the deck.

---

## 1. The method (what the Canva actually teaches)

Each of the 20 "models" is a **word-order pattern**, not a phrase. The deck color-codes every part of an English sentence and teaches the learner to assemble them in order:

> 🟥 誰(何)が (who/what) → 🟧 どうする (verb) → 🟨 何を (object) → 🟩 どこで (where) → 🟦 いつ (when)

Pattern 1 is the affirmative base; the other 19 are systematic transformations — negatives (`don't`/`doesn't`/`didn't`), questions (`Do`/`Does`/`Did`, WH-questions), modals, `be`-verb forms, and special frames (`It is… to…`, `It takes… to…`, `There is/are…`). The full list of 20 is in `src/data/patterns.json`.

**The app's job:** make practicing that slot-by-slot assembly *fast and repetitive*. Show the Japanese, she builds the English in the correct slot order, instant check, hear it spoken, next.

## 2. Audience & device

- **Learner:** wife's friend, visiting the USA. Reads Japanese; reading/grammar strong; wants speaking/listening reps.
- **Primary device:** phone. **Mobile-first is a hard requirement** (big tap targets, one column, thumb-reachable controls).
- **Used alongside:** live conversation with you + your wife, and the Canva deck itself.

## 3. Core interaction — the slot drill (the whole point)

This is the hero feature. For a chosen example, the app shows:

- The **Japanese sentence** (prompt) + the pattern's colored slot headers, exactly like the deck.
- A row of **scrambled word chips** (one per cell, color-coded by slot type).

The learner **taps/drags chips into the colored slots in order**. On the last chip:

- ✅ correct order → cells flash green, the full sentence appears, and it's **spoken aloud** (Web Speech API, US voice).
- ❌ wrong → gentle nudge, let her rearrange.

Two difficulty toggles (cheap to add, high value):
1. **Build mode** (default) — chips provided, just order them. Tests word order.
2. **Recall mode** — empty slots, she types each one. Tests production.

A **Reveal** button always shows the answer table (the exact Canva-style colored table) + plays audio, so it doubles as a flashcard.

### Why this shape
Word order is the entire pedagogy of the deck; a drag-into-slots drill mirrors it 1:1 and gives many fast reps. Japanese prompt + colored slots = zero new mental model for her.

## 4. Other features (MVP)

1. **Pattern list / home** — 20 cards, each showing the colored title (`誰が→どうする→…`), the English name, and a one-line grammar note. Tap → drill that pattern.
2. **Context filter** — chips `Airplane · Immigration · Transportation · Hotel · Restaurant` to focus examples on an upcoming situation.
3. **Listen (TTS)** — 🔊 on every full sentence via `window.speechSynthesis` (pick an `en-US` voice). Zero backend, free, works offline.
4. **Progress** — mark patterns "practiced"; persist in `localStorage`; progress bar on home.
5. **Colored-slot table view** — render any example as the deck's table so it feels familiar.

### Nice-to-have (post-MVP, only if easy)
- **Shuffle/quiz mode** across all 20 patterns.
- **Speak-and-check** with `SpeechRecognition` (Chrome/Edge only — treat as bonus).
- **"Trip mode"** — examples in journey order (plane → immigration → transport → hotel → restaurant).
- Japanese is the default prompt; an EN-only toggle is trivial since both are in the data.

## 5. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | **Vite** + React 18 | Fast, Vercel-native |
| Styling | **Tailwind CSS** | Mobile-first utilities; easy slot colors |
| Routing | `react-router-dom` | Home / pattern drill |
| Drag/drop | Native pointer events or `@dnd-kit/core` | Tap-to-place works without a lib; dnd-kit if you want smooth drag |
| State | React hooks + `localStorage` | No backend |
| Audio | Web Speech API (`speechSynthesis`) | Built-in, free |
| Data | Static `patterns.json` | One file, easy to edit |
| Host | **Vercel** | One-click from GitHub, free HTTPS |

**No backend, no database, no API keys, no cost.** Everything is static + browser APIs.

## 6. Data model (`src/data/patterns.json`) — already written

```jsonc
{
  "slotTypes": {                          // color + bilingual label per slot kind
    "subject": { "ja": "誰(何)が", "en": "Who/What", "color": "#E4262C" },
    "verb":    { "ja": "どうする", "en": "Action (verb)", "color": "#F47B20" },
    ...                                    // object, place, time, duration, neg, do,
                                           // aux, be, qword, manner, person, thing,
                                           // toverb, adj, complement, frame, prep, not
                                           // (20 slot types total)
  },
  "contexts": [ { "id": "airplane", "label": "Airplane", "emoji": "✈️" }, ... ],
  "models": [
    {
      "id": 1,
      "title_ja": "誰(何)が → どうする → 何を → どこで → いつ",
      "title_en": "Subject + Verb + Object + Place + Time",
      "grammar": "Basic affirmative sentence (present)...",
      "slots": ["subject","verb","object","place","time"],   // canonical template order
      "examples": [
        {
          "context": "restaurant",
          "full": "I order a coffee at the café every morning.",  // for display + TTS
          "ja": "私は毎朝カフェでコーヒーを注文します。",            // prompt
          "cells": [                                              // sentence order = answer
            { "type": "subject", "text": "I" },
            { "type": "verb",    "text": "order" },
            { "type": "object",  "text": "a coffee" },
            { "type": "place",   "text": "at the café" },
            { "type": "time",    "text": "every morning" }
          ]
        }
        // 5 examples per model
      ]
    }
    // 20 models
  ]
}
```

Key rules for the build:
- **`cells` is in sentence order** → it *is* the correct answer. Scramble a copy for the drill; compare the learner's order back to it.
- **Color a cell** by looking up `slotTypes[cell.type].color`. Slot headers use the same lookup.
- Examples may **omit optional slots** (not every sentence has a place or time) — render only the cells present.
- **`full`** is the clean, capitalized, punctuated sentence — use it for display and `speak(full)`.
- Content: **20 patterns × 21 travel examples = 420 sentences**, each with Japanese. Seven contexts (airplane, immigration, transportation, hotel, restaurant, shopping, tourism). Every (pattern × context) combination has at least 3 sentences, so any filter on any pattern always has enough to drill. Shopping and Tourism mix traveler-POV and cashier/staff-spoken lines for listening practice.

## 7. Suggested repo structure

```
english-practice/
├── PLAN.md                       (this file)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js / postcss.config.js
├── vercel.json                   ({ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] })
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css                 (Tailwind directives)
    ├── data/patterns.json        (already written — 20 patterns)
    ├── hooks/
    │   ├── useSpeech.js          (speechSynthesis wrapper → speak(text))
    │   └── useProgress.js        (localStorage practiced-state)
    ├── lib/
    │   └── slots.js              (color lookup, shuffle, answer-check helpers)
    ├── components/
    │   ├── PatternCard.jsx       (home list item, colored title)
    │   ├── SlotTable.jsx         (the Canva-style colored answer table)
    │   ├── SlotDrill.jsx         (scrambled chips → drop into slots; the hero)
    │   ├── Chip.jsx
    │   ├── ContextFilter.jsx
    │   └── ProgressBar.jsx
    └── pages/
        ├── Home.jsx              (20 patterns + filter + progress)
        └── PatternDrill.jsx      (pick example → drill → reveal → next)
```

## 8. Build steps (for the Sonnet session)

1. `npm create vite@latest . -- --template react` (folder is empty except `.claude/`, `PLAN.md`, `src/data/patterns.json` — keep those).
2. `npm i react-router-dom` and Tailwind (`npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`); add Tailwind directives to `src/index.css`.
3. Keep `src/data/patterns.json` as the single source of content; build `lib/slots.js` helpers.
4. `useSpeech` around `window.speechSynthesis` — choose an `en-US` voice; expose `speak(text)`.
5. Build `SlotTable` (render cells with `slotTypes` colors) → then `SlotDrill` (shuffle cells, tap/drag into slots, check order, on success `speak(full)`).
6. `Home` (20 `PatternCard`s + `ContextFilter` + `ProgressBar`) and `PatternDrill` page.
7. `localStorage` progress via `useProgress`.
8. Test on a narrow viewport; verify TTS speaks, slot colors match, deep links reload.

## 9. GitHub + Vercel deploy

```bash
git init
git add .
git commit -m "Travel English word-order drill app"
git branch -M main
git remote add origin https://github.com/chaserml/english-practice.git
git push -u origin main
```
Then on **vercel.com → Add New → Project → import `chaserml/english-practice`**. It auto-detects **Vite** (build `npm run build`, output `dist`). Deploy. Every push to `main` auto-redeploys. Share the `*.vercel.app` URL; "Add to Home Screen" makes it feel like an app on her phone.

## 10. Out of scope (keep it simple)
Accounts/auth, a backend, a CMS, analytics, paid TTS, AI grading. One learner, one trip — static + browser APIs is plenty.

---

### Notes on fidelity to the Canva
- The 20 patterns and the colored-slot system are taken **directly from the deck's index (もくじ)** and slide structure (title → 例文 → colored table → 主に使用される単語 → 他の例文).
- The **example sentences are travel-themed adaptations** (the deck uses home/daily-life examples like "I cook dinner in the kitchen"). Grammar/slot order is preserved; only the vocabulary moved to airplane/immigration/transport/hotel/restaurant per the request.
- **Slot order verified against the actual slides for patterns 1–2 and 15–20.** Notable details now baked into the data:
  - **#15** manner (どうやって) comes **after** the object: `subject→verb→object→manner→place→time`. Manner = "by/with + means" (by card, by hand, online).
  - **#16** is the full six-slot form `subject→verb→person→thing→place→time` (not just person+thing).
  - **#17** keeps `to どうする/何を` as a **single** cell (e.g. "to study English").
  - **#18 / #19** split `to+どうする` (verb only, e.g. "to find") from a separate 何を object cell; **#19** uses a dedicated `duration` slot (時間) distinct from `time` (いつ).
  - **#20** is `frame→thing→prep→place→time`, where `prep` is specifically **in/on/at** (its own cell) and `time` (いつ) is optional — confirmed against slide 20.
- The `full` field always holds the natural, capitalized, spoken sentence for audio/display. To mirror any slide word-for-word, edit `full`/`cells`/`ja` in the one JSON file — no code changes needed.
