<?php	
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "scheduler";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 

	// sql to create table
	$sql = "create table scheduleinfo (id int auto_increment primary key, day varchar(7) not null, hour time not null, description varchar(255);";

	if ($conn->query($sql) === TRUE) {
		echo "Table MyGuests created successfully";
	} else {
		echo "Error creating table: " . $conn->error;
	}

	$conn->close();
?>