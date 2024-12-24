package be.pxl.services.controller.api;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.services.ICommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    private final ICommentService commentService;
    private static final Logger log = LoggerFactory.getLogger(CommentController.class);

    @GetMapping("{/id}")
    public ResponseEntity getCommentByPostId(@PathVariable Long id){
        log.info("Calling endpoint [GET] /api/comment/" + id);
        return new ResponseEntity(commentService.getCommentsByPostId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity createComment(@RequestBody CommentRequest commentRequest, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [POST] /api/comment/");
        return new ResponseEntity(commentService.createComment(commentRequest, username, userId, role), HttpStatus.CREATED);
    }

    @DeleteMapping("{/id}")
    public ResponseEntity deleteComment(@PathVariable Long id, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [DELETE] /api/comment/" + id);
        commentService.deleteComment(id, username, userId, role);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PutMapping("{id}")
    public ResponseEntity updateComment(@PathVariable Long id, @RequestBody CommentRequest commentRequest, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [PUT] /api/comment/" + id);
        return new ResponseEntity(commentService.updateComment(id, commentRequest, username, userId, role), HttpStatus.OK);
    }
}
