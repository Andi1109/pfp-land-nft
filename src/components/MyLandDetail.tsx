import { useState, useEffect } from "react";
import { GetMyLandsByIndex, DecodeTokenID } from "../hooks";

type Props = {
  owner: any;
  index: number;
  onFoundLand: Function;
};

export default function MyLandDetail({ owner, index, onFoundLand }: Props) {
  const land = GetMyLandsByIndex(owner, index);
  const decodedLand = DecodeTokenID(land);
  const [landX, setLandX] = useState(-1);
  const [landY, setLandY] = useState(-1);

  useEffect(() => {
    setLandX(decodedLand.decodedX ? decodedLand.decodedX.toNumber() : -1);
    setLandY(decodedLand.decodedY ? decodedLand.decodedY.toNumber() : -1);
    console.log(landX, landY);
    onFoundLand({ x: landX, y: landY });
  }, [decodedLand]);

  return <></>;
}
