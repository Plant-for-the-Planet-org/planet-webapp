import { createClient } from 'redis';
import { REDIS_URL } from './config';

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (error) => {
  console.error('Redis Error:', error);
});

redisClient.connect();

export default redisClient;
