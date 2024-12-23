package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Invalid role")
public class InvalidRoleException extends RuntimeException{
    public InvalidRoleException(String message){
        super(message);
    }
}
