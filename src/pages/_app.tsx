import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
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
      fontSize: 30,
      textAlign: "center",
      fontWeight: 800,
    },
    body1: {
      fontSize: 20,
      fontWeight: 600,
    },
    body2: {
      fontSize: 16,
      fontWeight: 600,
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          boxShadow: "8px 8px 1px grey",
          borderRadius: "15px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "15px",
              border: "3px #000000 solid",
            },
            "&:hover fieldset": {
              borderRadius: "15px",
              border: "3px #ffa31a solid",
            },
            "&.Mui-focused fieldset": {
              borderRadius: "15px",
              border: "3px #ffa31a solid",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          boxShadow: "8px 8px 1px grey",
          borderRadius: "15px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "15px",
              border: "3px #000000 solid",
            },
            "&:hover fieldset": {
              borderRadius: "15px",
              border: "3px #ffa31a solid",
            },
            "&.Mui-focused fieldset": {
              borderRadius: "15px",
              border: "3px #ffa31a solid",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "8px 8px 1px grey",
          border: "solid 4px",
          borderRadius: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
          border: "3px black solid",

          textTransform: "none",
          fontSize: 20,
          fontWeight: 750,

          padding: "4px 64px",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffa31a",
        },
        message: {
          color: "black",
        },
      },
    },
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
