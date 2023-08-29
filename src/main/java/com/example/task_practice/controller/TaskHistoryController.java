package com.example.task_practice.controller;

import com.example.task_practice.model.TaskHistory;
import com.example.task_practice.service.ITaskHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskHistoryController {

    private final ITaskHistoryService taskHistoryService;

    @GetMapping
    public ResponseEntity<List<TaskHistory>> getAllTasks() {
        return new ResponseEntity<>(taskHistoryService.getAllTasks(), HttpStatus.FOUND);
    }

    @PostMapping
    public TaskHistory addTask(@RequestBody TaskHistory taskHistory) {
        return taskHistoryService.addTask(taskHistory);
    }

    @PutMapping("/update/{id}")
    public TaskHistory updateTask(@RequestBody TaskHistory taskHistory, @PathVariable Long id) {
        return taskHistoryService.updateTask(taskHistory, id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskHistoryService.deleteTask(id);
    }

    @GetMapping("/task/{id}")
    public TaskHistory getTaskById(@PathVariable Long id) {
        return taskHistoryService.getTaskById(id);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskHistory>> getAllTasksByDate(@RequestParam("selectedDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate selectedDate) {
        List<TaskHistory> tasks = taskHistoryService.getAllTaskByDate(selectedDate);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    @GetMapping("/day-by-day")
    public ResponseEntity<List<TaskHistory>> getAllTaskDayByDay(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TaskHistory> tasks = taskHistoryService.getAllTaskDayByDay(startDate, endDate);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }


}
