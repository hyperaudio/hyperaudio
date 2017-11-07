import { Controller, HttpStatus, HttpCode, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Account } from './interfaces/account.interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // // TODO set ns, owner
  // @Post()
  // async create(@Body() createAccountDto: CreateAccountDto) {
  //   this.accountsService.create(createAccountDto);
  // }
  //
  // // TODO check id
  // @Put(':id')
  // async update(@Param('id') id, @Body() updateAccountDto: UpdateAccountDto) {
  //   this.accountsService.update(updateAccountDto);
  // }

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
