-- init.sql: create extensions and basic tables for StrayGuard
CREATE EXTENSION IF NOT EXISTS postgis;

-- Minimal tables to match Prisma models (simplified)
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  device_hash VARCHAR(64) UNIQUE,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE,
  app_version VARCHAR(16),
  event_count BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS detections (
  id BIGSERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id),
  detected_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  geom geometry(POINT,4326),
  speed_kmph DOUBLE PRECISION,
  heading_deg DOUBLE PRECISION,
  animal_class VARCHAR(32),
  confidence DOUBLE PRECISION,
  bbox_norm DOUBLE PRECISION[]
);

-- danger_zones placeholder (polygon column named 'polygon')
CREATE TABLE IF NOT EXISTS danger_zones (
  id SERIAL PRIMARY KEY,
  zone_code VARCHAR(32) UNIQUE,
  segment_label VARCHAR(128),
  risk_level VARCHAR(16),
  risk_score DOUBLE PRECISION,
  recommended_speed_kmph INTEGER,
  polygon geometry(POLYGON,4326),
  dominant_animal VARCHAR(32),
  active_from VARCHAR(5),
  active_to VARCHAR(5),
  detection_count_30d INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);
