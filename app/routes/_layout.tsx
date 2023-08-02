import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Show,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import {
  IconHome2,
  IconLogout2,
  IconMenu2,
  IconTable,
  IconUser,
} from "@tabler/icons-react";
import { Navlink } from "~/components";
import { NavbarLinksProps } from "~/schemas/propstypes";
import env from "~/services/environment.server";
import { requireUserId } from "~/services/user.server";
import { useOptionalUser } from "~/utils/utils";

const navbarLinks: Array<NavbarLinksProps> = [
  {
    label: "Accueil",
    uri: "/",
    isButton: false,
  },
  {
    label: "Campagnes",
    uri: "/campaigns",
    isButton: false,
  },
  {
    label: "Produits",
    uri: "/products",
    isButton: false,
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return json({
    siteTitle: env.SITE_TITLE,
  });
};

export default function Layout() {
  const navigate = useNavigate();
  const data = useLoaderData();

  const user = useOptionalUser();

  return (
    <Box
      as="header"
      w="full"
      py={4}
      position="sticky"
      top={0}
      backdropFilter="blur(7px) hue-rotate(60deg)"
      zIndex={1000}>
      <Container
        mx="auto"
        w="95vw"
        maxW="full"
        py={2}>
        <HStack>
          <Box>
            <Link href="/">
              <Text>{data.siteTitle}</Text>
            </Link>
          </Box>

          {/* Show menu on large screen */}
          <Show above="lg">
            <Stack
              as={Box}
              flex={1}
              alignItems="center"
              flexDir="row"
              justifyContent="flex-end">
              {navbarLinks.map((link: NavbarLinksProps, idx: number) => (
                <Navlink
                  uri={link.uri}
                  label={link.label}
                  isButton={link.isButton}
                  key={`${link}-${idx}`}
                />
              ))}
              <Menu>
                <MenuButton
                  as={Box}
                  aria-label="Profile">
                  <Stack
                    direction="row-reverse"
                    alignItems="center"
                    gap={2}
                    bg="gray.100"
                    py={2}
                    px={4}
                    rounded="lg"
                    _hover={{ cursor: "pointer" }}>
                    <Avatar size="xs" />
                    <Text>{user?.fullName}</Text>
                  </Stack>
                </MenuButton>
                <MenuList>
                  <MenuGroup>
                    <MenuItem px={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        w="full"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={IconHome2} />}
                        onClick={() => navigate(`/dashboard`)}>
                        Tableau de bord
                      </Button>
                    </MenuItem>
                    <MenuItem px={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        w="full"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={IconTable} />}
                        onClick={() => navigate(`/me/campaigns`)}>
                        Mes campagnes
                      </Button>
                    </MenuItem>
                    <MenuItem px={2}>
                      <Button
                        variant="ghost"
                        w="full"
                        size="sm"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={IconUser} />}>
                        Mon compte
                      </Button>
                    </MenuItem>
                  </MenuGroup>
                  <MenuGroup>
                    <MenuItem px={2}>
                      <Form
                        action="/logout"
                        method="post">
                        <Button
                          variant="ghost"
                          w="full"
                          colorScheme="red"
                          size="sm"
                          justifyContent="flex-start"
                          leftIcon={<Icon as={IconLogout2} />}
                          type="submit">
                          Deconnexion
                        </Button>
                      </Form>
                    </MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </Stack>
          </Show>

          {/* Show menu on mobile */}
          <Show below="lg">
            <Stack
              as={Box}
              mr={0}
              flex={1}
              justifyContent="flex-end">
              <Menu>
                <MenuButton
                  as={Button}
                  aria-label="Menu"
                  alignSelf="flex-end"
                  colorScheme="green"
                  leftIcon={
                    <Icon
                      as={IconMenu2}
                      w={5}
                      h={5}
                    />
                  }>
                  Menu
                </MenuButton>
                <MenuList
                  px={4}
                  py={2}>
                  {navbarLinks.map((link: NavbarLinksProps, idx: number) => (
                    <MenuItem
                      my={2}
                      key={`${link.uri}-${idx}`}
                      as={Button}
                      variant={link.isButton ? "solid" : "ghost"}
                      colorScheme={link.isButton ? "green" : "gray"}
                      rounded="lg">
                      <Link
                        href={link.uri}
                        flex={1}
                        textAlign="right"
                        _hover={{ textDecor: "none" }}>
                        {link.label}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Stack>
          </Show>
        </HStack>
      </Container>
      <Outlet />
    </Box>
  );
}
