import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
      main: "#ff0000"
    }
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
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={mainTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
