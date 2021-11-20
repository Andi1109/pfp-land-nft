import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

const StyledAvatar = styled.div`
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background-color: #3333cc;
`;

export default function OwnerAvatar() {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(48, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledAvatar ref={ref as any} />;
}
