package rest

import (
	"github.com/gorilla/mux"
	"net/http"
	"fmt"
	//"io/ioutil"
	"github.com/cosmos/cosmos-sdk/client/context"
	sent "github.com/cosmos/cosmos-sdk/examples/sentinel"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cosmos/cosmos-sdk/x/auth"
	authcmd "github.com/cosmos/cosmos-sdk/x/auth/client/cli"
	"github.com/cosmos/cosmos-sdk/wire"
		"github.com/cosmos/cosmos-sdk_old/cmd/gaia/log"
)

const (
	storeName = "sentinel"
)

// type MsgQueryRegisteredVpnService struct {
// 	address sdk.AccAddress `json:"address",omitempty`
// }
// type MsgQueryFromMasterNode struct {
// 	address sdk.AccAddress `json:"address",omitempty`
// }
//type MsgQueryVpn struct {
//	Address string `json:"address"`
//	}
//type MsgQueryMaster struct {
//	Address string `json:"address"`
//}
func QueryRoutes(ctx context.CoreContext, r *mux.Router,cdc *wire.Codec, keeper sent.Keeper) {
	r.HandleFunc(
		"/query_vpn/{address}",
		queryvpnHandlerFn(cdc,  ctx,keeper),
	).Methods("GET")

	r.HandleFunc(
		"/query_master_node/{address}",
		querymasterHandlerFn(cdc, authcmd.GetAccountDecoder(cdc), ctx, keeper),
	).Methods("GET")

}

func queryvpnHandlerFn(cdc *wire.Codec, ctx context.CoreContext, k sent.Keeper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//msg := MsgQueryVpn{}
		vars := mux.Vars(r)
		address := vars["address"]

		addr, err := sdk.AccAddressFromBech32(address)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		res, err := ctx.QueryStore([]byte(addr.String()), storeName)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf("couldn't query account. Error: %s", err.Error())))
			return
		}

		// the query will return empty if there is no data for this account
		if len(res) == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		//a,err :=json.Marshal(res)
		//if err!=nil{
		//	w.Write([]byte(fmt.Sprintf("marshal json. Error: %s", err.Error())))
		//}
		log.WriteLog("the given result is"+string(res))

		// decode the value
		account,err := k.NewMsgDecoder(res)
		if err!=nil{
			w.Write([]byte(fmt.Sprintf("the vpn account unmarshal failed. Error: %s", err.Error())))
			return
		}


		// print out whole account
		output, err := cdc.MarshalJSON(account)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf("couldn't marshall query result. Error: %s", err.Error())))
			return
		}

		w.Write(output)
	}
}

func querymasterHandlerFn(cdc *wire.Codec,decoder auth.AccountDecoder, ctx context.CoreContext, keeper sent.Keeper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
//	/*	vars := mux.Vars(r)
//		bech32addr := vars["address"]
//
//		addr, err := sdk.AccAddressFromBech32(bech32addr)
//		if err != nil {
//			w.WriteHeader(http.StatusBadRequest)
//			w.Write([]byte(err.Error()))
//			return
//		}
//		sentStoreKey:= keeper.StoreKey()
//		data:=keeper.QueryStore(addr,sentStoreKey)
//
//		if data != nil {
//			//output:=keeper.Unmarshaling(address)
//			w.Write(data)
//			return
//		}
return

	}
}