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
} from "@chakra-ui/react";
import {
  EncodeTokenID,
  GetLandOwnerOf,
  CollectionIDAt,
  GetRoyalMetaDataOfLand,
  GetMetaDataAtCollection,
} from "../hooks";
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
  let assetID = EncodeTokenID(landX, landY);
  let landOwner = GetLandOwnerOf(assetID);
  const collectionID = CollectionIDAt(landX, landY);
  const royalData = GetRoyalMetaDataOfLand(assetID);
  const royalTokenURI = GetMetaDataAtCollection(
    royalData.collectionID,
    royalData.tokenID
  );

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

  return (
    <div>
      {console.log("isMobile---", isMobile)}
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose} colorScheme="linkedin">
        <ModalOverlay />
        <ModalContent style={{ width: isMobile ? "85%" : "100%" }}>
          <ModalHeader>
            Land {landX}, {landY}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex color="white" direction="column">
              <Box w="100%" bg="gray.1000" marginBottom="5px">
                <Text color="black">
                  Status: {isClaimed === "1" ? "Claimed" : "Not claimed"}
                </Text>
              </Box>
              <Box w="100%" bg="gray.1000" marginBottom="5px">
                <Text color="black">
                  Owner: {isClaimed === "1" ? landOwnerValue : "No owner"}
                </Text>
              </Box>
              <Box w="100%" bg="gray.1000">
                <Text color="black">
                  Royal NFT: {isClaimed === "1" ? "" : "No royal NFT yet"}
                </Text>
                {isClaimed === "1" && imageURLValue && royalTokenURIValue ? (
                  imageURLValue.includes("mp4") ? (
                    <Box
                      as="iframe"
                      title="royal NFT"
                      src={imageURLValue}
                      allowFullScreen
                      width="200px"
                      height="200px"
                      marginLeft="30px"
                      marginRight="30px"
                    />
                  ) : (
                    <Image
                      src={imageURLValue}
                      alt="Segun Adebayo"
                      width="200px"
                      height="200px"
                      minWidth="200px"
                      minHeight="200px"
                      marginLeft="30px"
                      marginRight="30px"
                    />
                  )
                ) : (
                  <Image
                    src="/emptyImg.png"
                    alt="Segun Adebayo"
                    width="200px"
                    height="200px"
                    marginLeft="30px"
                    marginRight="30px"
                  />
                )}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              style={{
                backgroundColor: "rgb(0 140 255)",
                marginRight: "20px",
                width: "27%",
              }}
              onClick={handleClaim}
              disabled={isClaimed === "1" ? true : false}
            >
              Claim
            </Button>
            <Button style={{ backgroundColor: "#808080" }} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
