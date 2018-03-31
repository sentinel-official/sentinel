pragma solidity ^0.4.21;

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

    function VPNService(
        )
            public {
                authorizedUsers[owner] = true;
        }

    struct User {
        bool initialPayment;
        uint256 sessionsCount;
        mapping(bytes32 => VpnUsage) vpnUsage;
    }

    struct VpnUsage {
        address addr;
        uint256 receivedBytes;
        uint256 sessionDuration;
        uint256 amount;
        uint256 timestamp;
        bool isPaid;
    }

    VpnUsage _vpnUsageTemplate;

    function addAuthorizedUser(
        address _addr)
            onlyOwner public {
                authorizedUsers[_addr] = true;
        }

    function removeAuthorizedUser(
        address _addr)
            onlyOwner public {
                authorizedUsers[_addr] = false;
        }

    function setInitialPaymentStatusOf(
        address _addr,
        bool _isPaid)
            public {
                require(authorizedUsers[msg.sender] == true);
                users[_addr].initialPayment = _isPaid;
        }

    function getInitialPaymentStatusOf(
        address _addr)
            public constant returns(bool) {
                return users[_addr].initialPayment;
        }

    function addVpnUsage(
        address _from,
        address _to,
        uint256 _receivedBytes,
        uint256 _sessionDuration,
        uint256 _amount,
        uint256 _timestamp,
        bytes32 _sessionId)
            public {
                require(authorizedUsers[msg.sender] == true);
                require(_receivedBytes > 0);
                require(_sessionDuration > 0);
                require(_amount > 0);

                if(users[_to].vpnUsage[_sessionId].addr == 0x0) {
                    VpnUsage storage _vpnUsage = _vpnUsageTemplate;
                    
                    _vpnUsage.addr = _from;
                    _vpnUsage.receivedBytes = _receivedBytes;
                    _vpnUsage.sessionDuration = _sessionDuration;
                    _vpnUsage.amount = _amount;
                    _vpnUsage.timestamp = _timestamp;
                    _vpnUsage.isPaid = false;
                    
                    users[_to].sessionsCount += 1;
                    users[_to].vpnUsage[_sessionId] = _vpnUsage;
                } else {
                    require(users[_to].vpnUsage[_sessionId].addr == _from);
                    require(users[_to].vpnUsage[_sessionId].isPaid == false);
                    
                    users[_to].vpnUsage[_sessionId].receivedBytes += _receivedBytes;
                    users[_to].vpnUsage[_sessionId].sessionDuration += _sessionDuration;
                    users[_to].vpnUsage[_sessionId].amount += _amount;
                    users[_to].vpnUsage[_sessionId].timestamp = _timestamp;
                }
        }

    function payVpnSession(
        address _from,
        uint256 _amount,
        bytes32 _sessionId)
            public {
                require(authorizedUsers[msg.sender] == true);
                require(users[_from].vpnUsage[_sessionId].amount == _amount);
                require(users[_from].vpnUsage[_sessionId].isPaid == false);

                users[_from].vpnUsage[_sessionId].isPaid = true;
        }

    function getVpnSessionsCountOf(
        address _address)
            public constant returns(uint256) {
                return users[_address].sessionsCount;
        }

    function getVpnUsageOf(
        address _address,
        bytes32 _sessionId)
            public constant returns(address, uint256, uint256, uint256, uint256, bool) {
                return (
                    users[_address].vpnUsage[_sessionId].addr,
                    users[_address].vpnUsage[_sessionId].receivedBytes,
                    users[_address].vpnUsage[_sessionId].sessionDuration,
                    users[_address].vpnUsage[_sessionId].amount,
                    users[_address].vpnUsage[_sessionId].timestamp,
                    users[_address].vpnUsage[_sessionId].isPaid
                );
        }
}
