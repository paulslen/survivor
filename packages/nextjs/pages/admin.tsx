// import Link from "next/link";
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

const Home: NextPage = () => {

  const { data: survivorData } = useDeployedContractInfo("SurvivorStrategy");
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
  const { data: getActiveRecipient } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "roundDuration",
  });

  // Create an array to hold the recipient data
const recipients = [];

const recipientCount = Number(getActiveRecipientCount);

// Fetch the data for each recipient
for (let i = 0; i < recipientCount; i++) {
  const { data: recipient } = useScaffoldContractRead({
    contractName: "SurvivorStrategy",
    functionName: "getActiveRecipient",
    args: [BigInt(i)], // Pass the index as an argument
  });

  // Add the recipient data to the array
  recipients.push(recipient);
}

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
              <div className="stat-value text-2xl">800 USDC</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Remaining Funds</div>
              <div className="stat-value text-2xl">800 USDC</div>
              <div className="stat-desc">(50%)</div>
            </div>
          </div>

          {/* Judge List */}
          <div className="overflow-x-auto pt-6">
            <h1 className="font-black text-xl">Judges</h1>
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
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Judge Judy</td>
                  <td>0x8aa01576787c820483620e4e1829cb51cdc145fda52ba40b9a1244cd138c7ded</td>
                  <td>
                    <input type="checkbox" checked="checked" className="checkbox" />
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Judge Judy</td>
                  <td>0x8aa01576787c820483620e4e1829cb51cdc145fda52ba40b9a1244cd138c7ded</td>
                  <td>
                    <input type="checkbox" checked="" className="checkbox" />
                  </td>
                </tr>
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
                  <th>Eliminated</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
              {recipients.map((recipient, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{recipient.metadata}</td>
                  <td>{recipient.recipientAddress}</td>
                  <td>
                    <input type="checkbox" checked={recipient.recipientStatus} className="checkbox" />
                  </td>
                  <td>{recipient.totalVotesReceived}</td>
                  <td>{recipient.earned}</td>
                </tr>
              ))}
              {/* ... (other rows) */}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
