package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Unauthorized user")
public class UnauthorizedCommentException extends RuntimeException{
    public UnauthorizedCommentException(String message){
        super(message);
    }
}
