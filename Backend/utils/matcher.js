// Matcher util: improved matching combining profile and parsed resume skills
// - Merge profile-entered skills and parsed-resume skills (dedupe)
// - Consider resume text occurrences when skills arrays don't include a match
// - Apply source-weight multipliers: profile (1.0), resumeSkill (0.92), resumeText (0.78)
// - Use same requirement weighting for 'required'/'must' style wording
// - Skill score computed per requirement (weighted), result 0..100
// - Experience score as before
// - Backwards compatible: accepts legacy `candidateSkills` param

function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s) => (s || '').toString().toLowerCase().trim())
    .filter(Boolean);
}

function isStrongRequirement(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return /\b(required|must|essential|mandatory|preferred|required skills)\b/.test(t);
}

function tokenCompare(jobReq, candSkill) {
  if (!jobReq || !candSkill) return 0;
  if (jobReq === candSkill) return 1.0;
  if (jobReq.includes(candSkill) || candSkill.includes(jobReq)) return 0.85;
  if (jobReq.split(' ').some(token => candSkill.includes(token)) || candSkill.split(' ').some(token => jobReq.includes(token))) return 0.6;
  return 0;
}

export function computeMatch({ jobRequirements = [], candidateSkills = [], profileSkills = [], resumeParsed = null, candidateYears = 0, jobExperience = 0, strictProfileOnly = false }) {
  const jobReqs = normalizeArray(jobRequirements);
  // build candidate skill set with source metadata
  const prof = normalizeArray(profileSkills);
  const resumeSkills = resumeParsed && Array.isArray(resumeParsed.skills) ? normalizeArray(resumeParsed.skills) : normalizeArray(candidateSkills);
  const candidateMap = new Map(); // skill -> { skill, source }

  if (!strictProfileOnly) {
    // resumeSkills first (lower priority)
    for (const s of resumeSkills) {
      if (!candidateMap.has(s)) candidateMap.set(s, { skill: s, source: 'resumeSkill' });
    }
    // profile skills override or mark as both
    for (const s of prof) {
      if (candidateMap.has(s)) candidateMap.set(s, { skill: s, source: 'both' });
      else candidateMap.set(s, { skill: s, source: 'profile' });
    }
  } else {
    // strict profile-only matching: only consider profile skills
    for (const s of prof) {
      if (!candidateMap.has(s)) candidateMap.set(s, { skill: s, source: 'profile' });
    }
  }

  const resumeText = (resumeParsed && resumeParsed.text) ? String(resumeParsed.text).toLowerCase() : '';

  // handle empty requirements: fallback to experience-only scoring (preserve backward compatibility)
  if (jobReqs.length === 0) {
    const expScore = jobExperience ? Math.min(candidateYears / jobExperience, 1) : 1;
    const matchScore = Math.round((expScore) * 100);
    return {
      matchScore,
      skillScore: 0,
      expScore: Math.round(expScore * 100),
      skillsMatched: 0,
      matchedSkills: [],
      skillMatchDetails: [],
    };
  }

  const details = [];
  let weightedSum = 0;
  let weightTotal = 0;

  for (const reqRaw of jobReqs) {
    const req = reqRaw;
    const weight = isStrongRequirement(req) ? 2 : 1;

    // find best match among candidateMap
    let best = { skill: null, score: 0, source: null };
    for (const [skill, meta] of candidateMap.entries()) {
      const base = tokenCompare(req, skill);
      if (base <= 0) continue;
      const sourceMult = meta.source === 'profile' ? 1.0 : (meta.source === 'both' ? 1.0 : 0.92);
      const score = base * sourceMult;
      if (score > best.score) best = { skill: meta.skill, score, source: meta.source };
    }

    // if still no match and not strictProfileOnly, check resume text occurrences (looser match)
    if (!strictProfileOnly && best.score === 0 && resumeText && resumeText.includes(req)) {
      best = { skill: req, score: 0.78, source: 'resumeText' };
    }

    weightedSum += best.score * weight;
    weightTotal += weight;

    if (best.score > 0) {
      details.push({ requirement: req, matchedSkill: best.skill, score: Number(best.score.toFixed(2)), weight, source: best.source });
    } else {
      details.push({ requirement: req, matchedSkill: null, score: 0, weight, source: null });
    }
  }

  const skillScore = weightTotal > 0 ? weightedSum / weightTotal : 0;
  const expScore = jobExperience ? Math.min(candidateYears / jobExperience, 1) : 1;
  const matchScore = Math.round((skillScore * 0.8 + expScore * 0.2) * 100);

  // aggregate unique matched skills (from details)
  const matchedSkills = Array.from(new Set(details.filter(d => d.matchedSkill).map(d => d.matchedSkill)));
  const skillsMatched = details.filter(d => d.score > 0).length; // how many requirements matched

  return {
    matchScore,
    skillScore: Math.round(skillScore * 100),
    expScore: Math.round(expScore * 100),
    skillsMatched,
    matchedSkills,
    skillMatchDetails: details,
  };
}

export default { computeMatch };