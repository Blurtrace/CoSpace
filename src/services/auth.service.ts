import "reflect-metadata";
import { Repository, DataSource } from "typeorm";
import { getDataSource } from "@/database/data-source";
import { User } from "@/database/entities/User";
import { RefreshToken } from "@/database/entities/RefreshToken";
import {
  hashPassword,
  comparePassword,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { ConflictError, UnauthorizedError, NotFoundError } from "@/lib/errors";
import { RegisterInput, LoginInput } from "@/lib/validations/auth.schema";
import { UserDTO } from "@/types/auth";

export interface AuthResult {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export class AuthService {
  /**
   * Obtiene el repositorio de User de forma segura bajo Next.js/Turbopack.
   */
  private static getUserRepository(dataSource: DataSource): Repository<User> {
    if (dataSource.hasMetadata(User)) {
      return dataSource.getRepository(User);
    }
    try {
      return dataSource.getRepository<User>("User");
    } catch {
      return dataSource.getRepository<User>("users");
    }
  }

  /**
   * Obtiene el repositorio de RefreshToken de forma segura bajo Next.js/Turbopack.
   */
  private static getTokenRepository(dataSource: DataSource): Repository<RefreshToken> {
    if (dataSource.hasMetadata(RefreshToken)) {
      return dataSource.getRepository(RefreshToken);
    }
    try {
      return dataSource.getRepository<RefreshToken>("RefreshToken");
    } catch {
      return dataSource.getRepository<RefreshToken>("refresh_tokens");
    }
  }

  static async register(input: RegisterInput): Promise<AuthResult> {
    const dataSource = await getDataSource();
    const userRepository = this.getUserRepository(dataSource);
    const tokenRepository = this.getTokenRepository(dataSource);

    const normalizedEmail = input.email.trim().toLowerCase();

    const existingUser = await userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictError("El correo electrónico ya se encuentra registrado");
    }

    const hashedPassword = await hashPassword(input.password);

    // El rol siempre se asigna como 'user' en el registro público
    const newUser = userRepository.create({
      name: input.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    const savedUser = await userRepository.save(newUser);

    const accessToken = signAccessToken({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    const refreshToken = signRefreshToken({ userId: savedUser.id });
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_SECONDS * 1000);

    const refreshTokenEntity = tokenRepository.create({
      userId: savedUser.id,
      hashedToken: hashToken(refreshToken),
      expiresAt,
      isRevoked: false,
    });

    await tokenRepository.save(refreshTokenEntity);

    return {
      user: toUserDTO(savedUser),
      accessToken,
      refreshToken,
    };
  }

  static async login(input: LoginInput): Promise<AuthResult> {
    const dataSource = await getDataSource();
    const userRepository = this.getUserRepository(dataSource);
    const tokenRepository = this.getTokenRepository(dataSource);

    const normalizedEmail = input.email.trim().toLowerCase();

    const user = await userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ userId: user.id });
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_SECONDS * 1000);

    const refreshTokenEntity = tokenRepository.create({
      userId: user.id,
      hashedToken: hashToken(refreshToken),
      expiresAt,
      isRevoked: false,
    });

    await tokenRepository.save(refreshTokenEntity);

    return {
      user: toUserDTO(user),
      accessToken,
      refreshToken,
    };
  }

  static async refreshSession(rawRefreshToken: string): Promise<AuthResult> {
    const payload = verifyRefreshToken(rawRefreshToken);
    if (!payload) {
      throw new UnauthorizedError("Token de actualización inválido o expirado");
    }

    const dataSource = await getDataSource();
    const tokenRepository = this.getTokenRepository(dataSource);

    const hashedIncomingToken = hashToken(rawRefreshToken);

    const tokenRecord = await tokenRepository.findOne({
      where: {
        hashedToken: hashedIncomingToken,
        isRevoked: false,
      },
      relations: ["user"],
    });

    if (!tokenRecord) {
      throw new UnauthorizedError("Token de actualización no reconocido o revocado");
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      tokenRecord.isRevoked = true;
      await tokenRepository.save(tokenRecord);
      throw new UnauthorizedError("Sesión expirada. Por favor, inicia sesión nuevamente");
    }

    // Rotación de tokens: revocar el token previo e insertar el nuevo
    tokenRecord.isRevoked = true;
    await tokenRepository.save(tokenRecord);

    const user = tokenRecord.user;
    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({ userId: user.id });
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_SECONDS * 1000);

    const newTokenRecord = tokenRepository.create({
      userId: user.id,
      hashedToken: hashToken(newRefreshToken),
      expiresAt: newExpiresAt,
      isRevoked: false,
    });

    await tokenRepository.save(newTokenRecord);

    return {
      user: toUserDTO(user),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const dataSource = await getDataSource();
    const tokenRepository = this.getTokenRepository(dataSource);
    const hashedIncomingToken = hashToken(rawRefreshToken);

    const tokenRecord = await tokenRepository.findOne({
      where: { hashedToken: hashedIncomingToken },
    });

    if (tokenRecord) {
      tokenRecord.isRevoked = true;
      await tokenRepository.save(tokenRecord);
    }
  }

  static async getUserProfile(userId: string): Promise<UserDTO> {
    const dataSource = await getDataSource();
    const userRepository = this.getUserRepository(dataSource);

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return toUserDTO(user);
  }
}
