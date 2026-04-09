package com.formationmanagement.training_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;

@SpringBootApplication(exclude = { 
    SecurityAutoConfiguration.class, 
    SecurityFilterAutoConfiguration.class,
    ServletWebSecurityAutoConfiguration.class,
    UserDetailsServiceAutoConfiguration.class
})
public class TrainingManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrainingManagementApplication.class, args);
	}

}
