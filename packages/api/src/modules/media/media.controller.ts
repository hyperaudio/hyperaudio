import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';
import { Media } from './interfaces/media.interface';

@Controller(':v?/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

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
  async create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  // TODO check owner
  @Put(':id')
  async update(@Param('id') id, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(updateMediaDto);
  }

  // TODO check owner
  @Delete(':id')
  async remove(@Param('id') id) {
    this.mediaService.remove(id);
  }

  @Get()
  async findAll(@Res() res, @Query('channel') channel, @Query('tag') tag) {
    const query = this.setupQuery(res, channel, tag);
    res.send(await this.mediaService.find(query));
  }

  @Get('channels')
  async listChannels(@Res() res, @Param('user') user) {
    res.send(await this.mediaService.listChannels(this.setupQuery(res, null, null)));
  }

  @Get('tags')
  async listTags(@Res() res) {
    res.send(await this.mediaService.listTags(this.setupQuery(res, null, null)));
  }


  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mediaService.findById(id);
  }

}
