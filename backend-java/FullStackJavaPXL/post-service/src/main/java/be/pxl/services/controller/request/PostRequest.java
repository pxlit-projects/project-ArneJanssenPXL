package be.pxl.services.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private Long id;
    private String author;
    private String content;
    private LocalDateTime datePublished;
    private boolean isConcept;
}
