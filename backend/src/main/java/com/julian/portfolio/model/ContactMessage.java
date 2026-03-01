package com.julian.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String email;

    @NotBlank
    @Size(max = 5000)
    @Column(nullable = false, length = 5000)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    public ContactMessage() {}

    public Long getId()                 { return id; }
    public String getName()             { return name; }
    public String getEmail()            { return email; }
    public String getMessage()          { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getIpAddress()        { return ipAddress; }

    public void setId(Long id)                 { this.id = id; }
    public void setName(String name)           { this.name = name; }
    public void setEmail(String email)         { this.email = email; }
    public void setMessage(String message)     { this.message = message; }
    public void setCreatedAt(LocalDateTime t)  { this.createdAt = t; }
    public void setIpAddress(String ip)        { this.ipAddress = ip; }
}
