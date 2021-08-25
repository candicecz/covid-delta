import React from "react";
import {Box, Flex, Text} from "@chakra-ui/react";

interface ChoroplethHeaderProps {}

const ChoroplethHeader: React.FC<ChoroplethHeaderProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Text textStyle={"subheading"}>
        Cumulative total of delta variant cases nation-wide
      </Text>
    </Flex>
  );
};

export default ChoroplethHeader;
