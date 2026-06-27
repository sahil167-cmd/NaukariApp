import { phoneSchema, pinCodeSchema, emailSchema } from '../src/validators';

describe('Yup Validation Schemas', () => {
  describe('Phone Validation Schema', () => {
    it('should validate correct 10-digit Indian mobile numbers starting with 6-9', async () => {
      await expect(phoneSchema.validate('8976478247')).resolves.toBe('8976478247');
      await expect(phoneSchema.validate('7012345678')).resolves.toBe('7012345678');
      await expect(phoneSchema.validate('6123456789')).resolves.toBe('6123456789');
    });

    it('should reject invalid mobile numbers', async () => {
      await expect(phoneSchema.validate('5999999999')).rejects.toThrow();
      await expect(phoneSchema.validate('987654321')).rejects.toThrow();
      await expect(phoneSchema.validate('98765432101')).rejects.toThrow();
      await expect(phoneSchema.validate('')).rejects.toThrow();
    });
  });

  describe('PIN Code Validation Schema', () => {
    it('should validate exactly 6-digit PIN codes', async () => {
      await expect(pinCodeSchema.validate('400025')).resolves.toBe('400025');
      await expect(pinCodeSchema.validate('110001')).resolves.toBe('110001');
    });

    it('should reject invalid PIN codes', async () => {
      await expect(pinCodeSchema.validate('40002')).rejects.toThrow();
      await expect(pinCodeSchema.validate('4000251')).rejects.toThrow();
      await expect(pinCodeSchema.validate('abc123')).rejects.toThrow();
      await expect(pinCodeSchema.validate('')).rejects.toThrow();
    });
  });

  describe('Email Validation Schema', () => {
    it('should validate standard email addresses', async () => {
      await expect(emailSchema.validate('info@3hdmedia.com')).resolves.toBe('info@3hdmedia.com');
      await expect(emailSchema.validate('worker.connect@domain.co.in')).resolves.toBe('worker.connect@domain.co.in');
    });

    it('should validate optional empty values', async () => {
      await expect(emailSchema.validate('')).resolves.toBe('');
      await expect(emailSchema.validate(undefined)).resolves.toBeUndefined();
    });

    it('should reject malformed email addresses', async () => {
      await expect(emailSchema.validate('info@3hdmedia')).rejects.toThrow();
      await expect(emailSchema.validate('info3hdmedia.com')).rejects.toThrow();
    });
  });
});
