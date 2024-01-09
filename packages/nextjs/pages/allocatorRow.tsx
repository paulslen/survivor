// PlayerView.tsx or PlayerView.js

import React from 'react';
import { useState, useEffect } from "react";



// Define the prop types for the PlayerView component
interface AllocatorRowProps {
  id: number;
}

interface AllocatorData {
  id: number;
  name: string;
  address: string;
  active: boolean;
}

// Use the defined prop types in the component
const AllocatorRow: React.FC<AllocatorRowProps> = ({ id }) => {

  const [allocatorData, setAllocatorData] = useState<AllocatorData>({
    id: 0,
    name: "luke",
    address: "0xaaaaaaa",
    active: true
  });
  
  return (
    <tr>
      <th>{id+1}</th>
      <td>{allocatorData.name}</td>
      <td>{allocatorData.address}</td>
      <td>
        <input 
          type="checkbox" 
          checked={allocatorData.active} 
          readOnly={true} 
          className="checkbox" 
          />
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

export default AllocatorRow;
