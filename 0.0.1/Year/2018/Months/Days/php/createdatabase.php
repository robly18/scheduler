<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "scheduler";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password);
	// Check connection
	if ($conn->connect_error){
		die("Connection failed: " . $conn->connect_error);
	} 

	// Create database
	$sql = "create database scheduler";
	if ($conn->query($sql) === TRUE){
		echo "Database created successfully";
	}else{
		echo "Error creating database: " . $conn->error;
	}

	$conn->close();
?>