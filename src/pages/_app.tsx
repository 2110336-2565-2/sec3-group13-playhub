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
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={mainTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
