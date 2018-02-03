package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
	"interpreter"
)

func handler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	switch r.Method {
	case "GET":
		body, err := ioutil.ReadFile("front_page.html")
		if err != nil {
			fmt.Printf("Error: %s", err.Error())
		}
		fmt.Fprintf(w, string(body))
	case "POST":
		if path == "/sendCommand" {
			body, _ := ioutil.ReadAll(r.Body)
			fmt.Fprintf(w, string(interpreter.Interpret(string(body))))
		}
	default:
		fmt.Printf("This is not supposed to be happening")
	}
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Printf("server up")
	http.ListenAndServe(":8080", nil)
}