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

  async create(createMixDto: CreateMixDto, namespace: any, user: String): Promise<Mix> {
    const createdMix = new this.mixModel(createMixDto);
    createdMix._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    createdMix.created = new Date();
    createdMix.modified = new Date();
    createdMix.owner = user;
    if (namespace) createdMix.namespace = namespace;

    return await createdMix.save();
  }

  async update(updateMixDto: UpdateMixDto, user: String): Promise<Mix> {
    const updatedMix = await this.mixModel.findById(updateMixDto._id).exec();
    if (updatedMix.owner === user) {
      updatedMix.label = updateMixDto.label;
      updatedMix.desc = updateMixDto.desc;
      updatedMix.type = updateMixDto.type;
      updatedMix.tags = updateMixDto.tags;
      updatedMix.channel = updateMixDto.channel;
      updatedMix.content = updateMixDto.content;
      updatedMix.modified = new Date();

      return await updatedMix.save();
    }

    throw Error('not authorized');
  }

  async remove(id: String, user: String): Promise<any> {
    const removableMix = await this.mixModel.findById(id).exec();
    if (removableMix.owner === user) {
      return await this.mixModel.findByIdAndRemove(id).exec();
    }

    throw Error('not authorized');
  }

  async find(query: any): Promise<Mix[]> {
    // console.log(query);
    return await this.mixModel.find(query).select('-content').exec();
  }

  async listChannels(query: any): Promise<any> {
    return await this.mixModel.distinct('channel', query).exec();
  }

  async listTags(query: any): Promise<any> {
    return await this.mixModel.distinct('tags', query).exec();
  }

  async findById(id): Promise<Mix> {
    return await this.mixModel.findById(id);
  }
}
