import { Box, Button, Heading } from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { requireUserId } from "~/services/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return json({});
};

export default function Layout() {
  return (
    <Box>
      <Form
        action="/logout"
        method="post">
        <Button type="submit">Deconnexion</Button>
      </Form>
      <Heading>Layout</Heading>
      <Outlet />
    </Box>
  );
}
