import {
  ChakraProvider,
  useDisclosure,
  Flex,
  Link,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useContractMethod } from "./hooks";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import Map from "./components/Map";
import "@fontsource/inter";
import { utils } from "ethers";
import "./App.css";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state, send: batchMint } = useContractMethod("batchMintLands");
  const [batchMintValue, setBatchMintValue] = useState(5);

  const handleBatchMint = async () => {
    try {
      await batchMint(batchMintValue, {
        value: utils.parseEther("0"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMinusBatchMintCount = () => {
    if (batchMintValue == 1) return;
    setBatchMintValue(batchMintValue - 1);
  };

  const handlePlusBatchMintCount = () => {
    if (batchMintValue == 10) return;
    setBatchMintValue(batchMintValue + 1);
  };

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
            <Text color="yellow" className="refreshText">
              Click on land to mint
            </Text>
            <ConnectButton handleOpenModal={onOpen} />
            <div className="batchmint">
              <Text color="yellow" className="refreshText">
                Batch Mint:
              </Text>
              <div className="batchMintCount">
                <Button
                  colorScheme="teal"
                  size="xs"
                  onClick={handleMinusBatchMintCount}
                >
                  -
                </Button>
                <Text color="yellow" className="marginY">
                  {batchMintValue}
                </Text>
                <Button
                  colorScheme="teal"
                  size="xs"
                  onClick={handlePlusBatchMintCount}
                >
                  +
                </Button>
              </div>
              <Button
                colorScheme="teal"
                size="md"
                className="mintBtn"
                onClick={handleBatchMint}
              >
                Mint
              </Button>
            </div>
          </div>
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
