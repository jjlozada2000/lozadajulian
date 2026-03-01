package com.julian.portfolio.service;

import com.julian.portfolio.dto.ContactRequest;
import com.julian.portfolio.model.ContactMessage;
import com.julian.portfolio.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository repo;
    private final JavaMailSender mailSender;

    @Value("${app.contact.recipient-email}")
    private String recipientEmail;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public ContactService(ContactMessageRepository repo, JavaMailSender mailSender) {
        this.repo = repo;
        this.mailSender = mailSender;
    }

    public void handleSubmission(ContactRequest req, HttpServletRequest httpReq) {
        // 1. Persist to DB
        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName());
        msg.setEmail(req.getEmail());
        msg.setMessage(req.getMessage());
        msg.setIpAddress(getClientIp(httpReq));
        repo.save(msg);

        // 2. Forward to your inbox
        sendNotificationEmail(req);
    }

    private void sendNotificationEmail(ContactRequest req) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(senderEmail);
        mail.setTo(recipientEmail);
        mail.setReplyTo(req.getEmail());
        mail.setSubject("Portfolio contact from " + req.getName());
        mail.setText(
            "Name:    " + req.getName() + "\n" +
            "Email:   " + req.getEmail() + "\n\n" +
            "Message:\n" + req.getMessage()
        );
        mailSender.send(mail);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
