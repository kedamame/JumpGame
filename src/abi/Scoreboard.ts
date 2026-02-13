// ===========================================
// Scoreboard Contract ABI
// ===========================================

export const SCOREBOARD_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'score',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxFloor',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxCombo',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'ScoreSubmitted',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_COMBO',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FLOOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_SCORE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'best',
    outputs: [
      {
        internalType: 'uint256',
        name: 'score',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxFloor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxCombo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'fid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'score',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxFloor',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxCombo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'fid',
        type: 'uint256',
      },
    ],
    name: 'submitScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
