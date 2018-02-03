package interpreter

import (
	"core"
	"errors"
	"shlex"
	"strconv"
)

func notImplementedError() error {
	return errors.New("not implemented")
}

func wrongArgNo() error {
	return errors.New("wrong argument number")
}


func Interpret(command string) string {
	argv, err := shlex.Split(command)
	if err != nil {
		return err.Error()
	}
	out, err := runArgs(argv)
	if err != nil {
		return err.Error()
	}
	return out
}

func runArgs(args []string) (string, error) {
	if len(args) == 0 {
		return "", nil
	}
	switch args[0] {
	case "add": //add NAME SUBJECT
		if len(args) != 3 {
			return "", wrongArgNo()
		}
		return core.AddTeacher(args[1], args[2])
	case "remove": //remove ID
		if len(args) != 2 {
			return "", wrongArgNo()
		}
		id, err := strconv.Atoi(args[1])
		if err != nil {
			return "", err
		}
		return core.RemoveById(id)
	case "list": //list
		if len(args) != 1 {
			return "", wrongArgNo()
		}
		idlist := core.IdList()
		if len(idlist) == 0 {
			return "", nil
		}
		t, err := core.GetTeacherById(idlist[0])
		if err != nil {
			return "", err
		}
		out := t.String()
		for _, id := range idlist[1:] {
			t, err := core.GetTeacherById(id)
			if err != nil {
				return "", err
			}
			out += "\n" + t.String()
		}
		return out, nil
	case "listJSON":
		if len(args) != 1 {
			return "", wrongArgNo()
		}
		return core.GetTeacherListJSON()
	default:
		return "", notImplementedError()
	}
}



