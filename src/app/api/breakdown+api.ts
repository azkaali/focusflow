import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

import type { BreakdownResponse } from '@/lib/types';

const MAX_INPUT_CHARS = 2000;
const MAX_TASKS = 3;
const MAX_STEPS = 10;

const BreakdownSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      steps: z.array(z.string()),
    })
  ),
});

const SYSTEM_PROMPT = `You help people who find it hard to get started on tasks. The user will send a "brain dump": a messy, unstructured note about something they need to do.

Turn it into small, concrete, doable steps:
- Identify up to ${MAX_TASKS} distinct tasks. If there is only one, return one. Put the most pressing task first.
- Give each task a short, plain title (under 8 words).
- Break each task into 3-${MAX_STEPS} steps. Each step should take roughly 2-10 minutes and start with a verb.
- Make the first step almost effortless (e.g. "Open your laptop and find the email from Sam"), so starting feels easy.
- Keep each step to one short sentence. No sub-steps, numbering, or emoji.
- Use the same language the user wrote in, and a warm, non-judgmental tone.
- Stick to practical planning. Do not give medical, legal, or financial advice; if the note is about something like that, break down the practical actions (e.g. booking an appointment) instead.`;

let client: Anthropic | undefined;

export async function POST(request: Request) {
  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'Write something first.' }, { status: 400 });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `That's a lot! Keep it under ${MAX_INPUT_CHARS} characters.` },
      { status: 400 }
    );
  }

  try {
    client ??= new Anthropic();
    const response = await client.messages.parse({
      model: 'claude-haiku-5-5',
      max_tokens: 8000,
      output_config: { effort: 'low', format: zodOutputFormat(BreakdownSchema) },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text.trim() }],
    });

    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      return Response.json(
        { error: "Couldn't break that one down. Try describing it as something you need to do." },
        { status: 422 }
      );
    }

    const body: BreakdownResponse = {
      tasks: response.parsed_output.tasks
        .filter((task) => task.steps.length > 0)
        .slice(0, MAX_TASKS)
        .map((task) => ({ title: task.title, steps: task.steps.slice(0, MAX_STEPS) })),
    };
    return Response.json(body);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: 'FocusFlow is busy right now. Try again in a minute.' },
        { status: 429 }
      );
    }
    console.error('Breakdown failed', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}
