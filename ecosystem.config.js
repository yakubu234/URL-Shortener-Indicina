module.exports = {
    apps: [
      {
        name: 'shortlink-api',
        script: 'dist/server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: 'production',
          PORT: 8004,
          BASE_URL: 'http://short.aob.com.ng',
          REDIS_HOST: '127.0.0.1',
          REDIS_PORT: 6379,
          MONGO_URI: 'mongodb://localhost:27017/shortlink_prod',
        },
      },
    ],
  };
  