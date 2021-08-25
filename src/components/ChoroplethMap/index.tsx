import React from "react";
import {Text} from "@chakra-ui/react";
import Map from "./components/Map";
import Legend from "./components/Legend";
import {ParentSize} from "@visx/responsive";
import {StyledChoroplethMap} from "./styles";
import ChoroplethHeader from "./components/Header";

interface ChoroplethMapProps {}

const ChoroplethMap: React.FC<ChoroplethMapProps> = () => {
  return (
    <StyledChoroplethMap>
      <ChoroplethHeader />
      <ParentSize>
        {({width, height}) => (
          // width < 415 ? (
          //   <Text textStyle={"body"}>
          //     Sorry, you must view this visualization in a larger browser
          //     window.
          //   </Text>
          // ) :
          <>
            <Map parentWidth={width} parentHeight={height} />
            <Legend />
          </>
        )}
      </ParentSize>
    </StyledChoroplethMap>
  );
};

export default ChoroplethMap;
