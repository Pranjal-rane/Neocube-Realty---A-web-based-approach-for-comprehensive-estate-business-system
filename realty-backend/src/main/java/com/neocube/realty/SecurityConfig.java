package com.neocube.realty;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        System.out.println("=== NEOCUBE SECURITY CONFIG LOADED ===");

        http
            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/error",
                    "/api/auth/**",
                    "/api/customers/**",
                    "/api/properties/**",
                    "/api/inquiries/**",
                    "/api/brokers/**",
                    "/api/leads/**",
                    "/api/lead-assignments/**",
                    "/api/site-visits/**",
                    "/api/bookings/**",
                    "/api/favorites/**",
                    "/api/contact-requests/**",
                    "/api/comparisons/**",
                    "/api/deals/**",
                    "/uploads/**"
                )
                .permitAll()
                .anyRequest()
                .authenticated()
            );

        return http.build();
    }
}