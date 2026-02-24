-- ============================================================
-- Portfolio DB Schema
-- Run against your PostgreSQL instance:
--   psql -U postgres -d portfolio_db -f schema.sql
-- ============================================================

-- Create database (run separately if needed)
-- CREATE DATABASE portfolio_db;

-- ─── Guest Canvas ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guest_pixels (
    id          BIGSERIAL PRIMARY KEY,
    x           INTEGER     NOT NULL CHECK (x >= 0 AND x <= 99),
    y           INTEGER     NOT NULL CHECK (y >= 0 AND y <= 49),
    color       VARCHAR(7)  NOT NULL,           -- "#4ade80"
    author_name VARCHAR(24),
    placed_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    UNIQUE (x, y)                               -- one color per cell
);

-- Index for fast full-canvas reads
CREATE INDEX IF NOT EXISTS idx_guest_pixels_coords ON guest_pixels (x, y);
CREATE INDEX IF NOT EXISTS idx_guest_pixels_author ON guest_pixels (author_name);

-- ─── (Future) Projects table ────────────────────────────────────────────────
-- Uncomment when you build the Projects section
/*
CREATE TABLE IF NOT EXISTS projects (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    tech_stack  TEXT[],
    repo_url    VARCHAR(200),
    live_url    VARCHAR(200),
    thumbnail   VARCHAR(200),
    featured    BOOLEAN DEFAULT FALSE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
*/
