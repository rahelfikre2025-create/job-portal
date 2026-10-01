import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

const skills = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'Backend', 'utils', 'skills.json'), 'utf8'));

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  try {
    if (ext === '.pdf') {
      const data = await pdfParse(buffer);
      return data.text || '';
    }

    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    }

    // For images, use Tesseract OCR
    if (['.png', '.jpg', '.jpeg', '.bmp', '.tiff'].includes(ext)) {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', { logger: m => null });
      return text || '';
    }

    // For other text-based files, attempt to treat as plain text
    return buffer.toString('utf8');
  } catch (err) {
    console.error('extractTextFromFile error:', err);
    return '';
  }
}

function parseSkills(text) {
  const found = new Set();
  const lower = text.toLowerCase();
  for (const s of skills) {
    const sk = s.toLowerCase();
    // word boundary check
    const regex = new RegExp(`\\b${sk.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) found.add(s);
  }
  return Array.from(found);
}

function parseYearsExperience(text) {
  const lower = text.toLowerCase();
  // look for patterns like "5 years", "3+ years", "over 4 years"
  const regex = /([0-9]{1,2})(\+)?\s*(?:years|yrs)/g;
  let match;
  let max = 0;
  while ((match = regex.exec(lower)) !== null) {
    const v = parseInt(match[1], 10);
    if (!Number.isNaN(v) && v > max) max = v;
  }
  // fallback: look for recent experience ranges like 2018-2022
  const rangeRegex = /(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}/g;
  while ((match = rangeRegex.exec(lower)) !== null) {
    const parts = match[0].split(/[-–]/).map(p => p.trim());
    const a = parseInt(parts[0], 10); const b = parseInt(parts[1], 10);
    if (!Number.isNaN(a) && !Number.isNaN(b) && b > a) {
      const years = b - a;
      if (years > max) max = years;
    }
  }
  return max;
}

export async function analyzeResume(filePath) {
  const text = await extractTextFromFile(filePath);
  const skillsFound = parseSkills(text || '');
  const years = parseYearsExperience(text || '');
  return {
    text,
    skills: skillsFound,
    yearsExperience: years,
  };
}

export default { analyzeResume };