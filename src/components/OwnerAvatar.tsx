import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

const StyledAvatar = styled.div`
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background-color: #3333cc;
`;

const blackhole: any = "0x0000000000000000000000000000000000000000";

type Props = {
  ownerAddress: any;
};

export default function OwnerAvatar({ ownerAddress }: Props) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ownerAddress && ref.current) {
      ref.current.innerHTML = "";
      if (ownerAddress !== blackhole) {
        ref.current.appendChild(
          Jazzicon(48, parseInt(ownerAddress.slice(2, 10), 16))
        );
      }
    }
  }, [ownerAddress]);

  return <StyledAvatar ref={ref as any} />;
}
