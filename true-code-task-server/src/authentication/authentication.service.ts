import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './login.entity';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './authentication.shemas';
import { promisify } from 'util';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async validateUser({ login, password }: LoginDto) {
    const loginEnt = await Login.findOneBy({ login });
    if (
      loginEnt?.hash !==
      ((await promisify(crypto.scrypt)(password, loginEnt?.salt ?? '', 64)) as Buffer).toString('hex')
    ) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return this.generateTokens(loginEnt.login);
  }

  async generateTokens(uid: string) {
    const payload = { uid };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await Login.update(uid, { refreshToken });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const login = await Login.findOne({
        where: { login: decoded.uid, refreshToken },
      });

      if (!login) {
        throw new UnauthorizedException('Refresh токен недействителен');
      }

      return this.generateTokens(login.login);
    } catch {
      throw new UnauthorizedException('Неверный refresh токен');
    }
  }

  async logout(uid: number) {
    await Login.update(uid, { refreshToken: null });
  }
}
