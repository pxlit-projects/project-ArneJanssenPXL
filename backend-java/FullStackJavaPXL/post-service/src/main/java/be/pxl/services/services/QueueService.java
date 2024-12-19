package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QueueService {
    private final PostRepository postRepository;
    private final MailSenderService mailSenderService;

    @RabbitListener(queues = "approvedPostQueue")
    public void approvedPost(Long id){
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
        post.setPostStatus(PostStatus.APPROVED);
        postRepository.save(post);

        mailSenderService.sendNotificationMail(post.getTitle() + " goedgekeurd", post.getTitle() + " is goedgekeurd een klaar om gepubliceerd te worden.");
    }

    @RabbitListener(queues = "rejectedPostQueue")
    public void rejectedPost(Long id){
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
        post.setPostStatus(PostStatus.REJECTED);
        postRepository.save(post);

        mailSenderService.sendNotificationMail(post.getTitle() + " afgekeurd", post.getTitle() + " is afgekeurd en zal herschreven moeten worden, om vervolgens weer ingediend te worden.");
    }
}
