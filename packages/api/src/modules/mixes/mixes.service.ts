import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { Mix } from './interfaces/mix.interface';
import { CreateMixDto } from './dto/create-mix.dto';
import { UpdateMixDto } from './dto/update-mix.dto';

@Component()
export class MixesService {
  constructor(
    @Inject('MixModelToken') private readonly mixModel: Model<Mix>) {}

  async create(createMixDto: CreateMixDto): Promise<Mix> {
    const createdMix = new this.mixModel(createMixDto);
    createdMix._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

    return await createdMix.save();
  }

  async update(updateMixDto: UpdateMixDto): Promise<Mix> {
    const updatedMix = new this.mixModel(updateMixDto);
    return await updatedMix.save();
  }

  async remove(id: String): Promise<any> {
    return await this.mixModel.findByIdAndRemove(id).exec();
  }

  async findAll(): Promise<Mix[]> {
    return await this.mixModel.find().exec();
  }

  async find(query: any): Promise<Mix[]> {
    return await this.mixModel.find(query).exec();
  }

  async listChannels(): Promise<any> {
    return await this.mixModel.distinct('channel').exec();
  }

  async listTags(): Promise<any> {
    return await this.mixModel.distinct('tags').exec();
  }

  async findById(id): Promise<Mix> {
    return await this.mixModel.findById(id);
  }
}
