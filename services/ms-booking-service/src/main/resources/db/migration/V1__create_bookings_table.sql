CREATE TABLE IF NOT EXISTS bookings
(
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    user_id         BIGINT         NOT NULL,
    room_id         BIGINT         NOT NULL,
    check_in_date   DATE           NOT NULL,
    check_out_date  DATE           NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    created_at      DATETIME       NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_booking_user_id (user_id),
    INDEX idx_booking_room_id (room_id),
    INDEX idx_booking_status (status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
