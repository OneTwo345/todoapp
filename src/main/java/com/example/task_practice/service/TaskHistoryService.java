package com.example.task_practice.service;

import com.example.task_practice.model.Task;
import com.example.task_practice.model.TaskHistory;
import com.example.task_practice.model.enums.TaskStatus;
import com.example.task_practice.model.enums.TaskType;
import com.example.task_practice.repository.TaskHistoryRepository;
import com.example.task_practice.repository.TaskRepository;
import com.example.task_practice.utils.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class TaskHistoryService implements ITaskHistoryService {
    private final TaskHistoryRepository taskHistoryRepository;
    private final TaskRepository taskRepository;


    @Override
    public TaskHistory addTask(TaskHistory taskHistory) {


        if (taskHistory.getType().equals(TaskType.DAILY)) {
            var task = AppUtil.mapper.map(taskHistory, Task.class);
            task = taskRepository.save(task);
            taskHistory.setTask(task);
        }
            taskHistory.setDeleted(false);
        return taskHistoryRepository.save(taskHistory);
    }

    @Override
    public List<TaskHistory> getAllTasks() {
        return taskHistoryRepository.findAllTaskToDay();

    }

    @Override
    public List<TaskHistory> getAllTaskDayByDay(LocalDate startDate,LocalDate end) {
        return taskHistoryRepository.getAllTaskDayByDay(startDate, end);
    }

    @Override
    public List<TaskHistory> getAllTaskByDate(LocalDate date) {
        return taskHistoryRepository.getAllTaskByDate(date);
    }


    @Override
    public TaskHistory updateTask(TaskHistory taskHistory, Long id) {
        return taskHistoryRepository.findById(id)
                .map(history -> {
                    history.setTitle(taskHistory.getTitle());
                    history.setDescription(taskHistory.getDescription());
                    history.setStart(taskHistory.getStart());
                    history.setEnd(taskHistory.getEnd());
                    history.setStatus(taskHistory.getStatus());
                    history.setType(taskHistory.getType());
                    return taskHistoryRepository.save(history);
                })
                .orElseThrow(() -> new RuntimeException("Sorry, the taskHistory could not be found"));
    }

    @Override
    public TaskHistory getTaskById(Long id) {
        return taskHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sorry, no task found with the id: " + id));
    }

    @Override
    public void deleteTask(Long id) {

        if (!taskHistoryRepository.existsById(id)) {
            throw new RuntimeException("Sorry, task delete not found");
        }
        TaskHistory task = taskHistoryRepository.findTaskHistoriesByIdAndDeleted(id, false);
        task.setDeleted(true);
        taskHistoryRepository.save(task);


    }

    @Scheduled(cron = "0 10 10 * * *")
    @Transactional
    public void updateTaskTypeAutomatically() {
        LocalDate currentDate = LocalDate.now();

        // Tìm kiếm các task daily từ hôm qua
        LocalDate yesterday = currentDate.minusDays(1);
        List<TaskHistory> oldDailyTasks = taskHistoryRepository.findOldDailyTasks(yesterday);

        List<TaskHistory> newTasks = new ArrayList<>();

        for (TaskHistory task : oldDailyTasks) {
            // Tạo một bản sao của nhiệm vụ với ngày hiện tại và giữ nguyên giờ
            TaskHistory newTask = new TaskHistory();
            newTask.setTitle(task.getTitle());
            newTask.setDescription(task.getDescription());
            newTask.setStart(task.getStart().plusDays(1));
            newTask.setEnd(task.getEnd().plusDays(1));
            newTask.setStatus(TaskStatus.TODO);
            newTask.setType(TaskType.DAILY);
            // Copy các thuộc tính khác của task nếu có
            // newTask.setXXX(task.getXXX());

            newTasks.add(newTask);
        }

        // Lưu các nhiệm vụ mới vào cơ sở dữ liệu
        taskHistoryRepository.saveAll(newTasks);
    }

//    @Transactional
//    @EventListener(ContextRefreshedEvent.class)
//    public void contextRefreshedEvent() {
//        updateTaskTypeAutomatically();
//    }

}
