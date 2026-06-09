import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed'),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn().mockReturnValue('signed.jwt.token') },
}));

vi.mock('./user.model.js', () => ({
  UserModel: {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
  toPublicUser: (doc: { _id: string; name: string; email: string }) => ({
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
  }),
}));

import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { AppError } from '../shared/app-error.js';
import { UserModel } from './user.model.js';

const service = new AuthService();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthService.register', () => {
  it('creates a user and returns a token when the email is free', async () => {
    // Arrange
    (UserModel.findOne as ReturnType<typeof vi.fn>).mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });
    (UserModel.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      _id: 'u1',
      name: 'Ana',
      email: 'ana@test.com',
    });

    // Act
    const result = await service.register({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'secret1',
    });

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('secret1', 10);
    expect(result.user).toEqual({ id: 'u1', name: 'Ana', email: 'ana@test.com' });
    expect(result.token).toBe('signed.jwt.token');
  });

  it('rejects when the user already exists', async () => {
    // Arrange
    (UserModel.findOne as ReturnType<typeof vi.fn>).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: 'u1' }),
    });

    // Act & Assert
    await expect(
      service.register({ name: 'Ana', email: 'ana@test.com', password: 'secret1' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('AuthService.login', () => {
  it('returns a token for valid credentials', async () => {
    // Arrange
    (UserModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
      _id: 'u1',
      name: 'Ana',
      email: 'ana@test.com',
      password: 'hashed',
    });
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    // Act
    const result = await service.login({ email: 'ana@test.com', password: 'secret1' });

    // Assert
    expect(result.token).toBe('signed.jwt.token');
  });

  it('rejects with INVALID_CREDENTIALS for a wrong password', async () => {
    // Arrange
    (UserModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
      _id: 'u1',
      password: 'hashed',
    });
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    // Act & Assert
    await expect(
      service.login({ email: 'ana@test.com', password: 'wrong' }),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });
});
