// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingGovernance is Ownable {
    IERC20 public certsToken;
    uint public totalStaked;

    struct Stake {
        uint amount;
        uint timestamp;
    }
    mapping(address => Stake) public stakes;
    mapping(uint => uint) public proposalVotes;

    event Staked(address indexed user, uint amount, uint timestamp);
    event Unstaked(address indexed user, uint amount, uint timestamp);
    event RewardDistributed(address indexed user, uint reward, uint timestamp);
    event Voted(address indexed user, uint proposalId, uint voteAmount, uint timestamp);

    /// @notice Constructor that sets the token
    constructor(IERC20 _token) Ownable(msg.sender) {
        certsToken = _token;
    }

    /// @notice Stake a specified amount of CERTs tokens.
    function stake(uint amount) external {
        require(amount > 0, "Cannot stake 0 tokens");
        require(certsToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount, block.timestamp);
    }

    /// @notice Unstake a specified amount of tokens.
    function unstake(uint amount) external {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked tokens");

        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        require(certsToken.transfer(msg.sender, amount), "Token transfer failed");

        emit Unstaked(msg.sender, amount, block.timestamp);
    }

    /// @notice Returns a time-based staking multiplier.
    function stakingMultiplier(address user) public view returns (uint multiplier) {
        uint stakedDuration = block.timestamp - stakes[user].timestamp;
        multiplier = 100 + (stakedDuration / 1 days);
        if (multiplier > 200) {
            multiplier = 200;
        }
    }

    /// @notice Distribute a reward based on a base reward.
    function distributeReward(address user, uint baseReward) external onlyOwner {
        uint multiplier = stakingMultiplier(user);
        uint finalReward = (baseReward * multiplier) / 100;
        require(certsToken.transfer(user, finalReward), "Reward transfer failed");

        emit RewardDistributed(user, finalReward, block.timestamp);
    }

    /// @notice Vote on a proposal by staking tokens.
    function vote(uint proposalId, uint voteAmount) external {
        require(voteAmount > 0, "Vote amount must be positive");
        require(stakes[msg.sender].amount >= voteAmount, "Insufficient staked tokens for voting");

        proposalVotes[proposalId] += voteAmount;
        emit Voted(msg.sender, proposalId, voteAmount, block.timestamp);
    }
}
