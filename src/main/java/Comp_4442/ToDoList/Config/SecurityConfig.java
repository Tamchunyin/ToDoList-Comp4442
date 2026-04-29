package Comp_4442.ToDoList.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder EncodePassword(){
        return new BCryptPasswordEncoder();
    }
    // Security rule about springframework security filter (white list for each page）
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.requestMatchers(
                        "/login.html",
                        "/register.html",
                        "/css/**",
                        "/js/**",
                        "/api/register",
                        "/api/login"
                ).permitAll()
                        .requestMatchers("/personalInfo.html").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                                .requestMatchers("/userMangement.html").hasRole("ADMIN")
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(

                                "/api/users/me",
                                "/api/todos/**").authenticated()
                        .anyRequest().authenticated()
                )

                .formLogin(login -> login
                        .loginPage("/login.html")
                        .loginProcessingUrl("/api/login")
                        .defaultSuccessUrl("/index.html", true)
                        .failureUrl("/login.html?error=true")
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessUrl("/login.html")
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );
        return http.build();

    }
}