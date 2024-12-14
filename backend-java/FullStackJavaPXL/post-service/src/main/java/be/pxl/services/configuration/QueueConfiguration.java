package be.pxl.services.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfiguration {
    @Bean
    public Queue myApprovedPostQueue() {
        return new Queue("approvedPostQueue", true);
    }
    @Bean
    public Queue myRejectedPostQueue() {
        return new Queue("rejectedPostQueue", true);
    }
}
