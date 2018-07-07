package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
	"interpreter"
	"html/template"
	"strings"
	"bufio"
	"os"
	"time"
)

func handler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	query := r.URL.Query()
	switch r.Method {
	case "GET":
		fmt.Printf("Got request at IP %v for path %v with query %v\n", r.RemoteAddr, path, r.URL.Query())
		if path == "/" {
			now := time.Now();
			fmt.Printf("/display?date=%v-%02v-%02v", now.Year(), int(now.Month()), now.Day())
			http.Redirect(w, r, fmt.Sprintf("/display?date=%v-%v-%v", now.Year(), int(now.Month()), now.Day()), 302)
		} else if path != "/display" {
			body, err := ioutil.ReadFile(fmt.Sprintf("html/%v",path))
			if err != nil {
				fmt.Printf("Error: %s", err.Error())
			}
			fmt.Fprint(w, string(body))
		} else {
			t, err := template.ParseFiles("html/display_template.html")
			if err != nil {
				fmt.Printf("Error: %s", err.Error())
			}
			date := strings.Split(query["date"][0],"-")
			data := struct {
				Day string
				Month string
				Year string
			} {date[2], date[1], date[0]}
			err = t.Execute(w, data)
			if err != nil {
				fmt.Printf("Error: %s", err.Error())
			}
		}
	case "POST":
		if path == "/sendCommand" {
			body, _ := ioutil.ReadAll(r.Body)
			fmt.Fprint(w, string(interpreter.Interpret(string(body))))
		}
	default:
		fmt.Printf("This is not supposed to be happening")
	}
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Printf("Insert port: ")
	inp, _ := reader.ReadString('\n')
	fmt.Printf(inp)
	http.HandleFunc("/", handler)
	fmt.Printf("server up\n")
	http.ListenAndServe(":"+strings.TrimRight(inp, "\r\n"), nil)
}