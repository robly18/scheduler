package interpreter

import (
	"core"
	"errors"
	"shlex"
	"strconv"
	"time"
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
	case "add": //add YEAR MONTH DAY STARTH STARTM ENDH ENDM DESC
		if len(args) != 9 {
			return "", wrongArgNo()
		}
		var aints [7]int
		for i := 1; i != 8; i++ {
			n, err := strconv.Atoi(args[i])
			if err != nil {
				return "", err
			}
			aints[i-1] = n
		}
		startDate := time.Date(aints[0], time.Month(aints[1]), aints[2], aints[3], aints[4], 0, 0, time.UTC) //For now, time is UTC
		endDate := time.Date(aints[0], time.Month(aints[1]), aints[2], aints[5], aints[6], 0, 0, time.UTC)
		b, err := core.MakeBlock(startDate, endDate, 0x0000FF, args[8])
		if err != nil {
			return "", err
		}
		id, err := core.AddBlock(b)
		return strconv.Itoa(id), err
	case "remove": //remove ID
		if len(args) != 2 {
			return "", wrongArgNo()
		}
		id, err := strconv.Atoi(args[1])
		if err != nil {
			return "", err
		}
		return "", core.RemoveById(id)
	case "list": //list
		if len(args) != 1 {
			return "", wrongArgNo()
		}
		idlist := core.IdList()
		if len(idlist) == 0 {
			return "", nil
		}
		t, err := core.GetBlockById(idlist[0])
		if err != nil {
			return "", err
		}
		out := t.String()
		for _, id := range idlist[1:] {
			t, err := core.GetBlockById(id)
			if err != nil {
				return "", err
			}
			out += "\n" + t.String()
		}
		return out, nil
	/*case "listJSON":
		if len(args) != 1 {
			return "", wrongArgNo()
		}
		return core.GetTeacherListJSON()*/
	default:
		return "", notImplementedError()
	}
}



