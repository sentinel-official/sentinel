package types

import (
	"math/rand"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	log "github.com/logger"
	"github.com/tendermint/tendermint/crypto"
)

var pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

type Session struct {
	TotalLockedCoins   sdk.Coin
	CurrentLockedCoins sdk.Coin
	Counter            int64
	Timestamp          int64
	VpnPubKey          crypto.PubKey
	CPubKey            crypto.PubKey
}

func GetNewSessionId() []byte {

	bytes := make([]byte, 20)
	for i := 0; i < 20; i++ {
		bytes[i] = pool[rand.Intn(len(pool))]
	}
	// fmt.Println(bytes)
	log.WriteLog("bytes in seesion id " + string(bytes[:]))
	return bytes

}
func GetNewSessionMap(coins sdk.Coin, vpnpub crypto.PubKey, cpub crypto.PubKey) Session {
	ti := time.Now().UnixNano()
	return Session{
		TotalLockedCoins:   coins,
		CurrentLockedCoins: coins,
		VpnPubKey:          vpnpub,
		CPubKey:            cpub,
		Timestamp:          ti,
	}

}
