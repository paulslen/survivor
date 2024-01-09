import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import AllocatorRow from "./allocatorRow"
import PlayerRow from "./playerRow";
import { useState } from "react";

import { useEffect } from 'react';




interface Allocator {
  id: number;
  name: string;
  address: string;
  active: boolean;
}

interface Player {
  eliminated: number;
  name: string;
  address: string;
  totalVotes: number;
  totalEarned: number;
  active: boolean;
}



const Home: NextPage = () => {

  const [allocators, setAllocators] = useState<Allocator[]>([]);
  const [allocatorsCount, setAllocatorsCount] = useState(0);
  const [playersCount, setPlayersCount] = useState(0);
  const [newAllocator, setNewAllocator] = useState<Allocator>({
    id: 1,
    name: "",
    address: "",
    active: false,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>({
    eliminated: 1,
    name: "",
    address: "",
    totalVotes: 0,
    totalEarned: 0,
    active: false,
  });


  const getNextAllocatorId = () => {
    // Find the maximum id in the existing allocators and add 1
    const maxId = Math.max(...allocators.map((allocator) => allocator.id), 1);
    return maxId === 0 ? 1 : maxId + 1;
  };

  const getNextPlayerId = () => {
    // Find the maximum id in the existing allocators and add 1
    const maxId = Math.max(...players.map((player) => player.eliminated), 1);
    return maxId === 0 ? 1 : maxId + 1;
  };



  // Watched data from the smart contract
  const contractAllocators = 3;
  const contractPlayers = 3;

  useEffect(() => {

    // Update allocators with data from the smart contract
    setAllocatorsCount(contractAllocators);
  }, [contractAllocators]);

  useEffect(() => {

    // Update players with data from the smart contract
    setPlayersCount(contractPlayers);
  }, [contractPlayers]);


  const handleSaveAllocator = async () => {
    const nextId = getNextAllocatorId();
    console.log("Next Allocator Id:", nextId);

    

    // Update the local state with the new allocator
    setAllocators((prevAllocators) => [
      ...prevAllocators,
      {
        id: nextId,
        name: newAllocator.name,
        address: newAllocator.address,
        active: newAllocator.active,
      },
    ]);

    // Clear the newAllocator state
    setNewAllocator({ id: nextId, name: "", address: "", active: false });
  };


  const handleSavePlayer = () => {
    const nextId = getNextPlayerId();
    console.log("Next Player Id:", nextId);

    setNewPlayer({
      eliminated: nextId,
      name: newPlayer.name,
      address: newPlayer.address,
      totalVotes: newPlayer.totalVotes,
      totalEarned: newPlayer.totalEarned,
      active: newPlayer.active,
    });

    console.log("Saving new player:", newPlayer);
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    console.log("Players after save:", players);
    setNewPlayer({ eliminated: nextId, name: "", address: "", totalVotes: 0, totalEarned: 0, active: false });
    console.log("New player state after save:", newPlayer);

  };




  return (
    <>
      <MetaHeader />
      <div className="flex flex-row flex-grow pt-10 mx-auto">
        {/* Project Menu List */}
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
        </div>

        {/* Project Data */}
        <div className="flex flex-col px-5 w-full">
          {/* Header */}
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-black">Project Name</h1>
            <h3 className="text-md pt-2 pl-4">
              <span className="text-slate-400">0x40Ac73fEB67e9d50087cce1FB739B92c99B2fF0E</span>
            </h3>
            <h1 className="text-2xl font-black">
              Round <span className="bg-color-zinc-400"></span>4/8
            </h1>
          </div>

          {/* Project Stats */}
          <div className="stats shadow pt-6">
            <div className="stat place-items-center">
              <div className="stat-title">Round Deadline</div>
              <div className="stat-value text-2xl">Jan 12, 2024</div>
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

          {/* Allocators List */}
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
                  { [...Array(allocatorsCount).keys()].map((allocatorIndex) => (
                    <AllocatorRow id={allocatorIndex} />
                   ))}
                <tr>
                  <th>New</th>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered w-full max-w-xs"
                      value={newAllocator.name}
                      onChange={(e) =>
                        setNewAllocator({ ...newAllocator, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Address"
                      className="input input-bordered w-full max-w"
                      onChange={(e) =>
                        setNewAllocator({ ...newAllocator, address: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={handleSaveAllocator}>
                      Save
                    </button>
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
                  <th>Total Votes</th>
                  <th>Total Earned</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
              { [...Array(playersCount).keys()].map((playerIndex) => (
                    <PlayerRow id={playerIndex} />
                   ))}

                <tr>
                  <th>New</th>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered w-full max-w-xs"
                      value={newPlayer.name}
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Address"
                      className="input input-bordered w-full max-w"
                      onChange={(e) =>
                        setNewPlayer({ ...newPlayer, address: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={handleSavePlayer}>
                      Save
                    </button>
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
