package be.pxl.services.controller.api;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;
    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@RequestBody PostRequest postRequest, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [POST] /api/post with params: {} in RequestBody", postRequest);
        postService.createPost(postRequest, username, userId, role);
    }

    /*
    @GetMapping
    public ResponseEntity getAllPosts(){
        log.info("Calling endpoint [GET] /api/post");
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }
    */

    @GetMapping("/published")
    public ResponseEntity getAllPublishedPosts(){
        log.info("Calling endpoint [GET] /api/post/published");
        return new ResponseEntity(postService.getPublishedPosts(), HttpStatus.OK);
    }

    @GetMapping("/submitted")
    public ResponseEntity getAllSubmittedPosts(@RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [GET] /api/post/submitted");
        return new ResponseEntity(postService.getAllSubmittedPosts(username, userId, role), HttpStatus.OK);
    }

    @GetMapping("/filter/{postStatus}")
    public ResponseEntity getAllPostsByAuthorIdAndStatus(@RequestHeader String username, @RequestHeader int userId, @RequestHeader String role, @PathVariable PostStatus postStatus){
        log.info("Calling endpoint [GET] /api/post/filter/{}", postStatus.name());
        return new ResponseEntity(postService.getAllPostsByAuthorIdAndPostStatus(username, userId, role, postStatus), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [PUT] /api/post/{} with params: {} in PathVariable & with params: {} in RequestBody", id, id, postRequest);

        return new ResponseEntity(postService.updatePost(id, postRequest, username, userId, role), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPostById(@PathVariable Long id, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role){
        log.info("Calling endpoint [GET] /api/post/{} with params: {} in PathVariable", id, id);
        return new ResponseEntity(postService.getPostById(id, username, userId, role), HttpStatus.OK);
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity publishPost(@PathVariable Long id, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role) {
        log.info("Calling endpoint [POST] /api/post/{}/publish with params: {} in PathVariable", id, id);
        return new ResponseEntity(postService.publishPost(id, username, userId, role), HttpStatus.OK);
    }
}
