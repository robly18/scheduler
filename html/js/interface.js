
function sendCommand(cmd, ongetresponsefunction) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
			if (ongetresponsefunction) ongetresponsefunction(this.responseText);
		}
	};
	xhttp.open("POST", "sendCommand", true);
	xhttp.send(cmd);
	console.log("sent command: " + cmd);
}

function sendConsole() { //temporary function, do not keep for too long
	let cnsl = document.getElementById("consoleInput");
	let text = cnsl.value;
	cnsl.value = "";
	sendCommand(text, function(){alert("success");});
}

function refresh() { //deprecated
	sendCommand("listDayJSON 2018 1 1", function(s) {refreshBlocks(JSON.parse(s));})
}

function refreshDate(year, month, day) {
	sendCommand("listDayJSON " + year + " " + month + " " + day, function(s) {var b = JSON.parse(s); refreshBlocks(b); blockCache = b;})
}