import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import redis from '../../src/configs/redis';

const BASE_URL = 'http://short.est';
let shortCode = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shortlink_test');
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    await redis.quit();
  } catch (e) {
    console.error('Teardown error:', e);
  }
});

describe('ShortLink API Endpoints', () => {
  jest.setTimeout(20000); // Increase timeout for all tests

  it('should encode a long URL', async () => {
    const res = await request(app).post('/api/encode').send({
      longUrl: 'https://example.com'
    });

    shortCode = res.body.shortUrl.split('/').pop() || '';
    expect(res.status).toBe(200);
    expect(res.body.shortUrl).toMatch(/http:\/\/.+\/\w{6}/);
    expect(shortCode.length).toBeGreaterThan(0);
  });

  it('should decode a short URL back to original', async () => {
    expect(shortCode).not.toBe('');

    const res = await request(app).post('/api/decode').send({
      shortUrl: shortCode
    });

    expect(res.status).toBe(200);
    expect(res.body.longUrl).toBe('https://example.com');
  });

  it('should redirect to the long URL', async () => {
    const res = await request(app).get(`/${shortCode}`);
    expect([200, 302]).toContain(res.status);
  });

  it('should return statistics for a short URL', async () => {
    const res = await request(app).get(`/api/statistic/${shortCode}`);
    expect(res.status).toBe(200);
    expect(res.body.longUrl).toBe('https://example.com');
    expect(res.body.visitCount).toBeGreaterThan(0);
  }, 10000);

  it('should list all shortened URLs', async () => {
    const res = await request(app).get('/api/list');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  }, 10000);

  it('should search for a URL by partial match', async () => {
    const res = await request(app).get('/api/search?query=exam');

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.data[0].longUrl).toContain('example.com');
  }, 10000);
});
