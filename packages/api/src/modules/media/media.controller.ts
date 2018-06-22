import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';
import { Media } from './interfaces/media.interface';

@Controller(':v?/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  setupQuery(res: any, channel: any, tag: any, user: any, created: any, modified: any) {
    // console.log(channel, tag, user);

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
  async findAll(@Res() res, @Query('channel') channel, @Query('tag') tag, @Query('user') user, @Query('created') created, @Query('modified') modified, @Query('sort') sort) {
    const query = this.setupQuery(res, channel, tag, user, created, modified);
    if (user === 'bgm') {
      delete query['namespace'];
      const bgm = await this.mediaService.find(query, sort);
      res.send(bgm.map((media: Media) => {
        const data = media.toJSON();
        data['source']['mp3']['url'] = data['source']['mp3']['url'].replace('http://hyperaud.io', 'https://lab.hyperaud.io');
        data['source']['ogg']['url'] = data['source']['ogg']['url'].replace('http://hyperaud.io', 'https://lab.hyperaud.io');
        return data;
      }));
    }

    res.send(await this.mediaService.find(query, sort));
  }

  @Get('channels')
  async listChannels(@Res() res, @Query('user') user) {
    const channels = await this.mediaService.listChannels(this.setupQuery(res, null, null, user, null, null));
    res.send(channels.filter(channel => !!channel));
  }

  @Get('tags')
  async listTags(@Res() res, @Query('user') user) {
    res.send(await this.mediaService.listTags(this.setupQuery(res, null, null, user, null, null)));
  }


  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mediaService.findById(id);
  }

  @Post('about')
  async aboutURL(@Body('url') url ) {
    return this.mediaService.aboutURL(url);
  }
}
