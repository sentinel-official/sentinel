package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
	fast "gopkg.in/ddo/go-fast.v0"
)

var keyAddr string

// Speed of the Node (Download Speed)
var Speed float64

// UpdateNodeStats is used for maintaining the health of the node
type UpdateNodeStats struct {
	Token       string `json:"token"`
	AccountAddr string `json:"account_addr"`
	Info        info   `json:"info"`
}
type info struct {
	Type string `json:"type"`
}

// Socks5Config info
type Socks5Config struct {
	Server       string   `json:"server"`
	PortPassword portPass `json:"port_password"`
	Timeout      int32    `json:"timeout"`
	Method       string   `json:"method"`
}

//NetworkInfo represent the network info about current socks5 Node
type NetworkInfo struct {
	// As          string  `json:"as"`
	City    string `json:"city"`
	Country string `json:"country"`
	// CountryCode string  `json:"countryCode"`
	// ISP         string  `json:"isp"`
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
	// Org         string  `json:"org"`
	IPAddr string `json:"query"`
	// Region      string  `json:"region"`
	// RegionName  string  `json:"regionName"`
	// Status      string  `json:"status"`
	// TimeZone    string  `json:"timezone"`
	// ZipCode     string  `json:"zip"`
}

type portPass struct {
	PortPassword0 string `json:"4200"`
}

//UserKeystore will be saved in a file
type UserKeystore struct {
	keystoreData keystore `json:"keystore"`
}

type keystore struct {
	Version string `json:"version"`
	ID      string `json:"id"`
	Address string `json:"address"`
	Crypto  crypto `json:"Crypto"`
}

type crypto struct {
	CipherText   string `json:"ciphertext"`
	CipherParams struct {
		IV string `json:"iv"`
	} `json:"cipherparams"`
	Cipher    string `json:"cipher"`
	KDF       string `json:"kdf"`
	KDFParams struct {
		DKLEN int32  `json:"dklen"`
		Salt  string `json:"salt"`
		N     int32  `json:"n"`
		R     int32  `json:"r"`
		P     int32  `json:"p"`
	} `json:"kdfparams"`
	MAC string `json:"mac"`
}

type configData struct {
	Token       string `json:"token"`
	AccountAddr string `json:"account_addr"`
	PricePerGB  int32  `json:"price_per_gb"`
}

//NodeStats represent the info about current socks5 Node
type NodeStats struct {
	AccountAddr string    `json:"account_addr"`
	PricePerGB  string    `json:"price_per_gb"`
	IPAddr      string    `json:"ip"`
	Location    location  `json:"location"`
	NetSpeed    bandwidth `json:"net_speed"`
	VPNType     string    `json:"vpn_type"`
}

type bandwidth struct {
	Download float64 `json:"download"`
	Upload   float64 `json:"upload"`
}

type location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	City      string  `json:"city"`
	Country   string  `json:"country"`
}

// UserAccount for storing keystore
type UserAccount struct {
	AccountAddress string `json:"account_addr"`
}

// Token struct for node authenticity
type Token struct {
	Token string `json:"token"`
}

// runCmd represents the new command
var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Spin up a new SOCKS5 node in Sentinel's Distributed Network",
	Run: func(cmd *cobra.Command, args []string) {
		p, err1 := cmd.Flags().GetString("sentinels-per-gb")
		w, err2 := cmd.Flags().GetString("wallet-address")
		k, err3 := cmd.Flags().GetString("encryption-key")
		if err1 != nil {
			return
		}
		if err2 != nil {
			return
		}
		if err3 != nil {
			return
		}
		if p == "" {
			fmt.Println("enter price per GB of bandwidth using flag -p")
			os.Exit(1)
		}
		if len(w) < 42 {
			fmt.Println("enter a valid ethereum wallet address using flag -w")
			os.Exit(1)
		}
		if len(k) < 4 {
			fmt.Println("enter at least a 4 character long password for SOCKS5 node using flag -k")
			os.Exit(1)
		}
		RegisterNode(w, p)
		createConfig(k)
		StartSocks5Node()
	},
}

func init() {
	runCmd.Flags().StringP("wallet-address", "w", "", "wallet address to receive sentinels")
	runCmd.Flags().StringP("sentinels-per-gb", "p", "", "price per GB(Giga-Byte)")
	runCmd.Flags().StringP("encryption-key", "k", "", "SOCKS5 Node Password")
	rootCmd.AddCommand(runCmd)
	// getNewWallet()
}

