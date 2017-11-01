import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { CreateMixDto } from './dto/create-mix.dto';
import { UpdateMixDto } from './dto/update-mix.dto';
import { MixesService } from './mixes.service';
import { Mix } from './interfaces/mix.interface';

@Controller('mixes')
export class MixesController {
  constructor(private readonly mixesService: MixesService) {}

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
  async findAll(@Res() res) {
    const query = this.setupQuery(res);
    res.send(await this.mixesService.find(query));
  }

  @Get('channels')
  async listChannels(@Res() res, @Param('user') user) {
    res.send(await this.mixesService.listChannels(this.setupQuery(res)));
  }

  // @Get('channels/nochannel')
  // async findNoChannel(@Res() res) {
  //   const query = this.setupQuery(res);
  //   query['$or'] = [
  //     { channel: null },
  //     { channel: { $exists: false } }
  //   ];
  //   res.send(await this.mixesService.find(query));
  // }

  @Get('channels/:channel')
  async findByChannel(@Res() res, @Param('channel') channel) {
    const query = this.setupQuery(res);
    query['channel'] = channel;
    res.send(await this.mixesService.find(query));
  }

  @Get('tags')
  async listTags(@Res() res) {
    res.send(await this.mixesService.listTags(this.setupQuery(res)));
  }

  // @Get('tags/notag')
  // async findNoTag(@Res() res) {
  //   const query = this.setupQuery(res);
  //   query['$or'] = [
  //     { tags: [] },
  //     { tags: { $exists: false } }
  //   ];
  //   res.send(await this.mixesService.find(query));
  // }

  @Get('tags/:tag')
  async findByTag(@Param('tag') tag): Promise<Mix[]> {
    return this.mixesService.find({
      tags: {
        $in: tag
      }
    });
  }

  @Get(':id')
  async findById(@Param('id') id ) {
    return this.mixesService.findById(id);
  }
}
