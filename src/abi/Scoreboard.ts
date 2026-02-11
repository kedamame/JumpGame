export const scoreboardAbi = [
  {
    type: "function",
    name: "submitScore",
    stateMutability: "nonpayable",
    inputs: [
      { name: "score", type: "uint256" },
      { name: "maxFloor", type: "uint256" },
      { name: "maxCombo", type: "uint256" },
      { name: "fid", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "best",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "score", type: "uint256" },
      { name: "maxFloor", type: "uint256" },
      { name: "maxCombo", type: "uint256" },
      { name: "fid", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "ScoreSubmitted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "maxFloor", type: "uint256", indexed: false },
      { name: "maxCombo", type: "uint256", indexed: false },
      { name: "fid", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ],
    anonymous: false
  }
] as const;
