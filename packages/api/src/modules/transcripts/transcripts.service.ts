import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { Transcript } from './interfaces/transcript.interface';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { UpdateTranscriptDto } from './dto/update-transcript.dto';

@Component()
export class TranscriptsService {
  constructor(
    @Inject('TranscriptModelToken') private readonly transcriptModel: Model<Transcript>) {}

  async create(createTranscriptDto: CreateTranscriptDto, namespace: any, user: String): Promise<Transcript> {
    const createdTranscript = new this.transcriptModel(createTranscriptDto);
    createdTranscript._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    createdTranscript.created = new Date();
    createdTranscript.modified = new Date();
    createdTranscript.owner = user;
    if (namespace) createdTranscript.namespace = namespace;

    return await createdTranscript.save();
  }

  async update(updateTranscriptDto: UpdateTranscriptDto, user: String): Promise<Transcript> {
    const updatedTranscript = await this.transcriptModel.findById(updateTranscriptDto._id).exec();
    if (updatedTranscript.owner === user) {
      updatedTranscript.label = updateTranscriptDto.label;
      updatedTranscript.desc = updateTranscriptDto.desc;
      updatedTranscript.type = updateTranscriptDto.type;
      if (updateTranscriptDto.meta) updatedTranscript.meta = updateTranscriptDto.meta;
      if (updateTranscriptDto.media) updatedTranscript.media = updateTranscriptDto.media;
      if (updateTranscriptDto.content) updatedTranscript.content = updateTranscriptDto.content;
      updatedTranscript.modified = new Date();

      return await updatedTranscript.save();
    }

    throw Error('not authorized');
  }

  async remove(id: String, user: String): Promise<any> {
    const removableTranscript = await this.transcriptModel.findById(id).exec();
    if (removableTranscript.owner === user) {
      return await this.transcriptModel.findByIdAndRemove(id).exec();
    }

    throw Error('not authorized');
  }

  async find(query: any): Promise<Transcript[]> {
    // console.log(query);
    return await this.transcriptModel.find(query).select('-meta -content').exec();
  }

  // TODO rename
  async find2(query: any): Promise<Transcript[]> {
    // console.log(query);
    return await this.transcriptModel.find(query).select('-meta -content').populate('media').exec();
  }

  async findById(id): Promise<Transcript> {
    return await this.transcriptModel.findById(id).populate('media');
  }
}
