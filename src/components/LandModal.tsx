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
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  EncodeTokenID,
  GetLandOwnerOf,
  CollectionIDAt,
  GetRoyalMetaDataOfLand,
  GetMetaDataAtCollection,
} from "../hooks";
import { useEthers } from "@usedapp/core";
import { ReactNode, useState, useEffect } from "react";

type Props = {
  children: ReactNode;
  onClaim: Function;
  isMobile: boolean;
};

export default function LandModal({ children, onClaim, isMobile }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isClaimed = document.getElementById("isClaimedLand")?.innerHTML;
  const landX = document.getElementById("selectedLandX")?.innerHTML;
  const landY = document.getElementById("selectedLandY")?.innerHTML;
  const [imageURLValue, setImageURLValue] = useState("");
  const { account } = useEthers();
  let assetID = EncodeTokenID(landX, landY);
  let landOwner = GetLandOwnerOf(assetID);
  const collectionID = CollectionIDAt(landX, landY);
  const royalData = GetRoyalMetaDataOfLand(assetID);
  const royalTokenURI = GetMetaDataAtCollection(
    royalData.collectionID,
    royalData.tokenID
  );

  const [myAccountValue, setMyAccountValue] = useState("");
  const [landOwnerValue, setLandOwnerValue] = useState("loading...");
  const [collectionIDValue, setCollectionIDValue] = useState("");
  const [royalTokenURIValue, setRoyalTokenURIValue] = useState("");

  const fetchImage = async (uri: any) => {
    return fetch(uri)
      .then((response) => response.json())
      .then((data) => data.image);
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
    setLandOwnerValue(landOwner ? landOwner.toString() : "loading...");
  }, [landOwner]);

  useEffect(() => {
    setCollectionIDValue(collectionID ? collectionID.toString() : "");
  }, [collectionID]);

  useEffect(() => {
    setRoyalTokenURIValue(
      royalTokenURI &&
        royalData.collectionID.toNumber() != 0 &&
        royalData.tokenID.toNumber() != 0
        ? royalTokenURI.toString()
        : ""
    );
    console.log("royalTokenURIValue is ", royalTokenURIValue);
  }, [royalTokenURI]);

  const handleClaim = () => {
    onClaim(landX, landY, collectionIDValue);
  };

  const handleRoyalNFT = () => {};

  return (
    <div>
      {console.log("isMobile---", isMobile)}
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
              <Flex color="white">
                {isClaimed === "1" && imageURLValue && royalTokenURIValue ? (
                  imageURLValue.includes("mp4") ? (
                    <Box
                      as="iframe"
                      title="royal NFT"
                      src={imageURLValue}
                      allowFullScreen
                      width="200px"
                      height="200px"
                      marginRight="30px"
                    />
                  ) : (
                    <Image
                      src={imageURLValue}
                      alt="Segun Adebayo"
                      width="200px"
                      height="200px"
                      marginRight="30px"
                    />
                  )
                ) : (
                  <Image
                    src="/emptyImg.png"
                    alt="Segun Adebayo"
                    width="200px"
                    height="200px"
                    marginRight="30px"
                  />
                )}
                <Flex
                  color="white"
                  direction="column"
                  style={{ justifyContent: "center", overflowWrap: "anywhere" }}
                >
                  <FormControl>
                    <FormLabel style={{ color: "green" }}>Status:</FormLabel>
                    <Input
                      style={{
                        height: "50%",
                        marginBottom: "20px",
                        opacity: "1",
                      }}
                      placeholder={
                        isClaimed === "1" ? "Claimed ✓" : "Not claimed ✖"
                      }
                      disabled
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormLabel style={{ color: "green" }}>Owner:</FormLabel>
                    <Input
                      style={{
                        height: "50%",
                        marginBottom: "20px",
                        opacity: "1",
                      }}
                      placeholder={
                        isClaimed === "1" ? landOwnerValue : "No owner"
                      }
                      disabled
                    />
                  </FormControl>
                </Flex>
              </Flex>
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "green",
                  border: "solid 1px green",
                  width: "100%",
                  marginTop: "20px",
                  boxShadow: "none",
                }}
                onClick={handleRoyalNFT}
                disabled={myAccountValue === landOwnerValue ? false : true}
              >
                Choose Royal NFT...
              </Button>
            </Flex>
          </ModalBody>

          <ModalFooter style={{ justifyContent: "center" }}>
            <Button
              style={{
                backgroundColor: "mediumseagreen",
                marginRight: "20px",
                width: "40%",
              }}
              onClick={handleClaim}
              disabled={isClaimed === "1" ? true : false}
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
