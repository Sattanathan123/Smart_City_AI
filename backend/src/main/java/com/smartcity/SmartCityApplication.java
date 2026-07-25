package com.smartcity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartCityApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCityApplication.class, args);
        System.out.print("Connection Successfully");
    }
}