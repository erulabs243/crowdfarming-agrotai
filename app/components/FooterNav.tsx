import {
  ButtonGroup,
  Center,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { SITE_TITLE } from "~/utils/consts";

const FooterNav = () => {
  return (
    <Center
      w="full"
      py={{ base: 4, lg: 8 }}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        w={{ base: "full", lg: "5xl" }}
        mx="auto"
        justifyContent={{ base: "center", lg: "space-between" }}
        alignItems={{ base: "center", lg: "center" }}
        gap={4}>
        <Link
          href="https://agrotai.com"
          target="_blank"
          fontSize="lg">
          Agrotai
        </Link>
        <ButtonGroup>
          <IconButton
            aria-label="Facebook"
            variant="outline"
            icon={
              <Icon
                as={IconBrandFacebookFilled}
                boxSize={6}
              />
            }
            colorScheme="facebook"
            isRound
          />
          <IconButton
            aria-label="Instagram"
            variant="outline"
            icon={
              <Icon
                as={IconBrandInstagram}
                boxSize={6}
              />
            }
            colorScheme="purple"
            isRound
          />
          <IconButton
            aria-label="WhatsApp"
            variant="outline"
            icon={
              <Icon
                as={IconBrandWhatsapp}
                boxSize={6}
              />
            }
            colorScheme="whatsapp"
            isRound
          />
        </ButtonGroup>
        <Text>&copy; {`${SITE_TITLE} ${new Date().getFullYear()}`}</Text>
      </Stack>
    </Center>
  );
};

export default FooterNav;
