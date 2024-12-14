package be.pxl.services.controller.api;

import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.services.IReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService reviewService;
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    @GetMapping("/{id}")
    public ResponseEntity getReviewById(Long id){
        log.info("Calling endpoint [GET] /api/review/" + id);
        return new ResponseEntity(reviewService.getReviewsByPostId(id), HttpStatus.OK);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity approvedPost(@PathVariable Long id){
        log.info("Calling endpoint [POST] /api/review/" + id + "approve");
        reviewService.approvePost(id);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity rejectPost(@PathVariable Long id, @RequestHeader String reviewer, @RequestHeader int reviewerId, @RequestBody ReviewRequest reviewRequest){
        log.info("Calling endpoint [POST] /api/review/" + id + "reject");
        reviewService.rejectPost(id, reviewer, reviewerId, reviewRequest);
        return new ResponseEntity(HttpStatus.OK);
    }
}
