package com.julian.portfolio.controller;

import com.julian.portfolio.dto.ContactRequest;
import com.julian.portfolio.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(
            @Valid @RequestBody ContactRequest req,
            HttpServletRequest httpReq
    ) {
        contactService.handleSubmission(req, httpReq);
        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }
}
