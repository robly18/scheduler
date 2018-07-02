
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
}