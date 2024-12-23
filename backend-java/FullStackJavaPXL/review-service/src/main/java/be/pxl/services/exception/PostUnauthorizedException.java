package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Unauthorized owner")
public class PostUnauthorizedException extends RuntimeException{
    public PostUnauthorizedException(String message){
        super(message);
    }
}
