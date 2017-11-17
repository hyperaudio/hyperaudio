import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';
import { Media } from './interfaces/media.interface';

@Controller(':v?/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  setupQuery(res: any, channel: any, tag: any, user: any) {
    // console.log(channel, tag, user);

    const query = {};

    const namespace = res.get('X-Organisation');
    if (namespace) query['namespace'] = namespace;

    if (channel) query['channel'] = channel;
    if (tag) query['tags'] = { $in: [tag] };
    if (user) query['owner'] = user;

    // console.log(query);
    return query;
  }

  @Post()
  async create(@Res() res, @Body() createMediaDto: CreateMediaDto) {
    const namespace = res.get('X-Organisation');
    const user = res.get('X-User');
    res.send(await this.mediaService.create(createMediaDto, namespace, user));
  }

  @Put(':id')
  async update(@Res() res, @Param('id') id, @Body() updateMediaDto: UpdateMediaDto) {
    const user = res.get('X-User');
    res.send(await this.mediaService.update(updateMediaDto, user));
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id) {
    const user = res.get('X-User');
    res.send(await this.mediaService.remove(id, user));
  }

  @Get()
  async findAll(@Res() res, @Query('channel') channel, @Query('tag') tag, @Query('user') user) {
    const query = this.setupQuery(res, channel, tag, user);
    if (user === 'bgm') delete query['namespace'];
    res.send(await this.mediaService.find(query));
  }

  @Get('channels')
  async listChannels(@Res() res, @Query('user') user) {
    const channels = await this.mediaService.listChannels(this.setupQuery(res, null, null, user));
    res.send(channels.filter(channel => !!channel));
  }

  @Get('tags')
  async listTags(@Res() res, @Query('user') user) {
    res.send(await this.mediaService.listTags(this.setupQuery(res, null, null, user)));
  }


  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mediaService.findById(id);
  }

}
