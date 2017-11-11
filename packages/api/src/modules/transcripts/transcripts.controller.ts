import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import * as haJson from '@hyperaudio/transcript-converter';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { TranscriptsService } from './transcripts.service';
import { Transcript } from './interfaces/transcript.interface';

@Controller(':v?/transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  setupQuery(res: any) {
    const query = {};
    const namespace = res.get('X-Organisation');

    if (namespace) query['namespace'] = namespace;

    return query;
  }

  @Post()
  async create(@Res() res, @Body() createTranscriptDto: CreateTranscriptDto) {
    const namespace = res.get('X-Organisation');
    const user = res.get('X-User');
    res.send(await this.transcriptsService.create(createTranscriptDto, namespace, user));
  }

  @Put(':id')
  async update(@Res() res, @Param('id') id, @Body() updateTranscriptDto: UpdateTranscriptDto) {
    const user = res.get('X-User');
    res.send(await this.transcriptsService.update(updateTranscriptDto, user));
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id) {
    const user = res.get('X-User');
    res.send(await this.transcriptsService.remove(id, user));
  }

  @Get()
  async findAll(@Res() res, @Query('media') media, @Query('type') type, @Query('user') user, @Query('channel') channel) {
    const query = this.setupQuery(res);
    if (media) query['media'] = media;
    if (type) query['type'] = type;
    if (user) query['owner'] = user;

    if (channel) {
      const results = await this.transcriptsService.find2(query);
      res.send(
        results
          .filter(result => result.media && result.media['channel'] === channel)
          .map(result => {
            const compact = result;
            compact.media = result.media['_id'];
            return compact;
          })
      );
    } else {
      res.send(await this.transcriptsService.find(query));
    }
  }

  @Get(':id')
  async findById(@Param('id') id) {
    return this.transcriptsService.findById(id);
  }

  @Get(':id/text')
  async textById(@Res() res, @Param('id') id ) {
    res.header('Content-Type', 'text/plain');
    res.send((await this.transcriptsService.findById(id)).content);
  }

  @Get(':id/html')
  async htmlById(@Res() res, @Param('id') id ) {
    res.header('Content-Type', 'text/html');
    res.send((await this.transcriptsService.findById(id)).content);
  }

  @Get(':id/json')
  async jsonById(@Res() res, @Param('id') id ) {
    const html = (await this.transcriptsService.findById(id)).content;
    res.send(await haJson(html));
  }
}
