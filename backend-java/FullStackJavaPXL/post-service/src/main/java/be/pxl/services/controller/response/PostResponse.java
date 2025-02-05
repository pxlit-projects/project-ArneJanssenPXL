package be.pxl.services.controller.response;

import be.pxl.services.domain.PostStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;

    private String author;
    private int authorId;

    private String content;
    private String title;
    private String category;

    private LocalDateTime datePublished;
    private LocalDateTime dateCreated;

    private PostStatus postStatus;
}
