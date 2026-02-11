'use client';

import { createBrowserClient } from '@supabase/ssr';

export function LogoutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
      }}
    >
      Sign out
    </button>
  );
}