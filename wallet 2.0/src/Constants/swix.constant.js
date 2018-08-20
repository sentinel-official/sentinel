export const NAME = 'SWIXER';


//URL endpoints
export const URL = {
    conversionBaseUri: 'https://api-swixer.sentinelgroup.io/swix/rate?node=',
    swapAddressUri: 'https://api-swixer.sentinelgroup.io/swix',
    swixStatus: 'https://api-swixer.sentinelgroup.io/swix/status?hash='
};

export const nodeAddress = '0x47bd80a152d0d77664d65de5789df575c9cabbdb';
export const pivxAddress = 'DLobyFv5chewrK9mp2ZmtYKFGyMUGMTjDA';


export const coinType = {
    ETH: 'ethereum',
    SENT: 'ethereum',
    PIVX: 'bitcoin',
    BNB: 'ethereum',
};

export const decimals = {
    ETH: 1e18,
    SENT: 1e8,
    PIVX: 1,
    BNB: 1e18
}
export default URL;