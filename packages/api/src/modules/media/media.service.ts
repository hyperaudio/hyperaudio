import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { Media } from './interfaces/media.interface';
import { Metadata } from './interfaces/metadata.interface';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Component()
export class MediaService {
  constructor(
    @Inject('MediaModelToken') private readonly mediaModel: Model<Media>,
    @Inject('MetadataModelToken') private readonly metadataModel: Model<Metadata>
  ) {}

  async create(createMediaDto: CreateMediaDto, namespace: any, user: String): Promise<Media> {
    const createdMetadata = new this.metadataModel(createMediaDto.meta);
    createdMetadata._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    await createdMetadata.save();

    createMediaDto.meta = createdMetadata._id;
    const createdMedia = new this.mediaModel(createMediaDto);
    createdMedia._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    createdMedia.created = new Date();
    createdMedia.modified = new Date();
    createdMedia.owner = user;
    if (namespace) createdMedia.namespace = namespace;

    return await createdMedia.save();
  }

  async update(updateMediaDto: UpdateMediaDto, user: String): Promise<Media> {
    const updatedMedia = await this.mediaModel.findById(updateMediaDto._id).exec();
    if (updatedMedia.owner === user) {
      updatedMedia.label = updateMediaDto.label;
      updatedMedia.desc = updateMediaDto.desc;
      updatedMedia.type = updateMediaDto.type;
      updatedMedia.source = updateMediaDto.source;
      updatedMedia.tags = updateMediaDto.tags;
      updatedMedia.channel = updateMediaDto.channel;
      updatedMedia.modified = new Date();

      return await updatedMedia.save();
    }

    throw Error('not authorized');
  }

  async remove(id: String, user: String): Promise<any> {
    const removableMedia = await this.mediaModel.findById(id).exec();
    if (removableMedia.owner === user) {
      return await this.mediaModel.findByIdAndRemove(id).exec();
    }

    throw Error('not authorized');
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
