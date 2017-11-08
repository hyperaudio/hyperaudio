import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
// import * as haJson from 'ha-json';
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
    // const owner = res.get('X-User');

    if (namespace) {
      query['namespace'] = namespace;
    }

    // if (owner) {
    //   query['owner'] = owner;
    // }

    return query;
  }

  // TODO set ns, owner
  @Post()
  async create(@Body() createTranscriptDto: CreateTranscriptDto) {
    this.transcriptsService.create(createTranscriptDto);
  }

  // TODO check id
  @Put(':id')
  async update(@Param('id') id, @Body() updateTranscriptDto: UpdateTranscriptDto) {
    this.transcriptsService.update(updateTranscriptDto);
  }

  // TODO check owner
  @Delete(':id')
  async remove(@Param('id') id) {
    this.transcriptsService.remove(id);
  }

  @Get()
  async findAll(@Res() res, @Query('media') media) {
    const query = this.setupQuery(res);
    if (media) query['media'] = media;
    res.send(await this.transcriptsService.find(query));
  }

  @Get(':id')
  async findById(@Param('id') id ) {
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

  // @Get(':id/json')
  // async jsonById(@Res() res, @Param('id') id ) {
  //   const html = (await this.transcriptsService.findById(id)).content;
  //   res.send(await haJson(html));
  // }

}
