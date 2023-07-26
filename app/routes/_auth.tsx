import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <Box
      w="100vw"
      h="100vh">
      <Outlet />
    </Box>
  );
}
