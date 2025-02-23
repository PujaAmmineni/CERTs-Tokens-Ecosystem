// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./CERTsToken.sol";

contract Marketplace {
    struct Content {
        string title;
        uint256 price;
        address seller;
    }

    CERTsToken public certsToken;
    Content[] public contents;

    constructor(address _certsTokenAddress) {
        certsToken = CERTsToken(_certsTokenAddress);
    }

    function listContent(string memory _title, uint256 _price) external {
        contents.push(Content({
            title: _title,
            price: _price,
            seller: msg.sender
        }));
    }

    function buyContent(uint256 contentId) external {
        require(contentId < contents.length, "Invalid content");
        Content memory content = contents[contentId];
        require(certsToken.balanceOf(msg.sender) >= content.price, "Insufficient funds");

        certsToken.transferTokens(content.seller, content.price);
    }
}
