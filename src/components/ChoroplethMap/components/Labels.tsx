import React from "react";
import {Box, Heading} from "@chakra-ui/react";
import {AlbersUsa} from "@visx/geo";
import {StyledMapLabel} from "../styles";
import {unitedStates, getFeatureProperties} from "./Map";
import {VizPropertiesProps} from "src/helpers/data";

// Values(in percent) to translate labels for states with too small a geographical area.
const coordsOutside: Record<string, number[]> = {
  VT: [-8, -150],
  MA: [180, -50],
  RI: [50, 70],
  NJ: [120, 0],
  DE: [120, 40],
  MD: [100, 0],
  DC: [40, 150],
  HI: [0, 0],
};

// Adjust label size as map gets bigger.
export const getLabelSizes = (width: number) => {
  return [Math.max(width / 60, 10), Math.max(width / 60, 10)];
};

/* Returns labels for states centered to each geo area or placed outside the map when too small.*/
const ChoroplethMapLabels = ({
  width,
  height,
  data,
}: {
  width: number;
  height: number;
  data: VizPropertiesProps[];
}) => {
  return (
    <AlbersUsa
      data={unitedStates}
      scale={(width + height) / 1.5}
      translate={[width / 2, height / 2]}
    >
      {({features}) => {
        return features.map(({feature, index, projection}) => {
          const {abbr, coords} = getFeatureProperties(feature, projection);

          const labelSizes = getLabelSizes(width);
          const labelColors = {
            dk: "#363636",
            lt: "#fff",
          };
          const state_data = data.findIndex(d => d.location === abbr);

          if (!coords) {
            return;
          }

          return (
            <StyledMapLabel
              key={`map-label-${index}`}
              left={`${coords[0]}px`}
              top={`${coords[1]}px`}
            >
              {/* Percentage based translation for labels outside the country keeps the labels consistent when resizing */}
              <Box
                transform={`translate(${
                  coordsOutside[abbr] ? coordsOutside[abbr][0] : 0
                }%, ${
                  coordsOutside[abbr]
                    ? coordsOutside[abbr][1] - labelSizes[0]
                    : 0
                }%)`}
                bg={
                  !data[state_data] || Object.keys(coordsOutside).includes(abbr)
                    ? "transparent"
                    : data[state_data]["fill"]
                }
                p={0.5}
              >
                <Heading
                  fontSize={`${labelSizes[0]}px`}
                  color={
                    Object.keys(coordsOutside).includes(abbr) ||
                    !data[state_data] ||
                    data[state_data].colorValue < 1
                      ? labelColors.dk
                      : labelColors.lt
                  }
                >
                  {abbr}
                </Heading>
              </Box>
            </StyledMapLabel>
          );
        });
      }}
    </AlbersUsa>
  );
};

export default ChoroplethMapLabels;
