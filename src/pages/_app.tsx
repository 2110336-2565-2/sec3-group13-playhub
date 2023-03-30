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
    h2: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: 800,
    },
    h3: {
      fontSize: 22,
      fontWeight: 600,
    },
    h5: {
      fontSize: 22,
      fontWeight: 700,
    },
    h6: {
      fontSize: 20,
      fontWeight: 700,
    },
    body1: {
      fontSize: 18,
      fontWeight: 600,
    },
    body2: {
      fontSize: 14,
      fontWeight: 600,
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          boxShadow: "4px 4px #BFBFBF",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-disabled": {
              borderRadius: "15px",
              backgroundColor: "#E8E8E8",
            }
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          boxShadow: "8px 8px 1px grey",
          backgroundColor: "#ffffff",
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
            "&.Mui-disabled fieldset": {
              borderRadius: "15px",
              border: "3px #000000 solid",
            },
            "&.Mui-disabled input": {
              borderRadius: "15px",
              backgroundColor: "#E8E8E8",
            },
            "&.Mui-disabled inputMultiline": {
              borderRadius: "15px",
              backgroundColor: "#E8E8E8",
            },
            "&.MuiInputBase-multiline.Mui-disabled": {
              borderRadius: "15px",
              backgroundColor: "#E8E8E8",
            },
            "&.MuiInputBase-readOnly fieldset": {
              borderRadius: "15px",
              border: "3px #000000 solid",
            },
          },
          "&.MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#838383",
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
