CREATE TABLE IF NOT EXISTS users
(
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL,
    phone     VARCHAR(20),
    password  VARCHAR(255) NOT NULL,
    role      VARCHAR(20)  NOT NULL,
    enabled   TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT uq_user_email UNIQUE (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
