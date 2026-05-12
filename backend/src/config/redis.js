const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-18651.crce292.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 18651
    }
});

module.exports = redisClient;