package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

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
        Post post = Post.builder()
                .id(postRequest.getId())
                .author(postRequest.getAuthor())
                .content(postRequest.getContent())
                .datePublished(postRequest.getDatePublished())
                .isConcept(postRequest.isConcept())
                .build();

        post = postRepository.save(post);

        return mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getConceptPosts() {
        List<Post> posts = postRepository.findByIsConcept(true);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getPublishedPosts() {
        List<Post> posts = postRepository.findByIsConcept(false);
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id: " + id + " was not found."));

        post.setAuthor(postRequest.getAuthor());
        post.setContent(postRequest.getContent());
        post.setConcept(postRequest.isConcept());
        post.setDatePublished(postRequest.getDatePublished());

        post = postRepository.save(post);

        return mapToPostResponse(post);
    }
}
