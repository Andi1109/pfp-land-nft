import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import HelpLabel from "./components/HelpLabel";
import AccountModal from "./components/AccountModal";
import Map from "./components/Map";
import "@fontsource/inter";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Flex>
          <ConnectButton handleOpenModal={onOpen} />
          <HelpLabel />
        </Flex>
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <Map />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
