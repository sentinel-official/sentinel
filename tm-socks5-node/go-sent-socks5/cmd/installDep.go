package cmd

import (
	"fmt"
	"os/exec"
	"strings"

	"github.com/spf13/cobra"
)

// killCmd represents the new command
var installdep = &cobra.Command{
	Use:   "install-dep",
	Short: "install dependencies for your OS",
	Run: func(cmd *cobra.Command, args []string) {
		installDep()
	},
}

func init() {
	rootCmd.AddCommand(installdep)
}

func installDep() {
	cmd := "sudo apt-get install python-pip -y"
	cmdParts := strings.Fields(cmd)

	installPip := exec.Command(cmdParts[0], cmdParts[1:]...)

	if err := installPip.Start(); err != nil {
		// fmt.Errorf("Could Not Start the Shadowsocks server: %v", err)
		panic(err)
	}
	installPip.Wait()

	cmd2 := "pip install shadowsocks"
	cmdParts2 := strings.Fields(cmd2)

	installShadowsocks := exec.Command(cmdParts2[0], cmdParts2[1:]...)

	if err := installShadowsocks.Start(); err != nil {
		// fmt.Errorf("Could Not Start the Shadowsocks server: %v", err)
		panic(err)
	}
	fmt.Println("Installed Dependencies Successfuly")
}
