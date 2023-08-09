import { Center, Spinner, Text } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Center
      flex={1}
      w="full"
      h="full"
      minH="100vh">
      <Spinner
        colorScheme="green"
        size="lg"
      />
      <Text
        fontSize="3xl"
        fontWeight={700}
        className="h1"
        ml={6}>
        Chargement...
      </Text>
    </Center>
  );
};

export default Loader;
