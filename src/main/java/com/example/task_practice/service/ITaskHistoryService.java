package com.example.task_practice.service;

import com.example.task_practice.model.TaskHistory;

import java.time.LocalDate;
import java.util.List;

public interface ITaskHistoryService {
    TaskHistory addTask(TaskHistory taskHistory);
    List<TaskHistory> getAllTasks();
    List<TaskHistory> getAllTaskDayByDay(LocalDate startDate,LocalDate end);
    List<TaskHistory> getAllTaskByDate(LocalDate date);

    TaskHistory updateTask(TaskHistory taskHistory, Long id);
    TaskHistory getTaskById(Long id);
    void deleteTask(Long id);

}
