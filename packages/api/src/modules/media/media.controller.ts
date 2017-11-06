import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';
import { Media } from './interfaces/media.interface';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  setupQuery(res: any) {
    const query = {};
    const namespace = res.get('X-Organisation');
    const owner = res.get('X-User');

    if (namespace) {
      query['namespace'] = namespace;
    }

    if (owner) {
      query['owner'] = owner;
    }

    return query;
  }

  // TODO set ns, owner
  @Post()
  async create(@Body() createMediaDto: CreateMediaDto) {
    this.mediaService.create(createMediaDto);
  }

  // TODO check id
  @Put(':id')
  async update(@Param('id') id, @Body() updateMediaDto: UpdateMediaDto) {
    this.mediaService.update(updateMediaDto);
  }

  // TODO check owner
  @Delete(':id')
  async remove(@Param('id') id) {
    this.mediaService.remove(id);
  }

  @Get()
  async findAll(@Res() res) {
    const query = this.setupQuery(res);
    res.send(await this.mediaService.find(query));
  }

  @Get('channels')
  async listChannels(@Res() res, @Param('user') user) {
    res.send(await this.mediaService.listChannels(this.setupQuery(res)));
  }

  // @Get('channels/nochannel')
  // async findNoChannel(@Res() res) {
  //   const query = this.setupQuery(res);
  //   query['$or'] = [
  //     { channel: null },
  //     { channel: { $exists: false } }
  //   ];
  //   res.send(await this.mediaService.find(query));
  // }

  @Get('channels/:channel')
  async findByChannel(@Res() res, @Param('channel') channel) {
    const query = this.setupQuery(res);
    query['channel'] = channel;
    res.send(await this.mediaService.find(query));
  }

  @Get('tags')
  async listTags(@Res() res) {
    res.send(await this.mediaService.listTags(this.setupQuery(res)));
  }

  // @Get('tags/notag')
  // async findNoTag(@Res() res) {
  //   const query = this.setupQuery(res);
  //   query['$or'] = [
  //     { tags: [] },
  //     { tags: { $exists: false } }
  //   ];
  //   res.send(await this.mediaService.find(query));
  // }

  @Get('tags/:tag')
  async findByTag(@Param('tag') tag): Promise<Media[]> {
    return this.mediaService.find({
      tags: {
        $in: tag
      }
    });
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mediaService.findById(id);
  }

  // @Get(':id/transcripts')
  // async findById(@Param('id') media ) {
  //   return this.transcriptsService.find({ media });
  // }

}
