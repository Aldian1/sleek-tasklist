import { HStack, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <HStack spacing={4} p={4} bg="gray.100">
      <ChakraLink as={Link} to="/">
        Home
      </ChakraLink>
    </HStack>
  );
}

export default Navigation;
