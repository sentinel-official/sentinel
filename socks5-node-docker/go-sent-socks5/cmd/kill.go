package cmd

import (
	"fmt"
	"os/exec"
	"strings"

	"github.com/spf13/cobra"
)

// killCmd represents the new command
var killCmd = &cobra.Command{
	Use:   "kill",
	Short: "Kill Your Sentinel SOCKS5 Node",
	Run: func(cmd *cobra.Command, args []string) {
		KillSocks5Node()
	},
}

func init() {
	rootCmd.AddCommand(killCmd)
}

// KillSocks5Node and config-server
func KillSocks5Node() {
	cmd := "killall ssserver"
	cmdParts := strings.Fields(cmd)

	killSocks := exec.Command(cmdParts[0], cmdParts[1:]...)

	if err := killSocks.Start(); err != nil {
		// fmt.Errorf("Could Not Start the Shadowsocks server: %v", err)
		panic(err)
	}

	cmd2 := "killall config-server"
	cmd2Parts := strings.Fields(cmd2)

	killConfigServer := exec.Command(cmd2Parts[0], cmd2Parts[1:]...)

	if err2 := killConfigServer.Start(); err2 != nil {
		panic(err2)
	}

	fmt.Println("killed successfully")
}
