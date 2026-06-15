package com.hotelbooking.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                .authorizeExchange(exchanges -> exchanges
                        // Endpoints públicos — sin token
                        .pathMatchers(
                                "/actuator/health",
                                "/actuator/info",
                                "/actuator/prometheus",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // API de negocio — requieren JWT válido de Keycloak
                        .pathMatchers(
                                "/api/v1/users/**",
                                "/api/v1/rooms/**",
                                "/api/v1/bookings/**",
                                "/api/v1/payments/**",
                                "/api/v1/notifications/**"
                        ).authenticated()
                        .anyExchange().authenticated()
                )
                // issuer-uri se lee de gateway-dev.yml vía config-server
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {})
                )
                .build();
    }
}