func createConfig(k string) {

	file, err := os.Create(".config.json")
	if err != nil {
		log.Printf("error occured while creating socks config file: %v", err)
	}
	bytes, err := json.Marshal(Socks5Config{
		Server: "0.0.0.0",
		Method: "aes-256-cfb",
		PortPassword: portPass{
			PortPassword0: k,
		},
		Timeout: 300,
	})
	defer file.Close()
	fmt.Fprintf(file, string(bytes))
}

//StartSocks5Node start a shadowsocks server as daemon
func StartSocks5Node() {
	cmd := "ssserver -c /home/.config.json"
	cmdParts := strings.Fields(cmd)

	startSocks := exec.Command(cmdParts[0], cmdParts[1:]...)

	if err := startSocks.Start(); err != nil {
		log.Fatalf("you are missing shadowsocks server, install it by running sent-socks5 install-dep: %v", err)
	}

	configServer := "config-server"
	split := strings.Fields(configServer)
	startInfoServer := exec.Command(split[0], split[1:]...)

	if err := startInfoServer.Start(); err != nil {
		log.Fatalf("You're missing info-server: %v", err)
	}
	fmt.Println("opened port :3000 for clients to get SOCKS5 server config")
	updateNodeInfo()
	fmt.Println(Speed)
	fmt.Println("Started SOCKS5 Server")
}

// RegisterNode func for registering the user's socks5 node,
func RegisterNode(w string, p string) {

	// getNewWallet()
	URL := "https://api.sentinelgroup.io/node/register"
	// fmt.Println("URL:>", URL)

	ipAddr, err := http.Get("http://ip-api.com/json")
	if err != nil {
		os.Stderr.WriteString(err.Error())
		os.Stderr.WriteString("\n")
		os.Exit(1)
	}
	netStat := NetworkInfo{}

	defer ipAddr.Body.Close()
	jsn, err := ioutil.ReadAll(ipAddr.Body)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(jsn, &netStat)
	if err != nil {
		panic(err)
	}

	fmt.Printf("your public IP Address is: %v\n", netStat.IPAddr)

	// var node NodeStatsc

	fastCom := fast.New()

	// init
	err = fastCom.Init()
	if err != nil {
		panic(err)
	}

	// get urls
	urls, err := fastCom.GetUrls()
	if err != nil {
		panic(err)
	}

	// measure
	KbpsChan := make(chan float64)

	go func() {
		for Kbps := range KbpsChan {
			Speed = Kbps
		}

		fmt.Printf("Download Speed: %v\n", floattostrwithprec(Speed, 4))
	}()

	err = fastCom.Measure(urls, KbpsChan)
	if err != nil {
		panic(err)
	}
	fmt.Println("Price Per GB of Data is: \n", p, "$SENTs")
	if w != "" && p != "" {
		some := &NodeStats{
			IPAddr: netStat.IPAddr,
			Location: location{
				Latitude:  netStat.Lat,
				Longitude: netStat.Lon,
				City:      netStat.City,
				Country:   netStat.Country,
			},
			AccountAddr: w,
			NetSpeed: bandwidth{
				Download: Speed * 1024,
				Upload:   Speed * 1024,
			},
			PricePerGB: p,
			VPNType:    "socks5",
		}

		may, err := json.Marshal(some)

		req, err := http.NewRequest("POST", URL, bytes.NewBuffer(may))
		// req.Header.Set("X-Custom-Header", "myvalue")
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		token := &Token{}
		body, _ := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &token)
		if err != nil {
			log.Printf("error occured while unmarshalling: %v", err)
		}

		fmt.Println("Master Node Response: ", string(body))
		file, err := os.Create("config.data")
		if err != nil {
			log.Printf("error occured while creating cofigData: %v", err)
		}

		bytes, err := json.Marshal(configData{
			Token:       token.Token,
			PricePerGB:  200,
			AccountAddr: w,
		})
		defer file.Close()
		fmt.Fprintf(file, string(bytes))
	}
}

// Saving Keystore for user and node config
func updateNodeInfo() {
	URL := "https://api.sentinelgroup.io/node/update-nodeinfo"
	file, err := os.Open("config.data")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	b, _ := ioutil.ReadAll(file)
	fileOBJ := &UpdateNodeStats{}
	err = json.Unmarshal(b, &fileOBJ)
	NodeInfo := &UpdateNodeStats{
		Token:       fileOBJ.Token,
		AccountAddr: fileOBJ.AccountAddr,
		Info: info{
			Type: "vpn",
		},
	}

	mrsh, _ := json.Marshal(NodeInfo)
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
	// err = json.Unmarshal(body, &token)
	// if err != nil {
	// 	panic(err)
	// }

	fmt.Println("Response From Master Node ", string(body))

}

func floattostrwithprec(fv float64, prec int) string {
	return strconv.FormatFloat(fv, 'f', prec, 64)
}
