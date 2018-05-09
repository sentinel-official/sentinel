package main

import (
	"fmt"
	"os/exec"
	"os"
	"strings"
)

func main() {
	startSOCKS5()
}

func startSOCKS5() {
	cmd := ".\\Shadowsocks.exe -c gui-config.json"
	cmdParts := strings.Fields(cmd)

	execSOCKS5 := exec.Command(cmdParts[0], cmdParts[1:]...)

	if err := execSOCKS5.Start(); err != nil {
		fmt.Println("error occured while starting SOCKS5 client")
		os.Exit(1)
	}
	execSOCKS5.Wait()
}