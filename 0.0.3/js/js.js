/*Add the markers for 9:00, 9:30, 10:00, 10:30 and so on*/
var t = document.getElementById("times");
for (var h = 0; h != 24; h++) {
	var fst = document.createElement("div"); 
	fst.appendChild(document.createTextNode(h + ":00"));
	fst.style.backgroundColor = "white";
	fst.style.height = "2.6%";
	t.appendChild(fst); //add the marker for h o'clock
	
	var snd = document.createElement("div");
	snd.appendChild(document.createTextNode(h + ":30"));
	snd.style.backgroundColor = "grey";
	snd.style.height = "2.6%";
	t.appendChild(snd); //add the marker for h:30
}

var day; // = document.getElementById("day");
function fillColumn(list) { /* list of {color, startpct, endpct, text} ordered with no overlap; color is optional and defaults to white */
	var lastpct = 0; //where we left off
	for (var block of list) {
		if (block.startpct != lastpct) { //if we need padding, add it
			let pad = document.createElement("div");
			pad.style.backgroundColor = "grey";
			pad.style.height = (block.startpct - lastpct)+"%";
			day.appendChild(pad);
		}
		
		let b = document.createElement("div"); //the actual block element
		b.style.backgroundColor = block.color || "white";
		b.style.height = (block.endpct - block.startpct)+"%";
		for (var line of block.text) {
			b.appendChild(document.createTextNode(line));
			b.appendChild(document.createElement("BR"));
		}
		day.appendChild(b);
		
		lastpct = block.endpct;
	}
}



var blocks1 = [];
var blocks2 = [];
var blocks3 = [];
var blocks4 = [];
var blocks5 = [];
var blocks6 = [];
var blocks7 = [];
document.getElementById("addButton").onclick = function()
{
	day = "day" + document.getElementById("dayInput").value;
	var sticky = day;
	day = document.getElementById(day);
	var initialHour = document.getElementById("initialHour").value;
	var initialMinute = document.getElementById("initialMinute").value;
	var endHour = document.getElementById("endHour").value;
	var endMinute = document.getElementById("endMinute").value;
	switch (sticky)
	{
		case "day1":
			blocks1.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks1.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks1);
			break;
			
		case "day2":
			blocks2.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks2.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks2);
			break;
			
		case "day3":
			blocks3.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks3.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks3);
			break;
			
		case "day4":
			blocks4.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks4.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks4);
			break;
			
		case "day5":
			blocks5.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks5.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks5);
			break;
			
		case "day6":
			blocks6.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks6.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks6);
			break;
		
		case "day7":
			blocks7.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
			blocks7.sort((a, b) => (a.startpct) - (b.startpct));
			day.innerHTML = "";
			fillColumn(blocks7);
			break;
	}
	
	
}

var hpct = 5.2; //how many percent is an hour
var mpct = 5.2 / 60; //how many percent is a minute

//fillColumn([{startpct: 0*hpct + 0*mpct, endpct:1*hpct+0*mpct, text:["0:00 - 1:00", "I told you this was possible!!"]}]);