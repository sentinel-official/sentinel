pragma solidity ^0.4.19;

import "../sentinel-coin/Owned.sol";
import "../sentinel-coin/ERC20Token.sol";

contract Sentinel is Owned, ERC20Token {
  mapping (string => address) private services;

  function Sentinel(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _totalSupply)
      ERC20Token(_name, _symbol, _decimals, _totalSupply) public {
    }

  function deployService(
    string _name,
    address _address)
      onlyOwner public {
        services[_name] = _address;
    }

  function getService(
    string _name)
      public constant returns(address) {
        return services[_name];
    }

  function payService(
    string _name,
    address _from,
    address _to,
    uint256 _value)
      public {
        require(msg.sender != 0x0);
        require(services[_name] != 0x0);
        require(msg.sender == services[_name]);
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);

        uint256 previousBalances = balanceOf[_from] + balanceOf[_to];

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        Transfer(_from, _to, _value);

        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }
}
