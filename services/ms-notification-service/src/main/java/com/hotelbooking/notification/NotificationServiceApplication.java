package com.hotelbooking.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// TODO fase Feign : agregar @EnableFeignClients y crear clients en client/
// TODO fase Kafka : agregar @EnableKafka y crear consumers en consumer/
@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
