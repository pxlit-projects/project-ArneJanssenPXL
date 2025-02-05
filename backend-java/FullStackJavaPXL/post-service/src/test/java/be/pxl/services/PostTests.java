package be.pxl.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.exception.InvalidRoleException;
import be.pxl.services.exception.PostInvalidPostStatusException;
import be.pxl.services.exception.PostUpdateForbiddenException;
import be.pxl.services.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Optional;

import static junit.framework.Assert.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

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
        postRepository.deleteAll();
    }

    @Test
    public void testCreatePost() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .author("Author")
                .authorId(1)
                .content("Content")
                .title("Title")
                .category("Category")
                .dateCreated(LocalDateTime.now())
                .postStatus(PostStatus.APPROVED)
                .build();

        String postRequestString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .content(postRequestString))
                .andExpect(status().isCreated());
    }

    @Test
    public void testCreatePostShouldThrowInvalidRoleException() throws InvalidRoleException, Exception {
        PostRequest post = PostRequest.builder()
                .content("Post Content")
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        String postRequestString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Gebruiker")
                        .content(postRequestString))
                .andExpect(status().isForbidden())
                .andDo(result -> new InvalidRoleException("Only users with role 'Redacteur' can create posts."));
    }

    /*@Test
    public void testPublishPost() throws Exception{
        Post post = Post.builder()
                .id(1L)
                .author("Author")
                .authorId(1)
                .content("Content")
                .title("Title")
                .category("Category")
                .dateCreated(LocalDateTime.now())
                .postStatus(PostStatus.APPROVED)
                .build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        String postRequestString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/1/publish")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .content(postRequestString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postStatus").value("PUBLISHED"));
    }*/

    @Test
    public void testGetAllPublishedPosts() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.PUBLISHED)
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .authorId(2)
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .title("Title2")
                .category("Category2")
                .postStatus(PostStatus.CONCEPT)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/published")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author1"))
                .andExpect(jsonPath("$[0].content").value("Post Content"))
                .andExpect(jsonPath("$[0].title").value("Title"))
                .andExpect(jsonPath("$[0].category").value("Category"));

        assertEquals(1, postRepository.findAllByPostStatus(PostStatus.PUBLISHED).size());
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.CONCEPT)
                .build();

        post = postRepository.save(post);

        PostRequest postRequest = PostRequest.builder()
                .content("Updated Content")
                .title("Updated Title")
                .category("Updated Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", post.getAuthor())
                        .header("userId", post.getAuthorId())
                        .header("role", "Redacteur")
                        .content(postRequestString))
                .andExpect(status().isOk());

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();

        assertEquals("Updated Content", updatedPost.getContent());
        assertEquals("Updated Title", updatedPost.getTitle());
        assertEquals("Updated Category", updatedPost.getCategory());
        assertEquals(PostStatus.SUBMITTED, updatedPost.getPostStatus());
    }

    @Test
    public void testUpdatePostShouldThrowException() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.CONCEPT)
                .build();

        post = postRepository.save(post);

        PostRequest postRequest = PostRequest.builder()
                .content("Updated Content")
                .title("Updated Title")
                .category("Updated Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Blabla")
                        .header("userId", 954)
                        .header("role", "Redacteur")
                        .content(postRequestString))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof PostUpdateForbiddenException));
    }

    @Test
    public void testUpdatePostShouldThrowPostInvalidPostStatusException() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.APPROVED)
                .build();

        post = postRepository.save(post);

        PostRequest postRequest = PostRequest.builder()
                .content("Updated Content")
                .title("Updated Title")
                .category("Updated Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", post.getAuthor())
                        .header("userId", post.getAuthorId())
                        .header("role", "Redacteur")
                        .content(postRequestString))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof PostInvalidPostStatusException));
    }

    @Test
    public void testGetPostById() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.CONCEPT)
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .title("Title2")
                .category("Category2")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/" + post2.getId())
                        .header("username", "Author2")
                        .header("userId", 2)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author").value("Author2"))
                .andExpect(jsonPath("$.content").value("Post Content 2"))
                .andExpect(jsonPath("$.title").value("Title2"))
                .andExpect(jsonPath("$.category").value("Category2"));

        assertTrue(postRepository.findById(post2.getId()).isPresent());
    }

    @Test
    public void testGetPostByIdWhenIdNotFound() throws Exception {
        long notFoundId = 25L;

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/" + notFoundId)
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(status().reason("Post not found"));
    }

    @Test
    public void testGetPostByIdNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/999")
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllSubmittedPosts() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .authorId(2)
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .title("Title2")
                .category("Category2")
                .postStatus(PostStatus.CONCEPT)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/submitted")
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author1"))
                .andExpect(jsonPath("$[0].content").value("Post Content"))
                .andExpect(jsonPath("$[0].title").value("Title"))
                .andExpect(jsonPath("$[0].category").value("Category"));

        assertEquals(1, postRepository.findAllByPostStatus(PostStatus.SUBMITTED).size());
    }

    /*@Test
    public void testGetAllPosts() throws Exception {
        Post post1 = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .title("Title2")
                .category("Category2")
                .postStatus(PostStatus.CONCEPT)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author1"))
                .andExpect(jsonPath("$[0].content").value("Post Content"))
                .andExpect(jsonPath("$[0].title").value("Title"))
                .andExpect(jsonPath("$[0].category").value("Category"))
                .andExpect(jsonPath("$[1].author").value("Author2"))
                .andExpect(jsonPath("$[1].content").value("Post Content 2"))
                .andExpect(jsonPath("$[1].title").value("Title2"))
                .andExpect(jsonPath("$[1].category").value("Category2"));

        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    public void testGetAllConceptPosts() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.CONCEPT)
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .authorId(1)
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .title("Title2")
                .category("Category2")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/concept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("authorId", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Post Content"))
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.category").value("Category"));

        assertEquals(1, postRepository.findAllByPostStatus(PostStatus.CONCEPT).size());
    }*/



    @Test
    public void testPublishPostSuccessfully() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Content")
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.APPROVED)
                .build();

        post = postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/" + post.getId() + "/publish")
                        .header("username", post.getAuthor())
                        .header("userId", post.getAuthorId())
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(post.getId()))
                .andExpect(jsonPath("$.postStatus").value(PostStatus.PUBLISHED.name()));

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals(PostStatus.PUBLISHED, updatedPost.getPostStatus());
        assertNotNull(updatedPost.getDatePublished());
    }

    @Test
    public void testPublishPostWhenNotOwner() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Content")
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.APPROVED)
                .build();

        post = postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/" + post.getId() + "/publish")
                        .header("username", "OtherAuthor")
                        .header("userId", 2)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testPublishPostWhenNotApproved() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .authorId(1)
                .content("Content")
                .title("Title")
                .category("Category")
                .postStatus(PostStatus.SUBMITTED)
                .build();

        post = postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/" + post.getId() + "/publish")
                        .header("username", post.getAuthor())
                        .header("userId", post.getAuthorId())
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testPublishPostWhenPostNotFound() throws Exception {
        long notFoundId = 999L;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/" + notFoundId + "/publish")
                        .header("username", "Author")
                        .header("userId", 1)
                        .header("role", "Redacteur")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }


}
