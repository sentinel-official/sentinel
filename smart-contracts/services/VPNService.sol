pragma solidity ^0.4.18;

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
        require(_owner != 0x0);

        owner = _owner;
    }
}

contract VPNService is Owned {
  mapping(address => User) private users;
  mapping(address => bool) public authorizedUsers;

  struct User {
    uint256 dueAmount;
    VpnUsage[] vpnUsage;
  }

  struct VpnUsage {
    address addr;
    uint256 receivedBytes;
    uint256 sessionDuration;
    uint256 amount;
    uint256 timestamp;
    bool isPayed;
  }

  VpnUsage _vpnUsageTemplate;
  
  function addAuthorizedUser(address _addr) onlyOwner public {
    authorizedUsers[_addr] = true;
  }

  function removeAuthorizedUser(address _addr) onlyOwner public {
    authorizedUsers[_addr] = false;
  }

  function addVpnUsage(
    address _from,
    address _to,
    uint256 _receivedBytes,
    uint256 _sessionDuration,
    uint256 _amount,
    uint256 _timestamp)
      public {
        require(authorizedUsers[msg.sender] == true);
        VpnUsage storage _vpnUsage = _vpnUsageTemplate;

        _vpnUsage.addr = _from;
        _vpnUsage.receivedBytes = _receivedBytes;
        _vpnUsage.sessionDuration = _sessionDuration;
        _vpnUsage.amount = _amount;
        _vpnUsage.timestamp = _timestamp;
        _vpnUsage.isPayed = false;

        users[_to].vpnUsage.push(_vpnUsage);
        users[_to].dueAmount += _amount;
    }

  function payVpnSession(
    address _from,
    uint256 _amount,
    uint256 _sessionId)
      public {
        require(authorizedUsers[msg.sender] == true);
        require(users[_from].dueAmount >= _amount);
        require(users[_from].vpnUsage[_sessionId].amount == _amount);
        require(users[_from].vpnUsage[_sessionId].isPayed == false);

        users[_from].dueAmount -= _amount;
        if ((users[_from].vpnUsage[_sessionId].amount - _amount) == 0) {
          users[_from].vpnUsage[_sessionId].isPayed = true;
        }
    }

  function getDueAmountOf(
    address _address)
      public constant returns(uint256) {
        return users[_address].dueAmount;
    }

  function getVpnSessionsOf(
    address _address)
      public constant returns(uint256) {
        return users[_address].vpnUsage.length;
    }

  function getVpnUsageOf(
    address _address,
    uint256 _sessionId)
      public constant returns(address, uint256, uint256, uint256, uint256, bool) {
        return (
          users[_address].vpnUsage[_sessionId].addr,
          users[_address].vpnUsage[_sessionId].receivedBytes,
          users[_address].vpnUsage[_sessionId].sessionDuration,
          users[_address].vpnUsage[_sessionId].amount,
          users[_address].vpnUsage[_sessionId].timestamp,
          users[_address].vpnUsage[_sessionId].isPayed
        );
    }
}
