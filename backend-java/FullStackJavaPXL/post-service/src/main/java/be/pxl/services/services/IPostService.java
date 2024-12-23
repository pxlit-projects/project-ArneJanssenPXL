package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.PostStatus;

import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest, String username, int userId, String role);
    PostResponse publishPost(Long id, String username, int userId, String role);

    //List<PostResponse> getAllPosts();
    List<PostResponse> getPublishedPosts();
    PostResponse getPostById(Long id, String username, int userId, String role);
    List<PostResponse> getAllSubmittedPosts(String username, int userId, String role);
    List<PostResponse> getAllPostsByAuthorIdAndPostStatus(String username, int userId, String role, PostStatus postStatus);

    PostResponse updatePost(Long id, PostRequest postRequest, String username, int userId, String role);
}
