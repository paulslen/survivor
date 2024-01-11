// import Link from "next/link";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
  useDeployedContractInfo,
} from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { parseEther } from "viem";

const Home: NextPage = () => {

  const [recipientAddress, setRecipientAddress] = useState("0x0000000000000000000000000000000000000000");
  const [status, setStatus] = useState(0);
  const [metadata, setMetadata] = useState("");
  const [recipientData, setRecipientData] = useState("0x0000000000000000000000000000000000000000");
  const [recIndex, setRecIndex] = useState(0);
  const [recipientCount, setRecipientCount] = useState(0);
  const [recipients, setRecipients] = useState([]);


  const { data: survivorData } = useDeployedContractInfo("SurvivorStrategy");
  const { data: registryData } = useDeployedContractInfo("Registry");
  const { data: nftData } = useDeployedContractInfo("AllocatorNFT");
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
  
  const { data: getPoolAmount } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getPoolAmount",
  });

  const handleEncode = () => {
    const encodedRecipientData = encodeAbiParameters(
      parseAbiParameters('address a, address b, uint256 c'),
      [recipientAddress, recipientAddress, BigInt(status)]
      // ['address', 'address', 'uint', ['uint', 'string']]
      // 
    )
    console.log(encodedRecipientData);
    setRecipientData(encodedRecipientData + "000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000d54657374204d6574616461746100000000000000000000000000000000000000");
  }
    ///0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000002
    ///0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000a74657374737472696e6700000000000000000000000000000000000000000000
    ///0x0000000000000000000000000921ca5c07dc02147c6178dc1fae9bd2f3eb053a0000000000000000000000000921ca5c07dc02147c6178dc1fae9bd2f3eb053a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000d54657374204d6574616461746100000000000000000000000000000000000000

  const { writeAsync: registerRecipient, isLoading: loadingRegistration } = useScaffoldContractWrite({
    contractName: "Allo",
    functionName: "registerRecipient",
    args: [ BigInt(1), recipientData],
      value: parseEther("0.1"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  let num1 = Number("" + roundStartTime);
  let num2 = Number("" + roundDuration);
  let roundExpiration = num1 + num2;

  // Convert BigInt to Number for the Date constructor
  let roundExpirationNumber = Number(roundExpiration);

  // Create a Date object and format it
  let expirationDate = new Date(roundExpirationNumber * 1000);
  let expirationDateString = expirationDate.toUTCString();

  return (
    <>
      <MetaHeader />
      
      <div className="flex flex-row flex-grow pt-10 mx-auto">
        {/* Project Menu List 
        <div className="px-5 w-1/4">
          <Link href="/admin/new">
            <button className="btn btn-primary">New Grant</button>
          </Link>

          <ul className="menu bg-base-200 w-56 rounded-box">
            <li className="menu-title">Your Grants</li>
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

          {/* Judge List */}
          <div className="overflow-x-auto pt-6">
            <h1 className="font-black text-xl">Allocators</h1>
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>New</th>
                  <td>
                    <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs" />
                  </td>
                  <td>
                    <input type="text" placeholder="Address" className="input input-bordered w-full max-w" />
                  </td>
                  <td>
                    <button className="btn btn-primary">Save</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Player List */}
          <div className="overflow-x-auto pt-6">
            <h1 className="font-black text-xl">Players</h1>
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Votes</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr key={index}>
                    <td>{recipient?.totalVotesReceived.toString()}</td>
                    <td>{recipient?.recipientAddress.toString()}</td>
                    <td>{recipient?.recipientStatus.toString()}</td>
                    <td>{recipient?.metadata.pointer.toString()}</td>
                  </tr>
                ))}

              <tr>
                <th>New</th>
                <td>
                  <input type="text" placeholder="Recipient Address" className="input input-bordered w-full max-w-xs" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
                </td>
                <td>
                  <input type="number" placeholder="Status" className="input input-bordered w-full max-w-xs" value={status} onChange={(e) => setStatus(Number(e.target.value))} />
                </td>
                {/*<td>
                  <input type="text" placeholder="Metadata" className="input input-bordered w-full max-w-xs" value={metadata} onChange={(e) => setMetadata(e.target.value)} />
                </td>*/}
                <td className="flex flex-row">
                  <button className="btn btn-primary" onClick={handleEncode}>Encode</button>
                  <button className="btn btn-primary" onClick={registerRecipient}>Save</button>
                </td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
