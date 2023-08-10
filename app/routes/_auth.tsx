import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

{
  /* <Box
      w="100vw"
      h="100vh"
      bgGradient="linear(to-br, green.300, green.400, green.600)"></Box> */
}

export default function Auth() {
  return (
    <Box
      w="100vw"
      h="100vh"
      bg="gray.50">
      <Outlet />
    </Box>
  );
}
