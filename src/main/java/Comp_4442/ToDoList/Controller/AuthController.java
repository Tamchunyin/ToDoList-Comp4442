package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        String role = user.getRole();
        // 💡 統一處理：確保回傳給前端的是 "ROLE_ADMIN"
        if (role != null && !role.toUpperCase().startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        } else if (role != null) {
            role = role.toUpperCase();
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("role", role);

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // 1. 檢查帳號是否存在
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // 2. 密碼加密
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. 💡 關鍵：強制設定註冊者為 USER 角色
        // 避免有心人透過 Postman 發送 {"role": "ADMIN"} 來竊取管理員權限
        user.setRole("USER");

        // 4. 儲存
        userRepository.save(user);

        return ResponseEntity.ok("Register success");
    }
}