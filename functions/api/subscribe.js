export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return Response.json({ error: 'email parameter required' }, { status: 400 });
  }

  const prefix = `sub:${email}:`;
  const list = await context.env.EMAIL_KV.list({ prefix });
  const subscriptions = [];

  for (const key of list.keys) {
    const value = await context.env.EMAIL_KV.get(key.name, 'json');
    if (value) subscriptions.push(value);
  }

  return Response.json({ email, subscriptions });
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { email, toolSlug, toolName } = body;

  if (!email || !toolSlug || !toolName) {
    return Response.json({ error: 'email, toolSlug, and toolName required' }, { status: 400 });
  }

  // Simple email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const key = `sub:${email}:${toolSlug}`;
  const existing = await context.env.EMAIL_KV.get(key, 'json');
  if (existing) {
    return Response.json({ success: true, message: 'Already subscribed' });
  }

  await context.env.EMAIL_KV.put(key, JSON.stringify({
    email,
    toolSlug,
    toolName,
    subscribedAt: new Date().toISOString(),
  }));

  return Response.json({ success: true, message: 'Subscribed' });
}

export async function onRequestDelete(context) {
  const body = await context.request.json();
  const { email, toolSlug } = body;

  if (!email || !toolSlug) {
    return Response.json({ error: 'email and toolSlug required' }, { status: 400 });
  }

  const key = `sub:${email}:${toolSlug}`;
  await context.env.EMAIL_KV.delete(key);

  return Response.json({ success: true, message: 'Unsubscribed' });
}
