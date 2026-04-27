package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")

public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody String newRole) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(newRole.replace("\"", "")); // 去掉 JSON 的引號
        userRepository.save(user);
        return ResponseEntity.ok("Role updated");
    }
}
