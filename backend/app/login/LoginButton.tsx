'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function LoginButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
          email: 'test@test.com',
          password: 'password',
        });

        if (error) {
          setError(error.message);
        }

        setLoading(false);
      }}
    >
      {loading ? 'Signing in…' : 'Sign in'}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </button>
  );
} 