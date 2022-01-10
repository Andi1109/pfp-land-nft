import {
  ChakraProvider,
  useDisclosure,
  Flex,
  Link,
  Image,
  Text,
} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import Map from "./components/Map";
import "@fontsource/inter";
import "./App.css";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Flex className="navbar">
          <div className="logolink">
            <Link href="http://mypfp.land">
              <Image className="linkImg" src="/assets/mypfp_icon.png" />
            </Link>
            <Text color="white" className="refreshText">
              Map version Alpha 0.5. Refreshes every 5 minutes
            </Text>
          </div>
          <ConnectButton handleOpenModal={onOpen} />
          <div className="link">
            <Link href="https://twitter.com/myPFPland">
              <Image className="linkImg" src="/assets/twitter_icon.png" />
            </Link>
            <Link href="https://discord.gg/uYx6HUPsCe">
              <Image className="linkImg" src="/assets/discord_icon.png" />
            </Link>
            <Link href="https://opensea.io/collection/mypfpland-v2">
              <Image className="linkImg" src="/assets/opensea_icon.png" />
            </Link>
          </div>
        </Flex>
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <Map />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
