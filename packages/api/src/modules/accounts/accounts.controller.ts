import { Controller, HttpStatus, HttpCode, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Account } from './interfaces/account.interface';

@Controller(':v?/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // @Post()
  // async create(@Body() createAccountDto: CreateAccountDto) {
  //   this.accountsService.create(createAccountDto);
  // }

  @Put('email')
  async updateEmail(@Res() res, @Body('email') email, @Body('password') password) {
    const id = res.get('X-UserID');
    const namespace = res.get('X-Organisation');
    res.send(await this.accountsService.updateEmail(email, password, id, namespace));
  }

  @Put('email/:token')
  async updateEmailToken(@Param('token') token) {
    return await this.accountsService.updateEmailToken(token);
  }

  @Put('password')
  async updatePassword(@Res() res, @Body('password') password) {
    const id = res.get('X-UserID');
    res.send(await this.accountsService.updatePassword(password, id));
  }

  @Post('register')
  async register(@Res() res, @Body('username') username, @Body('email') email) {
    const namespace = res.get('X-Organisation');
    res.send(await this.accountsService.register(username, email, namespace));
  }


  @Post('reset')
  async resetPassword(@Res() res, @Body('email') email) {
    const namespace = res.get('X-Organisation');
    res.send(await this.accountsService.resetPassword(email, namespace));
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.accountsService.findById(id);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  public async getToken(@Body() {username, password}) {
    return await this.accountsService.createToken(username, password);
  }
}
