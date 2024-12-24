package be.pxl.services.client;

import be.pxl.services.controller.response.PostResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "post-service")
public interface PostClient {
    @GetMapping("/api/post/{id}")
    PostResponse getPostById(@PathVariable Long id, @RequestHeader String username, @RequestHeader int userId, @RequestHeader String role);
}
