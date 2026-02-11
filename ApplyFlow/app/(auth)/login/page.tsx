"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/applications");
    router.refresh();
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Login
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
          Use the seeded accounts: alice@example.com / password or bob@example.com /
          password
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
              autoComplete="current-password"
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}