import request from 'supertest';
import app from '../../src/app';
jest.mock('../../src/configs/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    quit: jest.fn()
  }
}));
jest.mock('../../src/models/Url', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn().mockResolvedValue(null)
  }
}));

describe('ShortLink API — Negative Scenarios', () => {
  it('should return 400 for missing longUrl in /encode', async () => {
    const res = await request(app).post('/api/encode').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid longUrl in /encode', async () => {
    const res = await request(app).post('/api/encode').send({ longUrl: 'not-a-valid-url' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for missing shortUrl in /decode', async () => {
    const res = await request(app).post('/api/decode').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // This test may require extra time due to async DB lookups or mock delays.
  // Increasing the timeout ensures the test doesn't fail prematurely if the app waits on a non-existent short code

  it('should return 404 for unknown code in /api/statistic', async () => {
    const res = await request(app).get('/api/statistic/unknown123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Short URL not found');
  }, 10000);
});
