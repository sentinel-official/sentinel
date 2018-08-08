package rest

import (
	"encoding/json"

	// "fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	ioutill "io/ioutil"

	"github.com/tendermint/tendermint/crypto"

	"github.com/cosmos/cosmos-sdk/client/context"
	"github.com/cosmos/cosmos-sdk/client/keys"
	"github.com/cosmos/cosmos-sdk/examples/sentinel"
	senttype "github.com/cosmos/cosmos-sdk/examples/sentinel/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/wire"
	auth "github.com/cosmos/cosmos-sdk/x/auth"
	authcmd "github.com/cosmos/cosmos-sdk/x/auth/client/cli"
	"github.com/gorilla/mux"
	log "github.com/logger"
)

type MsgRegisterVpnService struct {
	//Address      string `json:"address"`
	Ip           string `json:"ip"`
	Netspeed     int64  `json:"netspeed"`
	Ppgb         int64  `json:"ppgb"`
	Location     string `json:"location"`
	Localaccount string `json:"account"`
	//Password     string `json:"password"`
	ChainID string `json:"chain-id"`
	Gas     int64  `json:"gas"`
	//Sequence     int64  `json:"sequence"`
}
type MsgRegisterMasterNode struct {
	//Address string `json:"address",omitempty`
	Name    string `json:"name"`
	ChainID string `json:"chain-id"`
	Gas     int64  `json:"gas"`
	//pubkey  crypto.PubKey `json:"pubkey",omitempty`
}

type MsgDeleteVpnUser struct {
	Address string `json:"address", omitempty`
	Name    string `json:"name"`
	ChainID string `json:"chain-id"`
	Gas     int64  `json:"gas"`
}
type MsgDeleteMasterNode struct {
	Address string `json:"address", omitempty`
	Name    string `json:"name"`
	ChainID string `json:"chain-id"`
	Gas     int64  `json:"gas"`
}
type MsgPayVpnService struct {
	Coins        string `json:"coins", omitempty`
	Vpnaddr      string `json:"vaddress", omitempty`
	Localaccount string `json:"account"`
	//	Password     string `json:"password"`
	ChainID string `json:"chain-id"`
	Gas     int64  `json:"gas"`
}

type MsgSigntoVpn struct {
	coins     sdk.Coin          `json:"coins", omitempty`
	address   sdk.AccAddress    `json:"address", omitempty`
	sessionid int64             `json:"session_id", omitempty`
	signature auth.StdSignature `json:"signature", omitempty`
	from      sdk.AccAddress    `json:"from", omitempty`
}

type MsgGetVpnPayment struct {
	Coins        string `json:"coin"`
	Sessionid    string `json:"session-id"`
	Counter      int64  `json:"counter"`
	ChainID      string `json:"chain-id"`
	Localaccount string `json:"account"`
	Gas          int64  `json:"gas"`
	IsFinal      bool   `json:"isfinal"`

	//	Signature    string `json:"signature"`
}

type MsgRefund struct {
	Name      string `json:"name"`
	Sessionid string `json:"session_id", omitempty`
	ChainID   string `json:"chain-id"`
	Gas       int64  `json:"gas"`
}

// client Signature :

type ClientSignature struct {
	Coins        string `json:"coin"`
	Sessionid    string `json:"session-id"`
	Counter      int64  `json:"counter"`
	isFinal      bool   `json:"isfinal"`
	Localaccount string `json:"account"`
	Password     string `json:"password"`
}

func ServiceRoutes(ctx context.CoreContext, r *mux.Router, cdc *wire.Codec) {

	r.HandleFunc(
		"/register/vpn",
		registervpnHandlerFn(ctx, cdc),
	).Methods("POST")

	r.HandleFunc(
		"/register/master",
		registermasterdHandlerFn(ctx, cdc),
	).Methods("POST")

	r.HandleFunc(
		"/refund",
		RefundHandleFn(ctx, cdc),
	).Methods("POST")

	r.HandleFunc(
		"/master",
		deleteMasterHandlerFn(ctx, cdc),
	).Methods("DELETE")

	r.HandleFunc(
		"/vpn",
		deleteVpnHandlerFn(ctx, cdc),
	).Methods("DELETE")
	r.HandleFunc(
		"/vpn/pay",
		PayVpnServiceHandlerFn(ctx, cdc),
	).Methods("POST")
	r.HandleFunc(
		"/send-sign",
		SendSignHandlerFn(ctx, cdc),
	).Methods("POST")
	r.HandleFunc(
		"/vpn/getpayment",
		GetVpnPaymentHandlerFn(ctx, cdc),
	).Methods("POST")

}

