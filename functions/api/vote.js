export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const softwareId = url.searchParams.get('softwareId');
  const subscriptionToolId = url.searchParams.get('subscriptionToolId');

  if (!softwareId || !subscriptionToolId) {
    return Response.json({ error: 'Missing softwareId or subscriptionToolId' }, { status: 400 });
  }

  const key = `votes:${subscriptionToolId}:${softwareId}`;
  const value = await context.env.VOTES_KV.get(key);
  const votes = parseInt(value, 10) || 0;

  return Response.json({ softwareId, subscriptionToolId, votes });
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { softwareId, subscriptionToolId, vote } = body;

  if (!softwareId || !subscriptionToolId || !['up', 'down'].includes(vote)) {
    return Response.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const key = `votes:${subscriptionToolId}:${softwareId}`;
  const current = parseInt(await context.env.VOTES_KV.get(key), 10) || 0;
  const delta = vote === 'up' ? 1 : -1;
  const newVotes = current + delta;

  await context.env.VOTES_KV.put(key, String(newVotes));

  return Response.json({ softwareId, subscriptionToolId, votes: newVotes });
}
