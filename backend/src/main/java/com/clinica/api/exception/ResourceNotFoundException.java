package com.clinica.api.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format(ExceptionMessages.RECURSO_NAO_ENCONTRADO, resource, id));
    }
}
