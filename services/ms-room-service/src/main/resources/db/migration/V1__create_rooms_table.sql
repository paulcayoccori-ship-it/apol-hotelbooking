CREATE TABLE IF NOT EXISTS rooms
(
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    room_number     VARCHAR(10)    NOT NULL,
    type            VARCHAR(50)    NOT NULL,
    description     TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity        INT            NOT NULL,
    status          VARCHAR(20)    NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_room_number UNIQUE (room_number)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
