import React from "react";
import {Box, Text} from "@chakra-ui/react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Box bgGradient="linear(to-b,#5876a2 0%, secondary)" p={[4, 10]}>
      <Text mb={4} textStyle={"heading"}>
        Do mask mandates help prevent the spread of the Delta variant?
      </Text>
      <Text textStyle={"body"} color={"gray.300"} py={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum."
      </Text>

      <Text textStyle={"body"} color={"gray.300"} py={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum."
      </Text>
    </Box>
  );
};

export default Header;
