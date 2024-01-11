import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useState } from "react";

const NFT: NextPage = () => {

    const [allocatorAddress, setAllocatorAddress] = useState("0x0000000000000000000000000000000000000000");
    const [id, setId] = useState('0');

    const { writeAsync: mint, isLoading: alloLoading, isMining } = useScaffoldContractWrite({
        contractName: "AllocatorNFT",
        functionName: "mintNFT",
        args: [allocatorAddress],
        blockConfirmations: 1,
        onBlockConfirmation: txnReceipt => {
          console.log("Transaction blockHash", txnReceipt.blockHash);
        },
      });

    const { data: ownerAddress } = useScaffoldContractRead({
        contractName: "AllocatorNFT",
        functionName: "ownerOf",
        args: [BigInt(id)],
    });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 w-full">
            <label className="form-control w-full max-w-md">
                <div className="label">
                    <span className="label-text">What's the Allocator address?</span>
                </div>
                <input type="text" placeholder="Type Here" value={allocatorAddress} className="input input-bordered w-full" onChange={(e) => setAllocatorAddress(e.target.value)}/>
                
            </label>
            <button className="btn btn-primary" onClick={mint}>Mint!</button>
        <label className="form-control w-full max-w-md pt-10">
            <div className="label">
                <span className="label-text">Get owner of NFT by index</span>
            </div>
            <input type="text" placeholder="Type here" value={id} className="input input-bordered w-xs max-w-xs" onChange={(e) => setId(e.target.value)} />
        </label>
        <div className="chat chat-end">
            <div className="chat-bubble max-w-xl">{ownerAddress?.toString()}</div>
        </div>
      </div>
    </>
  );
};

export default NFT;
