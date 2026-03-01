package com.julian.portfolio.service;

import com.julian.portfolio.dto.CanvasPixelRequest;
import com.julian.portfolio.model.CanvasPixel;
import com.julian.portfolio.repository.CanvasPixelRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CanvasService {

    private final CanvasPixelRepository repo;

    @Value("${app.canvas.max-pixels-per-day}")
    private int maxPixelsPerDay;

    public CanvasService(CanvasPixelRepository repo) {
        this.repo = repo;
    }

    public List<Map<String, Object>> getAllPixels() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (CanvasPixel p : repo.findAll()) {
            Map<String, Object> map = new HashMap<>();
            map.put("x", p.getX());
            map.put("y", p.getY());
            map.put("color", p.getColor());
            map.put("authorName", p.getAuthorName() != null ? p.getAuthorName() : "anonymous");
            result.add(map);
        }
        return result;
    }

    public void paintPixel(CanvasPixelRequest req, HttpServletRequest httpReq) {
        String ip = getClientIp(httpReq);

        // Rate limit: max pixels per IP per day
        LocalDateTime dayAgo = LocalDateTime.now().minusDays(1);
        long count = repo.countByIpAddressSince(ip, dayAgo);
        if (count >= maxPixelsPerDay) {
            throw new ResponseStatusException(
                HttpStatus.TOO_MANY_REQUESTS,
                "You've placed too many pixels today. Come back tomorrow!"
            );
        }

        // Upsert: update existing pixel at (x,y) or create new one
        CanvasPixel pixel = repo.findByXAndY(req.getX(), req.getY())
                .orElse(new CanvasPixel());

        pixel.setX(req.getX());
        pixel.setY(req.getY());
        pixel.setColor(req.getColor());
        pixel.setAuthorName(sanitize(req.getAuthorName()));
        pixel.setIpAddress(ip);
        pixel.setUpdatedAt(LocalDateTime.now());

        repo.save(pixel);
    }

    private String sanitize(String name) {
        if (name == null || name.isBlank()) return "anonymous";
        return name.replaceAll("<[^>]*>", "").trim();
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}