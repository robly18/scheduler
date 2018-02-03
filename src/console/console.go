package main

import (
	"interpreter"
	"bufio"
	"os"
	"fmt"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Printf(">>")
		inp, err := reader.ReadString('\n')
		if err != nil {
			fmt.Printf(err.Error())
			break
		}
		if strings.TrimRight(inp, "\r\n") == "quit" {
			break
		}
		fmt.Println(interpreter.Interpret(inp))
	}
}