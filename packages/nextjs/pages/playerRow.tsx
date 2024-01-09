// PlayerView.tsx or PlayerView.js

import React from 'react';

// Define the prop types for the PlayerView component
interface PlayerRowProps {
  id: number;
  name: string;
  address: string;
  active: boolean;
}

// Use the defined prop types in the component
const PlayerRow: React.FC<PlayerRowProps> = ({ id, name, address, active }) => {
  return (
    <tr>
      <th>{id+1}</th>
      <td>{name}</td>
      <td>{address}</td>
      <td>
        <input type="checkbox" checked={active} readOnly={true} className="checkbox" />
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
