pragma solidity ^0.4.19;

import "../sentinel-with-services/Sentinel.sol";

contract VPNService {
  mapping(address => User) private users;

  struct User {
    uint256 balance;
    uint256 dueAmount;
    VpnUsage[] vpnUsage;
  }

  struct VpnUsage {
    address addr;
    uint256 receivedBytes;
    uint256 sentBytes;
    uint256 sessionDuration;
    uint256 amount;
    uint256 timestamp;
    bool isPayed;
  }

  VpnUsage _vpnUsageTemp;

  function addVpnUsage(
    address _addr,
    uint256 _receivedBytes,
    uint256 _sentBytes,
    uint256 _sessionDuration,
    uint256 _amount,
    uint256 _timestamp)
      public {
        VpnUsage storage _vpnUsage = _vpnUsageTemp;

        _vpnUsage.addr = msg.sender;
        _vpnUsage.receivedBytes = _receivedBytes;
        _vpnUsage.sentBytes = _sentBytes;
        _vpnUsage.sessionDuration = _sessionDuration;
        _vpnUsage.amount = _amount;
        _vpnUsage.timestamp = _timestamp;
        _vpnUsage.isPayed = false;

        users[_addr].vpnUsage.push(_vpnUsage);
        users[_addr].dueAmount += _amount;
    }

  function payVpnSession(
    address _contractAddress,
    uint256 _amount,
    uint256 _sessionId)
      public {
        require(users[msg.sender].dueAmount >= _amount);
        require(users[msg.sender].vpnUsage[_sessionId].amount >= _amount);
        require(users[msg.sender].vpnUsage[_sessionId].isPayed == false);

        address _to = users[msg.sender].vpnUsage[_sessionId].addr;
        Sentinel sentinel = Sentinel(_contractAddress);
        sentinel.payService('vpn', msg.sender, _to, _amount);

        users[msg.sender].dueAmount -= _amount;
        if ((users[msg.sender].vpnUsage[_sessionId].amount - _amount) == 0) {
          users[msg.sender].vpnUsage[_sessionId].isPayed = true;
        }
    }

  function getDueAmount(
    )
      public constant returns(uint256) {
        return users[msg.sender].dueAmount;
    }

  function getVpnSessions(
    )
      public constant returns(uint256) {
        return users[msg.sender].vpnUsage.length;
    }

  function getVpnUsage(
    uint256 _sessionId)
      public constant returns(address, uint256, uint256, uint256, uint256, uint256, bool) {
        return (
          users[msg.sender].vpnUsage[_sessionId].addr,
          users[msg.sender].vpnUsage[_sessionId].receivedBytes,
          users[msg.sender].vpnUsage[_sessionId].sentBytes,
          users[msg.sender].vpnUsage[_sessionId].sessionDuration,
          users[msg.sender].vpnUsage[_sessionId].amount,
          users[msg.sender].vpnUsage[_sessionId].timestamp,
          users[msg.sender].vpnUsage[_sessionId].isPayed
        );
    }
}
