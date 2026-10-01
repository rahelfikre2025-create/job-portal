// Validation middleware - simple, dependency-free validators

export const isEmail = (s) => typeof s === 'string' && s.trim().length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isAlphaLike = (s) => typeof s === 'string' && s.trim().length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ '\-\.]+$/.test(s.trim());
export const isPhone = (s) => typeof s === 'string' && s.trim().length >= 7 && s.trim().length <= 25 && /^[+()0-9 \-]+$/.test(s.trim());
export const isStrongPassword = (p) => typeof p === 'string' && p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
const isNumeric = (v) => !Number.isNaN(Number(v));
const isObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);
const isDateString = (s) => { const d = new Date(s); return !Number.isNaN(d.getTime()); };

const respond = (res, errors) => res.status(400).json({ message: errors.join('; '), success: false, errors });

export const validateRegister = (req, res, next) => {
  const { fullname, email, phoneNumber, password, role } = req.body;
  const errors = [];
  if (!fullname || !isAlphaLike(fullname)) errors.push('Full name must contain only letters, spaces, hyphens or apostrophes and be at least 2 characters');
  if (!email || !isEmail(email)) errors.push('A valid email is required');
  if (!phoneNumber || !isPhone(phoneNumber)) errors.push('A valid phone number is required (digits, spaces, +, () allowed)');
  if (!password || !isStrongPassword(password)) errors.push('Password must be at least 8 characters and include upper, lower, number and symbol');
  if (!role || typeof role !== 'string' || !role.trim()) errors.push('Role is required');
  if (errors.length) return respond(res, errors);
  // Normalize common cleanups for downstream controllers
  req.body.fullname = String(fullname).trim();
  req.body.email = String(email).trim().toLowerCase();
  req.body.phoneNumber = String(phoneNumber).trim();
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email || !isEmail(email)) errors.push('A valid email is required');
  if (!password || typeof password !== 'string' || password.length < 1) errors.push('Password is required');
  if (errors.length) return respond(res, errors);
  req.body.email = String(email).trim().toLowerCase();
  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const { fullname, email, phoneNumber, bio, skills, grade, companyName } = req.body;
  const errors = [];
  if (typeof fullname !== 'undefined' && fullname !== null && fullname !== '' && !isAlphaLike(fullname)) errors.push('Full name, if provided, must be alphabetic (spaces, -, \' allowed)');
  if (typeof email !== 'undefined' && email !== null && email !== '' && !isEmail(email)) errors.push('Email is invalid');
  if (typeof phoneNumber !== 'undefined' && phoneNumber !== null && phoneNumber !== '' && !isPhone(phoneNumber)) errors.push('Phone number is invalid');
  if (typeof bio !== 'undefined' && bio !== null && String(bio).length > 1000) errors.push('Bio is too long (max 1000 chars)');
  if (typeof skills !== 'undefined' && skills !== null && typeof skills === 'string' && skills.length > 1000) errors.push('Skills value too long');
  if (typeof grade !== 'undefined' && grade !== null && grade !== '' && !isNumeric(grade)) errors.push('Grade must be a number');
  if (typeof companyName !== 'undefined' && companyName !== null && companyName !== '' && String(companyName).length > 200) errors.push('Company name too long');
  if (errors.length) return respond(res, errors);
  if (email) req.body.email = String(email).trim().toLowerCase();
  if (fullname) req.body.fullname = String(fullname).trim();
  if (phoneNumber) req.body.phoneNumber = String(phoneNumber).trim();
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  if (!email || !isEmail(email)) return respond(res, ['Valid email is required']);
  req.body.email = String(email).trim().toLowerCase();
  next();
};

