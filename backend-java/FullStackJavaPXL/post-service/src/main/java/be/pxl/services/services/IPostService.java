package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.PostStatus;

import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest, String author, int authorId);
    PostResponse publishPost(Long id, int authorId);

    List<PostResponse> getAllPosts();
    //List<PostResponse> getConceptPosts();
    List<PostResponse> getPublishedPosts();
    PostResponse getPostById(Long id);
    List<PostResponse> getAllSubmittedPosts();
    List<PostResponse> getAllPostsByAuthorIdAndPostStatus(int authorId, PostStatus postStatus);

    PostResponse updatePost(Long id, PostRequest postRequest, String author, int authorId);
}
