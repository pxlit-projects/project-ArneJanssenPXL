package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Post has invalid PostStatus")
public class PostInvalidPostStatusException extends RuntimeException{
    public PostInvalidPostStatusException(String message){
        super(message);
    }
}
