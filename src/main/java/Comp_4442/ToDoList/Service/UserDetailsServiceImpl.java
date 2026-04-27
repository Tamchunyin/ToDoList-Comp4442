package Comp_4442.ToDoList.Service;

import Comp_4442.ToDoList.entity.User;
import Comp_4442.ToDoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // 💡 改善點 1：增加事務唯讀標註，提升查詢效能
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String roleInDb = user.getRole();
        String finalRole;
        if (roleInDb != null && roleInDb.toUpperCase().startsWith("ROLE_")) {
            finalRole = roleInDb.toUpperCase(); // 直接使用 ROLE_ADMIN
        } else {
            finalRole = "ROLE_" + (roleInDb != null ? roleInDb.toUpperCase() : "USER");
        }



        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(finalRole)
                .build();
    }
}