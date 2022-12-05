// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationsStore {
  event NewDonation(
    address indexed from,
    string nickname,
    address indexed to,
    uint256 amount,
    uint256 timestamp,
    string message
  );

  function donate(
    string calldata _nickname,
    address _to,
    string calldata _message
  ) external payable {
    payable(_to).transfer(msg.value);
    emit NewDonation(
      msg.sender,
      _nickname,
      _to,
      msg.value,
      block.timestamp, // solhint-disable-line not-rely-on-time
      _message
    );
  }
}
