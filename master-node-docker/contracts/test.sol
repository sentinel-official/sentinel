pragma solidity ^ 0.4.18;

contract Sentinel {

    address public owner;
    uint256 public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals = 8;

    mapping(address => User) private allUsers;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _from, address indexed _to, uint256 _value);

    function Sentinel(
        uint256 _supply,
        string _name,
        string _symbol)
            public {
                owner = msg.sender;
                totalSupply = _supply * (10 ** uint256(decimals));
                name = _name;
                symbol = _symbol;

                allUsers[msg.sender].balance = totalSupply;
        }

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

    function balanceOf(
        address _addr)
            public constant returns(uint256) {
                return allUsers[_addr].balance;
        }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount)
            internal {
                require(_to != 0x0);
                require(_to != _from);
                require(allUsers[_from].balance >= _amount);
                require(allUsers[_to].balance + _amount > allUsers[_to].balance);

                uint256 previousBalances = allUsers[_from].balance + allUsers[_to].balance;
                allUsers[_from].balance -= _amount;
                allUsers[_to].balance += _amount;

                Transfer(_from, _to, _amount);

                assert(allUsers[_from].balance + allUsers[_to].balance == previousBalances);
        }

    function transfer(
        address _to,
        uint256 _amount)
            public {
                _transfer(msg.sender, _to, _amount);
        }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount)
            public returns(bool success) {
                require(_amount <= allowance[_from][msg.sender]);

                allowance[_from][msg.sender] -= _amount;
                _transfer(_from, _to, _amount);

                return true;
        }

    function approve(
        address _to,
        uint256 _amount)
            public returns(bool success) {
                allowance[msg.sender][_to] = _amount;
                
                return true;
        }

    /* ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ ------ */

    function payVpnSession(
        uint256 _amount,
        uint256 _sessionId)
            public {
                require(allUsers[msg.sender].dueAmount >= _amount);
                require(allUsers[msg.sender].vpnUsage[_sessionId].amount >= _amount);
                require(allUsers[msg.sender].vpnUsage[_sessionId].isPayed == false);

                address _to = allUsers[msg.sender].vpnUsage[_sessionId].addr;
                _transfer(msg.sender, _to, _amount);

                allUsers[msg.sender].dueAmount -= _amount;
                if ((allUsers[msg.sender].vpnUsage[_sessionId].amount - _amount) == 0) {
                    allUsers[msg.sender].vpnUsage[_sessionId].isPayed = true;
                }
        }

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

                allUsers[_addr].vpnUsage.push(_vpnUsage);
                allUsers[_addr].dueAmount += _amount;
        }

    function getDueAmount(
        )
            public constant returns(uint256) {
                return allUsers[msg.sender].dueAmount;
        }

    function getVpnSessions(
        )
            public constant returns(uint256) {
                return allUsers[msg.sender].vpnUsage.length;
        }

    function getVpnUsage(
        uint256 _sessionId)
            public constant returns(address, uint256, uint256, uint256, uint256, uint256, bool) {
                return (
                    allUsers[msg.sender].vpnUsage[_sessionId].addr,
                    allUsers[msg.sender].vpnUsage[_sessionId].receivedBytes,
                    allUsers[msg.sender].vpnUsage[_sessionId].sentBytes,
                    allUsers[msg.sender].vpnUsage[_sessionId].sessionDuration,
                    allUsers[msg.sender].vpnUsage[_sessionId].amount,
                    allUsers[msg.sender].vpnUsage[_sessionId].timestamp,
                    allUsers[msg.sender].vpnUsage[_sessionId].isPayed
                );
        }
}
