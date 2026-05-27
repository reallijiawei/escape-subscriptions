export async function onRequestPost(context) {
  const body = await context.request.json();
  const { subscriptionToolId, softwareName, websiteUrl, reason } = body;

  if (!subscriptionToolId || !softwareName) {
    return Response.json({ error: 'subscriptionToolId and softwareName required' }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const key = `rec:${subscriptionToolId}:${id}`;

  await context.env.EMAIL_KV.put(key, JSON.stringify({
    id,
    subscriptionToolId,
    softwareName: softwareName.trim(),
    websiteUrl: (websiteUrl || '').trim(),
    reason: (reason || '').trim(),
    createdAt: new Date().toISOString(),
  }));

  return Response.json({ success: true, id });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const toolId = url.searchParams.get('toolId');

  if (!toolId) {
    // List all recommendations
    const list = await context.env.EMAIL_KV.list({ prefix: 'rec:' });
    const recommendations = [];

    for (const key of list.keys) {
      const value = await context.env.EMAIL_KV.get(key.name, 'json');
      if (value) recommendations.push(value);
    }

    recommendations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return Response.json({ recommendations });
  }

  // List recommendations for a specific tool
  const prefix = `rec:${toolId}:`;
  const list = await context.env.EMAIL_KV.list({ prefix });
  const recommendations = [];

  for (const key of list.keys) {
    const value = await context.env.EMAIL_KV.get(key.name, 'json');
    if (value) recommendations.push(value);
  }

  recommendations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return Response.json({ toolId, recommendations });
}
