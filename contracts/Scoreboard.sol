// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Scoreboard
 * @notice On-chain scoreboard for Tower Jump game
 * @dev Stores best scores per player on Base mainnet
 *
 * MAX_SCORE (1 billion): A theoretical maximum assuming 100k floors
 *   at max chapter bonus (~10k points/floor with combo) = ~1B
 * MAX_FLOOR (100k): Extremely high but achievable with enough skill/time
 * MAX_COMBO (10k): High but reasonable combo limit
 */
contract Scoreboard {
    // ============ Constants ============

    uint256 public constant MAX_SCORE = 1_000_000_000; // 1 billion
    uint256 public constant MAX_FLOOR = 100_000;       // 100k floors
    uint256 public constant MAX_COMBO = 10_000;        // 10k combo

    // ============ Types ============

    struct Best {
        uint256 score;
        uint256 maxFloor;
        uint256 maxCombo;
        uint256 fid;       // Farcaster ID (0 if not connected via Farcaster)
        uint256 timestamp;
    }

    // ============ Storage ============

    mapping(address => Best) public best;

    // ============ Events ============

    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 maxFloor,
        uint256 maxCombo,
        uint256 fid,
        uint256 timestamp
    );

    // ============ Functions ============

    /**
     * @notice Submit a new score
     * @dev Only updates if score is higher than current best
     * @param score The player's final score
     * @param maxFloor The highest floor reached
     * @param maxCombo The highest combo achieved
     * @param fid The player's Farcaster ID (0 if not available)
     */
    function submitScore(
        uint256 score,
        uint256 maxFloor,
        uint256 maxCombo,
        uint256 fid
    ) external {
        // Validate inputs
        require(score <= MAX_SCORE, "Score exceeds maximum");
        require(maxFloor <= MAX_FLOOR, "Floor exceeds maximum");
        require(maxCombo <= MAX_COMBO, "Combo exceeds maximum");

        // Only update if new score is better
        if (score > best[msg.sender].score) {
            best[msg.sender] = Best({
                score: score,
                maxFloor: maxFloor,
                maxCombo: maxCombo,
                fid: fid,
                timestamp: block.timestamp
            });

            emit ScoreSubmitted(
                msg.sender,
                score,
                maxFloor,
                maxCombo,
                fid,
                block.timestamp
            );
        }
    }
}
