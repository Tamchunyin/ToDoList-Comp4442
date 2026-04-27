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

@RestController
@RequestMapping("/api")

public class TodoController {
    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/todos")
    public List<Todo> getVisibleTodos(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return todoRepository.findByUserOrIsPublicTrue(currentUser);
    }
    @PostMapping("/todos")
    public ResponseEntity<Todo> addTodo(@RequestBody Todo todo, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        todo.setUser(currentUser);
        if (todo.getPriority() == null) todo.setPriority("medium");
        Todo savedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Principal principal) {
        // 💡 取得當前使用者資訊來判斷權限
        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findById(id)
                .map(todo -> {
                    // 💡 優化邏輯：如果不是本人，且「不是 Admin」，才禁止刪除
                    boolean isOwner = todo.getUser().getUsername().equals(principal.getName());
                    boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole()) ||
                            "ROLE_ADMIN".equalsIgnoreCase(currentUser.getRole());

                    if (!isOwner && !isAdmin) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Only the owner or an admin can delete this task.");
                    }

                    todoRepository.delete(todo);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTodo(@PathVariable Long id, Principal principal) {
        return todoRepository.findById(id)
                .map(todo -> {
                    if (!todo.getUser().getUsername().equals(principal.getName())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("無法修改他人任務");
                    }
                    todo.setCompleted(!todo.getCompleted());
                    todoRepository.save(todo);
                    return ResponseEntity.ok(todo);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
