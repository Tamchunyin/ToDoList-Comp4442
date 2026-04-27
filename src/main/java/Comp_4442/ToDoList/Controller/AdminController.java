package Comp_4442.ToDoList.Controller;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // 1. 取得所有用戶 (現有)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. 刪除用戶 (優化：防止管理員刪除自己)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Principal principal) {
        User admin = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getId().equals(id)) {
            return ResponseEntity.badRequest().body("You cannot delete your own account.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    // 3. 更新權限 (現有)
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody String newRole) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(newRole.replace("\"", ""));
        userRepository.save(user);
        return ResponseEntity.ok("Role updated");
    }

    // 4. 💡 新增：停權與激活用戶 (Toggle Status)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statusRequest, Principal principal) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 安全檢查：不允許停權自己
        if (user.getUsername().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot disable your own account.");
        }

        Boolean isEnabled = statusRequest.get("enabled");
        if (isEnabled != null) {
            user.setEnabled(isEnabled); // 確保 User Entity 裡有 enabled 欄位
            userRepository.save(user);
        }

        return ResponseEntity.ok("Status updated");
    }
}