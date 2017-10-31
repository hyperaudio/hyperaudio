import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateMixDto } from './dto/create-mix.dto';
import { UpdateMixDto } from './dto/update-mix.dto';
import { MixesService } from './mixes.service';
import { Mix } from './interfaces/mix.interface';

@Controller('mixes')
export class MixesController {
  constructor(private readonly mixesService: MixesService) {}

  @Post()
  async create(@Body() createMixDto: CreateMixDto) {
    this.mixesService.create(createMixDto);
  }

  @Put(':id')
  async update(@Param('id') id, @Body() updateMixDto: UpdateMixDto) {
    // TODO check id
    this.mixesService.update(updateMixDto);
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    this.mixesService.remove(id);
  }

  @Get()
  async findAll(): Promise<Mix[]> {
    return this.mixesService.findAll();
  }

  @Get('channels')
  async listChannels(): Promise<any> {
    return this.mixesService.listChannels();
  }

  @Get('channels/nochannel')
  async findNoChannel(): Promise<Mix[]> {
    return this.mixesService.find({
      $or: [
        {
          channel: null
        },
        {
          channel: {
            $exists: false
          }
        }
      ]
    });
  }

  @Get('channels/:channel')
  async findByChannel(@Param('channel') channel): Promise<Mix[]> {
    return this.mixesService.find({ channel });
  }

  @Get('tags')
  async listTags(): Promise<any> {
    return this.mixesService.listTags();
  }

  @Get('tags/notag')
  async findNoTag(): Promise<Mix[]> {
    return this.mixesService.find({
      $or: [
        {
          tags: []
        },
        {
          tags:
            {
              $exists: false
            }
        }
      ]
    });
  }

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
