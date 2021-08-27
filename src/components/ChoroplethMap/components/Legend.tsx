import React from "react";
import {Box, Flex, FlexProps, Text} from "@chakra-ui/react";
import {StyledSwatch, StyledSwatches, StyledSwatchText} from "../styles";

interface LegendProps {
  colorScale: d3.ScaleSequential<string, never>;
}

interface SwatchProps extends FlexProps {
  color: string;
  value: string;
}

const Legend: React.FC<LegendProps> = ({colorScale}) => {
  const swatch_size = 1;

  const Swatch = ({color, value, ...rest}: SwatchProps) => {
    return (
      <StyledSwatches key={color} {...rest}>
        <StyledSwatch
          bg={color}
          width={`${swatch_size}rem`}
          height={`${swatch_size}rem`}
        ></StyledSwatch>
        <StyledSwatchText>{value}</StyledSwatchText>
      </StyledSwatches>
    );
  };
  return (
    <Box m={[2, 2, 10]}>
      <Box>
        <Text textStyle={"subheading"} fontSize={"md"}>
          Daily sequenced Delta cases per capita:
        </Text>
        <Text mb={2} textStyle={"body"} fontSize={"xs"}>
          (7 day rolling average per 100 000 people)
        </Text>
      </Box>
      <Flex flexWrap={"wrap"}>
        {Array(colorScale.domain()[0])
          .fill("")
          .map((d, i) => {
            const color = colorScale(i);
            return (
              <Swatch
                key={color}
                color={color}
                value={
                  i == 0 ? "0" : `${i === 1 ? ">" : ""}${i - 1}.0 - ${i}.0`
                }
              />
            );
          })}
      </Flex>
      <Flex flexDirection={"column"}>
        <Swatch
          color={"disabled"}
          value={"No data registered."}
          width={"100%"}
          flexDirection={"row"}
        />

        <StyledSwatches width={"100%"} flexDirection={"row"}>
          <Box>
            <svg width={`${swatch_size}rem`} height={`${swatch_size}rem`}>
              <rect
                stroke={"black"}
                strokeWidth={1}
                fill={"url('#mask-lines')"}
                width={`${swatch_size}rem`}
                height={`${swatch_size}rem`}
              ></rect>
            </svg>
          </Box>
          <StyledSwatchText ml={2} whiteSpace={"normal"} textAlign={"left"}>
            State ordered mask mandate in effect.
          </StyledSwatchText>
        </StyledSwatches>
      </Flex>
    </Box>
  );
};

export default Legend;
