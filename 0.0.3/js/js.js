/*Add the markers for 9:00, 9:30, 10:00, 10:30 and so on*/

function preprocess(list) { //Returns preprocessed list ready to be sent to fillColumn
	let newlist = list.slice(0).sort((a,b) => a.startpct-b.startpct);
	
	for (let i = 0; i < newlist.length-1; i++) {
		console.log(newlist);
		if (newlist[i].endpct > newlist[i+1].startpct) {
			/*If this happens:
			[AAAAAAAA]
			   [BB...
			*/
			if (newlist[i+1].endpct >= newlist[i].endpct) {
				/*Case:
				[AAAAAAAAA]
				     [BBBBBBB]
				becomes:
				[AAA][ABAB][B]
				*/
				let head = newlist.slice(0,i);
				let tail = newlist.slice(i+2);
				let first = Object.assign({}, newlist[i]);
				first.endpct = newlist[i+1].startpct;
				let overlap = Object.assign({}, newlist[i+1]);
				overlap.endpct = newlist[i].endpct;
				overlap.text = newlist[i].text.concat([" + "]).concat(newlist[i+1].text);
				overlap.color = "white";
				let last = Object.assign({}, newlist[i+1]);
				last.startpct = newlist[i].endpct;
				
				newlist = head.concat([first, overlap, last]).concat(tail);
			}
			if (newlist[i+1].endpct < newlist[i].endpct) {
				/*Case:
				[AAAAAAAAAAAAAAA]
				     [BBBBBB]
				becomes:
				[AAA][ABABAB][AA]
				*/
				let head = newlist.slice(0,i);
				let tail = newlist.slice(i+2);
				let first = Object.assign({}, newlist[i]);
				first.endpct = newlist[i+1].startpct;
				let overlap = Object.assign({}, newlist[i+1]);
				overlap.text = newlist[i].text.concat([" + "]).concat(newlist[i+1].text);
				overlap.color = "white";
				let last = Object.assign({}, newlist[i]);
				last.startpct = newlist[i+1].endpct;
				
				newlist = head.concat([first, overlap, last]).concat(tail);
			}
		}
	}
	return newlist.filter(block => block.startpct != block.endpct);
}


function fillColumn(list, day) { /* list of {color, startpct, endpct, text} ordered with no overlap; color is optional and defaults to white */
	var lastpct = 0; //where we left off
	for (var block of list) {
		if (block.startpct != lastpct) { //if we need padding, add it
			let pad = document.createElement("div");			
			pad.style.backgroundColor = "grey";
			pad.style.height = (block.startpct - lastpct)+"%";
			day.appendChild(pad);
		}
		
		var b = document.createElement("div"); //the actual block element
		//b.setAttribute("id", "div"+i);
		//var title = document.getElementById("Title").value;
		//var initialHour = document.getElementById("initialHour").value; //Javascript doesn't let me straight up attribute it so I have to do this stupid verbose thing.
		//var initialMinute = document.getElementById("initialMinute").value;
		//var endHour = document.getElementById("endHour").value;
		//var endMinute = document.getElementById("endMinute").value;
		//var description = document.getElementById("description").value;		
		//b.setAttribute("title", "test"+title);
		//b.setAttribute("initialHour", initialHour);
		//b.setAttribute("initialMinute", initialMinute);
		//b.setAttribute("endHour", endHour);
		//b.setAttribute("endMinute", endMinute);
		//b.setAttribute("description", description);
		
		
		b.className = "clickableDiv";
		b.style.backgroundColor = block.color || "white";
		b.style.height = (block.endpct - block.startpct)+"%";
		
		b.onclick = function()
		{
			//var myDiv1 = document.getElementById(this.id);
			var myDiv2 = document.getElementById("demonstrator");
			//myDiv2.innerHTML = myDiv1.innerHTML;
			
			//myDiv2.innerHTML = "Title: "+ b.getAttribute("title") + "<br>" + "Duration: " + b.getAttribute("initialHour") + ':' + b.getAttribute("initialMinute")+ ' - ' + b.getAttribute("endHour") + ':' + b.getAttribute("endMinute") + "<br>" + "Description: " + b.getAttribute("description");
			//myDiv2.innerHTML = "Title: "+ this.title + "ID: " + this.id;
			//text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]
		}
		
		for (var line of block.text) {
			b.appendChild(document.createTextNode(line));
			b.appendChild(document.createElement("BR"));
		}
		day.appendChild(b);
		
		lastpct = block.endpct;
		i = i+1;
	}
}

var blocks = [];
var i = 1;

document.getElementById("addButton").onclick = function()
{
	var title = document.getElementById("Title").value;
	var initialHour = document.getElementById("initialHour").value;
	var initialMinute = document.getElementById("initialMinute").value;
	var endHour = document.getElementById("endHour").value;
	var endMinute = document.getElementById("endMinute").value;
	//blocks.push({startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text:[initialHour+':'+initialMinute+' - '+ endHour+':'+endMinute, "Works?"]});
	blocks.push({id: title, startpct: initialHour*hpct + initialMinute*mpct, endpct: endHour*hpct + endMinute*mpct, text: [title]});
	let day = document.getElementById("day1");
	day.innerHTML = "";
	blocks = preprocess(blocks);
	fillColumn(blocks, day);
	i = i+1;
}

var hourStart = 0;
var hourEnd = 24;
var hpct = 100/(hourEnd - hourStart); //how many percent is an hour
var mpct = hpct / 60; //how many percent is a minute

var t = document.getElementById("times");
for (var h = hourStart; h != hourEnd; h++) {
	var fst = document.createElement("div"); 
	fst.appendChild(document.createTextNode(h + ":00"));
	fst.style.backgroundColor = "white";
	fst.style.height = hpct/2 + "%";
	t.appendChild(fst); //add the marker for h o'clock
	
	var snd = document.createElement("div");
	snd.appendChild(document.createTextNode(h + ":30"));
	snd.style.backgroundColor = "grey";
	snd.style.height = hpct/2 + "%";
	t.appendChild(snd); //add the marker for h:30
}
document.getElementById("playground").style.height = ((hourEnd - hourStart)*2 * 2) + "em";