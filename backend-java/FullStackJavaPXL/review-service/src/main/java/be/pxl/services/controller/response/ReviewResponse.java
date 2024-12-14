package be.pxl.services.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long postId;
    private String feedback;
    private LocalDateTime dateCreated;
    private String reviewer;
    private int reviewerId;
}
