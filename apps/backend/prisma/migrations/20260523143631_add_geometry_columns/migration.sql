-- AlterTable
ALTER TABLE "danger_zones" ADD COLUMN     "polygon" geometry(Polygon, 4326);

-- AlterTable
ALTER TABLE "detections" ADD COLUMN     "geom" geometry(Point, 4326);
