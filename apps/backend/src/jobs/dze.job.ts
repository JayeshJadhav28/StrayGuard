import cron from 'node-cron';
import { dzeService } from '../services/dze/dze.service';
import { env } from '../config/env';

cron.schedule(env.DZE_CRON_SCHEDULE, async () => {
	console.log('⏰ Scheduled DZE run starting...');
	try {
		await dzeService.runDZE();
	} catch (error) {
		console.error('Scheduled DZE failed:', error);
	}
});

console.log(`✅ DZE cron job scheduled: ${env.DZE_CRON_SCHEDULE}`);
