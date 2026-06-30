package com.hotelbooking.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                .authorizeExchange(exchanges -> exchanges
                        // Preflight OPTIONS — siempre libre
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Endpoints públicos de infraestructura
                        .pathMatchers(
                                "/actuator/health",
                                "/actuator/info",
                                "/actuator/prometheus",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // ── Público — cliente final, sin login (web pública) ────────
                        .pathMatchers(HttpMethod.GET,   "/api/v1/rooms/**").permitAll()
                        .pathMatchers(HttpMethod.POST,  "/api/v1/users/client/register").permitAll()
                        .pathMatchers(HttpMethod.POST,  "/api/v1/users/client/login").permitAll()
                        .pathMatchers(HttpMethod.POST,  "/api/v1/bookings").permitAll()
                        .pathMatchers(HttpMethod.GET,   "/api/v1/bookings/*").permitAll()
                        .pathMatchers(HttpMethod.POST,  "/api/v1/payments").permitAll()
                        .pathMatchers(HttpMethod.PATCH, "/api/v1/payments/*/confirm").permitAll()

                        // ── Resto de la API — panel admin, requiere JWT de Keycloak ──
                        .pathMatchers("/api/v1/**").authenticated()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                )
                .build();
    }
}
