import { Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Identicon from "./Identicon";

type Props = {
  handleOpenModal: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Box className="connectBox">
      <div className="balText">
        {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
      </div>
      <button className="connectbtn" onClick={handleOpenModal}>
        <div className="accountAdd">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </div>
        <Identicon />
      </button>
    </Box>
  ) : (
    <button className="connectbtn handlebtn" onClick={handleConnectWallet}>
      Connect to a wallet
    </button>
  );
}
