package core

import (
	"errors"
	"strconv"
	"encoding/json"
)

type Teacher struct {
	Name string
	Subject string
	Id int
}
func (t Teacher) String() string {
	return "Teacher " + t.Name + " teaches " + t.Subject + " (id="+strconv.Itoa(t.Id)+")"
}

func (t Teacher) ToJsonDictionary() (string, error) {
	s, err := json.Marshal(t)
	return string(s), err
}

var teacherMap map[int]Teacher = make(map[int]Teacher)
var currentId int = 0

func AddTeacher(name, subject string) (string, error) {
	for _,ok := teacherMap[currentId]; ok ; _,ok = teacherMap[currentId] {currentId++} //increments currentId until we find a free id
	teacherMap[currentId] = Teacher{name, subject, currentId}
	return strconv.Itoa(currentId), nil
}

func RemoveById(id int) (string, error) {
	_, ok := teacherMap[id]
	if !ok {
		return "", errors.New("Id not found in teacherMap")
	}
	delete(teacherMap, id)
	return "", nil
}

func GetTeacherById(id int) (Teacher, error) {
	t, ok := teacherMap[id]
	if !ok {
		return Teacher{}, errors.New("Id not found in teacherMap")
	}
	return t, nil
}

func IdList() []int {
	list := make([]int, len(teacherMap))
	i := 0
	for k := range teacherMap {
		list[i] = k
		i++
	}
	return list
}

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
}