import styled from "@emotion/styled";
import {Box, Flex, FlexProps, Text} from "@chakra-ui/react";

export const StyledChoroplethMap = styled(Flex)``;

StyledChoroplethMap.defaultProps = {
  p: [0, 0, 4],
  width: "100%",
  margin: "0 auto",
  flexDirection: "column",
};

export const StyledMap = styled(Box)``;

StyledMap.defaultProps = {
  position: "relative",
  margin: "0 auto",
};

export const StyledMapLabel = styled(Box)`
  user-select: none;
  cursor: default;
  pointer-events: none;
`;

StyledMapLabel.defaultProps = {
  position: "absolute",
  textAlign: "center",
  transform: `translate(-50%,-50%)`,
};

export const StyledTooltip = styled(Box)`
  border-top: ${props => {
    return `5px solid ${props.fill}`;
  }};
`;

StyledTooltip.defaultProps = {
  bg: "#fff",
  boxShadow: "md",
  width: "100%",
  border: "1px solid",
  borderColor: "gray.300",
};

// For Legend.

export const StyledSwatches = styled(Flex)<FlexProps>``;

StyledSwatches.defaultProps = {
  mr: [4, 4, 6],
  my: [1],
  flexDirection: ["row", "row", "column"],
  alignItems: "center",
  flex: [1, 1, "unset"],
  minWidth: ["20%", "20%", "unset"],
};

export const StyledSwatch = styled(Box)``;

StyledSwatch.defaultProps = {
  mr: [2, 2, 2],
  boxShadow: "sm",
  border: "1px solid",
};

export const StyledSwatchText = styled(Text)``;

StyledSwatchText.defaultProps = {
  my: 1,
  textStyle: "body",
  textAlign: "center",
  fontSize: "xs",
  whiteSpace: "nowrap",
};
