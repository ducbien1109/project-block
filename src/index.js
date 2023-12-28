import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as WagmiProvider } from "wagmi";
import { connectors } from "./connectors";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ChakraProvider>
      <WagmiProvider autoConnect connectors={connectors}>
        <App />
      </WagmiProvider>
    </ChakraProvider>
  </StrictMode>,
  rootElement
);
