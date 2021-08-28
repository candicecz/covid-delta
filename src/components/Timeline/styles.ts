import styled from "@emotion/styled";
import {Flex, IconButton} from "@chakra-ui/react";

type StyledTimelineProps = {};

export const StyledTimeline = styled(Flex)<StyledTimelineProps>``;

StyledTimeline.defaultProps = {
  py: 4,
  px: [0, 0, 8],
};

export const StyledPlayButton = styled(IconButton)``;

StyledPlayButton.defaultProps = {
  bg: "#fff",
  color: "red.400",
  border: "1px solid",
  borderColor: "red.400",
  boxShadow: "sm",
  fontSize: ["xs", "sm"],
  mr: 6,
  borderRadius: "10%",
  width: ["2rem"],
  height: ["2rem"],
  _hover: {
    bg: "red.50",
  },
};
