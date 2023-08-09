import {
  Box,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { IconPercentage } from "@tabler/icons-react";
import { EmptyData, Loader } from "~/components";
import { getRegistrations } from "~/models/registration.server";
import { RegistrationWithCampaign } from "~/schemas/propstypes";
import env from "~/services/environment.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const host = env.SERVER_HOST;

  const registrations = await getRegistrations(request);
  console.log(JSON.stringify(registrations, null, 2));

  return json({
    host: host,
    registrations: registrations,
  });
};

export default function MyCampaignPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const data = useLoaderData();

  const registrations = data.registrations as RegistrationWithCampaign[];
  const { host } = data;

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w={{ base: "full", lg: "4xl" }}
          mx="auto"
          my={{ base: 8, lg: 20 }}>
          <Heading>Mes campagnes</Heading>
          {registrations.length <= 0 ? (
            <EmptyData model="campaign" />
          ) : (
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              gap={4}
              py={{ base: 8, lg: 12 }}>
              {registrations.map((registration) => (
                <Card
                  my={2}
                  key={registration.id}
                  shadow="none"
                  rounded="lg"
                  bg="gray.100"
                  _hover={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/campaigns/${registration.attributes.campaign.data.id}`
                    )
                  }>
                  <CardBody>
                    <Image
                      src={`${host}${registration.attributes.campaign.data.attributes.image.data.attributes.url}`}
                      objectFit="cover"
                      objectPosition="center"
                      h={48}
                      w="full"
                      rounded="lg"
                      bg="gray.50"
                    />
                    <Stack
                      my={4}
                      gap={4}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={4}>
                        <Heading
                          size="md"
                          flex={1}
                          _hover={{ textDecoration: "underline" }}>
                          {
                            registration.attributes.campaign.data.attributes
                              .campaign
                          }
                        </Heading>
                        <Tag
                          colorScheme={
                            registration.attributes.status === "validated"
                              ? "green"
                              : registration.attributes.status === "pending"
                              ? "gray"
                              : "red"
                          }
                          size="sm"
                          rounded="lg"
                          textTransform="uppercase">
                          {registration.attributes.status === "validated"
                            ? "Confirmé"
                            : registration.attributes.status === "pending"
                            ? "En attente"
                            : "Réjété"}
                        </Tag>
                      </Stack>
                      <Stack
                        direction="row"
                        gap={4}>
                        <Box flex={1}>
                          <Text
                            color="gray.700"
                            fontSize="sm">
                            Montant investi
                          </Text>
                          <Text fontSize="lg">
                            {registration.attributes.amount.toLocaleString(
                              "fr-FR",
                              {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              }
                            )}
                          </Text>
                        </Box>
                        <Box flex={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent={{
                              base: "flex-start",
                              lg: "flex-end",
                            }}
                            gap={1}>
                            <Icon
                              as={IconPercentage}
                              w={4}
                              h={4}
                              color="gray.700"
                            />
                            <Text
                              color="gray.700"
                              fontSize="sm">
                              Bénéfice{" "}
                              <Text
                                as="span"
                                fontWeight="semibold">
                                (
                                {(
                                  registration.attributes.campaign.data
                                    .attributes.fundPercentage / 100
                                ).toLocaleString("fr-FR", {
                                  style: "percent",
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                })}
                                )
                              </Text>
                            </Text>
                          </Stack>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            textAlign={{ base: "left", lg: "right" }}>
                            {(
                              registration.attributes.amount +
                              (registration.attributes.amount *
                                registration.attributes.campaign.data.attributes
                                  .fundPercentage) /
                                100
                            ).toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 2,
                            })}
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}
    </Box>
  );
}
