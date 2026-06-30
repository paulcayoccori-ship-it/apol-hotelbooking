package com.hotelbooking.user.exception;

public class DocumentAlreadyExistsException extends RuntimeException {
    public DocumentAlreadyExistsException(String documentNumber) {
        super("Document number already registered: " + documentNumber);
    }
}