/**
* @api {post} /register/vpn To register VPN service provider.
* @apiName registerVPN
* @apiGroup Sentinel-Tendermint
* @apiParam {String} ip Ip address of VPN service provider.
* @apiParam {Number}  netspeed Net speed of VPN service.
* @apiParam {Number} ppgb Price per GB.
* @apiParam {String} location  Location of service provider.
* @apiParam {String} account Account name of service provider.
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AccountAlreadyExists VPN service provider already exists
* @apiErrorExample AccountAlreadyExists-Response:
* {
*   success: false,
*   message: 'Account is already registered..'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Account is registered successfully'
* }
*/

type Response struct {
	Success bool   `json:"status"`
	Message string `json:"message"`
}

func NewResponse(status bool, msg string) Response {
	//var res Response
	return Response{
		Success: status,
		Message: msg,
	}
}

func registervpnHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var a int64
		msg := MsgRegisterVpnService{}
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		err = json.Unmarshal(body, &msg)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid  Msg Unmarshal function Request"))
			return
		}

		if !validateIp(msg.Ip) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("  invalid Ip address."))
			return

		}
		if reflect.TypeOf(msg.Ppgb) != reflect.TypeOf(a) || msg.Ppgb < 0 || msg.Ppgb > 100000 {

			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" entered invalid amount of price per Gb"))
			return
		}
		if reflect.TypeOf(msg.Netspeed) != reflect.TypeOf(a) || msg.Netspeed < 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" entered invalid details"))
			return
		}
		ctx = ctx.WithChainID(msg.ChainID)
		ctx = ctx.WithGas(msg.Gas)
		ctx = ctx.WithFromAddressName(msg.Localaccount)
		addr, err := ctx.GetFromAddress()
		if err != nil {
			sdk.ErrInvalidAddress("The given Adress is Invalid")
		}
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))

		//ctx=ctx.WithAccountNumber(msg.AccountNumber)
		msg1 := sentinel.NewMsgRegisterVpnService(addr, msg.Ip, msg.Ppgb, msg.Netspeed, msg.Location)
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		//var result Response
		if err != nil {
			response := NewResponse(false, "Account is already registered.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Account is added successfully")
		data, _ := json.Marshal(response)

		w.Write(data)
	}
	return nil
}

/**
* @api {post} /register/master To register Master Node.
* @apiName registerMasterNode
* @apiGroup Sentinel-Tendermint
* @apiParam {String} name  Account name of Master Node.
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AccountAlreadyExists Master Node already exists
* @apiErrorExample AccountAlreadyExists-Response:
* {
*   success: false,
*   message: 'Account is already registered..'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Account is registered successfully'
* }
*/
func registermasterdHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		msg := MsgRegisterMasterNode{}
		var err error
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			return
		}

		json.Unmarshal(body, &msg)
		ctx = ctx.WithFromAddressName(msg.Name)
		ctx = ctx.WithGas(msg.Gas)
		addr, err := ctx.GetFromAddress()
		if err != nil {
			sdk.ErrInvalidAddress("The given Adress is Invalid")
		}
		ctx = ctx.WithChainID(msg.ChainID)
		ctx = ctx.WithGas(msg.Gas)
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		//ctx=ctx.WithAccountNumber(msg.AccountNumber)
		msg1 := sentinel.NewMsgRegisterMasterNode(addr)
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			response := NewResponse(false, "Account is already registered.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Account is registered successfully")
		data, _ := json.Marshal(response)

		w.Write(data)

	}
	return nil
}

/**
* @api {delete} /vpn To Delete VPN Node.
* @apiName  deleteVpnNode
* @apiGroup Sentinel-Tendermint
* @apiParam {String} address  Address of VPN Node which we want to delete.
* @apiParam {String} name AccountName of the person who is deleting the VPN node.
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AccountNotExists VPN Node not exists
* @apiErrorExample AccountNotExists-Response:
* {
*   success: false,
*   message: 'Account is not exist..'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Account is deleted successfully'
* }
*/
func deleteVpnHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		var msg MsgDeleteVpnUser
		var err error
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			return
		}
		json.Unmarshal(body, &msg)
		if msg.Address == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" entered invalid address."))
			return
		}
		Vaddr, err := sdk.AccAddressFromBech32(msg.Address)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		ctx = ctx.WithGas(msg.Gas)
		ctx = ctx.WithFromAddressName(msg.Name)
		ctx = ctx.WithChainID(msg.ChainID)
		from, err := ctx.GetFromAddress()
		if err != nil {
			panic(err)
		}
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		// msg:= sentinel.MsgDeleteVpnUser{addres}
		log.WriteLog(from.String() + "......" + Vaddr.String())
		msg1 := sentinel.NewMsgDeleteVpnUser(from, Vaddr)
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			response := NewResponse(false, "Account is not exist.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Account is deleted successfully")
		data, _ := json.Marshal(response)

		w.Write(data)
	}
	return nil
}

