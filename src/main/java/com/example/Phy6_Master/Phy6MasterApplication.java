package com.example.Phy6_Master;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class Phy6MasterApplication {

	private static final Logger logger = LoggerFactory.getLogger(Phy6MasterApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(Phy6MasterApplication.class, args);
		logger.info("Phy6-Master Learning Management System started successfully");
	}

}
