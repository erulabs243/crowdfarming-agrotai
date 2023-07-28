import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Stack,
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
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { IconUserPlus } from "@tabler/icons-react";
import { getCampaign } from "~/models/campaign.server";
import { ICampaignDetail } from "~/schemas/propstypes";
import env from "~/services/environment.server";
import { aggregateRegistrations, showPercentage } from "~/utils/functions";

export const loader = async ({ params, request }: LoaderArgs) => {
  const id = Number(params?.id);

  if (!id) return redirect("/campaigns");
  const campaign = await getCampaign(id, request);

  return json({ campaign: campaign });
};

export default function Campaign() {
  const navigate = useNavigate();

  const data = useLoaderData();
  const campaign = data.campaign as ICampaignDetail;
  const { registrations, products, files } = campaign.attributes;

  return (
    <Box>
      <Heading>Single campaign</Heading>
      {/* Actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={{ base: 4, lg: 12 }}>
        <Heading
          as="h1"
          size="md">
          {campaign.attributes.campaign}
        </Heading>
        {campaign.attributes.isActive && (
          <Button
            colorScheme="green"
            leftIcon={<Icon as={IconUserPlus} />}
            onClick={() => navigate(`/campaigns/${campaign.id}/participate`)}>
            Participer à la campagne
          </Button>
        )}
      </Stack>

      {/* Stats */}
      <Stack direction="row">
        <Box>
          <Text>Total</Text>
          <Text>
            {campaign.attributes.amount.toLocaleString("fr-FR", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            })}
          </Text>
        </Box>
        <Box>
          <Text>Total levee</Text>
          <Text>
            {aggregateRegistrations({
              type: "sum",
              values: registrations.data,
              status: "validated",
            }).toLocaleString("fr-FR", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text>
            {showPercentage(
              aggregateRegistrations({
                type: "sum",
                values: registrations.data,
                status: "validated",
              }),
              campaign.attributes.amount
            )}
          </Text>
        </Box>
      </Stack>

      {/* Details */}
      <Stack>
        <Card maxW="sm">
          <CardBody>
            <Image
              src={`${env.SERVER_HOST}${campaign.attributes.image.data.attributes.url}`}
              alt={campaign.attributes.campaign}
              rounded="lg"
              objectFit="cover"
              objectPosition="center"
            />
            <Stack
              direction="column"
              gap={2}
              my={4}>
              <Heading
                as="h3"
                size="sm">
                {campaign.attributes.campaign}
                <Tag
                  mx={2}
                  size="md"
                  colorScheme={campaign.attributes.isActive ? "green" : "red"}
                  textTransform="uppercase">
                  {campaign.attributes.isActive ? "En cours" : "A venir"}
                </Tag>
              </Heading>
              <Text>{campaign.attributes.description}</Text>
            </Stack>
            <Stack direction="column">
              <Box>
                <Text>Commenc le</Text>
                <Text>
                  {new Date(campaign.attributes.startsAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </Text>
              </Box>
              <Box>
                <Text>Se termine le</Text>
                <Text>
                  {new Date(campaign.attributes.endsAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </Text>
              </Box>
            </Stack>
            <Stack direction="row">
              <Text>Lévée des fonds</Text>
              <Box>
                <Text>Commence le</Text>
                <Text>
                  {new Date(
                    campaign.attributes.fundStartsAt
                  ).toLocaleDateString("fr-FR")}
                </Text>
              </Box>
              <Box>
                <Text>Se termine le</Text>
                <Text>
                  {new Date(campaign.attributes.fundEndsAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>

        {/* Les produts */}
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th isNumeric>#ID</Th>
                <Th>Produit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaign.attributes.products.data.map((product, idx) => (
                <Tr key={product.attributes.slug}>
                  <Td isNumeric>{idx + 1}</Td>
                  <Td>{product.attributes.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
