package be.pxl.services.services;

public interface IMailSenderService {
    void sendNotificationMail(String subject, String text);
}
