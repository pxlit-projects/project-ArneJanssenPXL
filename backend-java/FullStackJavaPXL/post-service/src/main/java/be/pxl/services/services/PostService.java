package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.exception.PostNotApprovedException;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.exception.PostUnauthorizedPublicationException;
import be.pxl.services.exception.PostUpdateForbiddenException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
                .dateCreated(post.getDateCreated())
                .postStatus(post.getPostStatus())
                .title(post.getTitle())
                .category(post.getCategory())
                .build();
    }

    @Override
    public PostResponse createPost(PostRequest postRequest, String author, int authorId) {
        log.info("Creating post with post-request: {}", postRequest);
        Post post = Post.builder()
                .content(postRequest.getContent())
                .title(postRequest.getTitle())
                .category(postRequest.getCategory())
                .postStatus(postRequest.getPostStatus())
                .build();

        post.setAuthor(author);
        post.setAuthorId(authorId);
        post.setDateCreated(LocalDateTime.now());

        if (postRequest.getPostStatus() == PostStatus.PUBLISHED){
            post.setDatePublished(LocalDateTime.now());
        }

        log.info("Saving post ({}) in repository", post);
        post = postRepository.save(post);
        log.info("Successfully saved post with id: {}", post.getId());

        log.info("Mapping {} To PostResponse", post);
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse publishPost(Long id, int authorId) {
        log.info("Finding post with id: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id: " + id + " not found"));

        log.info("Checking that author: {} is the owner", authorId);
        if (post.getAuthorId() != authorId){
            throw new PostUnauthorizedPublicationException("Post with id " + id + " cannot be published by user with id " + authorId);
        }
        log.info("Author: {} is the owner", authorId);

        log.info("Checking that post: {} is approved", post.getId());
        if (post.getPostStatus() != PostStatus.APPROVED){
            throw new PostNotApprovedException("Post with id " + id + " cannot be published because it is not approved");
        }
        log.info("Post: {} is approved", post.getId());

        log.info("Changing post: {} to PUBLISHED & set DatePublished", post.getId());
        post.setPostStatus(PostStatus.PUBLISHED);
        post.setDatePublished(LocalDateTime.now());

        log.info("Saving post ({}) in repository", post);
        postRepository.save(post);
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
    public List<PostResponse> getPublishedPosts() {
        log.info("Retrieving all published posts");
        List<Post> posts = postRepository.findAllByPostStatus(PostStatus.PUBLISHED);
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public PostResponse updatePost(Long id, PostRequest postRequest, String author, int authorId) {
        log.info("Finding post with id: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id: " + id + " was not found."));

        log.info("Checking if log user is owner");
        if (post.getAuthorId() != authorId){
            throw new PostUpdateForbiddenException("Post with id " + id + " cannot be edited because you're not the owner");
        }
        log.info("User is the owner");

        log.info("Updating post properties");
        post.setContent(postRequest.getContent());
        post.setTitle(postRequest.getTitle());
        post.setCategory(postRequest.getCategory());
        post.setPostStatus(postRequest.getPostStatus());

        if (postRequest.getPostStatus() != PostStatus.PUBLISHED){
            post.setDatePublished(null);
        }
        else{
            post.setDatePublished(LocalDateTime.now());
        }

        log.info("Saving post ({}) in repository", post);
        post = postRepository.save(post);
        log.info("Successfully saved post with id: {}", post.getId());

        log.info("Mapping {} To PostResponse", post);
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse getPostById(Long id) {
        log.info("Finding post with id: {}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id: " + id + " does not exist"));
        log.info("Successfully found post with id: {}", id);

        log.info("Mapping {} To PostResponse", post);
        return mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllSubmittedPosts() {
        log.info("Retrieving all submitted posts");
        List<Post> posts = postRepository.findAllByPostStatus(PostStatus.SUBMITTED);
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getAllPostsByAuthorIdAndPostStatus(int authorId, PostStatus postStatus) {
        log.info("Retrieving all {} posts by author: {}", postStatus.name() , authorId);
        List<Post> posts = postRepository.findByAuthorIdAndPostStatus(authorId, postStatus);
        log.info("Mapping {} To PostResponse", posts);
        return posts.stream().map(this::mapToPostResponse).toList();
    }
}
