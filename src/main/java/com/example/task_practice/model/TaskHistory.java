package com.example.task_practice.model;

import com.example.task_practice.model.enums.TaskStatus;
import com.example.task_practice.model.enums.TaskType;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@Table(name = "task_histories")
public class TaskHistory {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    @Enumerated(value = EnumType.STRING)
    private TaskStatus status;

    @Enumerated(value = EnumType.STRING)
    private TaskType type;
    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

}
