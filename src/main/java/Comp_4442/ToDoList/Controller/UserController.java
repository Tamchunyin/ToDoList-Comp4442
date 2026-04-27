package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.security.Principal;
import java.util.Map;


@RestController
@RequestMapping("/api/user")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> data, Principal principal) {
        // 獲取目前登入的使用者
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newUsername = data.get("username");
        String newPassword = data.get("password");

        // 更新用戶名 (需檢查是否重複)
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists.");
            }
            user.setUsername(newUsername);
        }

        // 更新密碼
        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated");
    }
}