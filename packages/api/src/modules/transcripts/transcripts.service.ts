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

  async create(createTranscriptDto: CreateTranscriptDto): Promise<Transcript> {
    const createdTranscript = new this.transcriptModel(createTranscriptDto);
    createdTranscript._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

    return await createdTranscript.save();
  }

  async update(updateTranscriptDto: UpdateTranscriptDto): Promise<Transcript> {
    const updatedTranscript = new this.transcriptModel(updateTranscriptDto);
    return await updatedTranscript.save();
  }

  async remove(id: String): Promise<any> {
    return await this.transcriptModel.findByIdAndRemove(id).exec();
  }

  async findAll(): Promise<Transcript[]> {
    return await this.transcriptModel.find().exec();
  }

  async find(query: any): Promise<Transcript[]> {
    console.log(query);
    return await this.transcriptModel.find(query).select('-meta -content').exec();
  }

  async listChannels(query: any): Promise<any> {
    return await this.transcriptModel.distinct('channel', query).exec();
  }

  async listTags(query: any): Promise<any> {
    return await this.transcriptModel.distinct('tags', query).exec();
  }

  async findById(id): Promise<Transcript> {
    return await this.transcriptModel.findById(id).populate('media');
  }
}
