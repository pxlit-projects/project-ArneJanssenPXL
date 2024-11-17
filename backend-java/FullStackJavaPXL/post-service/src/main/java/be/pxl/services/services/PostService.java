package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    private PostResponse mapToPostResponse(Post post){
        return PostResponse.builder()
                .id(post.getId())
                .author(post.getAuthor())
                .content(post.getContent())
                .datePublished(post.getDatePublished())
                .isConcept(post.isConcept())
                .build();
    }

    @Override
    public PostResponse createPost(PostRequest postRequest) {
        log.info("Creating post with post-request: {}", postRequest);
        Post post = Post.builder()
                .id(postRequest.getId())
                .author(postRequest.getAuthor())
                .content(postRequest.getContent())
                .datePublished(postRequest.getDatePublished())
                .isConcept(postRequest.isConcept())
                .build();

        log.info("Saving post ({}) in repository", post);
        post = postRepository.save(post);
        log.info("Successfully saved post with id: {}", post.getId());

        log.info("Mapping {} To PostResponse", post);
        return mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        log.info("Retrieving all posts");
        List<Post> posts = postRepository.findAll();
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getConceptPosts() {
        log.info("Retrieving all concept posts");
        List<Post> posts = postRepository.findByIsConcept(true);
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getPublishedPosts() {
        log.info("Retrieving all published posts");
        List<Post> posts = postRepository.findByIsConcept(false);
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        log.info("Finding post with id: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id: " + id + " was not found."));

        log.info("Updating post properties");
        post.setAuthor(postRequest.getAuthor());
        post.setContent(postRequest.getContent());
        post.setConcept(postRequest.isConcept());
        post.setDatePublished(postRequest.getDatePublished());

        log.info("Saving post ({}) in repository", post);
        post = postRepository.save(post);
        log.info("Successfully saved post with id: {}", post.getId());

        log.info("Mapping {} To PostResponse", post);
        return mapToPostResponse(post);
    }
}
