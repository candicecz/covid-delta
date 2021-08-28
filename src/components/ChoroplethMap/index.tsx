import React, {useMemo} from "react";
import _ from "lodash";
import {Flex, Text} from "@chakra-ui/react";
import {ParentSize} from "@visx/responsive";
import {DataProps} from "src/helpers/data";
import ChoroplethHeader from "./components/Header";
import Map from "./components/Map";
import {StyledChoroplethMap} from "./styles";

interface ChoroplethMapProps {
  data: DataProps[];
  currentIndex: number;
}

/* Data viz depicting US mask mandate and spread of delta covid cases.*/
const ChoroplethMap: React.FC<ChoroplethMapProps> = ({data, currentIndex}) => {
  // min and max values for all delta lineages rolling average per capita (used for color scale)
  const minMaxValues = useMemo(() => {
    let flattened = data.flatMap(daily => daily.data);
    const min =
      _.minBy(flattened, d => d["totalDeltaCountRollingPerCapita"])
        ?.totalDeltaCountRollingPerCapita || 0;
    const max =
      _.maxBy(flattened, d => d["totalDeltaCountRollingPerCapita"])
        ?.totalDeltaCountRollingPerCapita || 0;

    return [Math.ceil(min), Math.ceil(max)].reverse();
  }, [data]);

  return (
    <StyledChoroplethMap>
      <ChoroplethHeader />
      <ParentSize>
        {({width, height}) =>
          !width || !data ? (
            <Flex
              width={width || "100%"}
              height={height || "100%"}
              justifyContent={"center"}
              p={4}
            >
              Data is loading, please be patient.
            </Flex>
          ) : width < 430 ? (
            <Text textStyle={"body"} m={4}>
              Sorry, you must view this visualization in a larger browser
              window.
            </Text>
          ) : (
            <Map
              parentWidth={width}
              parentHeight={height}
              mapData={data[currentIndex]}
              minMaxValues={minMaxValues}
            />
          )
        }
      </ParentSize>
    </StyledChoroplethMap>
  );
};

export default ChoroplethMap;
