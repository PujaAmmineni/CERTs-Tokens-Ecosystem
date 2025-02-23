// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CERTsToken is ERC20, Ownable {
    constructor(uint256 initialSupply) 
        ERC20("CERTsToken", "CERTS") 
        Ownable(msg.sender) 
    {
        // Mint tokens (make sure to multiply by 10^decimals if needed)
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
