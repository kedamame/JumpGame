// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Scoreboard {
    uint256 public constant MAX_SCORE = 1_000_000_000;
    uint256 public constant MAX_FLOOR = 1_000_000;
    uint256 public constant MAX_COMBO = 10_000;

    struct Best {
        uint256 score;
        uint256 maxFloor;
        uint256 maxCombo;
        uint256 fid;
        uint256 timestamp;
    }

    mapping(address => Best) public best;

    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 maxFloor,
        uint256 maxCombo,
        uint256 fid,
        uint256 timestamp
    );

    function submitScore(
        uint256 score,
        uint256 maxFloor,
        uint256 maxCombo,
        uint256 fid
    ) external {
        require(score <= MAX_SCORE, "score too high");
        require(maxFloor <= MAX_FLOOR, "floor too high");
        require(maxCombo <= MAX_COMBO, "combo too high");

        Best storage b = best[msg.sender];
        if (score > b.score) {
            b.score = score;
            b.maxFloor = maxFloor;
            b.maxCombo = maxCombo;
            b.fid = fid;
            b.timestamp = block.timestamp;

            emit ScoreSubmitted(msg.sender, score, maxFloor, maxCombo, fid, block.timestamp);
        }
    }
}
