package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    private int authorId;

    private String content;
    private String title;
    private String category;

    private LocalDateTime datePublished;
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Enumerated(value = EnumType.STRING)
    private PostStatus postStatus;
}
