package com.example.task_practice.repository;

import com.example.task_practice.model.TaskHistory;
import com.example.task_practice.model.enums.TaskStatus;
import com.example.task_practice.model.enums.TaskType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory,Long> {

    @Query(value = "SELECT t FROM TaskHistory t WHERE " +
            "(DATE_FORMAT(t.start, '%Y-%m-%d') <= DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') AND " +
            "DATE_FORMAT(t.end, '%Y-%m-%d') >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d')) AND " +
            "t.deleted = false " +
            "ORDER BY t.start")
    List<TaskHistory> findAllTaskToDay();

    @Query(value = "SELECT t FROM TaskHistory t WHERE " +
            "(DATE_FORMAT(t.start, '%Y-%m-%d') <= DATE_FORMAT(:selectedDate, '%Y-%m-%d') AND " +
            "DATE_FORMAT(t.end, '%Y-%m-%d') >= DATE_FORMAT(:selectedDate, '%Y-%m-%d')) AND " +
            "t.deleted = false " +
            "ORDER BY t.start")
    List<TaskHistory> getAllTaskByDate(LocalDate selectedDate);

    @Query(value = "SELECT t FROM TaskHistory t WHERE " +
            "(DATE_FORMAT(t.start, '%Y-%m-%d') <= DATE_FORMAT(:endDate, '%Y-%m-%d') AND " +
            "DATE_FORMAT(t.end, '%Y-%m-%d') >= DATE_FORMAT(:startDate, '%Y-%m-%d')) AND " +
            "t.deleted = false " +
            "ORDER BY t.start")
    List<TaskHistory> getAllTaskDayByDay(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    TaskHistory findTaskHistoriesByIdAndDeleted(Long id, boolean deleted);
    @Modifying
    @Transactional
    @Query(value = "UPDATE TaskHistory t SET t.status = 'TODO' WHERE " +
            "DATE_FORMAT(t.start, '%Y-%m-%d') < DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') AND " +
            "t.type = 'DAILY' AND " +
            "t.deleted = false")
    void resetDailyTasksToTODO();

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Query("SELECT t FROM TaskHistory t WHERE " +
            "(DATE_FORMAT(t.start, '%Y-%m-%d') <= DATE_FORMAT(:newDate, '%Y-%m-%d') AND " +
            "DATE_FORMAT(t.end, '%Y-%m-%d') >= DATE_FORMAT(:newDate, '%Y-%m-%d')) AND " +
            "t.deleted = false " +
            "ORDER BY t.start")
    List<TaskHistory> findOldDailyTasks(LocalDate newDate);




}
