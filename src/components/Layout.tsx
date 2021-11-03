import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box w="100vw" h="100vh" bg="rgb(131 128 128 / 80%)">
      {children}
    </Box>
  );
}
