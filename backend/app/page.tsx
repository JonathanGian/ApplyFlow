import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase connected</h1>
      <pre>{JSON.stringify({ user: user?.email ?? null }, null, 2)}</pre>
    </main>
  );
}