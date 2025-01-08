package be.pxl.services;

import be.pxl.services.services.MailSenderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailSenderServiceTests {
    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private SimpleMailMessage simpleMailMessage;

    @InjectMocks
    private MailSenderService mailSenderService;

    @BeforeEach
    public void beforeEach() {
        simpleMailMessage = new SimpleMailMessage();
    }

    @Test
    public void testSendNotificationMail(){
        String subject = "Subject";
        String text = "Text";

        mailSenderService.sendNotificationMail(subject, text);
        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
