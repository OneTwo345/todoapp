package com.example.task_practice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TaskPracticeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskPracticeApplication.class, args);
    }

}
