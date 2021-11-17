import { useEffect } from "react";
import { GetTokenByIndex } from "../hooks";

type Props = {
  index: number;
  onFoundLand: Function;
};

export default function LandDetail({ index, onFoundLand }: Props) {
  const land = GetTokenByIndex(index);
  useEffect(() => {
    if (land && land.toNumber() > 10000) {
      const landX = Math.ceil((land.toNumber() - 10000) / 100);
      const landY = land.toNumber() - 10000 - (landX - 1) * 100;
      onFoundLand({ x: landX, y: landY });
    }
  }, [land]);

  return <></>;
}
