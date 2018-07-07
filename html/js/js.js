/*Add the markers for 9:00, 9:30, 10:00, 10:30 and so on*/

function preprocess(list) { //Returns preprocessed list ready to be sent to fillColumn
	let newlist = list.slice(0).sort((a,b) => a.startpct-b.startpct);
	for (let i = 0; i < newlist.length-1; i++) {
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
				overlap.linkedblocks = newlist[i].linkedblocks.concat(newlist[i+1].linkedblocks);
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
				overlap.linkedblocks = newlist[i].linkedblocks.concat(newlist[i+1].linkedblocks);
				overlap.color = "white";
				let last = Object.assign({}, newlist[i]);
				last.startpct = newlist[i+1].endpct;
				
				newlist = head.concat([first, overlap, last]).concat(tail);
			}
			newlist.sort((a,b) => a.startpct-b.startpct);
		}
	}
	return newlist.filter(b => b.startpct != b.endpct);
}


function fillColumn(list, day) { /* list of {color, startpct, endpct, linkedblocks} ordered with no overlap; color is optional and defaults to white */
	var lastpct = 0; //where we left off
	for (var block of list) {
		if (block.startpct != lastpct) { //if we need padding, add it
			let pad = document.createElement("div");			
			pad.style.backgroundColor = "grey";
			pad.style.height = (block.startpct - lastpct)+"%";
			day.appendChild(pad);
		}
		
		var b = document.createElement("div"); //the actual block element
		
		
		b.className = "clickableDiv";
		b.style.backgroundColor = block.color || "white";
		b.style.height = (block.endpct - block.startpct)+"%";
		b.style.overflow = "hidden";
		
		let blocklist = block.linkedblocks;
		b.onclick = () => displayBlocks(blocklist);
		
		var titles = block.linkedblocks.map(bl => bl.title);
		b.appendChild(document.createTextNode(titles.join(", ")));
		
		day.appendChild(b);
		
		lastpct = block.endpct;
	}
}

var blocks = {};
var currentId = 0;

var blockCache = {};

document.getElementById("addButton").onclick = function()
{
	var title = document.getElementById("Title").value;
	var desc = document.getElementById("description").value;
	var initialHour = document.getElementById("initialHour").value;
	var initialMinute = document.getElementById("initialMinute").value;
	var endHour = document.getElementById("endHour").value;
	var endMinute = document.getElementById("endMinute").value;
	var tagString = document.getElementById("tags").value;
	tags = tagString.split(";");
	
	blocks[currentId++] = { id: currentId,
							year: 2018, month: 1, day: 1, startHour: initialHour, startMinute: initialMinute,
															endHour: endHour,		endMinute: endMinute,
							title: title, desc: desc, tags:tags};
	refreshBlocks(blocks);
	blockCache = blocks;
}

function refreshBlocks(blocks, tags) { //Takes an Object "blocks" and puts it on the screen. optionally, an array of tags to filter for
	//begin by updating the array of display elements
	if (tags == undefined) tags = [];
	var displayElements = preprocess(
						Object.values(blocks)
										.filter(
										b => tags.every(t => b.tags.includes(t))
										)
										.map(
										b => ({startpct: b.startHour*hpct + b.startMinute*mpct,
										endpct: b.endHour*hpct + b.endMinute*mpct, color: b.color,
										linkedblocks: [b]})
										)
					);
	//clear out the "day"
	let day = document.getElementById("day1");
	day.innerHTML = "";
	//and repopulate it
	fillColumn(displayElements, day);
}

function filterTags() {
	var tags = document.getElementById("tagSearch").value.split(";").filter(s => s != "");
	refreshBlocks(blockCache, tags);
}

function displayBlocks(blocklist) {
	var demonstrator = document.getElementById("demonstrator");
	if (blocklist.length == 0) {
		demonstrator.innerHTML = "N/A";
	} else if (blocklist.length == 1) {
		displayBlock(blocklist[0]);
	} else {
		demonstrator.innerHTML = "";
		for (block of blocklist) demonstrator.appendChild(listDiv(block));
	}
}

function listDiv(block) {
	
	var d = document.createElement("div");
	d.style.maxHeight = "33%";
	var sidebar = document.createElement("div");
	sidebar.style.float = "left"
	sidebar.style.width = "0.8ex";
	sidebar.style.height = "33%"
	sidebar.style.backgroundColor = block.color;
	var content = document.createElement("div");
	content.style.overflow = "auto";
	content.style.float = "right"
	content.style.width = "calc(100% - 0.8ex)"
	content.style.height = "33%"
	content.style.paddingLeft = "1.5ex"
	content.style.boxSizing = "border-box"
	
	var bTitle = document.createElement("h3");
	bTitle.innerHTML = "Title: " + block.title;
	var bTime = document.createElement("p");
	bTime.innerHTML = "Duration: " + block.startHour + ":" + block.startMinute.toString().padStart(2,'0') + " - " +
										block.endHour + ":" + block.endMinute.toString().padStart(2,'0');
	var bDescription = document.createElement("p");
	bDescription.appendChild(document.createTextNode("Desc: " + block.desc));
	bDescription.style.overflow = "hidden";
	bDescription.style.whiteSpace = "nowrap";
	bDescription.style.textOverflow = "ellipsis";
	
	var bTags = document.createElement("p");
	bTags.appendChild(document.createTextNode(block.tags.length == 0 ? "This block has no tags." : "Tags: " + block.tags.join("; ")));
	bTags.appendChild(document.createElement("br"));
	bTags.appendChild(document.createTextNode("Block id: " + block.id));

	d.appendChild(sidebar);
	d.appendChild(content);
	
	content.appendChild(bTitle);
	content.appendChild(bTime);
	content.appendChild(bDescription);
	content.appendChild(bTags);
	
	d.style.cursor = "pointer";
	d.onclick = () => displayBlock(block);
	
	return d;
}

function displayBlock(block) {
	demonstrator.innerHTML = ""
	var sidebar = document.createElement("div");
	sidebar.style.float = "left"
	sidebar.style.width = "0.8ex";
	sidebar.style.height = "100%"
	sidebar.style.backgroundColor = block.color;
	var content = document.createElement("div");
	content.style.float = "right"
	content.style.width = "calc(100% - 0.8ex)"
	content.style.height = "100%"
	content.style.padding = "1.5ex"
	content.style.boxSizing = "border-box"
	
	var bTitle = document.createElement("h2");
	bTitle.innerHTML = block.title;
	bTitle.style.textAlign = "center";
	var bDuration = document.createElement("p");
	bDuration.innerHTML = "Duration: " + block.startHour + ":" + block.startMinute.toString().padStart(2,'0') + " - " +
										block.endHour + ":" + block.endMinute.toString().padStart(2,'0');
	var bDescription = document.createElement("p");
	bDescription.appendChild(document.createTextNode("Desc: "));
	for (let line of block.desc.split("\n")) {
		bDescription.appendChild(document.createTextNode(line)); //this should be safe from HTML injection.
		bDescription.appendChild(document.createElement("br"));
	}
	
	var bTags = document.createElement("p");
	bTags.appendChild(document.createTextNode(block.tags.length == 0 ? "This block has no tags." : "Tags: " + block.tags.join("; ")));
	bTags.appendChild(document.createElement("br"));
	bTags.appendChild(document.createTextNode("Block id: " + block.id));
	
	content.appendChild(bTitle);
	content.appendChild(bDuration);
	content.appendChild(bDescription);
	content.appendChild(bTags);
	demonstrator.appendChild(sidebar)
	demonstrator.appendChild(content);
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