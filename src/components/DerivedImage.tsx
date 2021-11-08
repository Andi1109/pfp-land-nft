import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { GetCollectionIDByAddress, GetLandMetaData } from "../hooks";
import "./RoyalImage.css";

type Props = {
  index: any;
  collectionAddress: any;
  tokenID: any;
  onDerivedImageChanged: any;
};

export default function DerivedImage({
  index,
  collectionAddress,
  tokenID,
  onDerivedImageChanged,
}: Props) {
  const collectionID = GetCollectionIDByAddress(collectionAddress);
  const tokenURI = GetLandMetaData(collectionID, tokenID);

  const [tokenURIValue, setTokenURIValue] = useState("");
  const [imageURLValue, setImageURLValue] = useState("");

  if (index == 0) onDerivedImageChanged(collectionAddress, tokenID);

  useEffect(() => {
    setTokenURIValue(tokenURI ? tokenURI.toString() : "");
  }, [tokenURI]);

  const fetchImage = async (uri: any) => {
    return fetch(uri)
      .then((response) => response.json())
      .then((data) => data.image);
  };

  const handleDerivedImageChanged = () => {
    onDerivedImageChanged(collectionAddress, tokenID);
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
              id={"derivedNFT" + index}
              name="derivedNFT"
              value={index}
              defaultChecked={index === 0}
              onChange={handleDerivedImageChanged}
            />
            <label htmlFor={"derivedNFT" + index}>
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
              id={"derivedNFT" + index}
              name="derivedNFT"
              value={index}
              defaultChecked={index === 0}
              onChange={handleDerivedImageChanged}
            />
            <label htmlFor={"derivedNFT" + index}>
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
            id={"derivedNFT" + index}
            name="derivedNFT"
            value={index}
            defaultChecked={index === 0}
            onChange={handleDerivedImageChanged}
          />
          <label htmlFor={"derivedNFT" + index}>
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
