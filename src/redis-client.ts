import { createClient } from 'redis';

const DEFAULT_REDIS_PORT = '6379';

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || DEFAULT_REDIS_PORT, 10),
  },
});

redisClient.on('error', (error) => {
  console.error('Redis Error:', error);
});

redisClient.connect();

export default redisClient;
