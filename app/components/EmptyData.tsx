import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import {
  IconCategory,
  IconCategory2,
  IconFileOff,
  IconWalk,
} from "@tabler/icons-react";

type Props = {
  model:
    | "campaign"
    | "dashboard"
    | "product"
    | "registration"
    | "career"
    | "tour";
};

const EmptyData = ({ model }: Props) => {
  const navigate = useNavigate();

  return (
    <Center
      flex={1}
      w="full"
      my={{ base: 8, lg: 20 }}>
      <Center
        w={{ base: "full", lg: "sm" }}
        mx={{ base: 4, lg: "auto" }}>
        <Center
          flexDirection="column"
          flex={1}
          justifyContent="center">
          <Icon
            as={IconFileOff}
            w={20}
            h={20}
            color="gray.700"
          />
          <VStack
            gap={4}
            mt={4}>
            <Heading
              textAlign="center"
              size="md">
              Aucune donnée disponible
            </Heading>
            {model === "dashboard" && (
              <>
                <Text textAlign="center">
                  Vous n'avez toujours pas investi dans aucune de nos campagnes.
                  Veuillez choisir parmi nos campagnes et produits
                </Text>
                <ButtonGroup
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  mt={4}>
                  <Button
                    rounded="lg"
                    onClick={() => navigate("/campaigns")}
                    colorScheme="green"
                    leftIcon={<Icon as={IconCategory} />}>
                    Nos campagnes
                  </Button>
                  <Button
                    rounded="lg"
                    onClick={() => navigate("/products")}
                    colorScheme="orange"
                    leftIcon={<Icon as={IconCategory2} />}>
                    Nos produits
                  </Button>
                </ButtonGroup>
              </>
            )}
            {model === "campaign" && (
              <>
                <Text textAlign="center">
                  Vous n'avez toujours pas investi dans aucune de nos campagnes.
                  Veuillez choisir parmi nos campagnes et produits
                </Text>
                <ButtonGroup
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  mt={4}>
                  <Button
                    rounded="lg"
                    onClick={() => navigate("/campaigns")}
                    colorScheme="green"
                    leftIcon={<Icon as={IconCategory} />}>
                    Nos campagnes
                  </Button>
                  <Button
                    rounded="lg"
                    onClick={() => navigate("/products")}
                    colorScheme="orange"
                    leftIcon={<Icon as={IconCategory2} />}>
                    Nos produits
                  </Button>
                </ButtonGroup>
              </>
            )}
            {model === "product" && (
              <>
                <Text textAlign="center">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  natus ad error enim ratione aliquid officiis modi ullam, ipsam
                  sit. Harum eveniet cupiditate, consectetur maxime adipisci
                  enim ad aut culpa!
                </Text>
                <ButtonGroup
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  mt={4}>
                  <Button rounded="lg">Nos campagnes</Button>
                  <Button rounded="lg">Nos campagnes</Button>
                </ButtonGroup>
              </>
            )}
            {model === "registration" && (
              <>
                <Text textAlign="center">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                  natus ad error enim ratione aliquid officiis modi ullam, ipsam
                  sit. Harum eveniet cupiditate, consectetur maxime adipisci
                  enim ad aut culpa!
                </Text>
                <ButtonGroup
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  mt={4}>
                  <Button rounded="lg">Nos campagnes</Button>
                  <Button rounded="lg">Nos campagnes</Button>
                </ButtonGroup>
              </>
            )}
            {model === "career" && (
              <>
                <Text textAlign="center">
                  Vous n'avez postulé à aucune de nos offres... Veuillez les
                  vérifier et postuler à celle qui vous intéresse...
                </Text>
              </>
            )}

            {model === "tour" && (
              <>
                <Text textAlign="center">
                  Vous n'avez fait aucune requête de visite. Cliquez sur le
                  bouton suivant pour nous laisser un message...
                </Text>
                <ButtonGroup
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  mt={4}>
                  <Button
                    rounded="lg"
                    colorScheme="green"
                    leftIcon={<Icon as={IconWalk} />}
                    onClick={() => navigate("/tours/create")}>
                    Nos campagnes
                  </Button>
                </ButtonGroup>
              </>
            )}
          </VStack>
        </Center>
      </Center>
    </Center>
  );
};

export default EmptyData;
