import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
        enum: ["Job Seeker", "Recruiter", "Administrator"],
      default: "Job Seeker",
      required: true,
    },
    profile: {
     
      type: { 
        bio: {
          type: String,
        },
        skills: [{ type: String }],
        resume: {
          type: String, 
        },
        resumeOriginalname: {
          type: String, 
        },
        // Parsed resume metadata (populated after OCR & parsing)
        resumeParsed: {
          text: { type: String, default: '' },
          skills: [{ type: String }],
          yearsExperience: { type: Number, default: 0 },
          experiences: [
            {
              title: { type: String },
              company: { type: String },
              start: { type: Date },
              end: { type: Date },
              years: { type: Number },
            },
          ],
        },
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
        profilePhoto: {
          type: String, 
          default: "",
        },
        // numeric grade (e.g., GPA or percentage) for automatic ranking
        grade: { type: Number, default: null },
      },
      default: {}, 
    },
    notifications: [
      {
        type: { type: String },
        message: { type: String },
        data: { type: Object },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Admin controls
    isBanned: { type: Boolean, default: false },
    // Password reset fields (link token)
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date },
    // Password reset code (numeric OTP) stored as hash and expiry
    resetCodeHash: { type: String, default: '' },
    resetCodeExpires: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);