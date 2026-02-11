import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    // Main brand color (deep modern indigo)
    primary: {
      main: "#4f46e5",      // brand color
      contrastText: "#ffffff",
    },

    // Subtle accent (slate gray)
    secondary: {
      main: "#334155",
    },

    background: {
      default: "#f8fafc",   // soft neutral background
      paper: "#ffffff",     // cards / surfaces
    },

    text: {
      primary: "#0f172a",   // near-black slate
      secondary: "#475569",
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    h4: {
      fontWeight: 700,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // remove ALL CAPS default
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});