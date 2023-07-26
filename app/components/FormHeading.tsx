import { Box, Heading, Text } from "@chakra-ui/react";

type Props = {
  heading: string;
  subheading?: string;
};

function FormHeading({ heading, subheading }: Props) {
  return (
    <Box my={6}>
      <Heading
        fontSize="3xl"
        textTransform="uppercase">
        {heading}
      </Heading>
      {subheading && (
        <Text
          fontSize="lg"
          color="gray.700">
          {subheading}
        </Text>
      )}
    </Box>
  );
}

export default FormHeading;
