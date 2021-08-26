import styled from "@emotion/styled";
import {Box, Flex} from "@chakra-ui/react";

export const StyledChoroplethMap = styled(Flex)``;

StyledChoroplethMap.defaultProps = {
  p: 4,
  maxWidth: 800,
  margin: "0 auto",
  flexDirection: "column",
};

export const StyledMap = styled(Box)``;

StyledMap.defaultProps = {
  position: "relative",
};

export const StyledMapLabel = styled(Box)``;

StyledMapLabel.defaultProps = {
  position: "absolute",
  textAlign: "center",
  transform: `translate(-50%,-50%)`,
};
