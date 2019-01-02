package sentinel

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/tendermint/tendermint/crypto"
)

var (
	pvk1 = crypto.GenPrivKeyEd25519()
	pvk2 = crypto.GenPrivKeyEd25519()
	pvk3 = crypto.GenPrivKeyEd25519()

	pk1 = pvk1.PubKey()
	pk2 = pvk2.PubKey()
	pk3 = pvk3.PubKey()

	addr1 = sdk.AccAddress(pk1.Address())
	addr2 = sdk.AccAddress(pk2.Address())
	addr3 = sdk.AccAddress(pk3.Address())

	emptypk   crypto.PubKey
	emptyaddr sdk.AccAddress
	sign1     crypto.Signature
)
var (
	coinPos  = sdk.NewCoin("sentinelToken", 1)
	coinZero = sdk.NewCoin("sentinelToken", 0)
	coinNeg  = sdk.NewCoin("sentinelToken", -1)
)
