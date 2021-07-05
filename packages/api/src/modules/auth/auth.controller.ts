import { Controller, Post, HttpStatus, HttpCode, Get, Body, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller(':v?/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('whoami/:token')
  @HttpCode(HttpStatus.OK)
  public async whoami(@Param('token') token) {
    return await this.authService.whoami(token);
  }

}
