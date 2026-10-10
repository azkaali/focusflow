import type { BreakdownResponse } from '@/lib/types';

export async function requestBreakdown(text: string): Promise<BreakdownResponse> {
  let response: Response;
  try {
    response = await fetch('/api/breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error("Couldn't reach FocusFlow. Check your connection and try again.");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? 'Something went wrong. Please try again.');
  }
  return body as BreakdownResponse;
}
