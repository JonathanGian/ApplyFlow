'use client';

import { createBrowserClient } from '@supabase/ssr';

export function LoginButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return (
    <button
      type="button"
      onClick={async () => {
        // Replace with your own form inputs later.
        await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password',
        });
      }}
    >
      Sign in
    </button>
  );
}