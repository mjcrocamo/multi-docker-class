const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(
  index,
  computed = {
    0: 1,
    1: 1,
  }
) {
  if (index < 2) return 1;
  if (!Object.keys(computed).includes(index)) {
    computed.index = fib(index - 1, computed) + fib(index - 2, computed);
  }
  return computed.index;
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
