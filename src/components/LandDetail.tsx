import { useState, useEffect } from "react";
import { GetLandsByIndex } from "../hooks";

type Props = {
  index: number;
  onFoundLand: Function;
};

export default function LandDetail({ index, onFoundLand }: Props) {
  const land = GetLandsByIndex(index);
  const [landX, setLandX] = useState(-1);
  const [landY, setLandY] = useState(-1);
  useEffect(() => {
    setLandX(land.landX ? land.landX.toNumber() : -1);
    setLandY(land.landY ? land.landY.toNumber() : -1);
    onFoundLand({ x: landX, y: landY });
  }, [land]);

  return <></>;
}
