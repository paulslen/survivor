// PlayerView.tsx or PlayerView.js

import React from 'react';
import { useState, useEffect } from "react";

// Define the prop types for the PlayerView component
interface PlayerRowProps {
  id: number;
}

interface PlayerData {
  id: number;
  name: string;
  address: string;
  totalVotes: number;
  totalEarned: number;
  active: boolean;
}

// Use the defined prop types in the component
const PlayerRow: React.FC<PlayerRowProps> = ({ id }) => {


  const [playerData, setPlayerData] = useState<PlayerData>({
    id: 0,
    name: "luke",
    address: "0xaaaaaaa",
    totalVotes: 1,
    totalEarned: 10,
    active: true
  });


  return (
    <tr>
      <th>{id+1}</th>
      <td>{playerData.name}</td>
      <td>{playerData.address}</td>
      <td>{playerData.totalVotes}</td>
      <td>{playerData.totalEarned}</td>
      <td>
        <input type="checkbox" checked={playerData.active} readOnly={true} className="checkbox" />
      </td>
      <td>
        <button
          className="btn btn-primary"
        >
          Vote
        </button>
      </td>
    </tr>
  );
};

export default PlayerRow;
