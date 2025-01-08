package be.pxl.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.exception.CommentNotFoundException;
import be.pxl.services.exception.PostInvalidPostStatusException;
import be.pxl.services.repository.CommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static junit.framework.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

    @MockBean
    private PostClient postClient;

    @Container
    private static MySQLContainer sqlContainer =
            new MySQLContainer("mysql:8.0.39");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void beforeEach(){
        commentRepository.deleteAll();
    }

    @Test
    public void testGetCommentsByPostId() throws Exception {
        Long postId = 15L;

        Comment comment = Comment.builder()
                .postId(postId)
                .text("Sample Comment")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/comment/" + postId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].text").value("Sample Comment"))
                .andExpect(jsonPath("$[0].commenter").value("testUser"));
    }

    @Test
    public void testCreateComment() throws Exception {
        Long postId = 15L;

        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setText("New Comment");
        commentRequest.setPostId(postId);

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.PUBLISHED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.anyString(), Mockito.anyInt(), Mockito.anyString()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/comment")
                        .header("username", "testUser")
                        .header("userId", 123)
                        .header("role", "Gebruiker")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("New Comment"))
                .andExpect(jsonPath("$.commenter").value("testUser"));
    }

    @Test
    public void testDeleteComment() throws Exception {
        Comment comment = Comment.builder()
                .postId(15L)
                .text("Comment to delete")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/comment/" + comment.getId())
                        .header("username", "testUser")
                        .header("userId", 123)
                        .header("role", "Gebruiker"))
                .andExpect(status().isNoContent());

        assertFalse(commentRepository.findById(comment.getId()).isPresent());
    }

    @Test
    public void testUpdateComment() throws Exception {
        Long postId = 15L;

        Comment comment = Comment.builder()
                .postId(postId)
                .text("Original Comment")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        CommentRequest updatedRequest = new CommentRequest();
        updatedRequest.setText("Updated Comment");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.PUBLISHED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.anyString(), Mockito.anyInt(), Mockito.anyString()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/comment/" + comment.getId())
                        .header("username", "testUser")
                        .header("userId", 123)
                        .header("role", "Gebruiker")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value("Updated Comment"));
    }

    @Test
    public void testUpdateCommentShouldThrowUnauthorizedCommentException() throws Exception {
        Long postId = 15L;

        Comment comment = Comment.builder()
                .postId(postId)
                .text("Original Comment")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        CommentRequest updatedRequest = new CommentRequest();
        updatedRequest.setText("Updated Comment");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.PUBLISHED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.anyString(), Mockito.anyInt(), Mockito.anyString()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/comment/" + comment.getId())
                        .header("username", "testUser")
                        .header("userId", 123)
                        .header("role", "GeenRedacteurOfGebruiker")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testUpdateCommentShouldThrowCommentNotFoundException() throws Exception {
        Long postId = 15L;

        Comment comment = Comment.builder()
                .postId(postId)
                .text("Original Comment")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        CommentRequest updatedRequest = new CommentRequest();
        updatedRequest.setText("Updated Comment");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.PUBLISHED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.anyString(), Mockito.anyInt(), Mockito.anyString()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/comment/" + comment.getId())
                        .header("username", "testUser")
                        .header("userId", 321)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof CommentNotFoundException));
    }

    @Test
    public void testUpdateCommentShouldThrowPostInvalidPostStatusException() throws Exception {
        Long postId = 15L;

        Comment comment = Comment.builder()
                .postId(postId)
                .text("Original Comment")
                .dateCreated(LocalDateTime.now())
                .commenter("testUser")
                .commenterId(123)
                .build();
        commentRepository.save(comment);

        CommentRequest updatedRequest = new CommentRequest();
        updatedRequest.setText("Updated Comment");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.SUBMITTED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.anyString(), Mockito.anyInt(), Mockito.anyString()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/comment/" + comment.getId())
                        .header("username", "testUser")
                        .header("userId", 123)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedRequest)))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof PostInvalidPostStatusException));
    }

    @Test
    public void testCreateCommentUnauthorized() throws Exception {
        Long postId = 15L;

        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setText("Unauthorized Comment");
        commentRequest.setPostId(postId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/comment")
                        .header("username", "unauthorizedUser")
                        .header("userId", 456)
                        .header("role", "Guest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isForbidden());
    }
}
