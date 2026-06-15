CREATE TABLE IF NOT EXISTS payments
(
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    booking_id       BIGINT         NOT NULL,
    amount           DECIMAL(10, 2) NOT NULL,
    payment_method   VARCHAR(20)    NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    transaction_code VARCHAR(50),
    paid_at          DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT uq_transaction_code UNIQUE (transaction_code),
    INDEX idx_payment_booking_id (booking_id),
    INDEX idx_payment_status (status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
