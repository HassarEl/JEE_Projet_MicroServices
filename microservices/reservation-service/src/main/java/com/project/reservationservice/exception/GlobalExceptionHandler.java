package com.project.reservationservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage() + "\n" + ex.getClass().getName(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleJsonErrors(org.springframework.http.converter.HttpMessageNotReadableException ex, WebRequest request) {
        return new ResponseEntity<>("JSON Parsing Error: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
