// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationsStore {
    struct RecipientInfo {
        string nickname;
        string avatarURI;
    }

    event NewDonation(
        address from,
        address to,
        uint amount,
        uint timestamp,
        string message
    );

    mapping(address => RecipientInfo) public recipients;

    function setRecipientInfo(string calldata _nickname, string calldata _avatarURI) external {
        recipients[msg.sender].nickname = _nickname;
        recipients[msg.sender].avatarURI = _avatarURI;
    }

    function donate(address _to, string calldata _message) external payable {
        payable(_to).transfer(msg.value);
        emit NewDonation(msg.sender, _to, msg.value, block.timestamp, _message);
    }
}