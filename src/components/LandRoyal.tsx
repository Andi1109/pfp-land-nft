import {
  GetLandsByIndex,
  EncodeTokenID,
  GetRoyalMetaDataOfLand,
  GetMetaDataAtCollection,
} from "../hooks";

type Props = {
  index: number;
  onFoundLand: Function;
};

export default function LandRoyal({ index, onFoundLand }: Props) {
  const land = GetLandsByIndex(index);
  const landX = land.landX ? land.landX.toNumber() : -1;
  const landY = land.landY ? land.landY.toNumber() : -1;
  const assetID = EncodeTokenID(landX, landY);
  const royalData = GetRoyalMetaDataOfLand(assetID);
  const royalTokenURI = GetMetaDataAtCollection(
    royalData.collectionID,
    royalData.tokenID
  );

  const fetchImage = async (uri: any) => {
    if (uri) {
      try {
        return fetch(uri)
          .then((response) => response.json())
          .then((data) => data.image);
      } catch (e) {}
    }
  };

  const getRoyalTokenURIValue = async () => {
    if (royalTokenURI) {
      if (
        royalData.collectionID.toString() === "0" &&
        royalData.tokenID.toString() === "0"
      ) {
        return;
      } else {
        fetchImage(royalTokenURI.toString()).then((imageURL) => {
          if (imageURL) onFoundLand({ x: landX, y: landY, src: imageURL });
        });
      }
    }
  };

  getRoyalTokenURIValue();

  return <></>;
}
