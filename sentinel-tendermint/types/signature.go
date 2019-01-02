package types

import (
	"encoding/json"

	sdk "github.com/cosmos/cosmos-sdk/types"
	// "github.com/cosmos/cosmos-sdk/x/auth"
	"github.com/tendermint/tendermint/crypto"
)

type ClientSignature struct {
	Coins     sdk.Coin
	Sessionid []byte
	Counter   int64
	Signature Signature
	IsFinal   bool
}
type Signature struct {
	Pubkey    crypto.PubKey    `json:"pub_key"` // optional
	Signature crypto.Signature `json:"signature"`
}

func NewClientSignature(coins sdk.Coin, sesid []byte, counter int64, pubkey crypto.PubKey, sign crypto.Signature, isfinal bool) ClientSignature {
	return ClientSignature{
		Coins:     coins,
		Sessionid: sesid,
		Counter:   counter,
		IsFinal:   isfinal,
		Signature: Signature{
			Pubkey:    pubkey,
			Signature: sign,
		},
	}
}
func (a ClientSignature) Value() Signature {
	return a.Signature
}

type StdSig struct {
	Coins     sdk.Coin
	Sessionid []byte
	Counter   int64
	Isfinal   bool
}

func ClientStdSignBytes(coins sdk.Coin, sessionid []byte, counter int64, isfinal bool) []byte {
	bz, err := json.Marshal(StdSig{
		Coins:     coins,
		Sessionid: sessionid,
		Counter:   counter,
		Isfinal:   isfinal,
	})
	if err != nil {
		panic(err)
	}
	return sdk.MustSortJSON(bz)
}
