package be.pxl.services.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Post update forbidden")
public class PostUpdateForbiddenException extends RuntimeException{
    public PostUpdateForbiddenException(String message) {super(message); }
}
