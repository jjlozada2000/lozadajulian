package com.julian.portfolio.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CanvasPixelRequest {

    @Min(0) @Max(999)
    private int x;

    @Min(0) @Max(999)
    private int y;

    @NotBlank
    @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Color must be a valid hex like #b8937a")
    private String color;

    private String authorName;

    public int getX()               { return x; }
    public int getY()               { return y; }
    public String getColor()        { return color; }
    public String getAuthorName()   { return authorName; }
    public void setX(int x)                       { this.x = x; }
    public void setY(int y)                       { this.y = y; }
    public void setColor(String color)            { this.color = color; }
    public void setAuthorName(String authorName)  { this.authorName = authorName; }
}
