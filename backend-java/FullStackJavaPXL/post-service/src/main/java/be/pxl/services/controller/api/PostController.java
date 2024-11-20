package be.pxl.services.controller.api;

import be.pxl.services.controller.request.PostRequest;
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
    public void createPost(@RequestBody PostRequest postRequest){
        log.info("Calling endpoint [POST] /api/post with params: {} in RequestBody", postRequest);
        postService.createPost(postRequest);
    }

    @GetMapping
    public ResponseEntity getAllPosts(){
        log.info("Calling endpoint [GET] /api/post");
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/concept")
    public ResponseEntity getAllConceptPosts(){
        log.info("Calling endpoint [GET] /api/post/concept");
        return new ResponseEntity(postService.getConceptPosts(), HttpStatus.OK);
    }

    @GetMapping("/published")
    public ResponseEntity getAllPublishedPosts(){
        log.info("Calling endpoint [GET] /api/post/published");
        return new ResponseEntity(postService.getPublishedPosts(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest){
        log.info("Calling endpoint [PUT] /api/post/{} with params: {} in PathVariable & with params: {} in RequestBody", id, id, postRequest);
        postService.updatePost(id, postRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPostById(@PathVariable Long id){
        log.info("Calling endpoint [GET] /api/post/{} with params: {} in PathVariable", id, id);
        return new ResponseEntity(postService.getPostById(id), HttpStatus.OK);
    }
}
