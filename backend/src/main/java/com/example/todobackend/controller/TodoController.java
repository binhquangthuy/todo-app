package com.example.todobackend.controller;

import com.example.todobackend.dto.TodoRequest;
import com.example.todobackend.exception.ResourceNotFoundException;
import com.example.todobackend.model.Todo;
import com.example.todobackend.repository.TodoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody TodoRequest request) {
        Todo todo = new Todo(
            request.title(),
            request.description(),
            request.priority(),
            request.dueDate()
        );
        Todo savedTodo = todoRepository.save(todo);
        return new ResponseEntity<>(savedTodo, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id " + id));
        return ResponseEntity.ok(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id " + id));

        todo.setTitle(request.title());
        todo.setDescription(request.description());
        if (request.priority() != null) {
            todo.setPriority(request.priority());
        }
        todo.setDueDate(request.dueDate());

        Todo updatedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(updatedTodo);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodoCompletion(@PathVariable Long id) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id " + id));

        todo.setCompleted(!todo.isCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id " + id));

        todoRepository.delete(todo);
        return ResponseEntity.noContent().build();
    }
}
