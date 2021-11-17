import { Box, Text } from "@chakra-ui/react";

export default function ConnectButton() {
  const isMobile = window.screen.width <= window.screen.height ? true : false;
  return (
    <Box display="flex" alignItems="center" py="0" marginLeft="20px">
      {isMobile ? (
        <></>
      ) : (
        <Text color="white" fontSize="md">
          To see more lands, move your mouse up or down
        </Text>
      )}
    </Box>
  );
}