export const validateResetPasswordWithCode = (req, res, next) => {
  const { email, code, password } = req.body;
  const errors = [];
  if (!email || !isEmail(email)) errors.push('Valid email is required');
  if (!code || !/^\d{4,7}$/.test(String(code))) errors.push('A valid numeric reset code is required');
  if (!password || !isStrongPassword(password)) errors.push('Password must be at least 8 characters and include upper, lower, number and symbol');
  if (errors.length) return respond(res, errors);
  req.body.email = String(email).trim().toLowerCase();
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || !isStrongPassword(password)) return respond(res, ['Password must be at least 8 characters and include upper, lower, number and symbol']);
  next();
};

// JOB validators
export const validatePostJob = (req, res, next) => {
  const { title, description, requirements, salary, salaryMin, salaryMax, applicationDeadline, location, jobType, experience, position, companyId } = req.body;
  const errors = [];
  if (!title || String(title).trim().length < 3) errors.push('Title is required and must be at least 3 characters');
  if (!description || String(description).trim().length < 10) errors.push('Description is required and must be at least 10 characters');
  if (!requirements || (Array.isArray(requirements) && requirements.length === 0) || (typeof requirements === 'string' && String(requirements).trim().length === 0)) errors.push('At least one requirement is required');
  if (salary !== undefined && salary !== null && salary !== '' && !isNumeric(salary)) errors.push('Salary must be a number');
  if (salaryMin !== undefined && salaryMin !== null && salaryMin !== '' && !isNumeric(salaryMin)) errors.push('salaryMin must be a number');
  if (salaryMax !== undefined && salaryMax !== null && salaryMax !== '' && !isNumeric(salaryMax)) errors.push('salaryMax must be a number');
  if ((salaryMin !== undefined && salaryMax !== undefined) && Number(salaryMin) > Number(salaryMax)) errors.push('salaryMin cannot be greater than salaryMax');
  if (applicationDeadline && !isDateString(applicationDeadline)) errors.push('applicationDeadline must be a valid date string');
  if (!location || String(location).trim().length < 2) errors.push('Location is required');
  if (!jobType || String(jobType).trim().length < 2) errors.push('jobType is required');
  if (!experience || String(experience).trim().length < 1) errors.push('experience is required');
  if (!position || (isNaN(Number(position)))) errors.push('position is required and must be a number');
  if (!companyId || !isObjectId(companyId)) errors.push('companyId is required and must be a valid id');
  if (errors.length) return respond(res, errors);
  // sanitize string fields
  req.body.title = String(title).trim();
  req.body.description = String(description).trim();
  req.body.location = String(location).trim();
  req.body.jobType = String(jobType).trim();
  req.body.position = Number(position);
  if (applicationDeadline) req.body.applicationDeadline = new Date(applicationDeadline).toISOString();
  next();
};

export const validateUpdateJob = (req, res, next) => {
  const { title, description, salary, salaryMin, salaryMax, applicationDeadline, location, jobType, experience, position, companyId, status } = req.body;
  const errors = [];
  if (title && String(title).trim().length < 3) errors.push('Title must be at least 3 characters');
  if (description && String(description).trim().length < 10) errors.push('Description must be at least 10 characters');
  if (salary !== undefined && salary !== null && salary !== '' && !isNumeric(salary)) errors.push('Salary must be a number');
  if (salaryMin !== undefined && salaryMin !== null && salaryMin !== '' && !isNumeric(salaryMin)) errors.push('salaryMin must be a number');
  if (salaryMax !== undefined && salaryMax !== null && salaryMax !== '' && !isNumeric(salaryMax)) errors.push('salaryMax must be a number');
  if ((salaryMin !== undefined && salaryMax !== undefined) && Number(salaryMin) > Number(salaryMax)) errors.push('salaryMin cannot be greater than salaryMax');
  if (applicationDeadline && !isDateString(applicationDeadline)) errors.push('applicationDeadline must be a valid date string');
  if (position !== undefined && position !== null && position !== '' && isNaN(Number(position))) errors.push('position must be a number');
  if (companyId && !isObjectId(companyId)) errors.push('companyId must be a valid id');
  if (status !== undefined) {
    const allowed = ['open', 'paused', 'closed'];
    if (!allowed.includes(String(status))) errors.push('Invalid status');
  }
  if (errors.length) return respond(res, errors);
  next();
};

