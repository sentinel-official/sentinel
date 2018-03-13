const environ = 'TEST' // set TEST for test environ, PROD for main environ
var config;
if (environ === 'PROD') {
    config = {
        masterUrl: 'https://api.sentinelgroup.io',
        infuraUrl: 'https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy',
        sentinelAddress: '0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037',
        gasLimit: 5000000,
        ethBalanceUrl: `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=balance&tag=latest&address=`,
        sentBalanceUrl: `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=tokenbalance&tag=latest&contractaddress=0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037&address=`,
        ethTransUrl: `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=txlist&startblock=0&endblock=latest&address=`,
        sentTransUrl1: `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037
        &topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=`,
        transcStatus: `https://api.etherscan.io/api?&apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&
        module=transaction&action=gettxreceiptstatus&txhash=`,
        gasApi: `https://api.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&module=proxy&action=eth_gasPrice`,
        statusUrl: `https://etherscan.io`
    }
}
else {
    config = {
        masterUrl: 'http://api.sentinelgroup.io:8333',
        infuraUrl: 'https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy',
        sentinelAddress: '0x7991241Af080593CB15cf783Fce16b77C96241bb',
        gasLimit: 2500000,
        ethBalanceUrl: `https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=balance&tag=latest&address=`,
        sentBalanceUrl: `https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=tokenbalance&tag=latest&contractaddress=0x7991241Af080593CB15cf783Fce16b77C96241bb&address=`,
        ethTransUrl: `https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=account&action=txlist&startblock=0&endblock=latest&address=`,
        sentTransUrl1: `https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM
        &module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x7991241Af080593CB15cf783Fce16b77C96241bb
        &topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=`,
        transcStatus: `https://api-rinkeby.etherscan.io/api?&apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&
        module=transaction&action=gettxreceiptstatus&txhash=`,
        gasApi: `https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&module=proxy&action=eth_gasPrice`,
        statusUrl: `https://rinkeby.etherscan.io`
    }
}
module.exports = config;