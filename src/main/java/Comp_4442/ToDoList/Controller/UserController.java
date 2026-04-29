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
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newUsername = data.get("username");
        String newPassword = data.get("password");
        boolean isChanged = false;

        // Check username exist or not
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists.");
            }
            user.setUsername(newUsername);
            isChanged = true;
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            if (passwordEncoder.matches(newPassword, user.getPassword())) {
            } else {
                user.setPassword(passwordEncoder.encode(newPassword));
                isChanged = true;
            }
        }
        if (!isChanged) {
            return ResponseEntity.badRequest().body("New info is the same as current info. No update performed.");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated");
    }
}