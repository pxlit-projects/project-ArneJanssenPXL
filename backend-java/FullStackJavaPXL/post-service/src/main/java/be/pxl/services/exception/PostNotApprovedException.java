package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Post is not approved")
public class PostNotApprovedException extends RuntimeException{
    public PostNotApprovedException(String message){
        super(message);
    }
}
