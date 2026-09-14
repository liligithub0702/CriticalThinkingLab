/*
 * Every coach response in the app comes through here. Four actions:
 *   coach   - respond to and score one stage
 *   oppose  - build stage 4's opposing case
 *   extract - pull the decision out of an uploaded document (stage 1 only)
 *   summary - the closing recap, weaknesses, strengths and score justifications
 */

import { askModel, CoachError } from './_model.js';
import { DASHBOARD } from './_dashboard.js';
import {
  STAGES,
  stageById,
  buildCoachPrompt,
  buildOpposePrompt,
  buildExtractPrompt,
  buildSummaryPrompt,
  COACH_SCHEMA,
  OPPOSE_SCHEMA,
  EXTRACT_SCHEMA,
  SUMMARY_SCHEMA,
  NO_FLAW
} from './_prompts.js';

const MAX_INPUT = 12000;
const MAX_DOC = 400000; // characters of pasted/plain-text document
const DIMENSIONS = ['clarity', 'evidence', 'assumptions', 'openness'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const action = String(body.action || 'coach');

    switch (action) {
      case 'coach':
        return res.status(200).json(await coach(body));
      case 'oppose':
        return res.status(200).json(await oppose(body));
      case 'extract':
        return res.status(200).json(await extract(body));
      case 'summary':
        return res.status(200).json(await summary(body));
      default:
        throw new CoachError(400, `Unknown action "${action}".`);
    }
  } catch (err) {
    const status = err instanceof CoachError ? err.status : 500;
    if (status >= 500) console.error('[coach]', err);
    return res.status(status).json({ error: err.message || 'Something went wrong.' });
  }
}

/* -- actions ------------------------------------------------------------- */

async function coach(body) {
  const stage = stageById(body.stage);
  if (!stage) throw new CoachError(400, 'Unknown stage.');

  const input = String(body.input || '').trim();
  if (!input) throw new CoachError(400, 'Write an answer before asking for coaching.');
  if (input.length > MAX_INPUT) throw new CoachError(400, 'That answer is too long. Trim it and resubmit.');

  const history = cleanHistory(body.history);
  const opposingCase = body.opposingCase ? String(body.opposingCase).slice(0, MAX_INPUT) : null;

  const { system, user } = buildCoachPrompt({
    stage: stage.id,
    input,
    history,
    dashboard: DASHBOARD,
    opposingCase
  });

  const out = await askModel({ system, user, schema: COACH_SCHEMA });

  return {
    stage: stage.id,
    onTopic: out.on_topic !== false,
    flaw: out.flaw && out.flaw !== NO_FLAW ? out.flaw : null,
    response: String(out.response || '').trim(),
    scores: normaliseScores(out.scores)
  };
}

async function oppose(body) {
  const history = cleanHistory(body.history);
  if (!history.length) throw new CoachError(400, 'There is nothing to argue against yet.');

  const { system, user } = buildOpposePrompt({ history, dashboard: DASHBOARD });
  const out = await askModel({ system, user, schema: OPPOSE_SCHEMA });
  return { case: String(out.case || '').trim() };
}

async function extract(body) {
  const documents = [];
  let note = '';

  if (body.pdf) {
    const data = String(body.pdf).replace(/^data:[^,]*,/, '');
    documents.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data }
    });
  } else {
    const text = String(body.text || '').trim();
    if (!text) throw new CoachError(400, 'The document was empty.');
    note = `\n\nDOCUMENT (${body.filename ? String(body.filename).slice(0, 200) : 'pasted text'})\n"""\n${text.slice(0, MAX_DOC)}\n"""`;
  }

  const { system, user } = buildExtractPrompt({ dashboard: DASHBOARD });
  const out = await askModel({
    system,
    user: user + note,
    schema: EXTRACT_SCHEMA,
    documents
  });

  return {
    decision: String(out.decision || '').trim(),
    deadline: String(out.deadline || '').trim(),
    stakeholders: Array.isArray(out.stakeholders) ? out.stakeholders.map(String) : [],
    draft: String(out.draft || '').trim()
  };
}

async function summary(body) {
  const history = cleanHistory(body.history);
  if (history.length < STAGES.length) {
    throw new CoachError(400, 'Finish all six stages before asking for the summary.');
  }

  const stageScores = history
    .filter((h) => h.scores)
    .map((h) => ({ stage: h.stage, ...h.scores }));

  const { system, user } = buildSummaryPrompt({ history, dashboard: DASHBOARD, stageScores });
  const out = await askModel({ system, user, schema: SUMMARY_SCHEMA });

  const averages = {};
  for (const dim of DIMENSIONS) {
    const vals = stageScores.map((s) => s[dim]).filter((v) => typeof v === 'number');
    averages[dim] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  }

  return {
    title: String(out.title || '').trim() || 'Untitled decision',
    chain: Array.isArray(out.chain) ? out.chain : [],
    weaknesses: Array.isArray(out.weaknesses) ? out.weaknesses.map(String) : [],
    strengths: Array.isArray(out.strengths) ? out.strengths.map(String) : [],
    dimensions: DIMENSIONS.reduce((acc, dim) => {
      acc[dim] = {
        score: averages[dim],
        justification: String(out.dimensions?.[dim]?.justification || '').trim()
      };
      return acc;
    }, {}),
    stageScores
  };
}

/* -- helpers ------------------------------------------------------------- */

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((h) => h && stageById(h.stage) && String(h.input || '').trim())
    .slice(0, STAGES.length)
    .map((h) => ({
      stage: Number(h.stage),
      input: String(h.input).slice(0, MAX_INPUT),
      coach: h.coach ? String(h.coach).slice(0, MAX_INPUT) : '',
      opposingCase: h.opposingCase ? String(h.opposingCase).slice(0, MAX_INPUT) : '',
      scores: h.scores && typeof h.scores === 'object' ? normaliseScores(h.scores) : null
    }));
}

function normaliseScores(scores) {
  const out = {};
  for (const dim of DIMENSIONS) {
    const v = Number(scores?.[dim]);
    out[dim] = Number.isFinite(v) ? Math.min(5, Math.max(1, Math.round(v))) : 3;
  }
  return out;
}
