import { useState } from "react";
import { GetLandOfByIndex, DecodeTokenID } from "../hooks";

type Props = {
  account: any;
  index: any;
};

export default function Land({ account, index }: Props) {
  // const [imageSrc, setImageSrc] = useState("");
  const encodedLand = GetLandOfByIndex(account, index);
  const decodedLandJson = DecodeTokenID(encodedLand);
  const { decodedX, decodedY } = decodedLandJson;
  console.log(decodedX, decodedY);

  return <div />;
}
