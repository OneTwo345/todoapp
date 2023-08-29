package com.example.task_practice.model;

import com.example.task_practice.model.enums.TaskStatus;
import com.example.task_practice.model.enums.TaskType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;
    private TaskType type;
    private TaskStatus status;
    @OneToMany(mappedBy = "task")
    private Set<TaskHistory> taskHistories;


}
