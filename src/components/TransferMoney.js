import React, { useState, useEffect } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { FaExchangeAlt } from "react-icons/fa";
import "../index.css";
import { ToastContainer, toast } from "react-toastify";
import transactionHistoryABI from "./TransactionHistory.json";
const { ethers } = require("ethers");
const TransferMoney = (props) => {
  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const { address, addTransactionToHistory } = props;
  const [txSent, setTxSent] = useState(null);
  const [imgs, setImgs] = React.useState(true);
  const [sender, setSender] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [currency, setCurrency] = React.useState("ETH");

  const ethToBtcRate = 0.05417; // Tỷ giá ETH/BTC cố định
  const convertToBtc = () => {
    if (currency === "ETH") {
      return amount * ethToBtcRate;
    } else if (currency === "BTC") {
      return amount;
    }
  };

  const convertToEth = () => {
    if (currency === "ETH") {
      return amount;
    } else if (currency === "BTC") {
      return amount / ethToBtcRate;
    }
  };

  const handleSenderChange = (event) => {
    setSender(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setAmount("");
  };
  const handleSendImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgs(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Địa chỉ của smart contract sau khi triển khai
  const contract = new ethers.Contract(contractAddress, transactionHistoryABI, Provider.getSigner());
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Provider.send("eth_requestAccounts");
      const signer = Provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });

      const receipt = await tx.wait();
      const txHash = receipt.transactionHash;

      toast.success(`Giao dịch chuyển tiền thành công: ${txHash}`, {
        position: toast.POSITION.TOP_LEFT,
        className: "toast-message",
      });
      await contract.recordTransaction(txHash);

      // Thêm giao dịch vào lịch sử
      const timestamp = new Date().getTime();
      console.log("Images:", imgs);
      addTransactionToHistory(
        address,
        recipient,
        amount,
        timestamp,
        txHash,
        imgs
      );

      // Reset input values
      setSender("");
      setRecipient("");
      setAmount("");
      setCurrency("ETH");
    } catch (error) {
      toast.error(`Lỗi trong quá trình chuyển tiền: ${error.message}`, {
        position: toast.POSITION.TOP_LEFT,
        className: "toast-message",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label className="block mb-2">
            <span>
              {" "}
              NGƯỜI GỬI:{" "}
              <span
                style={{ fontWeight: "bold", color: "gray", marginLeft: 110 }}
              >
                {address &&
                  `${address.slice(0, 8)}...${address.slice(
                    address.length - 10,
                    address.length
                  )}`}
              </span>
            </span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              value={address}
              disabled
              onChange={handleSenderChange}
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <span>
              {" "}
              Image:{" "}
              <span
                style={{ fontWeight: "bold", color: "gray", marginLeft: 110 }}
              ></span>
            </span>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleSendImg}
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <span>
              {" "}
              NGƯỜI NHẬN:{" "}
              <span
                style={{ fontWeight: "bold", color: "gray", marginLeft: 90 }}
              >
                {recipient &&
                  `${recipient.slice(0, 8)}...${recipient.slice(
                    recipient.length - 10,
                    recipient.length
                  )}`}
              </span>
            </span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              value={recipient}
              onChange={handleRecipientChange}
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Tiền tệ:
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
              {/* Thêm các loại tiền khác vào đây */}
            </select>
            <div></div>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <span>
              {" "}
              Số Lượng:{" "}
              <span
                style={{ fontWeight: "bold", color: "gray", marginLeft: 100 }}
              >
                {currency === "ETH"
                  ? convertToBtc() + " BTC"
                  : convertToEth() + " ETH"}
              </span>
            </span>
            <div className="relative">
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring focus:border-blue-300 pl-10"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                required
              />
              <div className="absolute left-3 top-2">
                <HiOutlineCurrencyDollar className="text-gray-400" />
              </div>
            </div>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 flex items-center"
        >
          <FaExchangeAlt className="mr-1" /> Chuyển Tiền
        </button>
        <text>{txSent ? txSent : " "}</text>
      </form>
    </>
  );
};

export default TransferMoney;
