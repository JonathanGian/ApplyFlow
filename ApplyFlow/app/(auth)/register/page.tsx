"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [email, setEmail] = useState("newuser@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create account
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
          Register with email + password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
