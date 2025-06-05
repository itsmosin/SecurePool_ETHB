// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC20
 * @dev Simple ERC20 token for testing the insurance contracts
 */
contract MockERC20 is ERC20, Ownable {
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    /**
     * @dev Mint new tokens (for testing)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Faucet function for easy testing - anyone can get 1000 tokens
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10000 * 10**decimals(), "Already has enough tokens");
        _mint(msg.sender, 1000 * 10**decimals());
    }
} 