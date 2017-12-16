import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, Query } from '@nestjs/common';
import * as haParser from '@hyperaudio/transcript-parser';
import * as haRender from '@hyperaudio/transcript-renderer';
import { JSDOM } from 'jsdom';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';
import { TranscriptsService } from './transcripts.service';
import { Transcript } from './interfaces/transcript.interface';

@Controller(':v?/transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  setupQuery(res: any, created: any, modified: any) {
    const query = {};
    const namespace = res.get('X-Organisation');

    if (namespace) query['namespace'] = namespace;

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
  async findAll(@Res() res, @Query('media') media, @Query('type') type, @Query('user') user, @Query('channel') channel, @Query('created') created, @Query('modified') modified, @Query('sort') sort) {
    const query = this.setupQuery(res, created, modified);
    if (media) {
      query['media'] = media;
      delete query['namespace'];
    }
    if (type) query['type'] = type;
    if (user) query['owner'] = user;

    if (channel) {
      const results = await this.transcriptsService.find2(query, sort);
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
      res.send(await this.transcriptsService.find(query, sort));
    }
  }

  @Get(':id')
  async findById(@Param('id') id, @Query('format') format) {
    const t = await this.transcriptsService.findById(id);
    const r = {
      _id: t._id,
      label: t.label,
      type: t.type,
      owner: t.owner,
      meta: t.meta,
      content: t.content,
      media: t.media,
      desc: t.desc,
      modified: t.modified,
      created: t.created
    };

    if (format === 'json') {
      r.content = t.data ? t.data : await haParser(t.content);
    } else if (t.content) {
      r.content = t.content;
    } else {
      const dom = new JSDOM('<!DOCTYPE html>');
      const document = dom.window.document;
      const root = document.body;
      haRender(t.data, document, root, format ? format : 'M', false);

      r.content = root.innerHTML;
    }

    return r;
  }

  // DEPRECATED
  @Get(':id/text')
  async textById(@Res() res, @Param('id') id ) {
    res.header('Content-Type', 'text/plain');
    res.send((await this.transcriptsService.findById(id)).content);
  }

  @Get(':id/html')
  async htmlById(@Res() res, @Param('id') id, @Query('format') format = 'T', @Query('speakers') speakers, @Query('digits') digits) {
    const transcript = await this.transcriptsService.findById(id);
    res.header('Content-Type', 'text/html');

    if (! transcript.data) {
      res.send(transcript.content);
    } else {
      const dom = new JSDOM('<!DOCTYPE html>');
      const document = dom.window.document;
      const root = document.body;
      haRender(transcript.data, document, root, format, speakers, digits);

      res.send(root.innerHTML);
    }
  }

  @Get(':id/json')
  async jsonById(@Res() res, @Param('id') id ) {
    const transcript = await this.transcriptsService.findById(id);

    if (transcript.data) {
      res.send(transcript.data);
    } else {
      res.send(await haParser(transcript.content));
    }
  }
}
