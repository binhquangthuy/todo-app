package com.example.todobackend.dto;

import com.example.todobackend.model.Priority;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record TodoRequest(
    @NotBlank(message = "Title is required")
    String title,
    
    String description,
    
    Priority priority,
    
    LocalDate dueDate
) {}
