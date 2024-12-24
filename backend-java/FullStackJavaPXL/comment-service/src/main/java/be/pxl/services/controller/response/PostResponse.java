package be.pxl.services.controller.response;

import be.pxl.services.domain.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String author;
    private int authorId;
    private String content;
    private LocalDateTime datePublished;
    private LocalDateTime dateCreated;
    private String title;
    private String category;
    private PostStatus postStatus;
}
