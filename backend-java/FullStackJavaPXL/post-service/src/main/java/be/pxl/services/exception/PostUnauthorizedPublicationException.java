package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Not authorized to publish this post.")
public class PostUnauthorizedPublicationException extends RuntimeException{
    public PostUnauthorizedPublicationException(String message){
        super(message);
    }
}