// Company validators
export const validateCompanyRegister = (req, res, next) => {
  const { companyName } = req.body;
  if (!companyName || String(companyName).trim().length < 2 || String(companyName).trim().length > 200) return respond(res, ['Company name must be provided and between 2 and 200 characters']);
  // basic character whitelist: letters, numbers, spaces and common punctuation
  if (!/^[A-Za-z0-9 &'\-\.(),]{2,200}$/.test(String(companyName).trim())) return respond(res, ['Company name contains invalid characters']);
  req.body.companyName = String(companyName).trim();
  next();
};

export const validateUpdateCompany = (req, res, next) => {
  const { name, description, website, location } = req.body;
  const errors = [];
  if (name && (String(name).trim().length < 2 || String(name).trim().length > 200)) errors.push('Company name must be between 2 and 200 characters');
  if (description && String(description).length > 2000) errors.push('Description is too long');
  if (website && String(website).length > 500) errors.push('Website field is too long');
  if (location && String(location).length > 200) errors.push('Location is too long');
  if (errors.length) return respond(res, errors);
  next();
};

// Application validators
export const validateApplyJob = (req, res, next) => {
  const jobId = req.params.id;
  if (!jobId || !isObjectId(jobId)) return respond(res, ['Invalid job id']);
  next();
};

export const validateUpdateApplicationStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || typeof status !== 'string') return respond(res, ['status is required']);
  next();
};

export const validateBulkUpdateApplications = (req, res, next) => {
  const { applicationIds, status } = req.body;
  if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) return respond(res, ['applicationIds array is required']);
  const invalid = applicationIds.filter((id) => !isObjectId(String(id)));
  if (invalid.length) return respond(res, ['One or more applicationIds are invalid']);
  if (!status || typeof status !== 'string') return respond(res, ['status is required']);
  next();
};

// Interview validators
export const validateScheduleInterview = (req, res, next) => {
  const { applicationId, interviewTitle, startTime, duration, type } = req.body;
  const errors = [];
  if (!applicationId || !isObjectId(String(applicationId))) errors.push('Valid applicationId is required');
  if (!interviewTitle || String(interviewTitle).trim().length < 3) errors.push('Interview title is required and must be at least 3 characters');
  if (!startTime || !isDateString(startTime)) errors.push('A valid startTime is required');
  if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) errors.push('A valid duration is required');
  const allowedTypes = ['interview', 'written_exam'];
  if (type && !allowedTypes.includes(String(type))) errors.push('Invalid type');
  if (errors.length) return respond(res, errors);
  // optional: ensure startTime is in the future
  if (new Date(startTime).getTime() < Date.now()) return respond(res, ['startTime must be in the future']);
  next();
};

// Chat validators
export const validateCreateConversation = (req, res, next) => {
  const { participants } = req.body;
  if (!participants || !Array.isArray(participants) || participants.length < 2) return respond(res, ['participants array with at least two user ids is required']);
  const invalid = participants.filter((id) => !isObjectId(String(id)));
  if (invalid.length) return respond(res, ['One or more participant ids are invalid']);
  next();
};

export const validateSendMessage = (req, res, next) => {
  const { text, type, meta } = req.body;
  if (!text || typeof text !== 'string' || String(text).trim().length === 0) return respond(res, ['Message text is required']);
  if (String(text).length > 5000) return respond(res, ['Message text is too long']);
  // keep meta small
  if (meta && typeof meta === 'object' && JSON.stringify(meta).length > 10000) return respond(res, ['Message meta too large']);
  next();
};

// Admin-specific register validation shares register rules
export const validateRegisterAdmin = (req, res, next) => validateRegister(req, res, next);

export default { };
