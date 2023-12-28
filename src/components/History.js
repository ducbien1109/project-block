import React from "react";
import { Image } from "antd";
const History = (props) => {
  const { block } = props;

  console.log("Block data:", block);

  if (!block) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Lịch sử giao dịch</h1>
      {block.map((block) => (
        <div key={block.number} className="bg-white shadow-md p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Hash: {block.txHash}</h2>
          <p>
            <span className="font-bold">Người gửi:</span> {block.sender}
          </p>
          Hợp đồng: 
          <figure
          width={200}
            src={block.imgs}
            alt=""
            className="font-bold"
          />
    
          <p>
            <span className="font-bold">Người nhận:</span> {block.recipient}
          </p>
          <p>
            <span className="font-bold">Số tiền:</span> {block.amount} ETH
          </p>
          <p>
            <span className="font-bold">Thời gian:</span>{" "}
            {new Date(block.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default History;

//0xAFa91142196443C868a0E5e4ec544220cb412aFb
