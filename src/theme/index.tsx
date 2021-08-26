import {extendTheme, ThemeConfig} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme: any = {
  config,
  colors: {
    primary: "#9F7AEA",
    secondary: "#283549",
    disabled: "#EFEFEF",
    bg: "#F8F8F8",
    text: {default: "gray.500", alt: "#525B6C"},
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },

  textStyles: {
    heading: {
      fontSize: ["36px", "2.5rem"],
      fontFamily: "Raleway",
      letterSpacing: "-0.01em",
      color: "#fff",
      lineHeight: "1.5",
    },
    subheading: {
      fontSize: ["24px", "1.5rem"],
      fontFamily: "Raleway",
      letterSpacing: "-0.01em",
      color: "#525B6C",
      lineHeight: "1.5",
    },
    body: {
      color: "gray.500",
      letterSpacing: "0.04em",
    },
  },
};

export default extendTheme(theme);
