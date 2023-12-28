import Header from "./components/Header";
import TransferMoney from "./components/TransferMoney";
import Home from "./components/Home";
import History from "./components/History";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/index.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState, useEffect } from "react";
const { ethers } = require("ethers");

export default function App() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [block, setBlock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts");
        const signer = provider.getSigner();
        const myAddress = await signer.getAddress();
        const a = await provider.getBlockNumber(myAddress);
        // console.log(a)
        var balance = await signer.getBalance();

        const ethbalance = ethers.utils.formatUnits(balance, 18);
        const formattedNumber = ethbalance.toString().slice(0, 6);
        setAccountBalance(formattedNumber);
        setAddress(myAddress);
      } catch (error) {
        alert("Lỗi truy xuất các khối mới nhất:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLatestBlocks() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Lấy số khối hiện tại
        const latestBlockNumber = await provider.getBlockNumber();
        // Lấy 10 khối gần nhất
        const latestBlocks = [];
        for (let i = 0; i < 0; i++) {
          const blockNumber = latestBlockNumber - i;
          const block = await provider.getBlock(blockNumber);
          latestBlocks.push(block);
        }

        setBlock(latestBlocks);
      } catch (error) {
        alert("Lỗi truy xuất các khối mới nhất:", error);
      }
    }

    fetchLatestBlocks();
  }, []);
  const addTransactionToHistory = async (
    sender,
    recipient,
    amount,
    timestamp,
    txHash,
    imgs
  ) => {
    setBlock((prevBlock) => [
      { sender, recipient, amount, timestamp, txHash, imgs },
      ...prevBlock,
    ]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Header accountBalance={accountBalance} address={address} />}
        >
          <Route path="home" element={<Home />} />
          <Route
            path="transfermony"
            element={
              <TransferMoney
                accountBalance={accountBalance}
                address={address}
                addTransactionToHistory={addTransactionToHistory}
              />
            }
          />
          <Route path="history" element={<History block={block} />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
