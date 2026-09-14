// Deploy with: supabase functions deploy submit-score
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const payload = await request.json().catch(() => null);
  const nickname = typeof payload?.nickname === 'string' ? payload.nickname.trim().replace(/[^\p{L}\p{N}_ -]/gu, '').slice(0, 15) : '';
  const score = Number(payload?.score);
  if (nickname.length < 3 || !Number.isInteger(score) || score < 0 || score > 1000000) return json({ error: 'invalid_score' }, 400);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const key = nickname.toLocaleLowerCase();
  const { data: existing } = await admin.from('leaderboard').select('id,score').eq('nickname_key', key).maybeSingle();
  if (existing && existing.score >= score) return json({ accepted: false, reason: 'not_better' });
  const { error } = existing
    ? await admin.from('leaderboard').update({ nickname, score, created_at: new Date().toISOString() }).eq('id', existing.id)
    : await admin.from('leaderboard').insert({ nickname, score });
  return error ? json({ error: 'storage_failed' }, 500) : json({ accepted: true });
});