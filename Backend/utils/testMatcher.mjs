import { computeMatch } from './matcher.js';

const jobRequirements = ['JavaScript', 'React', 'Node.js (required)', 'SQL'];

const candidateA = {
  profileSkills: ['javascript', 'react'],
  resumeParsed: { skills: ['node.js'], text: 'Worked on Node.js and various JS frameworks', yearsExperience: 3 },
  candidateYears: 3,
  jobExperience: 2
};

const candidateB = {
  profileSkills: [],
  resumeParsed: { skills: ['javascript', 'sql'], text: 'Experience with javascript and sql databases', yearsExperience: 1 },
  candidateYears: 1,
  jobExperience: 2
};

console.log('Candidate A (strict profile only):', computeMatch({ jobRequirements, ...candidateA, strictProfileOnly: true }));
console.log('Candidate A (full):', computeMatch({ jobRequirements, ...candidateA }));
console.log('Candidate B (strict profile only):', computeMatch({ jobRequirements, ...candidateB, strictProfileOnly: true }));
console.log('Candidate B (full):', computeMatch({ jobRequirements, ...candidateB }));
