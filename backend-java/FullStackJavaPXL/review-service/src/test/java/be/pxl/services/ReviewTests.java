package be.pxl.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.domain.Review;
import be.pxl.services.exception.PostHasInvalidPostStatusException;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.ReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.Assertions;
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
import java.util.List;

import static junit.framework.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class ReviewTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReviewRepository reviewRepository;

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
        reviewRepository.deleteAll();
    }

    @Test
    public void testApprovePost() throws Exception {
        Long postId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review/" + postId + "/approve"))
                .andExpect(status().isOk());
    }

    @Test
    public void testRejectPost() throws Exception {
        Long postId = 1L;

        ReviewRequest reviewRequest = new ReviewRequest();
        reviewRequest.setFeedback("Post needs improvement");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.SUBMITTED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.any(), Mockito.anyInt(), Mockito.any()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review/" + postId + "/reject")
                        .header("reviewer", "John Doe")
                        .header("reviewerId", 123)
                        .header("role", "Reviewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk());

        List<Review> reviews = reviewRepository.findAll();
        Assertions.assertEquals(1, reviews.size());
        Assertions.assertEquals("Post needs improvement", reviews.get(0).getFeedback());
    }

    @Test
    public void testRejectPostShouldThrowPostHasInvalidPostStatusException() throws Exception {
        Long postId = 1L;

        ReviewRequest reviewRequest = new ReviewRequest();
        reviewRequest.setFeedback("Post needs improvement");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.CONCEPT);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.any(), Mockito.anyInt(), Mockito.any()))
                .thenReturn(mockPostResponse);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review/" + postId + "/reject")
                        .header("reviewer", "John Doe")
                        .header("reviewerId", 123)
                        .header("role", "Reviewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof PostHasInvalidPostStatusException));
    }

    @Test
    public void testRejectPostShouldThrowPostNotFoundException() throws Exception {
        Long postId = 1L;

        ReviewRequest reviewRequest = new ReviewRequest();
        reviewRequest.setFeedback("Post needs improvement");

        PostResponse mockPostResponse = new PostResponse();
        mockPostResponse.setId(postId);
        mockPostResponse.setPostStatus(PostStatus.SUBMITTED);

        Mockito.when(postClient.getPostById(Mockito.eq(postId), Mockito.any(), Mockito.anyInt(), Mockito.any()))
                .thenReturn(null);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/review/" + postId + "/reject")
                        .header("reviewer", "John Doe")
                        .header("reviewerId", 123)
                        .header("role", "Reviewer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof PostNotFoundException));
    }

    @Test
    public void testGetReviewsByPostId() throws Exception {
        Long postId = 1L;

        Review review1 = Review.builder()
                .postId(postId)
                .feedback("Feedback 1")
                .dateCreated(LocalDateTime.now())
                .reviewer("Reviewer1")
                .reviewerId(1)
                .build();

        Review review2 = Review.builder()
                .postId(postId)
                .feedback("Feedback 2")
                .dateCreated(LocalDateTime.now())
                .reviewer("Reviewer2")
                .reviewerId(2)
                .build();

        reviewRepository.saveAll(List.of(review1, review2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/review/" + postId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].feedback").value("Feedback 1"))
                .andExpect(jsonPath("$[1].feedback").value("Feedback 2"));
    }
}
