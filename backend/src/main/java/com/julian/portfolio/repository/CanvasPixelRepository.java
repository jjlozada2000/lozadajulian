package com.julian.portfolio.repository;

import com.julian.portfolio.model.CanvasPixel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CanvasPixelRepository extends JpaRepository<CanvasPixel, Long> {

    Optional<CanvasPixel> findByXAndY(int x, int y);

    // Count pixels placed by a given IP since a given time (for rate limiting)
    @Query("SELECT COUNT(p) FROM CanvasPixel p WHERE p.ipAddress = :ip AND p.updatedAt >= :since")
    long countByIpAddressSince(String ip, LocalDateTime since);
}
