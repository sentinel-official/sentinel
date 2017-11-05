pragma solidity ^0.4.16;

contract Sentinel {
  address private owner;
  mapping (address => uint256) private balanceOf;

  function Sentinel(uint256 initialSupply) {
    owner = msg.sender;
    balanceOf[msg.sender] = initialSupply;
  }

  function transferAmount(address _from, address _to, uint256 amount, uint256 gas_amount) public {
    require(msg.sender == owner);
    require(_from != _to);
    require(amount > 0);
    require(gas_amount > 0);
    uint256 value = amount + gas_amount;
    require(balanceOf[_from] >= value);
    require(balanceOf[_to] + amount >= balanceOf[_to]);
    require(balanceOf[msg.sender] + gas_amount >= balanceOf[msg.sender]);
    balanceOf[_from] -= value;
    balanceOf[_to] += amount;
    balanceOf[msg.sender] += gas_amount;
  }

  function getBalanceOf(address _addr) public constant returns(uint256) {
    require(msg.sender == owner);
    return balanceOf[_addr];
  }
}
