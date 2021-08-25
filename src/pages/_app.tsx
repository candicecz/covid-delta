import type {AppProps} from "next/app";
import {ChakraProvider} from "@chakra-ui/react";
import theme from "src/theme/index";
import "@fontsource/raleway/800.css";
import "@fontsource/inter/400.css";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
