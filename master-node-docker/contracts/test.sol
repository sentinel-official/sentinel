pragma solidity ^0.4.18;

contract Sentinel {
  address private owner;
  mapping (address => User) private allUsers;

  function Sentinel(uint256 initialSupply) public {
    owner = msg.sender;
    allUsers[msg.sender].balance = initialSupply;
  }
  
  struct User {
    uint256 balance;
    mapping(address => VpnUsage) vpnUsage;
    uint256 dueAmount;
    mapping(address => bool) vpnCheker;
    address[] vpnAddrs;
  }
  
  struct VpnUsage {
    uint256 usedBytes;
    uint256 amount;
    uint256 timestamp;
    bool isPayed;
  }

  function transferAmount(address _to, uint256 _amount, bool _isVpnPayment) public {
    require(msg.sender != _to);
    require(_amount > 0);
    require(allUsers[msg.sender].balance >= _amount);
    require(allUsers[_to].balance + _amount > allUsers[_to].balance);

    if(_isVpnPayment == true) {
      require(allUsers[msg.sender].dueAmount >= _amount);
      require(allUsers[msg.sender].vpnUsage[_to].amount >= _amount);
      require(allUsers[msg.sender].vpnUsage[_to].isPayed == false);

      allUsers[msg.sender].dueAmount -= _amount;      
      if((allUsers[msg.sender].vpnUsage[_to].amount - _amount) == 0) {
        allUsers[msg.sender].vpnUsage[_to].isPayed = true;
      }
    }

    allUsers[msg.sender].balance -= _amount;
    allUsers[_to].balance += _amount;
  }

  function addVpnUsage(address _addr, uint256 _usedBytes, uint256 _amount, uint256 _timestamp) public {
    allUsers[_addr].vpnUsage[msg.sender].usedBytes += _usedBytes;
    allUsers[_addr].vpnUsage[msg.sender].amount += _amount;
    allUsers[_addr].vpnUsage[msg.sender].timestamp = _timestamp;
    allUsers[_addr].vpnUsage[msg.sender].isPayed = false;
    allUsers[_addr].dueAmount += _amount;
    
    if(!allUsers[_addr].vpnCheker[msg.sender]) {
        allUsers[_addr].vpnCheker[msg.sender] = true;
        allUsers[_addr].vpnAddrs.push(msg.sender);
    }
  }

  function getBalance() public constant returns(uint256) {
    return allUsers[msg.sender].balance;
  }
  
  function getDueAmount() public constant returns(uint256) {
    return allUsers[msg.sender].dueAmount;
  }
  
  function getVpnAddrs() public constant returns(address[]) {
      return allUsers[msg.sender].vpnAddrs;
  }
  
  function getVpnUsage(address _addr) public constant returns(uint256, uint256, uint256, bool) {
    return (
      allUsers[msg.sender].vpnUsage[_addr].usedBytes,
      allUsers[msg.sender].vpnUsage[_addr].amount,
      allUsers[msg.sender].vpnUsage[_addr].timestamp,
      allUsers[msg.sender].vpnUsage[_addr].isPayed
    );
  }
}
