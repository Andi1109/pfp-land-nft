import { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import "./RoyalImage.css";

type Props = {
  index: any;
  collectionID: any;
  tokenID: any;
  imageURLValue: any;
  onRoyalImageChanged: any;
};

export default function RoyalImageHonorary({
  index,
  collectionID,
  tokenID,
  imageURLValue,
  onRoyalImageChanged,
}: Props) {
  console.log(collectionID, tokenID, imageURLValue);

  const handleRoyalImageChanged = () => {
    onRoyalImageChanged(collectionID, tokenID, imageURLValue);
  };

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
