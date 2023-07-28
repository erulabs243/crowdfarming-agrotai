import { Box, Heading } from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function Dashboard() {
  return (
    <Box>
      <Heading>Dashboard</Heading>
    </Box>
  );
}
