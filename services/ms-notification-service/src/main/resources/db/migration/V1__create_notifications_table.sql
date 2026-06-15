CREATE TABLE notifications (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    user_id     BIGINT          NOT NULL,
    booking_id  BIGINT          NOT NULL,
    type        VARCHAR(40)     NOT NULL,
    channel     VARCHAR(20)     NOT NULL,
    subject     VARCHAR(255)    NOT NULL,
    message     TEXT            NOT NULL,
    status      VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    sent_at     DATETIME        NULL,
    CONSTRAINT pk_notifications PRIMARY KEY (id)
);

CREATE INDEX idx_notifications_user_id    ON notifications (user_id);
CREATE INDEX idx_notifications_booking_id ON notifications (booking_id);
CREATE INDEX idx_notifications_status     ON notifications (status);
