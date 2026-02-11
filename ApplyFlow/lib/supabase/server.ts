import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Next.js (newer versions) may return cookies() as a Promise, so we await it here.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // When called from a Server Component, Next may block setting cookies.
            // This is handled via middleware refresh.
          }
        },
      },
    }
  );
}