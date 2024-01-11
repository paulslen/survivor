import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { MetaHeader } from "~~/components/MetaHeader";
import { parseEther } from "viem";
import {
  useScaffoldContractRead,
  useDeployedContractInfo,
} from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { encodeAbiParameters, parseAbiParameters } from 'viem'

const Home: NextPage = () => {

  const [currentPoolId, setCurrentPoolId] = useState(2);
  const { data: survivorData } = useDeployedContractInfo("SurvivorStrategy");
  const [recIndex, setRecIndex] = useState(0);
  const [recipientCount, setRecipientCount] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [nftId, setNftId] = useState(0);
  

  const { data: poolId } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getPoolId",
  });
  const { data: currentRound } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "roundNumber",
  });
  const { data: totalRounds } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "maxRecipientsAllowed",
  });
  const { data: roundStartTime } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "roundStartTime",
  });
  const { data: roundDuration } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "roundDuration",
  });
  const { data: getActiveRecipientCount } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getActiveRecipientCount",
  });
  const { data: getPoolAmount } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getPoolAmount",
  });
  const { data: recipient } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getActiveRecipient",
    args: [BigInt(recIndex)],
  });

  useEffect(() => {
    if (recipient) {
      setRecipients((prevRecipients) => [...prevRecipients, recipient]);
      setRecIndex((prevIndex) => prevIndex + 1);
    }
  }, [recipient]);

  /// Calculations for round info
  let num1 = Number("" + roundStartTime);
  let num2 = Number("" + roundDuration);
  let roundExpiration = num1 + num2;
  // Convert BigInt to Number for the Date constructor
  let roundExpirationNumber = Number(roundExpiration);
  // Create a Date object and format it
  let expirationDate = new Date(roundExpirationNumber * 1000);
  let expirationDateString = expirationDate.toUTCString();

  const [recipientAddress, setRecipientAddress] = useState("0x0000000000000000000000000000000000000000");
  const encodedData = encodeAbiParameters(
    parseAbiParameters('address a, uint256 b'),
    [recipientAddress, BigInt(nftId)]
  )

  const { writeAsync: allocate, isLoading: loadingAllocate } = useScaffoldContractWrite({
    contractName: "Allo",
    functionName: "allocate",
    args: [ BigInt(currentPoolId), encodedData],
    value: parseEther("0.001"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <MetaHeader />
      <div className="flex flex-row flex-grow pt-10 mx-auto">
        {/* Project Menu List 
        <div className="px-5 w-1/4">
          <ul className="menu bg-base-200 w-56 rounded-box">
            <li className="menu-title">Your Votes</li>
            <li>
              <a>
                Project 1 <div className="badge badge-primary">Active</div>
              </a>
            </li>
            <li>
              <a>
                Project 2 <div className="badge badge-primary">Active</div>
              </a>
            </li>
            <li>
              <a>
                Project 3 <div className="badge badge-secondary">Completed</div>
              </a>
            </li>
          </ul>
        </div>*/}

        {/* Project Data */}
        <div className="flex flex-col px-5 w-full">
          {/* Header */}
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-black">Pool Id {poolId?.toString()}</h1>
            <h3 className="text-md pt-2 pl-4">
              <span className="text-slate-400">Address {survivorData?.address}</span>
            </h3>
            <h1 className="text-2xl font-black">
              Round <span className="bg-color-zinc-400"></span>{currentRound?.toString()}/{totalRounds?.toString()}
            </h1>
          </div>

          {/* Project Stats */}
          <div className="stats shadow pt-6">
            <div className="stat place-items-center">
              <div className="stat-title">Round Deadline</div>
              <div className="stat-value text-2xl">{expirationDateString}</div>
              <div className="stat-desc">18:30:00 UTC</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Dispensed Rewards</div>
              <div className="stat-value text-2xl">{currentRound?.toString()}</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Remaining Funds</div>
              <div className="stat-value text-2xl">{getPoolAmount?.toString()}</div>
              <div className="stat-desc">(-%)</div>
            </div>
          </div>

          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Please Confirm</h3>
              <p className="py-4">Are you sure you want to vote for {recipientAddress}</p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-primary" onClick={allocate}>Confirm</button>
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Player List */}
          <div className="overflow-x-auto pt-6">
            <h1 className="font-black text-xl">Players</h1>
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Votes</th>
                  <th>Metadata</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>

              {recipients.map((recipient, index) => (
                  <tr key={index}>
                    <td>{recipient?.totalVotesReceived.toString()}</td>
                    <td>{recipient?.metadata.pointer.toString()}</td>
                    <td>{recipient?.recipientAddress.toString()}</td>
                    <td>{recipient?.recipientStatus.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h1 className="font-black text-xl">Vote!</h1>
            <div className="flex flex-row">
              <div>Address
                <input type="text" placeholder="Recipient Address" className="input input-bordered w-lg" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
              </div>
              <div>Your NFT Id
                <input type="number" placeholder="Your NFT ID" className="input input-bordered w-xs max-w-xs" value={nftId} onChange={(e) => setNftId(Number(e.target.value))} />
              </div>
              <button
                className="btn btn-primary max-w-xs"
                onClick={() => {
                  document.getElementById("my_modal_5").showModal();
                }}
              >
                Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
