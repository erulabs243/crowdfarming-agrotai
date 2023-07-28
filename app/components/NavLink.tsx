import {
  Button,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { NavbarLinksProps } from "~/schemas/propstypes";

function Navlink({ label, uri, isButton }: NavbarLinksProps) {
  if (uri !== "/about")
    return (
      <Link href={uri}>
        <Button
          variant={isButton ? "solid" : "ghost"}
          rounded="lg"
          colorScheme={isButton ? "green" : "gray"}>
          {label}
        </Button>
      </Link>
    );
  else
    return (
      <Menu>
        <MenuButton
          as={Button}
          rounded="lg"
          colorScheme="gray"
          variant="ghost"
          rightIcon={<Icon as={IconChevronDown} />}>
          {label}
        </MenuButton>
        <MenuList px={2}>
          <MenuItem
            as={Link}
            href="/about"
            py={2}
            px={4}
            rounded="lg"
            _hover={{ textDecoration: "none" }}>
            Agrotai
          </MenuItem>
          <MenuItem
            as={Link}
            href="/actualites"
            py={2}
            px={4}
            rounded="lg"
            _hover={{ textDecoration: "none" }}>
            Actualités
          </MenuItem>
          <MenuItem
            as={Link}
            href="/careers"
            py={2}
            px={4}
            rounded="lg"
            _hover={{ textDecoration: "none" }}>
            Carrières
          </MenuItem>
          <MenuItem
            as={Link}
            href="/galeries"
            py={2}
            px={4}
            rounded="lg"
            _hover={{ textDecoration: "none" }}>
            Galéries
          </MenuItem>
        </MenuList>
      </Menu>
    );
}

export default Navlink;
