/*
 * Local development server. Serves public/ as static files and runs the
 * functions in api/ the way Vercel does, so `npm run dev` behaves like the
 * deployment without needing the Vercel CLI.
 *
 *   npm run dev          real model calls (needs ANTHROPIC_API_KEY)
 *   npm run dev -- --mock  canned coach responses, for UI work offline
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const MOCK = process.argv.includes('--mock');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

function decorate(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  try { return JSON.parse(raw); } catch { return raw; }
}

const MOCK_COACH = {
  coach: {
    stage: 1,
    onTopic: true,
    flaw: 'correlation treated as cause',
    response:
      'You have written that Gamma "is dragging the whole line down", but the only thing the dashboard shows is that Gamma sits at 71.3% CSAT while its average handling time is 25.46 minutes. Those two move together across all four teams, which is exactly the shape you would expect if something upstream - call mix, tenure, or both - drove both numbers. Naming Gamma as the cause before you have separated it from its tenure profile is treating a correlation as a cause. Which piece of evidence would distinguish "Gamma handles harder calls" from "Gamma handles calls worse"?',
    scores: { clarity: 3, evidence: 2, assumptions: 2, openness: 3 }
  },
  oppose: {
    case:
      'Gamma is not your problem; your sample is. All three survey KPIs rest on the 40.6% of customers who chose to answer, and nothing on this dashboard tells you how the other 59.4% felt. Week 2 alone supplies 32.8% of the month\'s surveys while week 3 supplies 21.0%, so the "decline" you are reading across four weekly points is partly a change in who answered. Before anyone is managed on a 71.3% figure, the unweighted team means need recomputing against actual response volumes - which moves the overall number from 78.98% to 79.35% on its own.'
  },
  extract: {
    decision: 'I have to decide whether to move Gamma onto a performance plan before the quarterly review.',
    deadline: 'The quarterly review on the 30th',
    stakeholders: ['Anika Singh', 'Gamma consultants', 'the operations director'],
    draft:
      'I have to decide whether to put Gamma on a formal performance plan before the quarterly review on the 30th. Gamma is the lowest team on every survey KPI and my director has asked for an answer. It affects fifteen consultants and their manager, Anika Singh. What makes it hard is that Gamma also has the longest handling time and the largest share of new starters, and I cannot yet tell which of those is doing the work.'
  },
  summary: {
    title: 'Performance plan for Gamma',
    chain: [1, 2, 3, 4, 5, 6].map((stage) => ({ stage, recap: 'Mock recap for stage ' + stage + '.' })),
    weaknesses: ['Mock weakness one.', 'Mock weakness two.'],
    strengths: ['Mock strength one.'],
    dimensions: {
      clarity: { score: 3.2, justification: 'Mock justification for clarity.' },
      evidence: { score: 2.7, justification: 'Mock justification for evidence.' },
      assumptions: { score: 2.5, justification: 'Mock justification for assumptions.' },
      openness: { score: 3.5, justification: 'Mock justification for openness.' }
    },
    stageScores: []
  }
};

const server = http.createServer(async (req, res) => {
  decorate(res);
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith('/api/')) {
    const name = pathname.slice(5).replace(/[^a-z0-9_-]/gi, '');
    const file = path.join(root, 'api', name + '.js');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'No such route.' });
    req.body = await readBody(req);
    if (MOCK && name === 'coach') {
      const action = (req.body && req.body.action) || 'coach';
      const canned = MOCK_COACH[action];
      if (!canned) return res.status(400).json({ error: 'Unknown action.' });
      await new Promise((r) => setTimeout(r, 250));
      // "dunno" in a stage answer exercises the evasive-input path offline.
      if (action === 'coach' && /dunno/i.test(String(req.body.input || ''))) {
        return res.status(200).json(Object.assign({}, canned, {
          onTopic: false,
          flaw: null,
          response: 'That is not an answer to the question. You have written a shrug where a decision should be, and nothing in it can be tested against the dashboard or argued with. The stage asks what you must decide, by when, and what makes it hard. What is the decision in front of you?',
          scores: { clarity: 1, evidence: 1, assumptions: 1, openness: 2 }
        }));
      }
      return res.status(200).json(canned);
    }
    try {
      const mod = await import(pathToFileURL(file).href + '?t=' + Date.now());
      return await mod.default(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  const rel = pathname === '/' ? '/index.html' : pathname;
  const file = path.join(root, 'public', path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(path.join(root, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  res.setHeader('content-type', MIME[path.extname(file)] || 'application/octet-stream');
  res.setHeader('cache-control', 'no-store');
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Critical Thinking Lab on http://localhost:${PORT}${MOCK ? '  (mock coach responses)' : ''}`);
  if (!MOCK && !process.env.ANTHROPIC_API_KEY) {
    console.log('ANTHROPIC_API_KEY is not set - coach requests will fail. Use --mock for UI work.');
  }
});
