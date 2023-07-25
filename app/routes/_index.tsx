import { Box, Heading, Icon } from "@chakra-ui/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { IconArrowAutofitContent } from "@tabler/icons-react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Box>
      <Heading>Agrotai</Heading>
      <Icon as={IconArrowAutofitContent} w={8} h={8} />
    </Box>
  );
}
