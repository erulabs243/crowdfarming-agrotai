import { Box, Heading } from "@chakra-ui/react";

export default function ToursList() {
  return (
    <Box>
      <Box
        w="full"
        pr={{ base: 12, lg: 0 }}>
        <Box
          my={{ base: 8, lg: 20 }}
          w={{ base: "full", lg: "4xl" }}
          mx={{ base: 6, lg: "auto" }}>
          <Heading>Tours</Heading>
        </Box>
      </Box>
    </Box>
  );
}
