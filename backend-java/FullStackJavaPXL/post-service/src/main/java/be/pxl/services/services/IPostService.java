package be.pxl.services.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.response.PostResponse;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest);
}
