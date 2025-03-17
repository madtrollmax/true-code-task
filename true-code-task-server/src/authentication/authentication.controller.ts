import { Body, Controller, Header, Post, Req, UnauthorizedException, Res, UseGuards, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './authentication.shemas';
import { Response } from 'express';
import { WithTokenGuard } from 'src/common';

@Controller('api/auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('login')
  @Header('content-type', 'application/json')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.validateUser(loginDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const rToken = req.cookies['refresh_token'];
    if (!rToken) {
      throw new UnauthorizedException('Refresh токен отсутствует');
    }
    const { accessToken, refreshToken } = await this.authService.refreshAccessToken(rToken);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @Post('logout')
  @UseGuards(WithTokenGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.uid);
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { message: 'Выход выполнен' };
  }
}
