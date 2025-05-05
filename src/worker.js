export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (request.method) {
        case 'POST':
          return handleStoreRecord(request, env);
        case 'GET':
          return handleRetrieveRecord(request, env);
        default:
          return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  }
};

async function handleStoreRecord(request, env) {
  const { isValid, token } = await validateToken(request);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: corsHeaders });
  }

  const data = await request.json();
  const recordId = await db.storeRecord(env.DB, data);
  return new Response(JSON.stringify({ id: recordId }), { headers: corsHeaders });
}

async function handleRetrieveRecord(request, env) {
  const url = new URL(request.url);
  const id = url.pathname.split('/')[2];

  const { isValid, token } = await validateToken(request);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: corsHeaders });
  }

  const record = await db.getRecord(env.DB, id);
  if (!record) {
    return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404, headers: corsHeaders });
  }

  logAccess(env.LOGS, request, token);
  return new Response(JSON.stringify(record), { headers: corsHeaders });
}
