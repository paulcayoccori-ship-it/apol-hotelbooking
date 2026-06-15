package com.hotelbooking.room.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HotelBooking — Room Service API")
                        .description("REST API for room management in the HotelBooking system")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("HotelBooking Team")
                                .email("contact@hotelbooking.com")));
    }
}
