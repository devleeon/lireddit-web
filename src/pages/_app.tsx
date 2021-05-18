import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    // <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
    // </ApolloProvider>
  );
}

export default MyApp;
