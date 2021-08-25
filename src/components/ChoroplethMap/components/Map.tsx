import React from "react";
import {Box, Text} from "@chakra-ui/react";
import * as topojson from "topojson-client";
import topology from "public/data/usa-topo.json";
import stateAbbrs from "public/data/us-abbr.json";
import {AlbersUsa} from "@visx/geo";
import {Topology, GeometryObject} from "topojson-specification";
import theme from "src/theme";
import {geoCentroid, GeoProjection} from "d3-geo";
import {StyledMap, StyledMapLabel} from "../styles";

interface MapProps {
  parentWidth?: number;
  parentHeight?: number;
}

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: {
    coordinates: [number, number][][];
    type: "Polygon";
  };
  properties: {name: string};
}

const {features: unitedStates} = topojson.feature(
  topology as unknown as Topology,
  topology.objects.states as GeometryObject,
) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

// Offset for state abbreviations that are not well placed.
const coordsOffset: Record<string, number[]> = {
  FL: [15, 3],
  CA: [-7, 0],
  NY: [5, 0],
  MI: [10, 15],
  LA: [-8, 0],
  AK: [0, -10],
  HI: [-10, 10],
  ID: [0, 10],
  WV: [-2, 4],
  KY: [10, 0],
  MD: [-5, -8],
  DC: [80, 60],
};

// Values(in percent) to translate labels for states with too small a geographical area.
const coordsOutside: Record<string, number[]> = {
  VT: [-10, -160],
  MA: [180, -50],
  RI: [50, 70],
  NJ: [120, 0],
  DE: [120, 0],
  MD: [100, 0],
  DC: [40, 150],
};

const get_feature_properties = (
  feature: FeatureShape,
  projection: GeoProjection,
) => {
  const featureId = feature.id as keyof typeof stateAbbrs;

  const abbr: string = stateAbbrs[featureId];

  // Center coordinates of each state for labels.
  const coords: [number, number] | null = projection(geoCentroid(feature));

  // Adjust label positioning if needed.
  if (coords && coordsOffset[abbr]) {
    coords[0] += coordsOffset[abbr][0];
    coords[1] += coordsOffset[abbr][1];
  }

  return {
    featureId,
    abbr,
    coords,
  };
};

// Adjust label size as map gets bigger.
const get_label_sizes = (width: number) => {
  return [Math.max(width / 70, 10), Math.max(width / 70, 10)];
};

const Map: React.FC<MapProps> = ({parentWidth: width}) => {
  if (!width) {
    return <div>Loading</div>;
  }
  const height = width * 0.8;
  return (
    <StyledMap width={width} height={height}>
      <AlbersUsa
        data={unitedStates}
        scale={(width + height) / 1.5}
        translate={[width / 2, height / 2]}
      >
        {({features}) => {
          return features.map(({feature, index, path, projection}) => {
            const {abbr, coords} = get_feature_properties(feature, projection);

            const labelsSize = get_label_sizes(width);

            if (!coords) {
              return;
            }

            return (
              <StyledMapLabel
                key={index}
                left={`${coords[0]}px`}
                top={`${coords[1]}px`}
              >
                {/* Percentage based translation for labels outside the country keeps the labels consistent when resizing */}
                <Box
                  transform={`translate(${
                    coordsOutside[abbr] ? coordsOutside[abbr][0] : 0
                  }%, ${
                    coordsOutside[abbr]
                      ? coordsOutside[abbr][1] - labelsSize[0]
                      : 0
                  }%)`}
                >
                  <Text textStyle={"body"} fontSize={`${labelsSize[0]}px`}>
                    {abbr}
                  </Text>
                </Box>
              </StyledMapLabel>
            );
          });
        }}
      </AlbersUsa>

      <svg width={width} height={height}>
        <AlbersUsa
          data={unitedStates}
          scale={(width + height) / 1.5}
          translate={[width / 2, height / 2]}
        >
          {({features}) => {
            return features.map(({feature, path, projection}) => {
              const {abbr, coords} = get_feature_properties(
                feature,
                projection,
              );

              const labelsSize = get_label_sizes(width);

              if (!coords) {
                return;
              }
              // DC has too small a geographical area, we represent it outside the continental map.
              if (abbr === "DC") {
                return (
                  <g transform="scale(1, 1)">
                    <rect
                      fill={"red"}
                      width={labelsSize[0]}
                      height={labelsSize[1]}
                      x={coords[0]}
                      y={coords[1]}
                    ></rect>
                  </g>
                );
              }
              return (
                <React.Fragment key={`map-feature-${feature.id}`}>
                  <path
                    d={path || ""}
                    stroke={theme.colors.gray["600"]}
                    strokeWidth={0.5}
                  ></path>
                </React.Fragment>
              );
            });
          }}
        </AlbersUsa>
      </svg>
    </StyledMap>
  );
};

export default Map;
