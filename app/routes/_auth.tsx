import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <Box
      w="100vw"
      h="100vh"
      bgGradient="linear(to-br, green.300, green.400, green.600)">
      <Outlet />
    </Box>
  );
}
