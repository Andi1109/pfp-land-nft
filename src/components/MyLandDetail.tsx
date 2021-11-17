import { useEffect } from "react";
import { GetTokenOfOwnerByIndex } from "../hooks";

type Props = {
  owner: any;
  index: number;
  onFoundLand: Function;
};

export default function MyLandDetail({ owner, index, onFoundLand }: Props) {
  const land = GetTokenOfOwnerByIndex(owner, index);

  useEffect(() => {
    if (land && land.toNumber() > 10000) {
      const landX = Math.ceil((land.toNumber() - 10000) / 100);
      const landY = land.toNumber() - 10000 - (landX - 1) * 100;
      onFoundLand({ x: landX, y: landY });
    }
  }, [land]);

  return <></>;
}
