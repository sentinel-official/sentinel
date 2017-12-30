pragma solidity ^0.4.19;

contract Owned {
  address public owner;

  function Owned(
    )
      public {
        owner = msg.sender;
    }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(
    address _owner)
      onlyOwner public {
        owner = _owner;
    }
}
