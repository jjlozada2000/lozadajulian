package com.julian.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "canvas_pixels",
    uniqueConstraints = @UniqueConstraint(columnNames = {"x", "y"})
)
public class CanvasPixel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)
    private int y;

    @NotBlank
    @Pattern(regexp = "^#[0-9a-fA-F]{6}$")
    @Column(nullable = false, length = 7)
    private String color;

    @Column(name = "author_name", length = 50)
    private String authorName;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CanvasPixel() {}

    public Long getId()                 { return id; }
    public int getX()                   { return x; }
    public int getY()                   { return y; }
    public String getColor()            { return color; }
    public String getAuthorName()       { return authorName; }
    public String getIpAddress()        { return ipAddress; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id)                    { this.id = id; }
    public void setX(int x)                       { this.x = x; }
    public void setY(int y)                       { this.y = y; }
    public void setColor(String color)            { this.color = color; }
    public void setAuthorName(String authorName)  { this.authorName = authorName; }
    public void setIpAddress(String ipAddress)    { this.ipAddress = ipAddress; }
    public void setUpdatedAt(LocalDateTime t)     { this.updatedAt = t; }
}