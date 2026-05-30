const fs = require('fs');
const path = require('path');

// load defaultVacancies from src/lib/careers.js by extracting the exported array
const careersPath = path.join(__dirname, '..', 'src', 'lib', 'careers.js');
const careersSrc = fs.readFileSync(careersPath, 'utf8');
const m = careersSrc.match(/export const defaultVacancies\s*=\s*(\[[\s\S]*?\]);/m);
if (!m) {
  console.error('Could not find defaultVacancies in careers.js');
  process.exit(1);
}
const defaultVacancies = eval('(' + m[1] + ')');

function originalFilter(vacancies, normalized) {
  const targetWords = normalized
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !["any", "job", "jobs", "open", "opening", "vacancy", "available", "current"].includes(word));

  if (!targetWords.length) return vacancies;

  const matches = vacancies.filter((job) => {
    const haystack = `${job.title} ${job.department} ${job.requirements} ${job.description}`.toLowerCase();
    return targetWords.some((word) => haystack.includes(word));
  });

  return matches.length ? matches : vacancies;
}

function updatedFilter(vacancies, normalized) {
  const stopWords = new Set([
    "what","are","the","now","today","current","available","show","list",
    "opening","openings","vacancy","vacancies","job","jobs","apply","career","careers","any",
  ]);

  const words = normalized
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => (w.endsWith('s') ? w.slice(0, -1) : w));

  const targetWords = words.filter((word) => word.length >= 3 && !stopWords.has(word));

  if (!targetWords.length) return vacancies;

  const matches = vacancies.filter((job) => {
    const haystack = `${job.title} ${job.department} ${job.requirements} ${job.description}`.toLowerCase();
    return targetWords.some((word) => haystack.includes(word));
  });

  return matches.length ? matches : vacancies;
}

function summarize(vacancies) {
  const total = vacancies.reduce((s, v) => s + (Number(v.openings) || 0), 0);
  return { total, titles: vacancies.map(v => `${v.title} (${v.openings || 1})`) };
}

const queries = [
  "What are the openings right now?",
  "Any vacancies?",
  "Show current openings",
  "Any nurse vacancy?",
  "Radiology jobs",
];

console.log('Vacancies loaded:', defaultVacancies.map(v=>v.title));

for (const q of queries) {
  const normalized = q.toLowerCase().trim();
  const before = originalFilter(defaultVacancies, normalized);
  const after = updatedFilter(defaultVacancies, normalized);
  console.log('\nQuery:', q);
  console.log('Before -> count:', before.length, 'total openings:', summarize(before).total);
  console.log('Before -> titles:', summarize(before).titles.join('; '));
  console.log('After  -> count:', after.length, 'total openings:', summarize(after).total);
  console.log('After  -> titles:', summarize(after).titles.join('; '));
}
