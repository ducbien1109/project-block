import {} from "react-router-dom";
import { useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Spacer,
  Box,
  Flex,
  Image,
  Icon,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

import SelectWalletModal from "../Modal";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { truncateAddress } from "../utils";
import {
  useConnect,
  useAccount,
  useNetwork,
  useSignMessage,
  useBalance,
} from "wagmi";

export default function Home() {
  function Identicon() {
    const ref = useRef < HTMLDivElement > null;
    useEffect(() => {
      if (accountData.address && ref.current) {
        ref.current.innerHTML = "";
        ref.current.appendChild(
          Jazzicon(16, parseInt(accountData.address.slice(2, 10), 16))
        );
      }
    }, [accountData.address]);

    return <StyledIdenticon refs={ref} />;
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: balanceData }] = useBalance();
  const [{ data: networkData }, switchNetwork] = useNetwork();
  const [message, setMessage] = useState("");
  const [{ data: signData }, signMessage] = useSignMessage({
    message,
  });
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  return (
    <>
      <VStack justifyContent="center" alignItems="center" h="100vh">
        <HStack marginBottom="10px">
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            {!connectData.connected ? "VUI LÒNG KẾT NỐI VÍ " : "BẠN ĐÃ KẾT NỐI"}
          </Text>

          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            !
          </Text>
        </HStack>
        <HStack>
          {!connectData.connected ? (
            <Button onClick={onOpen}>KẾT NỐI TỚI VÍ</Button>
          ) : (
            <Button onClick={disconnect}>HUỶ KẾT NỐI VÍ</Button>
          )}
        </HStack>
        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Tình trạng kết nối:: `}</Text>
            {connectData.connected ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>

          {!accountData ? (
            <Text>TÀI KHOẢN: Không Tài Khoản</Text>
          ) : (
            <Tooltip label={accountData.address} placement="right">
              <Text>{`Account: ${truncateAddress(accountData.address)}`}</Text>
            </Tooltip>
          )}
          <Text>{`ID MẠNG: ${
            networkData.chain ? networkData.chain.id : "Không có mạng"
          }`}</Text>
        </VStack>
        {connectData.connected && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button
                  onClick={async () => await signMessage()}
                  isDisabled={!message}
                >
                  Sign Message
                </Button>
                <Input
                  placeholder="Set Message"
                  maxLength={20}
                  onChange={handleInput}
                  w="140px"
                />
                {signData ? (
                  <Tooltip label={signData} placement="bottom">
                    <Text>{`Signature: ${truncateAddress(signData)}`}</Text>
                  </Tooltip>
                ) : null}
              </VStack>
            </Box>
          </HStack>
        )}
        <Text>{error ? error.message : null}</Text>
      </VStack>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}
