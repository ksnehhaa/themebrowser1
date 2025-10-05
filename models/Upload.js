import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  description: String,
  keywords: [String],
  demoLink: String,
  sourceLink: String,
  fileUrl: String,
}, {
  timestamps: true, // ✅ Adds createdAt and updatedAt fields
});

const Upload = mongoose.model('Upload', UploadSchema);

export default Upload;