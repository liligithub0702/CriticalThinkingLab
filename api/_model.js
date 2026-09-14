/*
 * The single place the Anthropic API is called. Prompt text lives in
 * _prompts.js; this file only knows how to send it and how to fail politely.
 */

import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.COACH_MODEL || 'claude-opus-5';
const EFFORT = process.env.COACH_EFFORT || 'medium';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

let client = null;
function getClient() {
  if (!client) client = new Anthropic(); // reads ANTHROPIC_API_KEY
  return client;
}

export class CoachError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/* A 400 that names a parameter this account or SDK build does not accept. */
function isUnsupportedParam(err) {
  return err?.status === 400 && /fallback|beta|unrecognized|unexpected|unsupported/i.test(err?.message || '');
}

/**
 * One structured-output call. Returns the parsed object matching `schema`.
 * `documents` is an optional array of content blocks placed before the text.
 */
export async function askModel({ system, user, schema, documents = [], maxTokens = 16000 }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new CoachError(500, 'ANTHROPIC_API_KEY is not set on this deployment.');
  }

  const params = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: [...documents, { type: 'text', text: user }] }],
    output_config: { effort: EFFORT, format: { type: 'json_schema', schema } }
  };

  let message;
  try {
    // Server-side refusal fallbacks, per Anthropic's guidance for Opus 5.
    message = await getClient().beta.messages.create({
      ...params,
      betas: [FALLBACK_BETA],
      fallbacks: 'default'
    });
  } catch (err) {
    if (!isUnsupportedParam(err)) throw toCoachError(err);
    try {
      message = await getClient().messages.create(params);
    } catch (retryErr) {
      throw toCoachError(retryErr);
    }
  }

  if (message.stop_reason === 'refusal') {
    throw new CoachError(422, 'The model declined to respond to that input. Rewrite it and try again.');
  }

  const text = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    return JSON.parse(text);
  } catch {
    throw new CoachError(502, 'The model returned a response this app could not read. Try again.');
  }
}

function toCoachError(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    return new CoachError(500, 'The Anthropic API key was rejected. Check ANTHROPIC_API_KEY.');
  }
  if (err instanceof Anthropic.PermissionDeniedError) {
    return new CoachError(500, 'This API key is not permitted to use the configured model.');
  }
  if (err instanceof Anthropic.NotFoundError) {
    return new CoachError(500, `Model "${MODEL}" was not found for this account.`);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new CoachError(429, 'Rate limited by the Anthropic API. Wait a moment and resubmit.');
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new CoachError(503, 'Could not reach the Anthropic API. Check the connection and resubmit.');
  }
  if (err instanceof Anthropic.APIStatusError) {
    return new CoachError(502, `The Anthropic API returned ${err.status}. Try again.`);
  }
  return new CoachError(500, err?.message || 'Unexpected error while calling the model.');
}
