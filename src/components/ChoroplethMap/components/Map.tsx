import React from "react";
import * as d3 from "d3";
import {AlbersUsa} from "@visx/geo";
import {PatternLines} from "@visx/pattern";
import {useTooltip} from "@visx/tooltip";
import {geoCentroid, GeoProjection} from "d3-geo";
import * as topojson from "topojson-client";
import {Topology, GeometryObject} from "topojson-specification";
import topology from "public/data/usa-topo.json";
import stateAbbrs from "public/data/usa-abbr.json";
import mask_mandates from "public/data/usa-mask.json";
import population from "public/data/usa-population.json";
import theme from "src/theme";
import {getIsMaskMandated, DataProps} from "src/helpers/data";
import MapLabels, {getLabelSizes} from "./Labels";
import Tooltip, {TooltipDataProps} from "./Tooltip";
import Legend from "./Legend";
import {StyledMap} from "../styles";

interface MapProps {
  parentWidth: number;
  parentHeight: number;
  mapData: DataProps;
  minMaxValues: number[];
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
  FL: [10, 3],
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

  const {abbr, state}: {abbr: string; state: string} = stateAbbrs[featureId];

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
    state,
    coords,
  };
};

let tooltipTimeout: number;

/*
 Returns a Choropleth that with colours based on total rolling averages for Delta cases on a given day in a given location and textures based on the mask mandate.
 */
const Map: React.FC<MapProps> = ({parentWidth, mapData, minMaxValues}) => {
  const {data, date} = mapData;
  const width = Math.min(parentWidth, 800);
  const height = width * 0.5;

  const colorScale = d3
    .scaleSequential()
    .domain(minMaxValues)
    .interpolator(d3.interpolatePlasma);

  //  Hover tooltip functionality.
  const {
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
  } = useTooltip();

  const handleMouseLeave = () => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  };
  const handleMouseMove = (
    coords: [number, number],
    data: TooltipDataProps,
  ) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    const top = coords[1];
    const left = coords[0];
    showTooltip({
      tooltipData: data,
      tooltipTop: top,
      tooltipLeft: left + 2,
    });
  };
  return (
    <>
      <Legend colorScale={colorScale} />
      <StyledMap width={width} height={height} my={10}>
        {/* State Labels */}
        <MapLabels
          width={width}
          height={height}
          data={data}
          colorScale={colorScale}
        ></MapLabels>

        {/* Map + Legend */}
        <svg width={width} height={height}>
          {/* Pattern for mask mandated states */}
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
                const {abbr, coords, state} = getFeatureProperties(
                  feature,
                  projection,
                );
                if (!coords) {
                  return;
                }
                // Label font sizes.
                const labelsSize = getLabelSizes(width);

                // Apply texture to geo area if mask is mandated.
                const isMaskMandated = getIsMaskMandated(
                  abbr as keyof typeof mask_mandates,
                  date,
                );

                // if data is not registered that day, the geo area of the state is a "disabled" color.
                const state_data = data.findIndex(d => d.location === abbr);
                const fill =
                  state_data < 0
                    ? theme.colors.disabled
                    : colorScale(
                        Math.ceil(
                          data[state_data].totalDeltaCountRollingPerCapita,
                        ),
                      );
                // DC has too small a geographical area, we represent it outside the continental map.
                if (abbr === "DC") {
                  return (
                    <React.Fragment key={`map-feature-${feature.id}`}>
                      <g transform="scale(1, 1)">
                        <rect
                          stroke={"#000"}
                          strokeWidth={1}
                          fill={fill}
                          width={labelsSize[0] * 2}
                          height={labelsSize[1] * 2}
                          x={coords[0] - labelsSize[0] / 2}
                          y={coords[1] - labelsSize[1]}
                        ></rect>
                        <rect
                          style={{cursor: "pointer"}}
                          width={labelsSize[0] * 2}
                          height={labelsSize[1] * 2}
                          x={coords[0] - labelsSize[0] / 2}
                          y={coords[1] - labelsSize[1]}
                          onMouseLeave={handleMouseLeave}
                          onMouseMove={() =>
                            handleMouseMove(coords, {
                              state,
                              population:
                                population[abbr as keyof typeof mask_mandates],
                              maskMandates:
                                mask_mandates[
                                  abbr as keyof typeof mask_mandates
                                ],
                              totalDeltaCountRolling:
                                data[state_data]?.totalDeltaCountRolling,
                              fill,
                            })
                          }
                          fill={isMaskMandated ? "url('#mask-lines')" : fill}
                        ></rect>
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
                    <path
                      style={{cursor: "pointer"}}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={() =>
                        handleMouseMove(coords, {
                          state,
                          population:
                            population[abbr as keyof typeof mask_mandates],
                          maskMandates:
                            mask_mandates[abbr as keyof typeof mask_mandates],
                          totalDeltaCountRolling:
                            data[state_data]?.totalDeltaCountRolling,
                          fill,
                        })
                      }
                      fill={isMaskMandated ? "url('#mask-lines')" : fill}
                      d={path || ""}
                    ></path>
                  </React.Fragment>
                );
              });
            }}
          </AlbersUsa>
        </svg>
        {/* Hover ToolTip */}
        {tooltipOpen && tooltipData && (
          <Tooltip
            tooltipLeft={tooltipLeft || 0}
            tooltipTop={tooltipTop || 0}
            tooltipData={tooltipData}
          ></Tooltip>
        )}
      </StyledMap>
    </>
  );
};

export default Map;
