import React from "react";
import * as topojson from "topojson-client";
import topology from "public/data/usa-topo.json";
import stateAbbrs from "public/data/usa-abbr.json";
import mask_mandates from "public/data/usa-mask.json";
import {AlbersUsa} from "@visx/geo";
import {Topology, GeometryObject} from "topojson-specification";
import theme from "src/theme";
import {geoCentroid, GeoProjection} from "d3-geo";
import {StyledMap} from "../styles";
import MapLabels, {getLabelSizes} from "./Labels";
import {PatternLines} from "@visx/pattern";
import {getIsMaskMandated, VizDataProps} from "src/helpers/data";

interface MapProps {
  parentWidth?: number;
  parentHeight?: number;
  mapData: VizDataProps;
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
  DC: [60, 30],
};

export const {features: unitedStates} = topojson.feature(
  topology as unknown as Topology,
  topology.objects.states as GeometryObject,
) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

export const getFeatureProperties = (
  feature: FeatureShape,
  projection: GeoProjection,
) => {
  const featureId = feature.id as keyof typeof stateAbbrs;

  const abbr = stateAbbrs[featureId] as keyof typeof mask_mandates;

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

/*
 Returns a Choropleth that with colours based on total rolling averages for Delta cases on a given day in a given location and textures based on the mask mandate.
 */
const Map: React.FC<MapProps> = ({parentWidth: width, mapData}) => {
  if (!width) {
    return <div>Loading</div>;
  }
  const {data, date} = mapData;
  const height = width * 0.8;
  return (
    <StyledMap width={width} height={height}>
      <MapLabels width={width} height={height} data={data}></MapLabels>

      <svg width={width} height={height}>
        <PatternLines
          id="mask-lines"
          height={10}
          width={10}
          stroke={theme.colors.blackAlpha["600"]}
          strokeWidth={1}
          orientation={["diagonal"]}
        ></PatternLines>
        <AlbersUsa
          data={unitedStates}
          scale={(width + height) / 1.5}
          translate={[width / 2, height / 2]}
        >
          {({features}) => {
            return features.map(({feature, path, projection}) => {
              const {abbr, coords} = getFeatureProperties(feature, projection);

              const labelsSize = getLabelSizes(width);

              // Apply texture to geo area if mask is mandated.
              const isMaskMandated = getIsMaskMandated(abbr, date);

              if (!coords) {
                return;
              }

              // if not data is registered that day, the geo area of the state is a "disabled" color.
              const state_data = data.findIndex(d => d.location === abbr);
              const fill =
                state_data < 0
                  ? theme.colors.disabled
                  : data[state_data]["fill"];
              // DC has too small a geographical area, we represent it outside the continental map.
              if (abbr === "DC") {
                return (
                  <React.Fragment key={`map-feature-${feature.id}`}>
                    <g transform="scale(1, 1)">
                      <rect
                        stroke={"black"}
                        strokeWidth={1}
                        fill={fill}
                        width={labelsSize[0] * 2}
                        height={labelsSize[1] * 2}
                        x={coords[0] - labelsSize[0] / 2}
                        y={coords[1] - labelsSize[1]}
                      ></rect>
                      {isMaskMandated && (
                        <rect
                          fill="url('#mask-lines')"
                          width={labelsSize[0] * 2}
                          height={labelsSize[1] * 2}
                          x={coords[0] - labelsSize[0] / 2}
                          y={coords[1] - labelsSize[1]}
                        ></rect>
                      )}
                    </g>
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={`map-feature-${feature.id}`}>
                  <path
                    d={path || ""}
                    stroke={"#fff"}
                    strokeWidth={1}
                    fill={fill}
                  ></path>
                  {isMaskMandated && (
                    <path d={path || ""} fill={"url('#mask-lines')"}></path>
                  )}
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
