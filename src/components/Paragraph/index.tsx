import React from "react";
import {BoxProps, Text} from "@chakra-ui/react";
import {StyledSection} from "./styles";

interface ParagraphProps extends BoxProps {
  title: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
  title,
  children,
  color,
  ...rest
}) => {
  return (
    <StyledSection py={[4, 10, 10, 20]} {...rest}>
      <Text mb={4} textStyle={"heading"} color={color}>
        {title}
      </Text>
      {children}
    </StyledSection>
  );
};

export default Paragraph;
