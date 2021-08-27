import React from "react";
import _ from "lodash";
import {Box, Text} from "@chakra-ui/layout";
import {TooltipWithBounds} from "@visx/tooltip";
import {numberWithSpaces} from "src/helpers/data";
import {StyledTooltip} from "../styles";

export interface TooltipDataProps {
  state: string;
  population: number;
  maskMandates: {
    dates: {start: string; end: string | null}[];
    details: string;
  };
  totalDeltaCountRolling: number;
  fill: string;
}

interface TooltipProps {
  tooltipTop: number;
  tooltipLeft: number;
  tooltipData: TooltipDataProps | {};
}
/*
Tooltip for map with information about each state.
Issue with findDomNode documented here:https://github.com/airbnb/visx/issues/737
*/
const Tooltip: React.FC<TooltipProps> = ({
  tooltipData,
  tooltipTop,
  tooltipLeft,
}) => {
  if (_.isEmpty(tooltipData)) {
    return null;
  }
  const {state, population, fill, totalDeltaCountRolling, maskMandates} =
    tooltipData as TooltipDataProps;

  return (
    tooltipData && (
      <TooltipWithBounds
        top={tooltipTop}
        left={tooltipLeft}
        style={{
          minWidth: 100,
          maxWidth: 300,
          zIndex: 100,
          color: "white",
          position: "absolute",
          padding: "0.5rem",
        }}
      >
        <StyledTooltip fill={fill}>
          <Text
            textStyle={"heading"}
            color={"#000"}
            fontSize={"md"}
            px={4}
            py={2}
          >
            {state}
          </Text>
          <Text textStyle={"tooltip"} px={4} py={2} bg={"gray.50"}>
            Population: {numberWithSpaces(population)}
          </Text>
          <Box px={4} py={2}>
            <Text textStyle={"tooltip"}>
              Delta cases sequenced:{" "}
              {totalDeltaCountRolling !== undefined
                ? numberWithSpaces(
                    Math.round(totalDeltaCountRolling * 1000) / 1000,
                  )
                : "Information not available."}
            </Text>
            {totalDeltaCountRolling !== undefined && (
              <Text textStyle={"tooltip"} fontSize={"10px"}>
                (7 day rolling average)
              </Text>
            )}
          </Box>
          <Text textStyle={"tooltip"} px={4} py={2} bg={"gray.50"}>
            Mask Mandate: <br />
            {maskMandates.dates.length > 0 ? (
              maskMandates.dates.map((mandate, i) => {
                return (
                  <span key={i}>
                    {i > 0 && <br />}
                    {mandate.start} to {mandate.end ? mandate.end : "present"}
                  </span>
                );
              })
            ) : (
              <span>{state} has never implemented a mask mandate.</span>
            )}
          </Text>
        </StyledTooltip>
      </TooltipWithBounds>
    )
  );
};

export default Tooltip;
