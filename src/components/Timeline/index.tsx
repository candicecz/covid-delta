import React, {useEffect, useState} from "react";
import {
  Slider as ChakraSlider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import {
  IoMdCalendar,
  IoMdInformationCircleOutline,
  IoIosPlay,
  IoIosPause,
} from "react-icons/io";
import {useInterval} from "src/hooks/useInterval";
import {StyledPlayButton, StyledTimeline} from "./styles";

interface TimelineProps {
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  setCurrentIndex: (arg: number) => void;
}

/*
 Scrollable timeline component to control date displayed.
*/
const Timeline: React.FC<TimelineProps> = ({
  label,
  min,
  max,
  defaultValue,
  setCurrentIndex,
}) => {
  const [mounted, setMounted] = useState(false);
  const [playSlider, setPlaySlider] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useInterval(
    () => {
      if (defaultValue < max) {
        setCurrentIndex(defaultValue++);
      } else {
        setPlaySlider(false);
      }
    },
    playSlider ? 60 : 0,
  );

  return !mounted ? null : (
    <StyledTimeline>
      <StyledPlayButton
        aria-label="Play timeline sequence automatically."
        icon={playSlider ? <IoIosPause /> : <IoIosPlay />}
        onClick={() => {
          // if play is pressed at the end of the timeline, set the index to the start.
          if (defaultValue === max - 1) {
            setCurrentIndex(0);
          }
          setPlaySlider(!playSlider);
        }}
      />
      <Flex flexDirection={"column"} flex={"1"}>
        <ChakraSlider
          defaultValue={defaultValue}
          value={defaultValue}
          min={min}
          max={max}
          onChange={v => {
            setCurrentIndex(v);
          }}
          step={1}
        >
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="red.400" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="red.400" as={IoMdCalendar} />
            <Box position="absolute" top={"-150%"}>
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

        <Text
          textStyle={"body"}
          fontSize={["xs", "sm"]}
          display={"flex"}
          justifyContent={"center"}
          mt={4}
        >
          <IoMdInformationCircleOutline
            size={"1.15rem"}
            style={{marginRight: "0.5rem"}}
          />
          Press play or drag slider to update daily results.
        </Text>
        <Text
          textStyle={"body"}
          fontSize={["xs"]}
          display={"flex"}
          justifyContent={"center"}
        >
          (The real action starts around 2021-03-25)
        </Text>
      </Flex>
    </StyledTimeline>
  );
};

export default Timeline;
