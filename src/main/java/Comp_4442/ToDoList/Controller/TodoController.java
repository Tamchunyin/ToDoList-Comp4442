package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.Todo;
import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.TodoRepository;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;


import java.io.File;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/todos")
// if not define mapping need add path in the lombok
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;

    // View current user and admin
    @GetMapping
    public List<Todo> getVisibleTodos(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findAll().stream()
                .filter(t -> t.getIsPublic() || t.getUser().getUsername().equals(principal.getName()))
                .collect(Collectors.toList());
    }

    // Only current user and admin can delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findById(id).map(todo -> {
            boolean isOwner = todo.getUser().getUsername().equals(principal.getName());
            boolean isAdmin = currentUser.getRole().equalsIgnoreCase("ROLE_ADMIN");

            if (isOwner || isAdmin) {
                todoRepository.delete(todo);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only owner or admin can delete this task.");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTodo(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findById(id).map(todo -> {
            boolean isOwner = todo.getUser().getUsername().equals(principal.getName());
            boolean isAdmin = currentUser.getRole().equalsIgnoreCase("ROLE_ADMIN");

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Permission denied.");
            }
            todo.setCompleted(!todo.getCompleted());
            todoRepository.save(todo);
            return ResponseEntity.ok(todo);
        }).orElse(ResponseEntity.notFound().build());
    }




    private final String UPLOAD_DIR = "uploads/";
    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return todoRepository.findById(id).map(todo ->{

            try {
                File directory = new File(UPLOAD_DIR);
                if (!directory.exists()) directory.mkdirs();

                String savedFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + savedFileName);
                Files.write(path, file.getBytes());

                todo.setFilePath(path.toString());
                todo.setFileName(file.getOriginalFilename());
                todoRepository.save(todo);

                return ResponseEntity.ok("File uploaded successfully");
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Upload failed");
            }
        }).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        if (todo.getFilePath() == null) return ResponseEntity.notFound().build();

        File file = new File(todo.getFilePath());
        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + todo.getFileName() + "\"")
                .body(resource);
    }
}



