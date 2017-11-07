import * as mongoose from 'mongoose';

export const MetadataSchema = new mongoose.Schema({
  _id: String,
  youtube: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  download: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  probe: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  video: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  audio: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  m4a: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  versionKey: false,
  collection: 'metadata'
});


MetadataSchema.pre('save', next => {
  this.modified = new Date();
  next();
});
