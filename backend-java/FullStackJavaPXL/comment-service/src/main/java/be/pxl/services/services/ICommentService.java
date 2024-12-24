package be.pxl.services.services;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.response.CommentResponse;

import java.util.List;

public interface ICommentService {
    List<CommentResponse> getCommentsByPostId(Long id);
    CommentResponse createComment(CommentRequest commentRequest, String username, int userId, String role);
    void deleteComment(Long id, String username, int userId, String role);
    CommentResponse updateComment(Long id, CommentRequest commentRequest, String username, int userId, String role);
}
