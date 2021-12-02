import {
  GetTokenByIndex,
  GetRoyalMetaDataOfLand,
  GetMetaDataAtCollection,
  GetTotalDerivativeBalance,
} from "../hooks";
import { useState, useEffect } from "react";

type Props = {
  index: number;
  onFoundLand: Function;
};

export default function LandRoyal({ index, onFoundLand }: Props) {
  const land = GetTokenByIndex(index);
  const derivativeBalance = GetTotalDerivativeBalance(land);
  console.log("landRoyal tokenID is ", land);
  const royalData = GetRoyalMetaDataOfLand(land);
  const royalTokenURI = GetMetaDataAtCollection(
    royalData.collectionID,
    royalData.tokenID
  );

  const [landX, setLandX] = useState(0);
  const [landY, setLandY] = useState(0);
  const [derivativeBalanceValue, setDerivativeBalanceValue] = useState("");

  useEffect(() => {
    if (land && land.toNumber() > 10000) {
      setLandX(Math.ceil((land.toNumber() - 10000) / 100));
      setLandY(land.toNumber() - 10000 - (landX - 1) * 100);
      setDerivativeBalanceValue(
        derivativeBalance ? derivativeBalance.toString() : ""
      );
    }
  }, [land]);

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
          if (imageURL)
            onFoundLand({
              x: landX,
              y: landY,
              derivative: derivativeBalanceValue,
              src: imageURL,
            });
        });
      }
    }
  };

  getRoyalTokenURIValue();

  return <></>;
}
