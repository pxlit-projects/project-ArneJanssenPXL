package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Comment update forbidden")
public class CommentUpdateForbiddenException extends RuntimeException{
    public CommentUpdateForbiddenException(String message){
        super(message);
    }
}
