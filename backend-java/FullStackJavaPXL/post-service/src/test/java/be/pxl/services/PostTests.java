package be.pxl.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
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
                .author("Author")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .isConcept(true)
                .title("Title")
                .category("Category")
                .build();

        String postString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postString))
                .andExpect(status().isCreated());

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testGetAllPosts() throws Exception {
        Post post1 = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .isConcept(true)
                .title("Title")
                .category("Category")
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .isConcept(false)
                .title("Title2")
                .category("Category2")
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author1"))
                .andExpect(jsonPath("$[0].content").value("Post Content"))
                .andExpect(jsonPath("$[0].concept").value(true))
                .andExpect(jsonPath("$[0].title").value("Title"))
                .andExpect(jsonPath("$[0].category").value("Category"))
                .andExpect(jsonPath("$[1].author").value("Author2"))
                .andExpect(jsonPath("$[1].content").value("Post Content 2"))
                .andExpect(jsonPath("$[1].concept").value(false))
                .andExpect(jsonPath("$[1].title").value("Title2"))
                .andExpect(jsonPath("$[1].category").value("Category2"));

        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    public void testGetAllConceptPosts() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .isConcept(true)
                .title("Title")
                .category("Category")
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .isConcept(false)
                .title("Title2")
                .category("Category2")
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/concept")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author1"))
                .andExpect(jsonPath("$[0].content").value("Post Content"))
                .andExpect(jsonPath("$[0].concept").value(true))
                .andExpect(jsonPath("$[0].title").value("Title"))
                .andExpect(jsonPath("$[0].category").value("Category"));

        assertEquals(1, postRepository.findByIsConcept(true).size());
    }

    @Test
    public void testGetAllPublishedPosts() throws Exception{
        Post post1 = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .isConcept(true)
                .title("Title")
                .category("Category")
                .build();

        Post post2 = Post.builder()
                .author("Author2")
                .content("Post Content 2")
                .datePublished(LocalDateTime.now().minusDays(4))
                .isConcept(false)
                .title("Title2")
                .category("Category2")
                .build();

        postRepository.save(post1);
        postRepository.save(post2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/published")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("Author2"))
                .andExpect(jsonPath("$[0].content").value("Post Content 2"))
                .andExpect(jsonPath("$[0].concept").value(false))
                .andExpect(jsonPath("$[0].title").value("Title2"))
                .andExpect(jsonPath("$[0].category").value("Category2"));

        assertEquals(1, postRepository.findByIsConcept(false).size());
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = Post.builder()
                .author("Author1")
                .content("Post Content")
                .datePublished(LocalDateTime.now())
                .isConcept(true)
                .title("Title")
                .category("Category")
                .build();

        post = postRepository.save(post);

        PostRequest postRequest = PostRequest.builder()
                .author("Author1000")
                .content("New Content")
                .datePublished(LocalDateTime.now().minusDays(12))
                .isConcept(false)
                .title("Title2")
                .category("Category2")
                .build();

        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/" + post.getId())
                .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequestString))
                .andExpect(status().isOk());

        Optional<Post> updatedPost = postRepository.findById(post.getId());

        assertEquals(postRequest.getAuthor(), updatedPost.get().getAuthor());
        assertEquals(postRequest.getContent(), updatedPost.get().getContent());
        assertEquals(postRequest.isConcept(), updatedPost.get().isConcept());
        assertEquals(postRequest.getDatePublished().getYear(), updatedPost.get().getDatePublished().getYear());
        assertEquals(postRequest.getDatePublished().getMonth(), updatedPost.get().getDatePublished().getMonth());
        assertEquals(postRequest.getDatePublished().getDayOfMonth(), updatedPost.get().getDatePublished().getDayOfMonth());
        assertEquals(postRequest.getTitle(), updatedPost.get().getTitle());
        assertEquals(postRequest.getCategory(), updatedPost.get().getCategory());

        assertEquals(1, postRepository.findAll().size());
    }
}
