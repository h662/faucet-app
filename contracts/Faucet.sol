// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Faucet {
    uint public constant MAX_AMOUNT = 0.5 ether;

    function requestTokens(address payable receipient, uint amount) external {
        require(amount <= MAX_AMOUNT, "Requested amount exceeds limit");
        require(address(this).balance >= amount, "Insufficient contract balance");

        (bool success, ) = receipient.call{value: amount}("");
        require(success, "Trnasfer failed");
    }

    receive() external payable {}
}