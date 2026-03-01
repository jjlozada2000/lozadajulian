package com.julian.portfolio.service;

import com.julian.portfolio.dto.ContactRequest;
import com.julian.portfolio.model.ContactMessage;
import com.julian.portfolio.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ContactService {

    private final ContactMessageRepository repo;

    @Value("${app.contact.recipient-email}")
    private String recipientEmail;

    public ContactService(ContactMessageRepository repo) {
        this.repo = repo;
    }

    public void handleSubmission(ContactRequest req, HttpServletRequest httpReq) {
        // 1. Persist to DB
        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName());
        msg.setEmail(req.getEmail());
        msg.setMessage(req.getMessage());
        msg.setIpAddress(getClientIp(httpReq));
        repo.save(msg);

        // 2. Forward to your inbox via Resend
        sendNotificationEmail(req);
    }

    private void sendNotificationEmail(ContactRequest req) {
    try {
        String apiKey = System.getenv("RESEND_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            System.err.println("RESEND_API_KEY is not set");
            return;
        }

        // Safely escape strings for JSON
        String name = req.getName().replace("\\", "\\\\").replace("\"", "\\\"");
        String email = req.getEmail().replace("\\", "\\\\").replace("\"", "\\\"");
        String message = req.getMessage().replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");

        String body = "{"
            + "\"from\":\"Portfolio Contact <contact@lozadajulian.com>\","
            + "\"to\":[\"" + recipientEmail + "\"],"
            + "\"reply_to\":\"" + email + "\","
            + "\"subject\":\"Portfolio contact from " + name + "\","
            + "\"text\":\"Name: " + name + "\\nEmail: " + email + "\\n\\nMessage:\\n" + message + "\""
            + "}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.resend.com/emails"))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Resend response: " + response.statusCode() + " " + response.body());

    } catch (Exception e) {
        System.err.println("Failed to send email: " + e.getMessage());
        e.printStackTrace();
    }
}

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}