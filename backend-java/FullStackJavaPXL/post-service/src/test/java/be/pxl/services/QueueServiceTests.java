package be.pxl.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.MailSenderService;
import be.pxl.services.services.QueueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class QueueServiceTests {
    @Mock
    private MailSenderService mailSenderService;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private QueueService queueService;

    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testApprovedPost(){
        Post post = new Post(1L, "Author", 1, "Content", "Title", "Category", null, LocalDateTime.now(), PostStatus.SUBMITTED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        queueService.approvedPost(1L);

        assertEquals(PostStatus.APPROVED, post.getPostStatus());
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNotificationMail(anyString(), anyString());
    }

    @Test
    public void testRejectedPost(){
        Post post = new Post(1L, "Author", 1, "Content", "Title", "Category", null, LocalDateTime.now(), PostStatus.SUBMITTED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        queueService.rejectedPost(1L);

        assertEquals(PostStatus.REJECTED, post.getPostStatus());
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNotificationMail(anyString(), anyString());
    }
}
