package main

import (
	"net/http"
	"fmt"
	"io/ioutil"
	"interpreter"
	"html/template"
)

func handler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	query := r.URL.Query()
	switch r.Method {
	case "GET":
		fmt.Printf("Got request at IP %v for path %v with query %v\n", r.RemoteAddr, path, r.URL.Query())
		if path != "/display" {
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
			data := struct {
				Day string
				Month string
				Year string
			} {query["day"][0], query["month"][0], query["year"][0]}
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
	http.HandleFunc("/", handler)
	fmt.Printf("server up\n")
	http.ListenAndServe(":8080", nil)
}