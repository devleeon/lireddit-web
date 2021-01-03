import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import theme from "../theme";

// initialize urql
// moved to createUrqlClient.ts
function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
