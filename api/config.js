/* Stage copy and the metric pack, so the page and the coach never drift apart. */

import { STAGES } from './_prompts.js';
import { DASHBOARD } from './_dashboard.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Use GET.' });
  }
  return res.status(200).json({
    stages: STAGES.map(({ id, key, name, short, question, help, placeholder }) => ({
      id,
      key,
      name,
      short,
      question,
      help,
      placeholder
    })),
    dashboard: DASHBOARD
  });
}
