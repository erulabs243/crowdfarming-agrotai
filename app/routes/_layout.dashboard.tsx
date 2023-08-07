import { Box, Heading, Text } from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function Dashboard() {
  const { state } = useNavigation();

  return (
    <Box>
      {state === "loading" ? (
        <Text>Chargement...</Text>
      ) : (
        <Heading>Dashboard</Heading>
      )}
    </Box>
  );
}
