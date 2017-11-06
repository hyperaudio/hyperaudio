import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { Media } from './interfaces/media.interface';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Component()
export class MediaService {
  constructor(
    @Inject('MediaModelToken') private readonly mediaModel: Model<Media>) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const createdMedia = new this.mediaModel(createMediaDto);
    createdMedia._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

    return await createdMedia.save();
  }

  async update(updateMediaDto: UpdateMediaDto): Promise<Media> {
    const updatedMedia = new this.mediaModel(updateMediaDto);
    return await updatedMedia.save();
  }

  async remove(id: String): Promise<any> {
    return await this.mediaModel.findByIdAndRemove(id).exec();
  }

  async findAll(): Promise<Media[]> {
    return await this.mediaModel.find().exec();
  }

  async find(query: any): Promise<Media[]> {
    console.log(query);
    return await this.mediaModel.find(query).exec();
  }

  async listChannels(query: any): Promise<any> {
    return await this.mediaModel.distinct('channel', query).exec();
  }

  async listTags(query: any): Promise<any> {
    return await this.mediaModel.distinct('tags', query).exec();
  }

  async findById(id): Promise<Media> {
    return await this.mediaModel.findById(id).populate('meta').exec();
  }
}
