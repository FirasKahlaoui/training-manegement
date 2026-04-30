package com.formationmanagement.training_management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public Endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Manager (Responsable) has strictly NO modification rights anywhere
                .requestMatchers(HttpMethod.POST, "/api/**").hasAnyRole("ADMINISTRATEUR", "SIMPLE UTILISATEUR")
                .requestMatchers(HttpMethod.PUT, "/api/**").hasAnyRole("ADMINISTRATEUR", "SIMPLE UTILISATEUR")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole("ADMINISTRATEUR", "SIMPLE UTILISATEUR")

                // Config & Admin Data - Only Admin can mutate. 
                // GET is allowed for all to populate dropdowns.
                .requestMatchers(HttpMethod.GET, "/api/utilisateurs/**", "/api/roles/**").hasRole("ADMINISTRATEUR")
                .requestMatchers(HttpMethod.POST, "/api/domaines/**", "/api/structures/**", "/api/profils/**", "/api/employeurs/**").hasRole("ADMINISTRATEUR")
                .requestMatchers(HttpMethod.PUT, "/api/domaines/**", "/api/structures/**", "/api/profils/**", "/api/employeurs/**").hasRole("ADMINISTRATEUR")
                .requestMatchers(HttpMethod.DELETE, "/api/domaines/**", "/api/structures/**", "/api/profils/**", "/api/employeurs/**").hasRole("ADMINISTRATEUR")

                // Stats Dashboard - Only Admin & Manager
                .requestMatchers("/api/stats/**").hasAnyRole("ADMINISTRATEUR", "RESPONSABLE")

                // All other GET requests (Formations, Participants, etc) are accessible by all authenticated users
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
