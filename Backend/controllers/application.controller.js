import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Authentication required", success: false });
    }

    // Block banned users from applying
    const requester = await User.findById(userId).select('isBanned role');
    if (requester && requester.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned', success: false });
    }

    const jobId = req.params.id;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }
    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    //check if the job exists or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Prevent applying past the job's application deadline
    if (job.applicationDeadline) {
      const deadline = new Date(job.applicationDeadline).getTime();
      if (deadline < Date.now()) {
        return res.status(400).json({ message: 'Application deadline has passed', success: false });
      }
    }

    // create a new application

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // enrich application with resume snapshot and a simple match score
    try {
      const applicantUser = await User.findById(userId).select('profile fullname');
      const parsed = (applicantUser && applicantUser.profile && applicantUser.profile.resumeParsed) ? applicantUser.profile.resumeParsed : null;
      const resumeSnapshot = parsed ? {
        text: parsed.text || '',
        skills: parsed.skills || [],
        yearsExperience: parsed.yearsExperience || 0,
      } : { text: '', skills: [], yearsExperience: 0 };

      // Use matcher util for consistent scoring
      try {
        const { computeMatch } = await import('../utils/matcher.js');
        const profileSkills = (applicantUser && applicantUser.profile && Array.isArray(applicantUser.profile.skills)) ? applicantUser.profile.skills : [];
        const match = computeMatch({ jobRequirements: job.requirements || [], profileSkills, resumeParsed: resumeSnapshot, candidateYears: resumeSnapshot.yearsExperience || 0, jobExperience: job.experienceLevel || 0 });
        newApplication.resumeSnapshot = resumeSnapshot;
        newApplication.matchScore = match.matchScore;
        newApplication.skillScore = match.skillScore || 0;
        newApplication.expScore = match.expScore || 0;
        newApplication.skillsMatched = match.skillsMatched;
        newApplication.matchedSkills = match.matchedSkills || [];
        newApplication.skillMatchDetails = match.skillMatchDetails || [];
        await newApplication.save();
      } catch (err) {
        console.error('Failed to compute match score:', err);
        newApplication.resumeSnapshot = resumeSnapshot;
        newApplication.matchScore = 0;
        newApplication.skillScore = 0;
        newApplication.expScore = 0;
        newApplication.skillsMatched = 0;
        newApplication.matchedSkills = [];
        newApplication.skillMatchDetails = [];
        await newApplication.save();
      }
    } catch (err) {
      console.error('Failed to compute match score:', err);
    }

    job.applications.push(newApplication._id);
    await job.save();

    // Notify the recruiter (job created_by) that someone applied
    try {
      const recruiterId = job.created_by;
      const applicantUser = await User.findById(userId).select("fullname");
      if (recruiterId) {
        const recruiter = await User.findById(recruiterId);
        if (recruiter) {
          recruiter.notifications = recruiter.notifications || [];
          recruiter.notifications.unshift({
            type: "application",
            message: `${applicantUser.fullname} applied to your job: ${job.title}`,
            data: { jobId: job._id, applicationId: newApplication._id, applicantId: userId },
            read: false,
          });
          await recruiter.save();
        }
      }
    } catch (notifErr) {
      console.error("Failed to create recruiter notification:", notifErr);
    }

    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
        select: "fullname email phoneNumber profile role",
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Only the recruiter who created the job may view the list of applicants
    const requesterId = req.id;
    if (!requesterId || String(job.created_by) !== String(requesterId)) {
      return res.status(403).json({ message: 'Forbidden - only the job owner may view applicants', success: false });
    }

    // Apply optional filtering and ordering via query params
    // Supported query params: skills (comma separated), minExperience (number), orderBy (grade|match|experience|skills|date)
    const { skills: skillsQ, minExperience: minExpQ, orderBy } = req.query;
    let applications = job.applications || [];

    // filter by minExperience
    if (minExpQ) {
      const minExp = Number(minExpQ) || 0;
      applications = applications.filter(a => {
        const years = (a.resumeSnapshot && typeof a.resumeSnapshot.yearsExperience === 'number') ? a.resumeSnapshot.yearsExperience : (a.applicant?.profile?.resumeParsed?.yearsExperience || 0);
        return years >= minExp;
      });
    }

    // filter by skills (any match). We check multiple sources: resumeSnapshot.skills, applicant profile parsed skills, applicant profile skills, matchedSkills
    if (skillsQ) {
      const wanted = skillsQ.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      if (wanted.length > 0) {
        applications = applications.filter(a => {
          const sources = [];
          if (a.resumeSnapshot && Array.isArray(a.resumeSnapshot.skills)) sources.push(...a.resumeSnapshot.skills);
          if (a.applicant?.profile?.resumeParsed && Array.isArray(a.applicant.profile.resumeParsed.skills)) sources.push(...a.applicant.profile.resumeParsed.skills);
          if (a.applicant?.profile && Array.isArray(a.applicant.profile.skills)) sources.push(...a.applicant.profile.skills);
          if (Array.isArray(a.matchedSkills)) sources.push(...a.matchedSkills);
          const s = sources.map(x => String(x).toLowerCase());
          return wanted.some(w => s.includes(w));
        });
      }
    }

    // filter by minimum skill percentage if provided (minSkill query param)
    if (req.query && typeof req.query.minSkill !== 'undefined') {
      const minSkill = Number(req.query.minSkill) || 0;
      applications = applications.filter(a => {
        const score = (typeof a.skillScore !== 'undefined' && a.skillScore !== null) ? Number(a.skillScore) : (typeof a.matchScore !== 'undefined' && a.matchScore !== null ? Number(a.matchScore) : null);
        return score !== null && score >= minSkill;
      });
    }

    // Ensure skillScore exists for legacy applications by computing when missing
    // If ?recompute=true is passed, recompute scores for all applications to update old values
    try {
      const { computeMatch } = await import('../utils/matcher.js');
      const recomputeAll = (req.query && (req.query.recompute === '1' || String(req.query.recompute).toLowerCase() === 'true'));
      for (const app of applications) {
        if (recomputeAll || typeof app.skillScore === 'undefined' || app.skillScore === null) {
          const resumeParsed = (app.resumeSnapshot && typeof app.resumeSnapshot === 'object') ? app.resumeSnapshot : (app.applicant?.profile?.resumeParsed || { text: '', skills: [], yearsExperience: 0 });
          const profileSkills = (app.applicant && app.applicant.profile && Array.isArray(app.applicant.profile.skills)) ? app.applicant.profile.skills : [];
          const years = (resumeParsed && typeof resumeParsed.yearsExperience === 'number') ? resumeParsed.yearsExperience : 0;
          const match = computeMatch({ jobRequirements: job.requirements || [], profileSkills, resumeParsed, candidateYears: years || 0, jobExperience: job.experienceLevel || 0 });
          app.skillScore = Number(match.skillScore || 0);
          app.expScore = Number(match.expScore || 0);
          app.matchScore = Number(match.matchScore || 0);
          app.skillsMatched = Number(match.skillsMatched || 0);
          app.matchedSkills = match.matchedSkills || [];
          app.skillMatchDetails = match.skillMatchDetails || [];
        }
      }
    } catch (err) {
      console.error('Failed to compute missing skillScores for applications:', err);
    }

    // choose ordering
    const order = orderBy || 'grade';
    if (order === 'match') {
      const val = (x) => (typeof x === 'number' && isFinite(x)) ? x : (typeof x === 'string' && !Number.isNaN(Number(x)) ? Number(x) : Number.NEGATIVE_INFINITY);
      applications.sort((a, b) => val(b.matchScore) - val(a.matchScore));
    } else if (order === 'skill' || order === 'skillScore') {
      const val = (x) => (typeof x === 'number' && isFinite(x)) ? x : (typeof x === 'string' && !Number.isNaN(Number(x)) ? Number(x) : Number.NEGATIVE_INFINITY);
      applications.sort((a, b) => val(b.skillScore) - val(a.skillScore));
    } else if (order === 'experience') {
      const getY = x => (x.resumeSnapshot && typeof x.resumeSnapshot.yearsExperience === 'number') ? x.resumeSnapshot.yearsExperience : (x.applicant?.profile?.resumeParsed?.yearsExperience || 0);
      applications.sort((a, b) => getY(b) - getY(a));
    } else if (order === 'skills') {
      const val = (x) => (typeof x === 'number' && isFinite(x)) ? x : (typeof x === 'string' && !Number.isNaN(Number(x)) ? Number(x) : 0);
      applications.sort((a, b) => val(b.skillsMatched) - val(a.skillsMatched));
    } else if (order === 'date') {
      applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // default: grade
      applications.sort((a, b) => {
        const gaRaw = a?.applicant?.profile?.grade;
        const gbRaw = b?.applicant?.profile?.grade;
        const ga = typeof gaRaw === 'number' ? gaRaw : (gaRaw ? Number(gaRaw) : Number.NEGATIVE_INFINITY);
        const gb = typeof gbRaw === 'number' ? gbRaw : (gbRaw ? Number(gbRaw) : Number.NEGATIVE_INFINITY);
        if (ga === gb) return 0;
        if (ga > gb) return -1;
        return 1;
      });
    }

    // replace job.applications with filtered/ordered list
    job.applications = applications;

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateMultipleStatus = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { applicationIds, status } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'applicationIds array is required', success: false });
    }
    if (!status) {
      return res.status(400).json({ message: 'status is required', success: false });
    }

    // ensure recruiter owns the jobs for these applications
    const jobs = await Job.find({ created_by: recruiterId }).select('_id');
    const jobIds = jobs.map(j => j._id.toString());

    const applications = await Application.find({ _id: { $in: applicationIds } }).populate('job').populate('applicant');
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for provided ids', success: false });
    }

    for (const application of applications) {
      const jobIdStr = application.job?._id?.toString();
      if (!jobIdStr || !jobIds.includes(jobIdStr)) {
        return res.status(403).json({ message: 'Not authorized to modify one or more applications', success: false });
      }
    }

    const results = [];
    for (const application of applications) {
      application.status = status.toLowerCase();
      let conversationIdForResult = null;
      await application.save();

      // notify applicant and create conversation for accepted
      try {
        if (application.status === 'accepted') {
          const recruiterIdLocal = recruiterId;
          const { Chat } = await import('../models/chat.model.js');
          const participants = [application.applicant.toString(), recruiterIdLocal.toString()];
          let convo = await Chat.findOne({ participants: { $all: participants, $size: 2 } });
          if (!convo) convo = await Chat.create({ participants });
          application.conversation = convo._id;
          conversationIdForResult = convo._id;
          await application.save();

          const applicant = await User.findById(application.applicant);
          const jobItem = await Job.findById(application.job).select('title');
          if (applicant) {
            applicant.notifications = applicant.notifications || [];
            applicant.notifications.unshift({
              type: 'status_update',
              message: `Your application for ${jobItem?.title || 'a job'} was accepted.`,
              data: { applicationId: application._id, jobId: application.job, status: application.status, conversationId: convo._id },
              read: false,
            });
            await applicant.save();
          }
        } else {
          const applicant = await User.findById(application.applicant);
          const jobItem = await Job.findById(application.job).select('title');
          if (applicant) {
            applicant.notifications = applicant.notifications || [];
            applicant.notifications.unshift({
              type: 'status_update',
              message: `Your application for ${jobItem?.title || 'a job'} was ${application.status}`,
              data: { applicationId: application._id, jobId: application.job, status: application.status },
              read: false,
            });
            await applicant.save();
          }
        }
      } catch (err) {
        console.error('Failed to notify during bulk update:', err);
      }

      results.push({ applicationId: application._id, status: application.status, conversationId: conversationIdForResult });
    }

    return res.status(200).json({ message: 'Bulk update completed', success: true, results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Authorization: only the recruiter that owns the job may change applicant status (except applicant may withdraw)
    const jobItem = await Job.findById(application.job).select('created_by title');
    if (!jobItem) return res.status(404).json({ message: 'Job not found', success: false });

    const requesterId = req.id;
    // If the requester is the applicant, only allow 'withdrawn' status
    if (requesterId && String(requesterId) === String(application.applicant)) {
      if (String(status).toLowerCase() !== 'withdrawn') {
        return res.status(403).json({ message: 'Applicants may only withdraw their application', success: false });
      }
      application.status = status.toLowerCase();
      await application.save();
    } else {
      // otherwise ensure requester is the job owner (recruiter)
      if (!requesterId || String(jobItem.created_by) !== String(requesterId)) {
        return res.status(403).json({ message: 'Forbidden - only the job owner may change application status', success: false });
      }
      application.status = status.toLowerCase();
      await application.save();
    }

    // If accepted, create or reuse a chat conversation between recruiter and applicant
    let conversationId = null;
    try {
      if (application.status === 'accepted') {
        const jobItem = await Job.findById(application.job).select('created_by title');
        const recruiterId = jobItem?.created_by;
        if (recruiterId) {
          // lazy-load Chat model to avoid circular deps
          const { Chat } = await import('../models/chat.model.js');
          // check for existing convo between the two participants
          const participants = [application.applicant.toString(), recruiterId.toString()];
          let convo = await Chat.findOne({ participants: { $all: participants, $size: 2 } });
          if (!convo) {
            convo = await Chat.create({ participants });
          }
          conversationId = convo._id;

          // persist conversation id on the application for easy lookup
          application.conversation = conversationId;
          await application.save();

          // Notify the applicant about status change and include conversationId so applicant can open chat
          try {
            const applicant = await User.findById(application.applicant);
            const jobItem2 = jobItem || (await Job.findById(application.job).select('title'));
            if (applicant) {
              applicant.notifications = applicant.notifications || [];
              applicant.notifications.unshift({
                type: "status_update",
                message: `Your application for ${jobItem2?.title || 'a job'} was accepted. Open chat to view interview schedule.`,
                data: { applicationId: application._id, jobId: application.job, status: application.status, conversationId },
                read: false,
              });
              await applicant.save();
            }
          } catch (notifErr) {
            console.error("Failed to notify applicant:", notifErr);
          }
        }
      } else {
        // for non-accepted statuses, notify as before without conversationId
        try {
          const applicant = await User.findById(application.applicant);
          const jobItem = await Job.findById(application.job).select("title");
          if (applicant) {
            applicant.notifications = applicant.notifications || [];
            applicant.notifications.unshift({
              type: "status_update",
              message: `Your application for ${jobItem?.title || 'a job'} was ${application.status}`,
              data: { applicationId: application._id, jobId: application.job, status: application.status },
              read: false,
            });
            await applicant.save();
          }
        } catch (notifErr) {
          console.error("Failed to notify applicant:", notifErr);
        }
      }
    } catch (chatErr) {
      console.error('Failed to create conversation on acceptance:', chatErr);
    }

    return res.status(200).json({ message: "Application status updated", success: true, conversationId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAcceptedApplicantsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.id;
    // find jobs created by this recruiter
    const jobs = await Job.find({ created_by: recruiterId }).select('_id');
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds }, status: 'accepted' })
      .sort({ createdAt: -1 })
      .populate('applicant', 'fullname email profile')
      .populate('job', 'title company');

    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error('getAcceptedApplicantsForRecruiter error', error && error.stack ? error.stack : error);
    return res.status(500).json({ message: 'Server error', success: false, error: process.env.NODE_ENV === 'production' ? undefined : (error && error.message ? error.message : String(error)) });
  }
};

export const openConversationForApplication = async (req, res) => {
  try {
    const recruiterId = req.id;
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found', success: false });

    const jobItem = await Job.findById(application.job).select('created_by');
    if (!jobItem) return res.status(404).json({ message: 'Job not found', success: false });
    if (jobItem.created_by.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: 'Not authorized to open chat for this application', success: false });
    }

    // lazy-load Chat model
    const { Chat } = await import('../models/chat.model.js');
    const participants = [application.applicant.toString(), recruiterId.toString()];
    let convo = await Chat.findOne({ participants: { $all: participants, $size: 2 } });
    if (!convo) convo = await Chat.create({ participants });

    // persist on application
    application.conversation = convo._id;
    await application.save();

    return res.status(200).json({ conversationId: convo._id, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};