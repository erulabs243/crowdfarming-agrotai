import { Box, Heading } from "@chakra-ui/react";
import { useOptionalUser } from "~/utils/utils";

export default function Dashboard() {
  const user = useOptionalUser();
  console.log(user);

  return (
    <Box>
      <Heading>Dashboard</Heading>
    </Box>
  );
}
