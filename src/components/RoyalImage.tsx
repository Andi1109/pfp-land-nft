import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { GetRoyalTokenOfOwnerByIndex, GetLandMetaData } from "../hooks";
import "./RoyalImage.css";

type Props = {
  account: any;
  index: any;
  collectionID: any;
  onRoyalImageChanged: any;
};

export default function RoyalImage({
  account,
  index,
  collectionID,
  onRoyalImageChanged,
}: Props) {
  const royalMetaData = GetRoyalTokenOfOwnerByIndex(
    account,
    index,
    collectionID
  );

  const tokenURI = GetLandMetaData(
    royalMetaData.newCollectionID,
    royalMetaData.tokenID
  );

  const [newCollectionIDValue, setNewCollectionIDValue] = useState("");
  const [tokenIDValue, setTokenIDValue] = useState("");
  const [tokenURIValue, setTokenURIValue] = useState("");
  const [imageURLValue, setImageURLValue] = useState("");

  // if (index === 0 && newCollectionIDValue && tokenIDValue) {
  //   onRoyalImageChanged(newCollectionIDValue, tokenIDValue);
  // }

  useEffect(() => {
    setTokenURIValue(tokenURI ? tokenURI.toString() : "");
  }, [tokenURI]);

  useEffect(() => {
    setNewCollectionIDValue(
      royalMetaData && royalMetaData.newCollectionID
        ? royalMetaData.newCollectionID.toString()
        : ""
    );
    setTokenIDValue(
      royalMetaData && royalMetaData.tokenID
        ? royalMetaData.tokenID.toString()
        : ""
    );
  }, [royalMetaData]);

  const fetchImage = async (uri: any) => {
    return fetch(uri)
      .then((response) => response.json())
      .then((data) => data.image);
  };

  const handleRoyalImageChanged = () => {
    onRoyalImageChanged(newCollectionIDValue, tokenIDValue, imageURLValue);
  };

  if (tokenURIValue) {
    fetchImage(tokenURIValue).then((imageURL) => {
      if (imageURL) setImageURLValue(imageURL);
    });
  }

  return (
    <div style={{ margin: "10px auto" }}>
      {imageURLValue ? (
        imageURLValue.includes("mp4") ? (
          <Box>
            <input
              type="radio"
              id={"royalNFT" + index}
              name="royalNFT"
              value={index}
              onChange={handleRoyalImageChanged}
            />
            <label htmlFor={"royalNFT" + index}>
              <Box
                as="iframe"
                title="derivatives"
                src={imageURLValue}
                width="200px"
                height="200px"
                marginLeft="30px"
                marginRight="30px"
              />
            </label>
          </Box>
        ) : (
          <Box>
            <input
              type="radio"
              id={"royalNFT" + index}
              name="royalNFT"
              value={index}
              onChange={handleRoyalImageChanged}
            />
            <label htmlFor={"royalNFT" + index}>
              <Image
                src={imageURLValue}
                alt="Royal NFT Image"
                width="200px"
                height="200px"
                minWidth="200px"
                minHeight="200px"
                marginLeft="30px"
                marginRight="30px"
              />
            </label>
          </Box>
        )
      ) : (
        <Box>
          <input
            type="radio"
            id={"royalNFT" + index}
            name="royalNFT"
            value={index}
            onChange={handleRoyalImageChanged}
          />
          <label htmlFor={"royalNFT" + index}>
            <Image
              src="/emptyImg.png"
              alt="Royal NFT Image"
              width="200px"
              height="200px"
              marginLeft="30px"
              marginRight="30px"
            />
          </label>
        </Box>
      )}
    </div>
  );
}
