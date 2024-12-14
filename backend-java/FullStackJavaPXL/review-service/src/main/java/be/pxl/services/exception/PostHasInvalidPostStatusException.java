package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Post is not submitted")
public class PostHasInvalidPostStatusException extends RuntimeException{
    public PostHasInvalidPostStatusException(String message){
        super(message);
    }
}
