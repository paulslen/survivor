import type { NextPage } from "next";
import { useState } from "react";
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
import { displayTxResult } from "~~/components/scaffold-eth";
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { parseEther } from "viem";

const Init: NextPage = () => {

  const [startTime, setStartTime] = useState(1704943826);
  const [roundCount, setRoundCount] = useState(4);
  const [roundDuration, setRoundDuration] = useState(1000);
  const [createdProfileId, setCreatedProfileId] = useState(null);
  const { data: survivorData, isLoading: survivorLoading } = useDeployedContractInfo("SurvivorStrategy");
  const { data: registryData, isLoading: nftLoading } = useDeployedContractInfo("Registry");
  const { data: nftData, isLoading: registryLoading } = useDeployedContractInfo("AllocatorNFT");
  
  const { writeAsync: initializeAllo, isLoading: alloLoading, isMining } = useScaffoldContractWrite({
    contractName: "Allo",
    functionName: "initialize",
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', registryData?.address, registryData?.address, BigInt(0), BigInt(0) ],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: initializeRegistry, isLoading: loadingRegistry } = useScaffoldContractWrite({
    contractName: "Registry",
    functionName: "initialize",
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: createProfile, isLoading: loadingProfile } = useScaffoldContractWrite({
    contractName: "Registry",
    functionName: "createProfile",
    args: [BigInt(Math.floor(Math.random() * 1001)), "Paul Len", 
    {
        protocol: BigInt(1),
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi"
      }, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Registry",
    eventName: "ProfileCreated",
    listener: logs => {
      logs.map(log => {
        const { profileId } = log.args;
        console.log("Profile Id Generated:", profileId);
        setCreatedProfileId(profileId);
      });
    },
  });

  const initStrategyParam = encodeAbiParameters(
    parseAbiParameters('address a, uint256 b, uint64 c, uint64 d, uint256 e'),
    ["0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", BigInt(roundCount), BigInt(startTime), BigInt(roundDuration), BigInt(100)]
  )

  const { writeAsync: createPool, isLoading: loadingPool } = useScaffoldContractWrite({
    contractName: "Allo",
    functionName: "createPoolWithCustomStrategy",
    args: [createdProfileId, survivorData?.address, initStrategyParam, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', BigInt(100), 
    {
        protocol: BigInt(1),
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi"
      }, ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]],
      value: parseEther("0.1"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });


  

  return (
    <>
      <MetaHeader />
      

        {/* Project Data */}
        <div className="flex flex-col p-20 w-full">
          {/* Header */}
            <div className="p-6 flex flex-row">
                <button
                    className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                    alloLoading ? "loading" : ""
                    }`}
                    onClick={initializeAllo}
                >
                    {!alloLoading && (
                    <>
                        Initialize Allo
                    </>
                    )}
              </button>
              <button
                className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                  loadingRegistry ? "loading" : ""
                }`}
                onClick={initializeRegistry}
              >
                {!loadingRegistry && (
                  <>
                    Initialize Registry
                  </>
                )}
              </button>
              </div>
          <div>
            <button
                className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                  loadingProfile ? "loading" : ""
                }`}
                onClick={createProfile}
              >
                {!loadingProfile && (
                  <>
                    Create Profile
                  </>
                )}
              </button>
              Your New Profile Id:{createdProfileId}
          </div>
          <div>
            <div>Round Duration
              <input type="number" className="input input-bordered w-xs max-w-xs" value={roundDuration} onChange={(e) => setRoundDuration(Number(e.target.value))} />
            </div>
            <div>Uniq start time
              <input type="number" className="input input-bordered w-xs max-w-xs" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} />
            </div>
            <div>Number of Players
              <input type="number" className="input input-bordered w-xs max-w-xs" value={roundCount} onChange={(e) => setRoundCount(Number(e.target.value))} />
            </div>
            <button
                className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                  loadingPool ? "loading" : ""
                }`}
                onClick={createPool}
              >
                {!loadingPool && (
                  <>
                    Create Pool
                  </>
                )}
              </button>
          </div>
      </div>
    </>
  );
};

export default Init;
