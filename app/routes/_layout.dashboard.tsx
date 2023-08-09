import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Icon,
  IconButton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import {
  IconAxe,
  IconCategory,
  IconCategory2,
  IconEye,
  IconWalk,
} from "@tabler/icons-react";
import { EmptyData, Loader } from "~/components";
import { getRegistrations } from "~/models/registration.server";
import { RegistrationWithCampaign } from "~/schemas/propstypes";
import {
  aggregateRegistrations,
  computeCampaignProfit,
  countRegistrations,
} from "~/utils/functions";

export const loader = async ({ request }: LoaderArgs) => {
  //Get registrations
  const registrations = await getRegistrations(request);

  return json({ registrations });
};

export default function Dashboard() {
  const { state } = useNavigation();
  const navigate = useNavigate();

  const data = useLoaderData();
  const registrations = data.registrations as RegistrationWithCampaign[];

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w="full"
          px={4}>
          {registrations.length <= 0 ? (
            <EmptyData model="dashboard" />
          ) : (
            <Stack
              direction="column"
              w={{ base: "full", lg: "4xl" }}
              mx={{ base: 4, lg: "auto" }}
              py={{ base: 4, lg: 12 }}>
              <Heading
                size="lg"
                className="h1">
                <Text
                  as="span"
                  fontWeight={400}>
                  Bienvenue
                </Text>
                <Text
                  as="span"
                  fontWeight="bold"
                  px={{ base: 2, lg: 4 }}>
                  #username
                </Text>
                <Text
                  fontSize={{ base: "xl", lg: "3xl" }}
                  as="span">
                  👋
                </Text>
              </Heading>

              {/* Stats */}
              <Stack
                flexDirection={{ base: "column", lg: "row" }}
                my={{ base: 4, lg: 8 }}
                mr={4}
                gap={{ base: 4, lg: 8 }}>
                <Stat
                  borderWidth={1}
                  p={4}
                  rounded="lg">
                  <StatLabel>Investissement</StatLabel>
                  <StatNumber>
                    {aggregateRegistrations({
                      type: "sum",
                      values: registrations,
                    }).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                    <StatHelpText>Total montant investi</StatHelpText>
                  </StatNumber>
                </Stat>
                <Stat
                  borderWidth={1}
                  p={4}
                  rounded="lg">
                  <StatLabel>Confirmé</StatLabel>
                  <StatNumber>
                    {aggregateRegistrations({
                      type: "sum",
                      values: registrations,
                      status: "validated",
                    }).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 3,
                    })}
                  </StatNumber>
                  <StatHelpText>
                    Total confirmé (
                    {`${countRegistrations({
                      values: registrations,
                      status: "validated",
                    })}/${countRegistrations({ values: registrations })}`}
                    )
                  </StatHelpText>
                </Stat>
              </Stack>

              {/* Table des investissements */}
              <Box pr={4}>
                <Heading
                  as="h4"
                  size="lg"
                  mb={8}>
                  Mes investissements
                </Heading>
                <TableContainer
                  w="full"
                  p={{ base: 4, lg: 8 }}
                  bg="gray.200"
                  rounded="lg">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th isNumeric>#Id</Th>
                        <Th>Campagne</Th>
                        <Th isNumeric>Investissement</Th>
                        <Th isNumeric>Pourcentage</Th>
                        <Th isNumeric>Bénéfice</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {registrations.map((registration, idx) => (
                        <Tr
                          key={idx}
                          _hover={{
                            bg: "white",
                            rounded: "lg",
                            cursor: "pointer",
                          }}>
                          <Td isNumeric>{idx + 1}</Td>
                          <Td>
                            <Text>
                              {
                                registration.attributes.campaign.data.attributes
                                  .campaign
                              }
                            </Text>
                            <Tag
                              colorScheme={
                                registration.attributes.status === "validated"
                                  ? "green"
                                  : registration.attributes.status === "pending"
                                  ? "blackAlpha"
                                  : "red"
                              }
                              size="sm"
                              textTransform="uppercase"
                              rounded="lg"
                              mt={1}>
                              {registration.attributes.status === "validated"
                                ? "Validé"
                                : registration.attributes.status === "pending"
                                ? "En attente"
                                : "Réjété"}
                            </Tag>
                          </Td>
                          <Td isNumeric>
                            {registration.attributes.amount.toLocaleString(
                              "fr-FR",
                              {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              }
                            )}
                          </Td>
                          <Td isNumeric>
                            {(
                              registration.attributes.campaign.data.attributes
                                .fundPercentage / 100
                            ).toLocaleString("fr-FR", { style: "percent" })}
                          </Td>
                          <Td isNumeric>
                            {computeCampaignProfit(
                              registration.attributes.amount,
                              registration.attributes.campaign.data.attributes
                                .fundPercentage
                            )}
                          </Td>
                          <Td>
                            <ButtonGroup>
                              <IconButton
                                aria-label="Details"
                                icon={<Icon as={IconEye} />}
                              />
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Liens rapides */}
              <Box
                pr={4}
                my={{ base: 4, lg: 8 }}>
                <Heading
                  as="h4"
                  size="lg"
                  mb={8}>
                  Vous pouvez aussi...
                </Heading>
                <Stack
                  direction={{ base: "column", lg: "row" }}
                  flexWrap="wrap"
                  gap={4}>
                  <Button
                    rounded="lg"
                    variant="outline"
                    colorScheme="orange"
                    leftIcon={<Icon as={IconCategory} />}
                    onClick={() => navigate("/campaigns")}>
                    Découvrir nos campagnes
                  </Button>
                  <Button
                    rounded="lg"
                    variant="outline"
                    colorScheme="orange"
                    leftIcon={<Icon as={IconCategory2} />}
                    onClick={() => navigate("/products")}>
                    Découvrir nos produits
                  </Button>
                  <Button
                    rounded="lg"
                    variant="outline"
                    colorScheme="orange"
                    leftIcon={<Icon as={IconWalk} />}
                    onClick={() => navigate("/tours/create")}>
                    Demader une visite
                  </Button>
                  <Button
                    rounded="lg"
                    variant="outline"
                    colorScheme="orange"
                    leftIcon={<Icon as={IconAxe} />}
                    onClick={() => navigate("/careers")}>
                    Travailler avec nous
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
