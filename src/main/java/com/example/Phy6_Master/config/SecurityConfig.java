package com.example.Phy6_Master.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Authentication
                        .requestMatchers("/api/auth/signin").permitAll()
                        .requestMatchers("/api/auth/signup").permitAll()
                        .requestMatchers("/api/auth/signup/student").permitAll()
                        .requestMatchers("/api/auth/signup/teacher").permitAll()
                        .requestMatchers("/api/auth/signup/tutor").permitAll()
                        .requestMatchers("/api/auth/signup/accountant").permitAll()
                        
                        // Protected endpoints - require authentication (you can add @PreAuthorize for role-based)
                        .requestMatchers("/api/students/**").permitAll() // Can be restricted with @PreAuthorize("hasRole('STUDENT')")
                        .requestMatchers("/api/teachers/**").permitAll() // Can be restricted with @PreAuthorize("hasRole('TEACHER')")
                        .requestMatchers("/api/tutors/**").permitAll() // Can be restricted with @PreAuthorize("hasRole('TUTOR')")
                        .requestMatchers("/api/accountants/**").permitAll() // Can be restricted with @PreAuthorize("hasRole('ACCOUNTANT')")
                        
                        // Public endpoints for courses and materials
                        .requestMatchers("/api/courses/**").permitAll()
                        .requestMatchers("/api/lessons/**").permitAll()
                        .requestMatchers("/api/materials/**").permitAll()
                        .requestMatchers("/api/timetable/**").permitAll()
                        
                        // Everything else is allowed for development
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
