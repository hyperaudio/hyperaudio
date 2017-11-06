import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { Account } from './interfaces/account.interface';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  setupQuery(res: any) {
    const query = {};
    const namespace = res.get('X-Organisation');

    if (namespace) {
      query['namespace'] = namespace;
    }

    return query;
  }

  // TODO set ns, owner
  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    this.accountsService.create(createAccountDto);
  }

  // TODO check id
  @Put(':id')
  async update(@Param('id') id, @Body() updateAccountDto: UpdateAccountDto) {
    this.accountsService.update(updateAccountDto);
  }

  // TODO check owner
  @Delete(':id')
  async remove(@Param('id') id) {
    this.accountsService.remove(id);
  }

  @Get()
  async findAll(@Res() res) {
    const query = this.setupQuery(res);
    res.send(await this.accountsService.find(query));
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.accountsService.findById(id);
  }
}
