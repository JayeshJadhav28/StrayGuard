-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "device_hash" VARCHAR(64) NOT NULL,
    "first_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3),
    "app_version" VARCHAR(16),
    "event_count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detections" (
    "id" BIGSERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "speed_kmph" DOUBLE PRECISION,
    "heading_deg" DOUBLE PRECISION,
    "animal_class" VARCHAR(32) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "app_version" VARCHAR(16),
    "bbox_norm" DOUBLE PRECISION[],

    CONSTRAINT "detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "danger_zones" (
    "id" SERIAL NOT NULL,
    "zone_code" VARCHAR(32) NOT NULL,
    "segment_label" VARCHAR(128),
    "risk_level" VARCHAR(16) NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "recommended_speed_kmph" INTEGER NOT NULL,
    "active_from" VARCHAR(5),
    "active_to" VARCHAR(5),
    "dominant_animal" VARCHAR(32),
    "detection_count_30d" INTEGER NOT NULL DEFAULT 0,
    "free_flow_speed" INTEGER NOT NULL DEFAULT 60,
    "speed_override" INTEGER,
    "updated_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "danger_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" VARCHAR(16) NOT NULL DEFAULT 'agency',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_hash_key" ON "devices"("device_hash");

-- CreateIndex
CREATE INDEX "detections_detected_at_idx" ON "detections"("detected_at");

-- CreateIndex
CREATE INDEX "detections_animal_class_idx" ON "detections"("animal_class");

-- CreateIndex
CREATE UNIQUE INDEX "detections_device_id_detected_at_key" ON "detections"("device_id", "detected_at");

-- CreateIndex
CREATE UNIQUE INDEX "danger_zones_zone_code_key" ON "danger_zones"("zone_code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "detections" ADD CONSTRAINT "detections_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
