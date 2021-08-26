import React from "react";
import Map from "./components/Map";
import Legend from "./components/Legend";
import {ParentSize} from "@visx/responsive";
import ChoroplethHeader from "./components/Header";
import {VizDataProps} from "src/helpers/data";
import {StyledChoroplethMap} from "./styles";
import {Text} from "@chakra-ui/react";

interface ChoroplethMapProps {
  data: VizDataProps;
}

/* Data viz depicting US mask mandate and spread of delta covid cases.*/
const ChoroplethMap: React.FC<ChoroplethMapProps> = ({data}) => {
  return (
    <StyledChoroplethMap>
      <ChoroplethHeader />
      <ParentSize>
        {({width, height}) =>
          width < 415 ? (
            <Text textStyle={"body"}>
              Sorry, you must view this visualization in a larger browser
              window.
            </Text>
          ) : (
            <>
              <Map parentWidth={width} parentHeight={height} mapData={data} />
              {/* <Legend colorScale={colorScale} step={1} /> */}
            </>
          )
        }
      </ParentSize>
    </StyledChoroplethMap>
  );
};

export default ChoroplethMap;
