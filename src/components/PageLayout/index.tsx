import React from "react";
import {Box} from "@chakra-ui/react";

interface PageLayoutProps {}

const Layout: React.FC<PageLayoutProps> = ({children}) => {
  return (
    <Box pb={20} mb={20}>
      {children}
    </Box>
  );
};

export default Layout;
