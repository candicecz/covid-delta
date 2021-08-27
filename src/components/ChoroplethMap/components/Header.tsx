import React from "react";
import {Flex, Text} from "@chakra-ui/react";

interface ChoroplethHeaderProps {}

/* Title Header for Choropleth Viz*/
const ChoroplethHeader: React.FC<ChoroplethHeaderProps> = () => {
  return (
    <Flex justifyContent={["flex-start", "flex-start", "center"]}>
      <Text textStyle={"subheading"}>Total Sequenced Delta Variant Cases </Text>
    </Flex>
  );
};

export default ChoroplethHeader;
