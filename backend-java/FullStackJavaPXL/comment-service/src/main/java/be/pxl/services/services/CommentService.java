package be.pxl.services.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.response.CommentResponse;
import be.pxl.services.controller.response.PostResponse;
import be.pxl.services.domain.Comment;
import be.pxl.services.domain.PostStatus;
import be.pxl.services.exception.CommentNotFoundException;
import be.pxl.services.exception.PostInvalidPostStatusException;
import be.pxl.services.exception.UnauthorizedCommentException;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService{
    private final CommentRepository commentRepository;
    private final PostClient postClient;
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);

    private CommentResponse mapToCommentResponse(Comment comment){
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getId())
                .text(comment.getText())
                .dateCreated(comment.getDateCreated())
                .commenter(comment.getCommenter())
                .commenterId(comment.getCommenterId())
                .build();
    }

    @Override
    public List<CommentResponse> getCommentsByPostId(Long id) {
        log.info("Retrieving all comments");
        List<Comment> comments = commentRepository.findAllByPostId(id);
        log.info("Mapping {} To CommentResponse", comments);
        return comments.stream().map(this::mapToCommentResponse).toList();
    }

    @Override
    public CommentResponse createComment(CommentRequest commentRequest, String username, int userId, String role) {
        log.info("Finding post with id: {}", commentRequest.getPostId());
        PostResponse post = postClient.getPostById(commentRequest.getPostId(), username, userId, role);
        log.info("Post with id: {} found", commentRequest.getPostId());

        log.info("Checking for correct permissions.");
        if (!Objects.equals(role, "Redacteur") && !Objects.equals(role, "Gebruiker")){
            throw new UnauthorizedCommentException("User does not have the permissions to create a comment");
        }
        log.info("User: {} has the correct permissions", username);

        log.info("Create comment");
        Comment comment = Comment.builder()
                .text(commentRequest.getText())
                .postId(commentRequest.getPostId())
                .build();

        comment.setDateCreated(LocalDateTime.now());
        comment.setPostId(post.getId());
        comment.setCommenter(username);
        comment.setCommenterId(userId);
        log.info("Comment has been created");

        log.info("Saving comment ({}) in repository", comment);
        comment = commentRepository.save(comment);
        log.info("Successfully saved comment with id: {}", comment.getId());

        log.info("Mapping {} To CommentResponse", comment);
        return mapToCommentResponse(comment);
    }

    @Override
    public void deleteComment(Long id, String username, int userId, String role) {
        log.info("Finding comment with id " + id);
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException("Comment with id: " + id + " not found"));

        log.info("Checking for correct permissions.");
        if (!Objects.equals(role, "Redacteur") && !Objects.equals(role, "Gebruiker")){
            throw new UnauthorizedCommentException("User does not have the permissions to create a comment");
        }
        log.info("User: {} has the correct permissions", username);

        log.info("Deleting comment with id: {}", comment.getId());
        commentRepository.deleteById(comment.getId());
        log.info("Comment has been deletet");
    }

    @Override
    public CommentResponse updateComment(Long id, CommentRequest commentRequest, String username, int userId, String role) {
        log.info("Finding comment with id " + id);
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new CommentNotFoundException("Comment with id: " + id + " not found"));

        log.info("Finding post with id: {}", id);
        PostResponse post = postClient.getPostById(comment.getPostId(), username, userId, role);
        log.info("Post with id: {} found", id);

        log.info("Checking for correct permissions.");
        if (!Objects.equals(role, "Redacteur") && !Objects.equals(role, "Gebruiker")){
            throw new UnauthorizedCommentException("User does not have the permissions to create a comment");
        }
        log.info("User: {} has the correct permissions", username);

        log.info("Checking if user is owner");
        if (comment.getCommenterId() != userId){
            throw new CommentNotFoundException("Comment with id " + id + " cannot be edited because you're not the owner");
        }
        log.info("User is the owner");

        log.info("Checking for correct postStatus");
        if (post.getPostStatus() != PostStatus.PUBLISHED){
            throw new PostInvalidPostStatusException("Post with id " + id + " needs to be a concept or rejected.");
        }
        log.info("Post has appropriate PostStatus");

        log.info("Updating comment properties");
        comment.setText(commentRequest.getText());

        log.info("Saving comment ({}) in repository", comment);
        comment = commentRepository.save(comment);
        log.info("Successfully saved comment with id: {}", comment.getId());

        log.info("Mapping {} To CommentResponse", comment);
        return mapToCommentResponse(comment);
    }
}
