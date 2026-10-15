import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { people, facts, sources, categories, relationships, terms } from '../src/data';
import { whoAmIQuestions } from '../src/data/whoAmI';
import { validateQuestions, validateData } from '../src/data/validate';
const errors = validateData({ people, facts, sources, categories, relationships, terms });
errors.push(...validateQuestions(whoAmIQuestions, { people, facts, sources }));
for (const person of people)
  if (!existsSync(`public${person.image.path}`)) errors.push(`Missing portrait for ${person.name}`);
for (const size of [192, 512])
  if (!existsSync(`public/icon-${size}.png`)) errors.push(`Missing ${size}px icon`);
for (const person of people) {
  const items = facts.filter((f) => f.personId === person.id);
  console.log(
    `${person.name}: ${items.filter((f) => f.verification === 'verified').length} verified / ${items.length} total`,
  );
}
const styleSources = readdirSync('src', { recursive: true, encoding: 'utf8' })
  .filter((path) => /\.(vue|less|css)$/.test(path))
  .map((path) => readFileSync(`src/${path}`, 'utf8'));
if (styleSources.some((source) => source.includes('https://fonts.googleapis.com')))
  errors.push('Fonts must be bundled for offline access');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Data validation passed: ${people.length} people, ${facts.length} facts, ${sources.length} sources.`,
  );
