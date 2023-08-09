import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Stat,
  StatGroup,
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
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { IconUserPlus } from "@tabler/icons-react";
import { Loader } from "~/components";
import { getCampaign } from "~/models/campaign.server";
import { ICampaignDetail } from "~/schemas/propstypes";
import env from "~/services/environment.server";
import { aggregateRegistrations, showPercentage } from "~/utils/functions";

export const loader = async ({ params, request }: LoaderArgs) => {
  const id = Number(params?.id);
  const host = env.SERVER_HOST;

  if (!id) return redirect("/campaigns");
  const campaign = await getCampaign(id, request);

  return json({ campaign: campaign, host: host });
};

export default function Campaign() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const data = useLoaderData();
  const campaign = data.campaign as ICampaignDetail;
  const { registrations, products, files } = campaign.attributes;

  const registrationsSum = aggregateRegistrations({
    type: "sum",
    values: registrations.data,
  });

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w={{ base: "full", lg: "4xl" }}
          mx={{ base: 4, lg: "auto" }}
          pr={{ base: 8, lg: 0 }}
          py={{ base: 4, lg: 12 }}>
          {/* Actions */}
          <Stack
            mb={4}
            direction={{ base: "column", lg: "row" }}
            justifyContent={{ base: "flex-start", lg: "space-between" }}
            alignItems={{ base: "flex-start", lg: "center" }}
            py={{ base: 4, lg: 12 }}>
            <Heading as="h1">{campaign.attributes.campaign}</Heading>
            {campaign.attributes.isActive && (
              <Button
                isDisabled={registrationsSum >= campaign.attributes.amount}
                colorScheme={
                  registrationsSum >= campaign.attributes.amount
                    ? "red"
                    : "green"
                }
                leftIcon={<Icon as={IconUserPlus} />}
                onClick={() => navigate(`/campaigns/join/${campaign.id}`)}>
                Participer à la campagne
              </Button>
            )}
          </Stack>

          {/* Stats */}
          <StatGroup
            gap={{ base: 4, lg: 8 }}
            mb={8}>
            <Stat
              borderWidth={1}
              borderColor="gray.300"
              px={4}
              py={2}
              rounded="lg">
              <StatLabel>Total à lever</StatLabel>
              <StatNumber>
                {campaign.attributes.amount.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
              <StatHelpText>Total du montant recherché</StatHelpText>
            </Stat>

            <Stat
              borderWidth={1}
              borderColor="gray.300"
              px={4}
              py={2}
              rounded="lg">
              <StatLabel>Total levée</StatLabel>
              <StatNumber>
                {aggregateRegistrations({
                  type: "sum",
                  values: registrations.data,
                  status: "validated",
                }).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
              <StatHelpText>
                {showPercentage(
                  aggregateRegistrations({
                    type: "sum",
                    values: registrations.data,
                    status: "validated",
                  }),
                  campaign.attributes.amount
                )}
              </StatHelpText>
            </Stat>
          </StatGroup>

          {/* Details */}
          <Stack
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 4, lg: 8 }}>
            <Card flex={1}>
              <CardBody>
                <Image
                  src={`${data.host}${campaign.attributes.image.data.attributes.url}`}
                  alt={campaign.attributes.campaign}
                  rounded="lg"
                  w="full"
                  h={{ base: 56, lg: 72 }}
                  objectFit="cover"
                  objectPosition="center"
                  bg="gray.100"
                  rounded="lg"
                />
                <Stack
                  direction="column"
                  gap={2}
                  my={4}>
                  <Heading
                    as="h3"
                    size="md"
                    fontWeight="bold">
                    {campaign.attributes.campaign}
                    <Tag
                      mx={2}
                      size="md"
                      colorScheme={
                        campaign.attributes.isActive ? "green" : "red"
                      }
                      textTransform="uppercase">
                      {campaign.attributes.isActive ? "En cours" : "A venir"}
                    </Tag>
                  </Heading>
                  <Text color="gray.600">
                    {campaign.attributes.description}
                  </Text>
                </Stack>
                <Stack direction="row">
                  <Box flex={1}>
                    <Text
                      fontSize="sm"
                      color="gray.600">
                      Commence le
                    </Text>
                    <Text fontWeight="bold">
                      {new Date(
                        campaign.attributes.startsAt
                      ).toLocaleDateString("fr-FR")}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      textAlign="right">
                      Se termine le
                    </Text>
                    <Text
                      fontWeight="bold"
                      textAlign="right">
                      {new Date(campaign.attributes.endsAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </Text>
                  </Box>
                </Stack>
                <Text mt={4}>Lévée des fonds</Text>
                <Stack direction="row">
                  <Box flex={1}>
                    <Text
                      fontSize="sm"
                      color="gray.600">
                      Commence le
                    </Text>
                    <Text fontWeight="bold">
                      {new Date(
                        campaign.attributes.fundStartsAt
                      ).toLocaleDateString("fr-FR")}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      textAlign="right">
                      Se termine le
                    </Text>
                    <Text
                      fontWeight="bold"
                      textAlign="right">
                      {new Date(
                        campaign.attributes.fundEndsAt
                      ).toLocaleDateString("fr-FR")}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>

            {/* Les produts */}
            <Box
              flex={1}
              mx={2}
              my={{ base: 4, lg: 0 }}>
              <Box mb={8}>
                <Heading
                  as="h4"
                  size="md"
                  mb={4}>
                  Fichiers nécessaires
                </Heading>
                <Stack
                  direction="column"
                  gap={2}>
                  {files.data.map((file) => (
                    <Link
                      key={file.id}
                      href={`${data.host}${file.attributes.url}`}
                      download={file.attributes.name}>
                      {file.attributes.name}
                    </Link>
                  ))}
                </Stack>
              </Box>
              <Heading
                as="h4"
                size="md"
                mb={4}>
                Produits disponibles
              </Heading>
              <TableContainer
                bg="gray.200"
                p={4}
                rounded="lg">
                <Table>
                  <Thead>
                    <Tr>
                      <Th isNumeric>#ID</Th>
                      <Th>Produit</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.data.map((product, idx) => (
                      <Tr
                        key={product.attributes.slug}
                        _hover={{
                          bg: "white",
                          rounded: "lg",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/products/${product.id}`)}>
                        <Td isNumeric>{idx + 1}</Td>
                        <Td>{product.attributes.name}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
