import React, {useEffect, useState} from "react";
import {
  Slider as ChakraSlider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
} from "@chakra-ui/react";
import {IoMdCalendar} from "react-icons/io";
import {StyledTimeline} from "./styles";

interface TimelineProps {
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  setCurrentIndex: (arg: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  label,
  min,
  max,
  defaultValue,
  setCurrentIndex,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return !mounted ? null : (
    <StyledTimeline>
      <ChakraSlider
        defaultValue={defaultValue}
        min={min}
        max={max}
        onChange={v => setCurrentIndex(v)}
        step={1}
      >
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="red.400" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="red.400" as={IoMdCalendar} />
          <Box position="absolute" top={"-110%"}>
            <Text
              pb={4}
              whiteSpace={"nowrap"}
              textStyle={"body"}
              fontSize={"sm"}
            >
              {label}
            </Text>
          </Box>
        </SliderThumb>
      </ChakraSlider>
    </StyledTimeline>
  );
};

export default Timeline;
