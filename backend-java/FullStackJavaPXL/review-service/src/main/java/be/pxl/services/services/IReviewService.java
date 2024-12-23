package be.pxl.services.services;

import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.controller.response.ReviewResponse;

import java.util.List;

public interface IReviewService {
    void approvePost(Long id);
    void rejectPost(Long id, String reviewer, int reviewerId, String role, ReviewRequest reviewRequest);
    List<ReviewResponse> getReviewsByPostId(Long id);
}
