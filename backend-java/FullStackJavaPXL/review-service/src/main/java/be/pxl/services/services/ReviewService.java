package be.pxl.services.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.controller.response.ReviewResponse;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.Review;
import be.pxl.services.exception.PostHasInvalidPostStatusException;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;
    private final PostClient postClient;

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private ReviewResponse mapToReviewResponse(Review review){
        return ReviewResponse.builder()
                .id(review.getId())
                .postId(review.getId())
                .feedback(review.getFeedback())
                .dateCreated(review.getDateCreated())
                .reviewer(review.getReviewer())
                .reviewerId(review.getReviewerId())
                .build();
    }

    @Override
    public void approvePost(Long id) {
        log.info("Sending a Approved Message To Post-Service");
        rabbitTemplate.convertAndSend("approvedPostQueue", id);
    }

    @Override
    public void rejectPost(Long id, String reviewer, int reviewerId, ReviewRequest reviewRequest) {
        log.info("Finding post with id: {}", id);
        PostResponse post = postClient.getPostById(id);
        log.info("Post with id: {} found", id);

        log.info("Checking is post: {} exists", post.getId());
        if (post == null){
            throw new PostNotFoundException("Post with id: " + id + " does not exist");
        }
        log.info("Post {} does exist", post.getId());

        log.info("Checking if post: {} is submitted", post.getId());
        if (post.getPostStatus() != PostStatus.SUBMITTED){
            throw new PostHasInvalidPostStatusException("Post is not submitted");
        }
        log.info("Post {} has been submitted", post.getId());

        log.info("Sending a Rejected Message To Post-Service");
        rabbitTemplate.convertAndSend("rejectedPostQueue", id);

        log.info("Building the review object.");
        Review review = Review.builder()
                .postId(post.getId())
                .feedback(reviewRequest.getFeedback())
                .dateCreated(LocalDateTime.now())
                .reviewer(reviewer)
                .reviewerId(reviewerId)
                .build();

        log.info("Saving review ({}) in repository", review);
        reviewRepository.save(review);
        log.info("Successfully saved review with id: {}", review.getId());
    }

    @Override
    public List<ReviewResponse> getReviewsByPostId(Long id) {
        log.info("Retrieving all review");
        List<Review> reviews = reviewRepository.findAllByPostId(id);
        log.info("Mapping {} To ReviewResponse", reviews);
        return reviews.stream().map(this::mapToReviewResponse).toList();
    }
}
