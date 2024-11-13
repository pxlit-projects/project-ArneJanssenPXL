package be.pxl.services.controller.api;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@RequestBody PostRequest postRequest){
        postService.createPost(postRequest);
    }

    @GetMapping
    public ResponseEntity getAllPosts(){
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/concept")
    public ResponseEntity getAllConceptPosts(){
        return new ResponseEntity(postService.getConceptPosts(), HttpStatus.OK);
    }

    @GetMapping("/published")
    public ResponseEntity getAllPublishedPosts(){
        return new ResponseEntity(postService.getPublishedPosts(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest){
        postService.updatePost(id, postRequest);
    }
}
