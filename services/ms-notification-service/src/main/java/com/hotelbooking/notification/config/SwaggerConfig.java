package com.hotelbooking.notification.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI notificationServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ms-notification-service API")
                        .description("Notification management — simulated send (no real email/SMS yet). " +
                                "Kafka consumer and JavaMailSender wired in a future phase.")
                        .version("1.0.0"));
    }
}
