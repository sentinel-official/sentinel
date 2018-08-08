package sentinel

import (
	"testing"

	"github.com/cosmos/cosmos-sdk/store"
	sdk "github.com/cosmos/cosmos-sdk/types"
	wire "github.com/cosmos/cosmos-sdk/wire"
	"github.com/cosmos/cosmos-sdk/x/auth"
	"github.com/cosmos/cosmos-sdk/x/bank"
	"github.com/stretchr/testify/require"
	abci "github.com/tendermint/tendermint/abci/types"
	dbm "github.com/tendermint/tendermint/libs/db"
	log "github.com/tendermint/tendermint/libs/log"
)

var (
	ms, authkey, sentkey = CreateMultiStore()
	cdc                  = wire.NewCodec()
	ac                   = auth.NewAccountMapper(cdc, authkey, auth.ProtoBaseAccount)
	ctx                  = sdk.NewContext(ms, abci.Header{}, false, log.NewNopLogger())
	keeper               = NewKeeper(cdc, sentkey, bank.NewKeeper(ac), ac, DefaultCodeSpace)
	// keeper               = NewKeeper{
	// 	sentStoreKey: sentkey,
	// 	coinKeeper:
	// 	cdc:          cdc,
	// 	codespace:    DefaultCodeSpace,
	// 	account:      ac,
	// }
)

func CreateMultiStore() (sdk.MultiStore, *sdk.KVStoreKey, *sdk.KVStoreKey) {
	db := dbm.NewMemDB()
	authkey := sdk.NewKVStoreKey("authkey")
	sentinelkey := sdk.NewKVStoreKey("sentinel")
	ms := store.NewCommitMultiStore(db)
	ms.MountStoreWithDB(authkey, sdk.StoreTypeIAVL, db)
	ms.MountStoreWithDB(sentinelkey, sdk.StoreTypeIAVL, db)
	ms.LoadLatestVersion()
	return ms, authkey, sentinelkey

}

func TestPayVpnService(t *testing.T) {
	cd := cdc
	k := keeper
	c := ctx
	am := ac
	auth.RegisterBaseAccount(cd)
	aut1 := am.NewAccountWithAddress(c, addr1)
	aut1.SetPubKey(pk1)
	t.Log(aut1.GetAddress())
	//am.NewAccountWithAddress(c, addr2)
	//	t.Log(k.account.GetAccount(c, addr1).GetPubKey())
	// acc := k.account.GetPubKey(c, addr1)
	// t.Log(acc)
	b, _ := k.account.GetPubKey(c, addr1)
	t.Log(b)
	require.Equal(t, pk1, b)

	//t.Log(k)
	//t.Log(ctx)
	// mp1 := NewMsgPayVpnService(coinPos, addr2, addr1)
	// a := mp1.Type()
	// require.Equal(t, a, "sentinel")
	// require.Equal(t, mp1.GetSigners(), []sdk.AccAddress{addr1})
	// t.Log(k.sentStoreKey)
	// b, add := keeper.GetsentStore(ctx, MsgRegisterMasterNode{Address: addr1})
	// require.Equal(t, add, addr1)
	// t.Log(b)
	// t.Log(k.PayVpnService(c, mp1))

	//require.NotNil(t, sessionid)
	// ////require.Nil(t,err)
	//t.Log(sessionid)
}

func TestGetVpnPayment(t *testing.T) {
	k := keeper
	t.Log(k.sentStoreKey)
	// sessionid := []byte("iK7FDcCc35S4IzoOjgm2")

	// require.Nil(t, err)

	// clientsession := senttype.GetNewSessionMap(coinPos, pk2, pk1)
	// bz := senttype.ClientStdSignBytes(coinPos, sessionid, 1, false)
	// t.Log(bz)
	// sign1, err = pvk1.Sign(bz)
	// t.Log(ctx, keeper)
	// t.Log(sign1)
	//mg := MsgGetVpnPayment{
	//	Signature: sign1,
	//	Coins:     coinPos,
	//	Sessionid: sessionid,
	//	Counter:   1,
	//	Pubkey:    pk1,
	//	From:      addr2,
	//	IsFinal:   false,
	//}
	// a, err := keeper.GetVpnPayment(ctx, MsgGetVpnPayment{Signature: sign1, Coins: coinPos, Sessionid: sessionid, Pubkey: pk1, From: addr2, IsFinal: false, Counter: 1})
	// require.Nil(t, err)
	// require.Equal(t, sessionid, a)
}
