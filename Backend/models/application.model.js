import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // reference to conversation (created when an application is accepted)
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: null },
    // Interview details (filled when recruiter schedules an interview)
    interview: {
      meetingLink: { type: String, default: '' },
      eventId: { type: String, default: '' },
      interviewTitle: { type: String, default: '' },
      startTime: { type: Date },
      duration: { type: Number }, // duration in minutes
      type: { type: String, enum: ['interview', 'written_exam'], default: 'interview' },
      reminderSent: { type: Boolean, default: false },
    },
      interviewStatus: { type: String, enum: ['pending', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
    // Snapshot of parsed resume at the time of application (helps filtering without extra DB joins)
    resumeSnapshot: {
      text: { type: String, default: '' },
      skills: [{ type: String }],
      yearsExperience: { type: Number, default: 0 },
    },
    // Computed match score between job requirements and applicant resume
    matchScore: { type: Number, default: 0 },
    skillsMatched: { type: Number, default: 0 },
    // detailed matched skills and match breakdown for auditing / improved sorting
    matchedSkills: [{ type: String }],
    skillMatchDetails: { type: Array, default: [] },
    // percent scores
    skillScore: { type: Number, default: 0 },
    expScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);