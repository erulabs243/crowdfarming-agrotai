import {
  Box,
  ButtonGroup,
  Heading,
  Icon,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { IconEye, IconQuestionMark, IconUserPlus } from "@tabler/icons-react";
import { Loader } from "~/components";
import { getCampaigns } from "~/models/campaign.server";
import { getRegistrations } from "~/models/registration.server";
import { ICampaign, RegistrationWithCampaign } from "~/schemas/propstypes";
import { campaignInvestedIn, computeCampaignProfit } from "~/utils/functions";

export const loader = async ({ request }: LoaderArgs) => {
  const campaigns = await getCampaigns(request);
  const registrations = await getRegistrations(request);

  return json({ campaigns: campaigns, registrations: registrations });
};

export default function Campaigns() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const data = useLoaderData();
  const campaigns = data.campaigns as ICampaign[];
  const registrations = data.registrations as RegistrationWithCampaign[];

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w={{ base: "full", lg: "4xl" }}
          mx={{ base: 4, lg: "auto" }}
          py={{ base: 4, lg: 12 }}>
          <Heading my={{ base: 4, lg: 8 }}>Toutes nos campagnes</Heading>
          <TableContainer
            bg="gray.100"
            rounded="lg"
            p={4}>
            <Table>
              <Thead>
                <Tr>
                  <Th isNumeric>#Id</Th>
                  <Th>Campagne</Th>
                  <Th isNumeric>Pourcentage</Th>
                  <Th isNumeric>Montant</Th>
                  <Th isNumeric>Participation</Th>
                  <Th isNumeric>Bénéfice</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {campaigns.length <= 0 ? (
                  <Text>Aucune campagne</Text>
                ) : (
                  <>
                    {campaigns.map((campaign, idx) => (
                      <Tr
                        key={idx}
                        _hover={{ cursor: "pointer", bg: "white" }}
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                        <Td isNumeric>{idx + 1}</Td>
                        <Td>{campaign.attributes.campaign}</Td>
                        <Td isNumeric>
                          {(
                            campaign.attributes.fundPercentage / 100
                          ).toLocaleString("fr-FR", { style: "percent" })}
                          <Tooltip
                            hasArrow
                            label="Pourcentage des gains"
                            rounded="lg">
                            <IconButton
                              aria-label="Explication"
                              size="xs"
                              rounded="lg"
                              ml={2}
                              icon={
                                <Icon
                                  as={IconQuestionMark}
                                  w={4}
                                  h={4}
                                />
                              }
                            />
                          </Tooltip>
                        </Td>
                        <Td isNumeric>
                          {campaign.attributes.amount.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                          })}
                        </Td>
                        <Td isNumeric>
                          {campaignInvestedIn(
                            campaign.id,
                            registrations
                          )?.attributes.amount.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                          }) ??
                            (0).toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 2,
                            })}
                        </Td>
                        <Td isNumeric>
                          {campaignInvestedIn(campaign.id, registrations)
                            ? computeCampaignProfit(
                                campaignInvestedIn(campaign.id, registrations)
                                  ?.attributes.amount as number,
                                campaign.attributes.fundPercentage
                              )
                            : "Vous ne participez pas"}
                        </Td>
                        {/* <Td>
                          {campaign.attributes.products.data.map((product) => (
                            <Tag
                              mx={1}
                              colorScheme="blackAlpha"
                              rounded="lg"
                              onClick={() =>
                                navigate(`/products/${product.id}`)
                              }
                              key={product.attributes.slug}>
                              {product.attributes.name}
                            </Tag>
                          ))}
                        </Td> */}
                        <Td>
                          <ButtonGroup>
                            <Tooltip
                              hasArrow
                              label="Plus de détails"
                              rounded="lg">
                              <IconButton
                                rounded="lg"
                                icon={<Icon as={IconEye} />}
                                aria-label="Voir"
                                onClick={() =>
                                  navigate(`/campaigns/${campaign.id}`)
                                }
                              />
                            </Tooltip>
                            {!campaignInvestedIn(
                              campaign.id,
                              registrations
                            ) && (
                              <Tooltip
                                hasArrow
                                label="Participer à la campagne"
                                rounded="lg">
                                <IconButton
                                  rounded="lg"
                                  colorScheme="green"
                                  aria-label="Participer"
                                  icon={<Icon as={IconUserPlus} />}
                                  onClick={() =>
                                    navigate(
                                      `/campaigns/join?campaign=${campaign.id}`
                                    )
                                  }
                                />
                              </Tooltip>
                            )}
                          </ButtonGroup>
                        </Td>
                      </Tr>
                    ))}
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
