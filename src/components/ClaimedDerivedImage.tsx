import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import {
  GetCollectionIDByAddress,
  GetDerivativeByIndex,
  GetLandMetaData,
} from "../hooks";

type Props = {
  assetID: any;
  index: any;
};

export default function ClaimedDerivedImage({ assetID, index }: Props) {
  const derivedMetaData = GetDerivativeByIndex(assetID, index);
  const collectionID = GetCollectionIDByAddress(
    derivedMetaData.collectionAddress
  );
  const tokenURI = GetLandMetaData(collectionID, derivedMetaData.tokenID);

  const [tokenURIValue, setTokenURIValue] = useState("");
  const [imageURLValue, setImageURLValue] = useState("");

  useEffect(() => {
    setTokenURIValue(tokenURI ? tokenURI.toString() : "");
  }, [tokenURI]);

  const fetchImage = async (uri: any) => {
    return fetch(uri)
      .then((response) => response.json())
      .then((data) => data.image);
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
            <Box
              as="iframe"
              title="derivatives"
              src={imageURLValue}
              width="100px"
              height="100px"
              marginLeft="10px"
              marginRight="10px"
            />
          </Box>
        ) : (
          <Box>
            <Image
              src={imageURLValue}
              alt="Derived NFT Image"
              width="100px"
              height="100px"
              minWidth="100px"
              minHeight="100px"
              marginLeft="10px"
              marginRight="10px"
            />
          </Box>
        )
      ) : (
        <Box>
          <Image
            src="/emptyImg.png"
            alt="Derived NFT Image"
            width="100px"
            height="100px"
            minWidth="100px"
            minHeight="100px"
            marginLeft="10px"
            marginRight="10px"
          />
        </Box>
      )}
    </div>
  );
}
