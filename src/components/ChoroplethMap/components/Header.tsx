import React from "react";
import {Flex, Text} from "@chakra-ui/react";

interface ChoroplethHeaderProps {}

/* Title Header for Choropleth Viz*/
const ChoroplethHeader: React.FC<ChoroplethHeaderProps> = () => {
  return (
    <Flex justifyContent={["flex-start", "flex-start", "center"]}>
      <Text textStyle={"subheading"}>
        Sequenced Delta Variant Cases Across the United States
      </Text>
    </Flex>
  );
};

export default ChoroplethHeader;
