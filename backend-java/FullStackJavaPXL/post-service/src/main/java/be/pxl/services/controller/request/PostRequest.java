package be.pxl.services.controller.request;

import be.pxl.services.domain.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String content;
    private String title;
    private String category;
    private PostStatus postStatus;
}
