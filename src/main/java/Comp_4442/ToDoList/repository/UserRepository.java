package Comp_4442.ToDoList.repository;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encodePassword;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> register(@ResponseBody User user){

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username exist.Please use another name register");
        }

        String rawPw = user.getPassword();
        String enPw = passwordEncoder.encode(rawPw);
        user.setPassword(user);

        return ResponseEntity.ok("Register success");
    }
}