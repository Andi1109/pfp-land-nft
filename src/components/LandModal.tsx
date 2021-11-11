// @ts-nocheck
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Flex,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import {
  EncodeTokenID,
  GetLandOwnerOf,
  CollectionIDAt,
  GetRoyalMetaDataOfLand,
  GetMetaDataAtCollection,
  GetTotalRoyalBalanceOf,
  GetTotalDerivativeBalance,
  useContractMethod,
} from "../hooks";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { ReactNode, useState, useEffect } from "react";
import RoyalImage from "./RoyalImage";
import DerivedImage from "./DerivedImage";
import ClaimedDerivedImage from "./ClaimedDerivedImage";
import pairsJson from "../royal_derived_pair/pair.json";

type Props = {
  children: ReactNode;
  onClaim: Function;
  isMobile: boolean;
  doPostTransaction: Function;
  checkClaimedLand: Function;
};

export default function LandModal({
  children,
  onClaim,
  isMobile,
  doPostTransaction,
  checkClaimedLand,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const landX = document.getElementById("selectedLandX")?.innerHTML;
  const landY = document.getElementById("selectedLandY")?.innerHTML;
  const isClaimed = checkClaimedLand(parseInt(landX), parseInt(landY));

  const { account } = useEthers();
  const assetID = EncodeTokenID(landX, landY);
  const landOwner = GetLandOwnerOf(assetID);
  const collectionID = CollectionIDAt(landX, landY);
  const royalData = GetRoyalMetaDataOfLand(assetID);
  const royalTokenURI = GetMetaDataAtCollection(
    royalData.collectionID,
    royalData.tokenID
  );
  const royalBalance = GetTotalRoyalBalanceOf(landOwner, collectionID);
  const derivativeBalance = GetTotalDerivativeBalance(assetID);
  const { state: royalNFTState, send: updateRoyal } = useContractMethod(
    "updateLandRoyalMetaData"
  );
  const { state: derivedNFTState, send: updateDerived } = useContractMethod(
    "updateLandDerivativeMetaData"
  );

  const [imageURLValue, setImageURLValue] = useState("");
  const [myAccountValue, setMyAccountValue] = useState("");
  const [assetIDValue, setAssetIDValue] = useState("");
  const [landOwnerValue, setLandOwnerValue] = useState("loading...");
  const [collectionIDValue, setCollectionIDValue] = useState("");
  const [royalCollectionIDValue, setRoyalCollectionIDValue] = useState("0");
  const [royalTokenIDValue, setRoyalTokenIDValue] = useState("0");
  const [royalTokenURIValue, setRoyalTokenURIValue] = useState("");
  const [royalBalanceValue, setRoyalBalanceValue] = useState("");
  const [derivativeBalanceValue, setDerivativeBalanceValue] = useState("");
  const [jsonKeyValue, setJsonKeyValue] = useState("0_0");
  const [selectedRoyalCollectionID, setSelectedRoyalCollectionID] = useState<
    String
  >();
  const [selectedRoyalTokenID, setSelectedRoyalTokenID] = useState<String>();
  const [
    selectedDerivedCollectionAddress,
    setSelectedDerivedCollectionAddress,
  ] = useState<String>();
  const [selectedDerivedTokenID, setSelectedDerivedTokenID] = useState<
    String
  >();

  const fetchImage = async (uri: any) => {
    if (uri) {
      try {
        return fetch(uri)
          .then((response) => response.json())
          .then((data) => data.image);
      } catch (e) {}
    }
  };

  if (royalTokenURIValue) {
    fetchImage(royalTokenURIValue).then((imageURL) => {
      if (imageURL) setImageURLValue(imageURL);
    });
  }

  useEffect(() => {
    setMyAccountValue(account ? account.toString() : "");
  }, [account]);

  useEffect(() => {
    setAssetIDValue(assetID ? assetID.toString() : "");
  }, [assetID]);

  useEffect(() => {
    setLandOwnerValue(landOwner ? landOwner.toString() : "loading...");
  }, [landOwner]);

  useEffect(() => {
    setCollectionIDValue(collectionID ? collectionID.toString() : "");
  }, [collectionID]);

  useEffect(() => {
    setRoyalCollectionIDValue(
      royalData && royalData.collectionID
        ? royalData.collectionID.toString()
        : "0"
    );
    setRoyalTokenIDValue(
      royalData && royalData.tokenID ? royalData.tokenID.toString() : "0"
    );
    setJsonKeyValue(royalCollectionIDValue + "_" + royalTokenIDValue);
  }, [royalData]);

  useEffect(() => {
    setRoyalTokenURIValue(
      royalTokenURI &&
        royalData.collectionID.toString() !== "" &&
        royalData.tokenID.toString() !== ""
        ? royalTokenURI.toString()
        : ""
    );
  }, [royalTokenURI]);

  useEffect(() => {
    setRoyalBalanceValue(royalBalance ? royalBalance.toString() : "");
  }, [royalBalance]);

  useEffect(() => {
    setDerivativeBalanceValue(
      derivativeBalance ? derivativeBalance.toString() : ""
    );
  }, [derivativeBalance]);

  useEffect(() => {
    if (royalNFTState) doPostTransaction(royalNFTState);
  }, [royalNFTState]);

  useEffect(() => {
    if (derivedNFTState) doPostTransaction(derivedNFTState);
  }, [derivedNFTState]);

  const handleClaim = () => {
    onClaim(landX, landY, collectionIDValue);
    onClose();
  };

  const onRoyalImageChanged = (collectionID: any, tokenID: any) => {
    setSelectedRoyalCollectionID(collectionID);
    setSelectedRoyalTokenID(tokenID);
  };

  const onDerivedImageChanged = (collectionAddress: any, tokenID: any) => {
    setSelectedDerivedCollectionAddress(collectionAddress);
    setSelectedDerivedTokenID(tokenID);
  };

  const handleChooseRoyalNFT = async () => {
    console.log("selectedRoyalCollectionID", selectedRoyalCollectionID);
    console.log("selectedRoyalTokenID", selectedRoyalTokenID);
    onClose();
    try {
      await updateRoyal(
        landX,
        landY,
        selectedRoyalCollectionID,
        selectedRoyalTokenID,
        {
          value: utils.parseEther("0"),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChooseDerivedNFT = async () => {
    onClose();
    try {
      await updateDerived(
        landX,
        landY,
        selectedDerivedCollectionAddress,
        selectedDerivedTokenID,
        {
          value: utils.parseEther("0"),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose} colorScheme="linkedin">
        <ModalOverlay />
        <ModalContent
          style={{
            width: isMobile ? "85%" : "100%",
            margin: "auto",
            color: "white",
          }}
        >
          <ModalHeader style={{ backgroundColor: "mediumseagreen" }}>
            Land {landX}, {landY}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex color="white" direction="column">
              <Flex color="white" display="flex" alignItems="center">
                {isClaimed === "1" &&
                imageURLValue &&
                royalTokenURIValue &&
                royalData.collectionID &&
                royalData.tokenID &&
                (royalData.collectionID.toString() !== "0" ||
                  royalData.tokenID.toString() !== "0") ? (
                  imageURLValue.includes("mp4") ? (
                    <Box
                      as="iframe"
                      title="royal NFT"
                      src={imageURLValue}
                      allowFullScreen
                      width={isMobile ? "100px" : "200px"}
                      height={isMobile ? "100px" : "200px"}
                      marginRight="10px"
                    />
                  ) : (
                    <Image
                      src={imageURLValue}
                      alt="Segun Adebayo"
                      width={isMobile ? "100px" : "200px"}
                      height={isMobile ? "100px" : "200px"}
                      marginRight="10px"
                    />
                  )
                ) : (
                  <Image
                    src="/emptyImg.png"
                    alt="Segun Adebayo"
                    width={isMobile ? "100px" : "200px"}
                    height={isMobile ? "100px" : "200px"}
                    marginRight="10px"
                  />
                )}
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  display="flex"
                  alignItems="center"
                >
                  <Flex direction="column" padding="0">
                    <Box
                      display="flex"
                      alignItems="baseline"
                      justifyContent="flex-start"
                      padding="5px"
                    >
                      <Box
                        color="gray.500"
                        fontWeight="semibold"
                        fontSize="xl"
                        marginRight="5px"
                        ml="2"
                      >
                        Status
                      </Box>
                      {isClaimed === "1" ? (
                        <Badge borderRadius="full" px="3" colorScheme="teal">
                          Claimed ✓
                        </Badge>
                      ) : (
                        <Badge borderRadius="full" px="3" colorScheme="red">
                          Not claimed ✖
                        </Badge>
                      )}
                    </Box>
                    <Box
                      display="flex"
                      alignItems="baseline"
                      justifyContent="flex-start"
                      padding="5px"
                    >
                      <Avatar margin="auto 10px">
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </Avatar>
                      <Box
                        color="gray.500"
                        margin="auto 15px"
                        fontWeight="1000"
                      >
                        Owner
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="baseline"
                      justifyContent="space-around"
                      padding="5px"
                      marginTop="10px"
                      color="gray"
                      fontWeight="1000"
                    >
                      {isClaimed === "1"
                        ? landOwnerValue.substring(0, 8) +
                          "..." +
                          landOwnerValue.substring(33)
                        : "No owner"}
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              <Box
                overflowX="auto"
                d="flex"
                h="100%"
                whiteSpace="nowrap"
                pb="4px"
                px="5px"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "1px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "1px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    width: "1px",
                    background: "#707070",
                    borderRadius: "5px",
                  },
                }}
              >
                {Array.from(
                  { length: parseInt(derivativeBalanceValue) },
                  (_, i) => 0 + i
                ).map((index) => {
                  return (
                    <ClaimedDerivedImage
                      assetID={assetIDValue}
                      index={index}
                      key={index}
                    />
                  );
                })}
              </Box>
              {/* Royal NFT Section*/}
              <Accordion
                allowMultiple
                style={{
                  backgroundColor: "transparent",
                  color: "green",
                  width: "100%",
                  marginTop: "20px",
                  boxShadow: "none",
                }}
                hidden={myAccountValue === landOwnerValue ? false : true}
              >
                <AccordionItem>
                  <h2>
                    <AccordionButton style={{ boxShadow: "none" }}>
                      <Box flex="1" textAlign="left">
                        Choose Royal NFT
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex
                      overflowX="auto"
                      direction="column"
                      padding="0"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        padding: "0",
                      }}
                    >
                      {Array.from(
                        { length: parseInt(royalBalanceValue) },
                        (_, i) => 0 + i
                      ).map((index) => {
                        return (
                          <RoyalImage
                            account={account}
                            index={index}
                            collectionID={collectionIDValue}
                            onRoyalImageChanged={onRoyalImageChanged}
                            key={index}
                          />
                        );
                      })}
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          color: "green",
                          border: "solid 1px green",
                          width: "40%",
                          marginTop: "20px",
                          marginBottom: "20px",
                          boxShadow: "none",
                        }}
                        onClick={handleChooseRoyalNFT}
                      >
                        Choose
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              {/* Derivative NFT Section*/}
              <Accordion
                allowMultiple
                style={{
                  backgroundColor: "transparent",
                  color: "purple",
                  width: "100%",
                  marginTop: "20px",
                  boxShadow: "none",
                  pointerEvents:
                    parseInt(royalCollectionIDValue) !== 0 ||
                    parseInt(royalTokenIDValue) !== 0
                      ? "all"
                      : "none",
                }}
                hidden={myAccountValue === landOwnerValue ? false : true}
              >
                <AccordionItem>
                  <h2>
                    <AccordionButton style={{ boxShadow: "none" }}>
                      <Box flex="1" textAlign="left">
                        Add Derivative NFT
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex
                      overflowX="auto"
                      direction="column"
                      padding="0"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        padding: "0",
                      }}
                    >
                      {Array.from(
                        {
                          length: pairsJson[jsonKeyValue]
                            ? pairsJson[jsonKeyValue].length
                            : 0,
                        },
                        (_, i) => 0 + i
                      ).map((index) => {
                        return (
                          <DerivedImage
                            index={index}
                            collectionAddress={
                              pairsJson[jsonKeyValue][index].collectionAddress
                            }
                            tokenID={pairsJson[jsonKeyValue][index].tokenID}
                            onDerivedImageChanged={onDerivedImageChanged}
                            key={index}
                          />
                        );
                      })}
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          color: "green",
                          border: "solid 1px green",
                          width: "40%",
                          marginTop: "20px",
                          marginBottom: "20px",
                          boxShadow: "none",
                        }}
                        onClick={handleChooseDerivedNFT}
                      >
                        Add
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </ModalBody>

          <ModalFooter
            style={{
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button
              style={{
                backgroundColor: "mediumseagreen",
                marginRight: "20px",
                width: "40%",
              }}
              onClick={handleClaim}
              disabled={isClaimed === "1" || collectionIDValue === ""}
            >
              Claim
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                border: "solid 1px mediumseagreen",
                width: "40%",
                color: "mediumaquamarine",
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
