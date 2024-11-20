package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;

import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest);
    List<PostResponse> getAllPosts();
    List<PostResponse> getConceptPosts();
    List<PostResponse> getPublishedPosts();
    PostResponse updatePost(Long id, PostRequest postRequest);

    PostResponse getPostById(Long id);
}
