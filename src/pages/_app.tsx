import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState } from "react";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { UserStatusWrapper } from "supabase/user_context";

const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#ffa31a",
      light: "#ffe1b4",
      dark: "#a66300",
    },
    secondary: {
      main: "#000000",
    },
    error: {
      main: "#ff0000",
    },
    warning: {
      main: "#ff0000",
    },
  },
  typography: {
    fontFamily: "LINESeed",
    h1: {
      fontSize: 20,
      textAlign: "center",
      fontWeight: 800,
    },
    body1: {
      fontSize: 16,
      fontWeight: 700,
    },
    body2: {
      fontSize: 14,
      fontWeight: 650,
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          fontSize: 14,
          fontWeight: 650,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          fontSize: 16,
          fontWeight: 800,
          padding: "10px 64px",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffa31a",
        },
        message: {
          color: "black"
        }
      }
    }
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <UserStatusWrapper>
        <ThemeProvider theme={mainTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </UserStatusWrapper>
    </SessionContextProvider>
  );
}
