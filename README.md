# Critical Thinker Pro

A guided, six-stage critical thinking coach for team managers. It walks one
person through one real decision, one reasoning stage at a time, and challenges
their thinking at each step instead of solving the problem for them.

Every coach response is a real model call to Claude. Nothing is canned.

## The six stages

| # | Stage | What the user does |
|---|-------|--------------------|
| 1 | Frame | States the decision in their own words, or uploads a document the app extracts the decision from |
| 2 | Evidence | Lists what they know, separated into observed, inferred and assumed |
| 3 | Assumptions & blind spots | Names what would have to be true for their view to hold |
| 4 | Alternative perspectives | Answers the strongest case against their position, which the app argues first |
| 5 | Options & criteria | Names two to four courses of action and the criteria they are judged against |
| 6 | Decide | Commits to a course of action with a written justification |

A final summary screen recaps the reasoning chain across all six stages, names
the specific weaknesses found and what the user did well, and shows the scores.

The coach is Socratic. It never supplies the user's answer, never flatters,
answers in three to five sentences ending in one question, and names the flaw
when one is present: confirmation bias, sunk cost, false dichotomy, hasty
generalization, appeal to authority, survivorship bias, correlation treated as
cause, anecdote treated as pattern. If an answer is off-topic or evasive the
coach says so, re-asks, and the stage will not advance until it is rewritten.
An empty stage never advances.

## Scoring

Each stage is scored 1-5 on clarity of reasoning, quality of evidence,
awareness of assumptions and openness to disagreement. Scores are hidden during
the session and shown only on the final summary, as the mean of the six stage
scores, with one line of justification per dimension.

## The dashboard

The embedded dashboard is the contact centre KPI workbook
(`KPI_Performance_Dashboard_Critical_Thinking.xlsx`): 60 phone consultants
across four teams, month M1 of Q1, weeks 1-4. CSAT, NPS, FCR, QA and AHT
against their targets, broken down by week, team, agent tenure, reason for the
call and call type, plus 1,079 QA audits and every consultant's month-to-date
figures.

Team, week and tenure figures are the workbook's own unweighted means of
agent-week rates, so what the learner reads in the app matches what they would
read in Excel. The dashboard also states, as fact rather than conclusion, how it
was built - the 40.6% survey return rate, the unweighted means, the two
irreconcilable quality numbers, the survey count that disagrees between sheets.
Those are the things the session is meant to make a learner notice.

The learner can consult the dashboard from inside any stage, or open it as a
full view, and can break every segment down by any of the five KPIs. The coach
sees exactly the same figures, so it can check a claim against them.

The **Progress** view charts scores from completed sessions over time, one line
per dimension, with the list of past sessions by decision title and date.
Sessions are stored in the browser's `localStorage`, so history survives across
visits on that browser.

## Interface

The shell follows the CONCEPT admin-dashboard layout: a white top bar with the
wordmark and a compact theme control, a dark navy sidebar holding the three
views plus a live mirror of the six stages, and light cards on a soft grey page.
The dashboard leads with a hero card - the assigned metric, its definition and
source, and a divided strip of session totals - then the KPI tiles with their
circular badges, then the charts.

Type is Poppins, loaded from Google Fonts with a system-sans fallback; if the
font cannot be fetched the layout is unchanged. Light and dark are both first
class: the dark theme restates every colour token against a navy surface rather
than inverting the light one.

Chart colours are indigo, pink, teal and amber - the mock's palette - and both
the light and dark sets were checked with a colour-vision-deficiency validator
for lightness band, chroma, adjacent-pair separation and contrast against their
own surface. Every series is direct-labelled and every chart carries a data
table, so identity never rests on colour alone.

## Deploying to Vercel

```bash
npm install -g vercel      # if you do not have the CLI
vercel link                # or import the repo at vercel.com/new
vercel env add ANTHROPIC_API_KEY    # paste your key, select all environments
vercel --prod
```

Importing the repository from the Vercel dashboard works equally well: it is a
zero-config project - `public/` is served as static files and each file in
`api/` becomes a serverless function. The only required setting is the
environment variable.

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `ANTHROPIC_API_KEY` | yes | - | Your key from [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| `COACH_MODEL` | no | `claude-opus-5` | Model used for every coach response |
| `COACH_EFFORT` | no | `medium` | `low`, `medium`, `high`, `xhigh` or `max`. Raise for sharper critique, lower for faster and cheaper replies |

`vercel.json` sets a 60 second function duration, which is the Hobby plan
maximum. If coach responses time out, lower `COACH_EFFORT`.

## Running locally

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm run dev          # http://localhost:3000
```

`npm run mock` serves the same app with canned coach responses and no API key,
for working on the interface offline.

## Editing the prompts

**Every model-facing prompt is in `api/_prompts.js` and nowhere else.** Edit
that one file to change how the coach behaves - its persona and hard rules, the
list of flaws it may name, the scoring rubric, each stage's question and
coaching brief, how the dashboard is described to the model, and the four prompt
builders. The UI reads the stage questions from that file too, via
`GET /api/config`, so the wording the user sees and the wording the model gets
can never drift apart.

The only contract the rest of the app depends on is the shape of the JSON
schemas at the bottom of that file.

## Assigning a different metric

`api/_dashboard.js` holds the whole metric pack. Change `DASHBOARD.focus` to
another KPI id (`nps`, `fcr`, `qa`, `aht`) to reassign the session; replace the
arrays to load a different period or organisation. Nothing in the UI or the
prompts is hard-coded to CSAT.

## Layout

```
public/index.html     the entire interface - one self-contained page, no build step
api/config.js         GET  - stage copy and the metric pack
api/coach.js          POST - coach, oppose, extract and summary actions
api/_prompts.js       every model-facing prompt, in one marked place
api/_dashboard.js     the metric pack extracted from the KPI workbook
api/_model.js         the only place the Anthropic API is called
scripts/dev.js        local server that runs api/ the way Vercel does
```
