package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                .build();
    }

    @Override
    public PostResponse createPost(PostRequest postRequest) {
        Post post = Post.builder()
                .id(postRequest.getId())
                .author(postRequest.getAuthor())
                .content(postRequest.getContent())
                .datePublished(postRequest.getDatePublished())
                .build();

        post = postRepository.save(post);

        return mapToPostResponse(post);
    }
}
