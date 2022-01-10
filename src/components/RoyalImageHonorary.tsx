import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { GetLandMetaData } from "../hooks";
import "./RoyalImage.css";

type Props = {
  index: any;
  collectionID: any;
  tokenID: any;
  onRoyalImageChanged: any;
};

export default function RoyalImageHonorary({
  index,
  collectionID,
  tokenID,
  onRoyalImageChanged,
}: Props) {
  const tokenURI = GetLandMetaData(collectionID, tokenID);

  const [tokenURIValue, setTokenURIValue] = useState("");
  const [imageURLValue, setImageURLValue] = useState("");

  // if (index === 0 && newCollectionIDValue && tokenIDValue) {
  //   onRoyalImageChanged(newCollectionIDValue, tokenIDValue);
  // }

  useEffect(() => {
    setTokenURIValue(tokenURI ? tokenURI.toString() : "");
  }, [tokenURI]);

  const convertUrlForIpfs = (uri: any) => {
    if (uri.includes("ipfs://")) {
      return "https://gateway.pinata.cloud/ipfs/" + uri.split("//")[1];
    } else {
      return uri;
    }
  };

  const fetchImage = async (uri: any) => {
    const converted = convertUrlForIpfs(uri);
    return fetch(converted, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => data.image);
  };

  const handleRoyalImageChanged = () => {
    onRoyalImageChanged(collectionID, tokenID, imageURLValue);
  };

  if (tokenURIValue) {
    fetchImage(tokenURIValue).then((imageURL) => {
      if (imageURL) {
        const converted = convertUrlForIpfs(imageURL);
        setImageURLValue(converted);
      }
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
                backgroundImage="loading.png"
                backgroundPosition="center center"
                backgroundRepeat="no-repeat"
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
              // src="/emptyImg.png"
              backgroundImage="loading.png"
              backgroundPosition="center center"
              backgroundRepeat="no-repeat"
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
