// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract Fun {
    uint256 public x;
    event XWasChanged(uint256 _from, uint256 _to);

    constructor(uint256 _x) {
        emit XWasChanged(x, _x);
        x = _x;
    }

    function changeX(uint256 _x) external {
        emit XWasChanged(x, _x);
        x = _x;
    }
}