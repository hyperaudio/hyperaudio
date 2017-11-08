import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import { CreateMixDto } from './dto/create-mix.dto';
import { UpdateMixDto } from './dto/update-mix.dto';
import { MixesService } from './mixes.service';
import { Mix } from './interfaces/mix.interface';

@Controller(':v?/mixes')
export class MixesController {
  constructor(private readonly mixesService: MixesService) {}

  setupQuery(res: any, channel: any, tag: any) {
    const query = {};
    const namespace = res.get('X-Organisation');
    // const owner = res.get('X-User');

    if (namespace) {
      query['namespace'] = namespace;
    }

    // if (owner) {
    //   query['owner'] = owner;
    // }

    if (channel) query['channel'] = channel;
    if (tag) query['tags'] = { $in: [tag] };

    return query;
  }

  // TODO set ns, owner
  @Post()
  async create(@Body() createMixDto: CreateMixDto) {
    this.mixesService.create(createMixDto);
  }

  // TODO check id
  @Put(':id')
  async update(@Param('id') id, @Body() updateMixDto: UpdateMixDto) {
    this.mixesService.update(updateMixDto);
  }

  // TODO check owner
  @Delete(':id')
  async remove(@Param('id') id) {
    this.mixesService.remove(id);
  }

  @Get()
  async findAll(@Res() res, @Query('channel') channel, @Query('tag') tag) {
    const query = this.setupQuery(res, channel, tag);
    res.send(await this.mixesService.find(query));
  }

  @Get('channels')
  async listChannels(@Res() res, @Param('user') user) {
    res.send(await this.mixesService.listChannels(this.setupQuery(res, null, null)));
  }


  @Get('tags')
  async listTags(@Res() res) {
    res.send(await this.mixesService.listTags(this.setupQuery(res, null, null)));
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mixesService.findById(id);
  }
}
