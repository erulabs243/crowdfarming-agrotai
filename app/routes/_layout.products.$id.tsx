import {
  Alert,
  AlertIcon,
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
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { IconEye, IconQuestionMark, IconUserPlus } from "@tabler/icons-react";
import { getProduct } from "~/models/product.server";
import { getRegistrationsByProduct } from "~/models/registration.server";
import {
  ProductWithCampaign,
  RegistrationWithCampaign,
} from "~/schemas/propstypes";
import { campaignInvestedIn, computeCampaignProfit } from "~/utils/functions";

export const loader = async ({ params, request }: LoaderArgs) => {
  const id = Number(params.id);
  if (!id) return redirect("/products");

  const product = await getProduct(id, request);
  const registrations = await getRegistrationsByProduct(id, request);

  return json({
    product: product,
    registrations: registrations,
  });
};

export default function ShowProduct() {
  const navigate = useNavigate();

  const data = useLoaderData();
  const product = data.product as ProductWithCampaign;
  const registrations = data.registrations as RegistrationWithCampaign[];
  const { campaigns, image, category } = product.attributes;

  return (
    <Box>
      <Box
        w={{ base: "full", lg: "4xl" }}
        mx={{ base: 4, lg: "auto" }}
        py={{ base: 4, lg: 12 }}>
        <Heading my={{ base: 4, lg: 8 }}>{product.attributes.name}</Heading>

        {registrations.length <= 0 && (
          <Alert
            status="error"
            rounded="lg">
            <AlertIcon />
            Vous n'avez participé dans aucune campagne... Veuillez en choisir
            une pour investir...
          </Alert>
        )}

        {/* Campagnes */}
        <Heading
          as="h4"
          size="lg"
          my={{ base: 4, lg: 8 }}>
          Campagnes disponibles pour ce produit
        </Heading>
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
                <Th isNumeric>Votre participation</Th>
                <Th isNumeric>Votre gain</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns.data.length <= 0 ? (
                <Text>Aucune campagne</Text>
              ) : (
                <>
                  {campaigns.data.map((campaign, idx) => (
                    <Tr
                      key={idx}
                      _hover={{ cursor: "pointer" }}
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
                          {!campaignInvestedIn(campaign.id, registrations) && (
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
                                  navigate(`/campaigns/join/${campaign.id}`)
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
    </Box>
  );
}
