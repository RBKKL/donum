// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationsStore {
    struct Donation {
        address from;
        uint amount;
        uint timestamp;
        string message;
    }

    struct RecipientInfo {
        string nickname;
        string avatarURI;
        Donation[] donations;
    }

    // data is same as in Donation struct
    event NewDonation(
        address from,
        uint amount,
        uint timestamp,
        string message
    );

    // TODO: change to logs for gas saving? https://consensys.net/blog/developers/guide-to-events-and-logs-in-ethereum-smart-contracts/
    mapping(address => RecipientInfo) recipients;

    function getAllDonations(address _recipient) external view returns (Donation[] memory) {
        return recipients[_recipient].donations;
    }

    function getDonation(address _recipient, uint _index) external view returns (Donation memory) {
        return recipients[_recipient].donations[_index];
    }

    function getInfo(address _recipient) external view returns (string memory, string memory) {
        return (recipients[_recipient].nickname, recipients[_recipient].avatarURI);
    }

    function setInfo(string calldata _nickname, string calldata _avatarURI) external {
        recipients[msg.sender].nickname = _nickname;
        recipients[msg.sender].avatarURI = _avatarURI;
    }

    function donate(address _to, string calldata _message) external payable {
        recipients[_to].donations.push(Donation(msg.sender, msg.value, block.timestamp, _message));
        payable(_to).transfer(msg.value);
        emit NewDonation(msg.sender, msg.value, block.timestamp, _message);
    }
}