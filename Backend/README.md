# Backend SMTP setup

To enable sending password reset codes via email, set the following environment variables in your deployment or `.env` file:

- `SMTP_HOST` - SMTP server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP server port (e.g., `587`)
- `SMTP_USER` - SMTP username (login)
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - (optional) from address for outgoing emails; defaults to `SMTP_USER` or `no-reply@yourdomain.com`
- `SMTP_SECURE` - (optional) set to `true` to use TLS on connect (port 465); default behavior infers from port or `false`
- `SMTP_REJECT_UNAUTHORIZED` - (optional) set to `false` to skip certificate validation (not recommended for production)
- `SENDGRID_API_KEY` - (optional) if you prefer SendGrid, set this API key to send email via SendGrid when SMTP is not present
- `SENDGRID_FROM` - (optional) from address to use when sending via SendGrid

In development, if SMTP is not configured, the system will log the reset code to the server console for convenience. In production, failed email delivery will return an explicit error so you can catch miss-configuration and act on it.

Testing the forgot-password endpoint:

```bash
# Replace email@example.com with a real email you control
curl -X POST http://localhost:5011/api/user/forgot-password -H "Content-Type: application/json" -d '{"email":"email@example.com"}'
```

If SMTP is configured correctly, you should receive the reset code in the inbox. If not configured and running in development mode, the code will be printed to the server console where the backend is running.


## Resume parsing & job recommendations

This backend now includes an OCR and resume parsing pipeline to analyse uploaded resumes and compute skill/experience metadata used for applicant filtering and job recommendations.

Notes:
- New dependencies: `pdf-parse`, `mammoth`, `tesseract.js` — run `npm install` in the `Backend` folder.
- Resumes uploaded to `/uploads` are automatically parsed (PDF, DOCX, or images). Parsed skills are merged into `user.profile.skills` and stored in `user.profile.resumeParsed`.
- When a user applies to a job, the application stores a `resumeSnapshot` and a `matchScore` used for recruiter-side filtering and ordering.
- New endpoints:
  - `GET /api/job/recommendations` — authenticated job seekers: returns a list of jobs ranked by match score based on parsed resume.
  - `GET /api/application/:id/applicants` supports query params: `skills`, `minExperience`, `orderBy` (`grade|match|experience|skills|date`).

If you need to switch the parsing strategy (e.g., use a cloud OCR provider), update `Backend/utils/resumeParser.js` accordingly.