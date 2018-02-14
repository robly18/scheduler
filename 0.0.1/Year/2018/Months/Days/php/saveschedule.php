<?php
	$day=$_POST["day"];
	$hour=$_POST["hour"];
	$description=$_POST["description"];
?>

<?php
	//Connection info
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "scheduler";
	
	//Connecting
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	//Checking connection
	if ($conn->connect_error){
		die("Connection failed: " . $conn->connect_error);
	}
	
	$sql = "insert into scheduleinfo (day, hour, description) values (\"" . $day . "\", \"" . $hour . "\", \"" . $description . "\");";
	
	if ($conn->query($sql) === TRUE){
		echo "New record created successfully";
	}else{
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

$conn->close();
?>