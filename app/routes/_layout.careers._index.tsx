import {
  Box,
  Button,
  Heading,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { IconArrowRight } from "@tabler/icons-react";
import { EmptyData, Loader } from "~/components";
import { getCareers } from "~/models/career.server";
import { CareerType } from "~/schemas/propstypes";
import env from "~/services/environment.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const careers = await getCareers(request);
  const host = env.SERVER_HOST;

  return json({ careers, host });
};

export default function CareersList() {
  const { state } = useNavigation();
  const navigate = useNavigate();

  const data = useLoaderData();
  const careers = data.careers as CareerType[];

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w="full"
          px={4}>
          {careers.length <= 0 ? (
            <EmptyData model="career" />
          ) : (
            <Stack
              direction="column"
              w={{ base: "full", lg: "4xl" }}
              mx={{ base: 4, lg: "auto" }}
              py={{ base: 4, lg: 12 }}>
              <Heading
                size="lg"
                className="h1">
                Pour travailler avec nous...
              </Heading>

              <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                columnGap={4}
                my={8}>
                {careers.map((career) => (
                  <Stack
                    key={career.id}
                    direction="column"
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                    px={{ base: 4, lg: 8 }}
                    py={{ base: 2, lg: 4 }}
                    rounded="lg"
                    my={2}>
                    <Stack
                      direction="column"
                      gap={0}
                      flex={1}>
                      <Link href={`/careers/${career.id}/create`}>
                        <Image
                          src={`${data.host}${career.attributes.cover.data.attributes.url}`}
                          w="full"
                          h={40}
                          mb={{ base: 2, lg: 4 }}
                          objectFit="cover"
                          objectPosition="center"
                          rounded="lg"
                        />
                      </Link>
                      <Link
                        href={`/careers/${career.id}/create`}
                        fontSize="lg"
                        fontWeight="bold"
                        noOfLines={2}>
                        {career.attributes.career}
                      </Link>
                      <Link
                        _hover={{ textDecoration: "none" }}
                        href={`/careers/${career.id}/create`}
                        noOfLines={2}
                        color="gray.700">
                        {career.attributes.description}
                      </Link>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Text
                        fontSize="sm"
                        color="gray.600">
                        {new Date(
                          career.attributes.updatedAt
                        ).toLocaleDateString("fr-FR")}
                      </Text>
                      <Button
                        rightIcon={<Icon as={IconArrowRight} />}
                        variant="ghost"
                        onClick={() =>
                          navigate(`/careers/${career.id}/create`)
                        }>
                        Voir l'offre
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
