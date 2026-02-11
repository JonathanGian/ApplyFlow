"use client";

import * as React from "react";
import { Alert, Box, Button, Container, Typography } from "@mui/material";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Optional: log the error to the console for local debugging
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container maxWidth="md">
          <Box sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Something went wrong
            </Typography>

            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || "An unexpected error occurred."}
            </Alert>

            {error.digest && (
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                Error digest: {error.digest}
              </Typography>
            )}

            <Button variant="contained" onClick={() => reset()}>
              Try again
            </Button>
          </Box>
        </Container>
      </body>
    </html>
  );
}