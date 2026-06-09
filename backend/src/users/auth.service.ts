import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import { UserModel, toPublicUser, type PublicUser } from './user.model.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

export interface AuthResult {
  user: PublicUser;
  token: string;
}

/**
 * Authentication business logic: registration, credential validation and
 * JWT issuance. Passwords are hashed with bcrypt; the hash is never returned.
 */
export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await UserModel.findOne({ email: input.email }).lean();
    if (existing) {
      throw new AppError('El usuario ya existe', ErrorCodes.USER_ALREADY_EXISTS, 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const created = await UserModel.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
    });

    const user = toPublicUser(created);
    return { user, token: this.signToken(user) };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const doc = await UserModel.findOne({ email: input.email });
    if (!doc) {
      throw new AppError('Credenciales inválidas', ErrorCodes.INVALID_CREDENTIALS, 401);
    }

    const matches = await bcrypt.compare(input.password, doc.password);
    if (!matches) {
      throw new AppError('Credenciales inválidas', ErrorCodes.INVALID_CREDENTIALS, 401);
    }

    const user = toPublicUser(doc);
    return { user, token: this.signToken(user) };
  }

  async getById(id: string): Promise<PublicUser> {
    const doc = await UserModel.findById(id);
    if (!doc) {
      throw new AppError('Usuario no encontrado', ErrorCodes.NOT_FOUND, 404);
    }
    return toPublicUser(doc);
  }

  private signToken(user: PublicUser): string {
    return jwt.sign({ sub: user.id, email: user.email }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();
