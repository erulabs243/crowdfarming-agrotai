import {
  Box,
  ButtonGroup,
  Heading,
  Icon,
  IconButton,
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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { IconEye, IconQuestionMark } from "@tabler/icons-react";
import { getProducts } from "~/models/product.server";
import { ProductWithCampaign } from "~/schemas/propstypes";
import env from "~/services/environment.server";

export const loader = async ({ request }: LoaderArgs) => {
  const products = await getProducts(request);
  return json({ products });
};

export default function ListProducts() {
  const navigate = useNavigate();

  const data = useLoaderData();
  const products = data.products as ProductWithCampaign[];

  return (
    <Box>
      <Heading>List products</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th isNumeric>#Id</Th>
              <Th>Produit</Th>
              <Th>
                <Stack
                  direction="row"
                  alignItems="center">
                  <Text>Status</Text>
                  <Tooltip
                    hasArrow
                    label="Produit disponible pour la vente ?"
                    rounded="lg">
                    <IconButton
                      aria-label="Explication du status"
                      icon={
                        <Icon
                          as={IconQuestionMark}
                          w={4}
                          h={4}
                        />
                      }
                      rounded="lg"
                      size="xs"
                    />
                  </Tooltip>
                </Stack>
              </Th>
              <Th># Campagnes</Th>
              <Th>Catégorie</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.length <= 0 ? (
              <Text>Aucun produit</Text>
            ) : (
              <>
                {products.map((product, idx) => (
                  <Tr
                    key={product.attributes.slug}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => navigate(`/products/${product.id}`)}>
                    <Td isNumeric>{idx + 1}</Td>
                    <Td>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={4}>
                        <Image
                          alt={product.attributes.name}
                          src={`${env.SERVER_HOST}${product.attributes.image.data.attributes.url}`}
                          w={16}
                          h={16}
                          p={1}
                          objectFit="cover"
                          objectPosition="center"
                          bg="gray.100"
                          rounded="lg"
                        />
                        <Text>{product.attributes.name}</Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Tag
                        textTransform="uppercase"
                        size="sm"
                        mx={2}
                        rounded="lg"
                        colorScheme={
                          product.attributes.status === "instock"
                            ? "green"
                            : product.attributes.status === "soon"
                            ? "gray"
                            : "red"
                        }>
                        {product.attributes.status === "instock"
                          ? "En stock"
                          : product.attributes.status === "soon"
                          ? "Bientôt"
                          : "Indisponible"}
                      </Tag>
                    </Td>
                    <Td isNumeric>
                      {product.attributes.campaigns.data.length > 1
                        ? `${product.attributes.campaigns.data.length} campagnes`
                        : `${product.attributes.campaigns.data.length} campagne`}
                    </Td>
                    <Td
                      onClick={() =>
                        navigate(
                          `/categories/${product.attributes.category.data.id}`
                        )
                      }
                      _hover={{ textDecor: "underline" }}>
                      {product.attributes.category.data.attributes.name}
                    </Td>
                    <Td>
                      <ButtonGroup>
                        <Tooltip
                          hasArrow
                          label="Voir le produit">
                          <IconButton
                            rounded="lg"
                            aria-label="Plus de détails"
                            icon={<Icon as={IconEye} />}
                            onClick={() => navigate(`/products/${product.id}`)}
                          />
                        </Tooltip>
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
  );
}
