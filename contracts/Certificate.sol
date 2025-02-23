// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Certificate is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("Certificate", "CERT") Ownable(msg.sender) {}

    /// @notice Issue a certificate to a recipient. Only owner can call.
    function issueCertificate(address recipient) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        nextTokenId++;
    }

    /// @notice Prevent transfers by overriding `_update`
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        require(to == address(0) || msg.sender == owner(), "Certificates are non-transferable");
        return super._update(to, tokenId, auth);
    }
}
