package com.smartcity.config;

import com.smartcity.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                .requestMatchers("/ws-notifications/**", "/api/ws-notifications/**").permitAll()
                .requestMatchers("/api/notifications/**", "/notifications/**").permitAll()
                .requestMatchers("/api/reports/**", "/reports/**").permitAll()
                .requestMatchers("/api/export/**", "/export/**").permitAll()
                .requestMatchers("/api/weather/**", "/weather/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**", "/dashboard/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/analytics/**", "/analytics/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/alerts", "/api/alerts/**", "/alerts", "/alerts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/complaints", "/api/complaints/**", "/complaints", "/complaints/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/projects", "/api/projects/**", "/projects", "/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/**").permitAll()

                // Admin only
                .requestMatchers("/api/admin/**", "/admin/**").hasRole("ADMIN")

                // Officer & Admin creation / modification endpoints
                .requestMatchers(HttpMethod.POST, "/api/projects", "/api/projects/**", "/projects", "/projects/**").hasAnyRole("ADMIN", "DEPARTMENT_OFFICER")
                .requestMatchers(HttpMethod.PUT, "/api/projects/**", "/projects/**").hasAnyRole("ADMIN", "DEPARTMENT_OFFICER")
                .requestMatchers(HttpMethod.DELETE, "/api/projects/**", "/projects/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/projects/**", "/projects/**").hasRole("ADMIN")

                // Predict — officer & admin
                .requestMatchers("/api/predict/**", "/predict/**").hasAnyRole("ADMIN", "DEPARTMENT_OFFICER")

                // Complaints submission — authenticated or public
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/complaints", "/api/complaints/**", "/complaints", "/complaints/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/complaints/**", "/complaints/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/complaints/**", "/complaints/**").permitAll()

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
