import type {AppProps} from "next/app";
import {ChakraProvider} from "@chakra-ui/react";
import theme from "src/theme/index";
import globalStyles from "src/theme/GlobalStyles";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <style jsx global>
        {globalStyles}
      </style>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
