-- Permite registrar clientes con DNI/Carnet sin requerir email

ALTER TABLE users
    MODIFY COLUMN email VARCHAR(150) NULL;

ALTER TABLE users
    ADD COLUMN document_type   VARCHAR(30) NULL AFTER email,
    ADD COLUMN document_number VARCHAR(20) NULL AFTER document_type,
    ADD CONSTRAINT uq_user_document_number UNIQUE (document_number);
