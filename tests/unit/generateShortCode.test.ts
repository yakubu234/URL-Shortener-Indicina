import { generateShortCode } from '../../src/utils/generateShortCode';

describe('generateShortCode', () => {
  it('should generate a code of default length 6', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
  });

  it('should generate unique codes in multiple calls', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateShortCode());
    }
    expect(codes.size).toBeGreaterThan(900); // Allow some collisions
  });

  it('should generate code of custom length', () => {
    const code = generateShortCode(10);
    expect(code).toHaveLength(10);
  });
});
