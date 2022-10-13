// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

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
        uint unpaidAmount;
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

    function getAllDonations(address _recipient) public view returns (Donation[] memory) {
        return recipients[_recipient].donations;
    }

    // TODO: should be only for recipient?
    function getDonation(address _recipient, uint _index) public view returns (Donation memory) {
        // TODO: should check for index existance?
        return recipients[_recipient].donations[_index];
    }

    // TODO: should be only for recipient?
    function getUnpaidAmount(address _recipient) public view returns (uint) {
        // TODO: should check for index existance?
        return recipients[_recipient].unpaidAmount;
    }

    function getInfo(address _recipient) public view returns (string memory, string memory) {
        // TODO: should check for index existance?
        return (recipients[_recipient].nickname, recipients[_recipient].avatarURI);
    }

    function setInfo(string calldata _nickname, string calldata _avatarURI) public {
        recipients[msg.sender].nickname = _nickname;
        recipients[msg.sender].avatarURI = _avatarURI;
    }

    function donate(address _to, string calldata _message) public payable {
        // TODO: should check for index existance?
        recipients[_to].donations.push(Donation(msg.sender, msg.value, block.timestamp, _message));
        recipients[_to].unpaidAmount += msg.value;
        emit NewDonation(msg.sender, msg.value, block.timestamp, _message);
    }

    function withdrawDonations() public {
        address payable _to = payable(msg.sender);
        // TODO: should check for sufficient funds?
        // TODO: should check for index existance?
        _to.transfer(recipients[_to].unpaidAmount);
       recipients[_to].unpaidAmount = 0;
    }
}