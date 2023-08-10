import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { FooterNav } from "~/components";
import env from "~/services/environment.server";
import { SITE_TITLE } from "~/utils/consts";

export const meta: V2_MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} | Pour une agriculture durable` },
    {
      name: "description",
      content: `Agrotai est un société congolaise œuvrant
        dans l’agropastoral, dont l’élevage (l’aviculture et la pisciculture) 
        et l’agriculture produisant principalement des légumes et des céréales.`,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const host = env.SERVER_HOST;

  return json({ host });
};

export default function Index() {
  const navigate = useNavigate();
  const data = useLoaderData();

  return (
    <Box
      w="full"
      p={0}
      m={0}
      flex={1}>
      <Center
        minH="100vh"
        flexDir="column"
        justifyContent="center"
        gap={{ base: 4, lg: 12 }}
        w={{ base: "full", lg: "4xl" }}
        mx="auto"
        bg="gray.100"
        px={{ base: 4, lg: 12 }}
        rounded="lg">
        <Link href="https://agrotai.com">
          <Stack
            direction="row"
            alignItems="center"
            w="full"
            justifyContent="center"
            _hover={{ textDecor: "none" }}>
            <Image
              src={`${data.host}/uploads/logo_comp2_f29790d4d6.png`}
              alt="Logo Agrotai"
              w={48}
            />
          </Stack>
        </Link>
        <Heading
          textAlign="center"
          size={{ base: "xl", lg: "2xl" }}
          color="gray.700">
          Rejoignez la grande famille Agrotai
        </Heading>
        <Text
          fontSize={{ base: "lg", lg: "2xl" }}
          color="gray.700"
          textAlign="center"
          px={{ base: 4, lg: 8 }}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          ipsum illo, veniam esse omnis repellendus perferendis labore eius ab
          minima quas, vel nesciunt perspiciatis harum et neque ad deserunt
          laboriosam!
        </Text>
        <ButtonGroup
          flexDir={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          gap={{ base: 4, lg: 8 }}
          my={8}>
          <Button
            w={{ base: "full", md: "xs" }}
            variant="solid"
            colorScheme="green"
            size="lg"
            rightIcon={<Icon as={IconLogin} />}
            onClick={() => navigate("/login")}>
            Se connecter
          </Button>
          <Button
            w={{ base: "full", md: "xs" }}
            variant="outline"
            colorScheme="orange"
            size="lg"
            leftIcon={<Icon as={IconUserPlus} />}
            onClick={() => navigate("/register")}>
            Créer un compte
          </Button>
        </ButtonGroup>
      </Center>

      {/* Footer */}
      <FooterNav />
    </Box>
  );
}
