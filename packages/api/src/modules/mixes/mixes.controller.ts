import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import { CreateMixDto } from './dto/create-mix.dto';
import { UpdateMixDto } from './dto/update-mix.dto';
import { MixesService } from './mixes.service';
import { Mix } from './interfaces/mix.interface';

@Controller(':v?/mixes')
export class MixesController {
  constructor(private readonly mixesService: MixesService) {}

  setupQuery(res: any, channel: any, tag: any, user: any, created: any, modified: any) {
    const query = {};

    const namespace = res.get('X-Organisation');
    if (namespace) query['namespace'] = namespace;

    if (channel) query['channel'] = channel;
    if (tag) query['tags'] = { $in: [tag] };
    if (user) query['owner'] = user;

    if (created) {
      const [$gte = new Date(), $lt = new Date()] = created.split(',').map(d => d ? new Date(d) : new Date());
      query['created'] = { $gte, $lt };
    }

    if (modified) {
      const [$gte = new Date(), $lt = new Date()] = modified.split(',').map(d => d ? new Date(d) : new Date());
      query['modified'] = { $gte, $lt };
    }

    return query;
  }

  @Post()
  async create(@Res() res, @Body() createMixDto: CreateMixDto) {
    const namespace = res.get('X-Organisation');
    const user = res.get('X-User');
    res.send(await this.mixesService.create(createMixDto, namespace, user));
  }

  @Put(':id')
  async update(@Res() res, @Param('id') id, @Body() updateMixDto: UpdateMixDto) {
    const user = res.get('X-User');
    res.send(await this.mixesService.update(updateMixDto, user));
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id) {
    const user = res.get('X-User');
    res.send(await this.mixesService.remove(id, user));
  }

  @Get()
  async findAll(@Res() res, @Query('channel') channel, @Query('tag') tag,  @Query('user') user, @Query('created') created, @Query('modified') modified, @Query('sort') sort) {
    const query = this.setupQuery(res, channel, tag, user, created, modified);
    res.send(await this.mixesService.find(query, sort));
  }

  @Get('channels')
  async listChannels(@Res() res, @Query('user') user) {
    const channels = await this.mixesService.listChannels(this.setupQuery(res, null, null, user, null, null));
    res.send(channels.filter(channel => !!channel));
  }


  @Get('tags')
  async listTags(@Res() res, @Query('user') user) {
    res.send(await this.mixesService.listTags(this.setupQuery(res, null, null, user, null, null)));
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mixesService.findById(id);
  }
}
