pragma solidity ^0.4.19;

import "./Owned.sol";
import "./ERC20Token.sol";

contract Sentinel is Owned, ERC20Token {
  function Sentinel(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimals,
    uint256 _totalSupply)
      ERC20Token(_tokenName, _tokenSymbol, _decimals, _totalSupply) public {
    }
}
