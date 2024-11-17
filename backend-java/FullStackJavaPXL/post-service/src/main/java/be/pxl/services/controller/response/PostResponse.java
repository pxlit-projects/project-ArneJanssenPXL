package be.pxl.services.controller.response;

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
    private String content;
    private LocalDateTime datePublished;
    private boolean isConcept;
    private String title;
    private String category;
}
