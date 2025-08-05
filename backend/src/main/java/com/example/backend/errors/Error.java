package com.example.backend.errors;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class Error extends Exception {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleOtherException(
            Exception e,
            WebRequest req) {

        ErrorDetails errorDetails = new ErrorDetails();

        errorDetails.setMessage(e.getMessage());

        errorDetails.setError(req.getDescription(false));

        errorDetails.setTimeStamp(new Date(System.currentTimeMillis()));

        return new ResponseEntity<ErrorDetails>(errorDetails, HttpStatus.BAD_REQUEST);
    }
}
