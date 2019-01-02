package sentinel

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func TestMsgRegisterVpnService(t *testing.T) {

	cases := []struct {
		From           sdk.AccAddress
		Ip, Location   string
		Netspeed, Ppgb int64
		expectedPass   bool
	}{
		{addr1, "127.0.0.1", "Hyderabad1", 12, 0, false},
		{addr1, "127.0.0.1", "Hyderabad2", 12.000, -123, false},
		{addr1, "127.0.0.1", "Hyderabad3", 0, 1, false},
		{addr2, "127.0.0.1", "Hyderabad4", -23, 1, false},
		{emptyaddr, "127.0.0.1", "Hyderabad5", 12, 1, false},
		{addr3, "", "Hyderabad6", 12, 1, false},
		{addr3, "127.0.0.1", "Hyderabad7", 922337203685470, 1, false},
		{addr3, "127.0.0.1.12", "Hyderabad8", 12, 1, false},
		{addr3, "127.0.0.1", "Hyderabad9", 12, 1, true},
		{addr3, "127.0.0.1", "", 12, 1, false},
		{addr1, "127.0.1.12", "Hyderabad10", 12, 123, true},
	}

	for _, tc := range cases {
		msg := NewMsgRegisterVpnService(tc.From, tc.Ip, tc.Netspeed, tc.Ppgb, tc.Location)
		if tc.expectedPass {
			require.Nil(t, msg.ValidateBasic(), "test : %v", tc.Ip)
		} else {
			require.NotNil(t, msg.ValidateBasic(), "test : %v ", tc.Location)
		}

	}
}

//Register Master node Test

func TestMsgRegisterMasterNodeGetSignBytes(t *testing.T) {
	addr := sdk.AccAddress("abcd")
	msg := NewMsgRegisterMasterNode(addr)
	bytes := msg.GetSignBytes()
	require.Equal(t, string(bytes), `{"Address":"cosmosaccaddr1v93xxeqhyqz5v"}`)
}

//

func TestMsgPayVpnService(t *testing.T) {

	cases := []struct {
		Coins   sdk.Coin
		Vpnaddr sdk.AccAddress
		From    sdk.AccAddress
		expectedPass   bool

	}{
		{coinNeg,addr1,addr2, false},
		{coinPos,addr1,addr2,true},
		{coinPos,addr1,emptyaddr,false},
		{coinPos,emptyaddr,addr2, false},
		{coinPos,emptyaddr,  addr1,false},
		{coinZero,addr1,addr3,false},
		{coinZero,emptyaddr,addr3, false},
		{coinZero,addr3, emptyaddr, false},
		{coinNeg,addr1, emptyaddr,false},
		{coinNeg,emptyaddr,addr2,false},
	}

	for _, tc := range cases {
		msg := NewMsgPayVpnService(tc.Coins, tc.Vpnaddr, tc.From)
		if tc.expectedPass {
			require.Nil(t, msg.ValidateBasic(), "test : %v", tc.From)
		} else {
			require.NotNil(t, msg.ValidateBasic(), "test : %v ", tc.From)
		}

	}
}
