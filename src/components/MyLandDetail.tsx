import { useState, useEffect } from "react";
import { GetMyLandsByIndex } from "../hooks";

type Props = {
  owner: any;
  index: number;
  onFoundLand: Function;
};

export default function MyLandDetail({ owner, index, onFoundLand }: Props) {
  const land = GetMyLandsByIndex(owner, index);
  const [landX, setLandX] = useState(-1);
  const [landY, setLandY] = useState(-1);

  useEffect(() => {
    setLandX(land.decodedX ? land.decodedX.toNumber() : -1);
    setLandY(land.decodedY ? land.decodedY.toNumber() : -1);
    onFoundLand({ x: landX, y: landY });
  }, [land]);

  return <></>;
}