/**
* @api {delete} /master To Delete Master Node.
* @apiName  deleteMasterNode
* @apiGroup Sentinel-Tendermint
* @apiParam {String} address  Address of Master Node which we want to delete.
* @apiParam {String} name AccountName of the person who is deleting the Master node.
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AccountNotExists Master Node not exists
* @apiErrorExample AccountNotExists-Response:
* {
*   success: false,
*   message: 'Account is not exist..'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Account is deleted successfully'
* }
*/
func deleteMasterHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		var msg MsgDeleteMasterNode
		var err error
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			return
		}
		json.Unmarshal(body, &msg)
		if msg.Address == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" entered invalid address."))
			return
		}
		Maddr, err := sdk.AccAddressFromBech32(msg.Address)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		ctx = ctx.WithGas(msg.Gas)
		ctx = ctx.WithFromAddressName(msg.Name)
		ctx = ctx.WithChainID(msg.ChainID)
		from, err := ctx.GetFromAddress()
		if err != nil {
			sdk.ErrInvalidAddress("The given Adress is Invalid")
		}
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		// msg:= sentinel.MsgDeleteVpnUser{addres}
		msg1 := sentinel.NewMsgDeleteMasterNode(from, Maddr)
		log.WriteLog(from.String() + "......" + Maddr.String())
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			response := NewResponse(false, "Account is not exist.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Account is deleted successfully")
		data, _ := json.Marshal(response)
		w.Write(data)
	}
	return nil
}

func validateIp(host string) bool {
	parts := strings.Split(host, ".")

	if len(parts) < 4 {
		return false
	}

	for _, x := range parts {
		if i, err := strconv.Atoi(x); err == nil {
			if i < 0 || i > 255 {
				return false
			}
		} else {
			return false
		}

	}
	return true
}

/**
* @api {post} /vpn/pay To Pay for VPN service.
* @apiName  payVPN service
* @apiGroup Sentinel-Tendermint
* @apiParam {String} coins  Amount to pay for vpn service.
* @apiParam {String} vaddress Address of the vpn service provider.
* @apiParam {String} account Account name of Client
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AccountNotExists VPN Node not exists
* @apiErrorExample AccountNotExists-Response:
* {
*   success: false,
*   message: 'VPN address  is not registered..'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Payment done successfully'
* }
*/
func PayVpnServiceHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//var msg MsgRegisterVpnService
		msg := MsgPayVpnService{}
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		err = json.Unmarshal(body, &msg)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			// w.Write([]byte("Invalid  Msg Unmarshal function Request"))
			return
		}
		if msg.Coins == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" invalid address."))
			return
		}
		if msg.Vpnaddr == "" {

			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" entered invalid vpn address"))
			return
		}
		vaddr, err := sdk.AccAddressFromBech32(msg.Vpnaddr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		coins, err := sdk.ParseCoin(msg.Coins)
		if err != nil {

			sdk.ErrInternal("Parse Coins Failed")
		}

		ctx = ctx.WithFromAddressName(msg.Localaccount)
		ctx = ctx.WithChainID(msg.ChainID)
		ctx = ctx.WithGas(msg.Gas)
		//ctx = ctx.WithSequence(msg.Sequence)
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		addr, err := ctx.GetFromAddress()
		if err != nil {
			sdk.ErrInvalidAddress("The given Adress is Invalid")
			return
		}
		msg1 := sentinel.NewMsgPayVpnService(coins, vaddr, addr)
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			response := NewResponse(false, "VPN address is not registered.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Payment done successfully")
		data, _ := json.Marshal(response)
		w.Write(data)

	}
	return nil
}

/**
* @api {post} /refund To Refund the balance of client.
* @apiName  Refund
* @apiGroup Sentinel-Tendermint
* @apiParam {String} name AccountName of the client.
* @apiParam {String} session-id session-id.
* @apiParam {String} chain-id chain-id.
* @apiParam {Number} gas Gas value.
* @apiError AddressInvalid Address is not valid
* @apiErrorExample AddressInvalid-Response:
* {
*   success: false,
*   message: 'Address is not associated with this SessionId'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Balance added Successfully'
* }
*/

func RefundHandleFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		msg := MsgRefund{}
		var err error
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			return
		}
		err = json.Unmarshal(body, &msg)
		if err != nil {
			sentinel.ErrUnMarshal("Unmarshal of Given Message Type is failed")

		}
		ctx = ctx.WithChainID(msg.ChainID)
		ctx = ctx.WithFromAddressName(msg.Name)
		ctx = ctx.WithGas(msg.Gas)
		addr, err := ctx.GetFromAddress()
		if err != nil {
			sdk.ErrInvalidAddress("The given Adress is Invalid")
		}
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		log.WriteLog("session id from client" + msg.Sessionid)
		msg1 := sentinel.NewMsgRefund(addr, []byte(msg.Sessionid))
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			panic(err)
			response := NewResponse(false, "Address is not associated with SessionId")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Balance added Successfully")
		data, _ := json.Marshal(response)
		w.Write(data)
	}
}

