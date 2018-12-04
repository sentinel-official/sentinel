package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/spf13/cobra"
)

//KeyString for storing user's stringified keystore
type KeyString struct {
	Keystore string `json:"keystore"`
}

type password struct {
	Password string `json:"password"`
}

//WalletAddr for storing user's ETH Wallet Addr
type WalletAddr struct {
	AccountAddr string `json:"account_addr"`
}

// killCmd represents the new command
var getWallet = &cobra.Command{
	Use:   "get-wallet",
	Short: "get a new ethereum wallet address",
	Run: func(cmd *cobra.Command, args []string) {
		p, err := cmd.Flags().GetString("password")
		if err != nil {
			return
		}
		if len(p) < 6 {
			fmt.Println("please enter at least a six digit password using flag -p")
			os.Exit(1)
		}
		getNewWallet(p)
	},
}

func init() {
	getWallet.Flags().StringP("password", "p", "", "password for your new wallet address")
	rootCmd.AddCommand(getWallet)
}

func getNewWallet(p string) {

	URL := "https://api.sentinelgroup.io/node/account"

	fmt.Println("your wallet password will be := ", p)
	fmt.Println("don't share this password with anyone. \n Anyone who know's this password and your keystore, \n can withdraw sentinels or any eth based currency from your account")
	pass := &password{
		Password: p,
	}
	mrsh, _ := json.Marshal(pass)
	req, err := http.NewRequest("POST", URL, bytes.NewBuffer(mrsh))
	if err != nil {
		fmt.Printf("Could Not Get Wallet Address: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer req.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	// fmt.Printf(string(body))

	accountInfo := &KeyString{}
	walletAddr := &WalletAddr{}
	err = json.Unmarshal(body, &accountInfo)
	if err != nil {
		fmt.Printf("Error here: %v", err)
	}

	err = json.Unmarshal(body, &walletAddr)
	if err != nil {
		fmt.Printf("Error here: %v", err)
	}
	keyAddr = walletAddr.AccountAddr
	// fmt.Printf("%v", accountInfo)
	file, err := os.Create("keystore")
	if err != nil {
		log.Printf("error occured while creating keystore: %v", err)
	}
	bytes, err := json.Marshal(accountInfo.Keystore)
	defer file.Close()
	// keystoreError != nil {
	unquoteKeystore, _ := strconv.Unquote(string(bytes))
	// keystoreError != nil {
	// 	panic(keystoreError)
	// }
	fmt.Fprintf(file, unquoteKeystore)
	fmt.Println("Your keystore is successfuly stored in a file named 'keystore'")
}
