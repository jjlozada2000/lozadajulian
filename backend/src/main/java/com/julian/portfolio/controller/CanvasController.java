package com.julian.portfolio.controller;

import com.julian.portfolio.dto.CanvasPixelRequest;
import com.julian.portfolio.service.CanvasService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/canvas")
public class CanvasController {

    private final CanvasService canvasService;

    public CanvasController(CanvasService canvasService) {
        this.canvasService = canvasService;
    }

    // GET /api/canvas — returns all painted pixels
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCanvas() {
        return ResponseEntity.ok(canvasService.getAllPixels());
    }

    // POST /api/canvas/pixel — paint or repaint a pixel
    @PostMapping("/pixel")
    public ResponseEntity<Map<String, String>> paintPixel(
            @Valid @RequestBody CanvasPixelRequest req,
            HttpServletRequest httpReq
    ) {
        canvasService.paintPixel(req, httpReq);
        return ResponseEntity.ok(Map.of("message", "Pixel saved"));
    }
}
