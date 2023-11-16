import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (error) => {
  console.error('Redis Error:', error);
});

redisClient.connect();

export default redisClient;
