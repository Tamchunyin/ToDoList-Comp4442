package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.Todo;
import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.TodoRepository;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

// TodoController.java 優化版
@RestController
@RequestMapping("/api/todos") // 💡 統一基礎路徑
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;

    // 1. 取得可見任務：自己的 + 所有人的 Public
    @GetMapping
    public List<Todo> getVisibleTodos(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findAll().stream()
                .filter(t -> t.getIsPublic() || t.getUser().getUsername().equals(principal.getName()))
                .collect(Collectors.toList());
    }

    // 2. 刪除任務：本人或 ADMIN 才能刪除
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

    // 3. 切換狀態：本人或 ADMIN 才能切換
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
}