//To create client signature....... This is not a transaction......
func SendSignHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		msg := ClientSignature{}
		var err error
		body, err := ioutill.ReadAll(r.Body)
		if err != nil {
			return
		}
		err = json.Unmarshal(body, &msg)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			// w.Write([]byte("Invalid  Msg Unmarshal function Request"))
			return
		}
		coins, err := sdk.ParseCoin(msg.Coins)
		if err != nil {
			sdk.ErrInternal("Parse Coins Failed")
		}
		bz := senttype.ClientStdSignBytes(coins, []byte(msg.Sessionid), msg.Counter, msg.isFinal)

		keybase, err := keys.GetKeyBase()
		if err != nil {
			sentinel.ErrKeyBase("Can't Get the Keybase")
		}

		sig, pubkey, err := keybase.Sign(msg.Localaccount, msg.Password, bz)
		if err != nil {
			sentinel.ErrSignMsg("Signature of given Message is failed")
		}
		Signature.Signature = sig
		Signature.Pubkey = pubkey
		//signature := types.NewSignature(pubkey, sig)
		val := senttype.NewClientSignature(coins, []byte(msg.Sessionid), msg.Counter, pubkey, sig, msg.isFinal)

		address := val.Signature.Pubkey.Address().String()
		log.WriteLog("address of signed " + address)
		data, err := json.Marshal(val)
		if err != nil {
			panic(err)
		}
		log.WriteLog(string(data))
	}
	return nil
}

var Signature struct {
	Pubkey    crypto.PubKey
	Signature crypto.Signature
}

/**
* @api {post} /vpn/getpayment To get payment of vpn service
* @apiName  GetVPNPayment
* @apiGroup Sentinel-Tendermint
* @apiParam {String} coin Amount to send VPN node.
* @apiParam {String} session-id session-id.
* @apiParam {Number} counter Counter value.
* @apiParam {String} chain-id chain-id.
* @apiParam {String} account Account name of client.
* @apiParam {Number} gas gas value.
* @apiParam {Boolean} isfinal is this final signature or not.
* @apiError Signature VerificationFailed signature verification failed
* @apiErrorExample SignatureFailed-Response:
* {
*   success: false,
*   message: 'Signature varification is faild.'
* }
* @apiSuccessExample Response:
{
*   success: true,
*   message: 'Payment done successfully'
* }
*/
func GetVpnPaymentHandlerFn(ctx context.CoreContext, cdc *wire.Codec) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		msg := MsgGetVpnPayment{}
		body, err := ioutill.ReadAll(r.Body)
		w.Write(body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		err = json.Unmarshal(body, &msg)
		if err != nil {
			sentinel.ErrUnMarshal("UnMarshal of MessageType is failed")
			w.WriteHeader(http.StatusBadRequest)
			// w.Write([]byte("Invalid  Msg Unmarshal function Request"))
			return
		}
		log.WriteLog("coins" + msg.Coins + "sessionid" + msg.Sessionid)
		if msg.Coins == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" invalid address."))
			return
		}
		if msg.Sessionid == "" {

			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(" Session Id is wrong"))
			return
		}
		log.WriteLog("coins" + msg.Coins + "sessionid" + msg.Sessionid)
		if msg.Counter < 0 {

			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid Counter"))
			return
		}
		coins, err := sdk.ParseCoin(msg.Coins)
		if err != nil {
			sdk.ErrInternal("Parse Coins failed")
		}

		ctx = ctx.WithFromAddressName(msg.Localaccount)
		ctx = ctx.WithChainID(msg.ChainID)
		ctx = ctx.WithGas(msg.Gas)
		ctx = ctx.WithDecoder(authcmd.GetAccountDecoder(cdc))
		addr, err := ctx.GetFromAddress()
		if err != nil {
			panic(err)
		}
		//Time := time.Now()
		//	msg1 := sentinel.NewMsgGetVpnPayment(coins, []byte(msg.Sessionid), msg.Counter, addr,Signature, senttype.ClientSignature.IsFinal, caddr)
		msg1 := sentinel.NewMsgGetVpnPayment(coins, []byte(msg.Sessionid), msg.Counter, addr, Signature.Signature, Signature.Pubkey, msg.IsFinal)
		err = ctx.EnsureSignBuildBroadcast(ctx.FromAddressName, []sdk.Msg{msg1}, cdc)
		if err != nil {
			response := NewResponse(false, "Signature varification is faild.")
			data, _ := json.Marshal(response)
			w.Write(data)
			return
			//panic(err)
		}
		response := NewResponse(true, "Payment done successfully")
		data, _ := json.Marshal(response)
		w.Write(data)
	}
	return nil
}
