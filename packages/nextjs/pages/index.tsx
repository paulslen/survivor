//import Link from "next/link";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
//import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { encodeAbiParameters } from 'viem'

const Home: NextPage = () => {

  // Initialize data for the SurvivorStrategy initialize function
  // const initializeData = {
  //     nft: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  //     maxRecipientsAllowed: 10,
  //     roundStartTime: Math.floor(Date.now() / 1000),
  //     roundDuration: 1704740052,
  //     roundReward: 1000000000000000000,
  // };

  const encodedData = encodeAbiParameters(
    [
      { name: 'x', type: 'string' },
      { name: 'y', type: 'uint' },
      { name: 'z', type: 'bool' }
    ],
    ['wagmi', 420n, true]
  )
  // const data = abiCoder.encode(
  //     ['address', 'uint256', 'uint64', 'uint64', 'uint256'],
  //     Object.values(initializeData)
  // );
  console.log(encodedData);

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="hero pt-10">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <Image src="/400px-survivor.png" width="400" height="200" alt="Survivor logo" />
              <p className="py-6">
                Gamify competition for gitcoin grants based on the TV show Survivor. Built on Allo Protocol.
              </p>
              <Link href="./players">
                <button className="btn btn-primary">Browse Grants</button>
              </Link>
              <Link href="./admin">
                <button className="btn btn-secondary">Post a Grant</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
