package core

import (
	"errors"
	"encoding/json"
	"time"
	"fmt"
)

type block struct { //todo fix this: if something starts at midnight it counts as the previous day
	Start time.Time
	End time.Time //start and end time should be in the same day!
	
	Color int
	Desc string
}

func MakeBlock(start, end time.Time, color int, desc string) (block, error) {
	if start.Year() != end.Year() || start.YearDay() != end.YearDay() {
		return block{}, errors.New("start and end date are not the same")
	}
	return block{start, end, color, desc}, nil
}

func (b block) String() string {
	return fmt.Sprintf("Block date: %v/%v/%v; time: %v:%02d to %v:%02d; color: %v; desc: %v",
						b.Start.Year(), b.Start.Month(), b.Start.Day(),
										b.Start.Hour(), b.Start.Minute(),
										b.End.Hour(), b.End.Minute(), b.Color, b.Desc)
}

var blockMap map[int]block = make(map[int]block)
var currentId int = 0

func AddBlock(b block) (int, error) {
	for _,ok := blockMap[currentId]; ok ; _,ok = blockMap[currentId] {currentId++} //increments currentId until we find a free id
	blockMap[currentId] = b
	return currentId, nil
}

func RemoveById(id int) error {
	_, ok := blockMap[id]
	if !ok {
		return errors.New("Id not found in blockMap")
	}
	delete(blockMap, id)
	return nil
}

func GetBlockById(id int) (block, error) {
	b, ok := blockMap[id]
	if !ok {
		return block{}, errors.New("Id not found in blockMap")
	}
	return b, nil
}

func IdList() []int {
	list := make([]int, len(blockMap))
	i := 0
	for k := range blockMap {
		list[i] = k
		i++
	}
	return list
}

func GetBlocksInDay(year int, month int, day int) []block {
	dayblocks := make([]block, 0)
	for _, b := range blockMap {
		y, m, d := b.Start.Date()
		if year == y && month == int(m) && day == d {
			dayblocks = append(dayblocks, b)
		}
	}
	return dayblocks
}

func GetBlocksInDayJSON(year int, month int, day int) (string, error) {
	out := "["
	for _, b := range GetBlocksInDay(year, month, day) {
		str, err := b.ToJsonDictionary()
		if err != nil {
			return "", err
		}
		out += str + ","
	}
	return out[:len(out)-1] + "]", nil
}

func (b block) ToJsonDictionary() (string, error) { //see documentation for how this is represented
	desc, err := json.Marshal(b.Desc) 
	str := fmt.Sprintf("{\"year\":%v, \"month\":%v, \"day\":%v, \"startHour\":%v, \"startMinute\":%v, \"endHour\":%v, \"endMinute\":%v, \"color\":%v, \"desc\":%v}",
						b.Start.Year(), b.Start.Month(), b.Start.Day(),
										b.Start.Hour(), b.Start.Minute(),
										b.End.Hour(), b.End.Minute(), b.Color, string(desc))
	return str, err
}




/*
func GetTeacherListJSON() (string, error) {
	out := "["
	for _, t := range teacherMap {
		str, err := t.ToJsonDictionary()
		if err != nil {
			return "", err
		}
		out += str + ","
	}
	return out[:len(out)-1] + "]", nil
}*/