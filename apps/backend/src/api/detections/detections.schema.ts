import { z } from 'zod';

export const detectionEventSchema = z.object({
	timestamp: z.string().datetime(),
	lat: z.number().min(-90).max(90),
	lon: z.number().min(-180).max(180),
	speed_kmph: z.number().min(0).max(300).optional(),
	heading_deg: z.number().min(0).max(360).optional(),
	animal_class: z.enum(['cattle', 'dog', 'goat', 'sheep', 'horse', 'buffalo']),
	confidence: z.number().min(0).max(1),
	bbox_norm: z.array(z.number()).length(4),
});

export const batchDetectionsSchema = z.object({
	device_id: z.string().length(64),
	app_version: z.string().max(16),
	events: z.array(detectionEventSchema).min(1).max(50),
});

export type DetectionEvent = z.infer<typeof detectionEventSchema>;
export type BatchDetections = z.infer<typeof batchDetectionsSchema>;
