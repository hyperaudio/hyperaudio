import { Controller, Get, Req } from '@nestjs/common';

@Controller('')
export class RootController {
  @Get()
  index() {
    return {
      status: 'OK'
    };
  }
}
