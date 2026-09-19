/**
 * Static guard for a bug class that `vite build` cannot detect.
 *
 * Rollup bundles `<IconPin />` even when IconPin was never imported, because an
 * unbound JSX identifier is indistinguishable from a global at bundle time. The
 * mistake only shows up at runtime as:
 *
 *     ReferenceError: IconPin is not defined
 *
 * This script checks two precise things:
 *   1. every capitalised JSX tag resolves to an import or local declaration;
 *   2. every symbol exported by the shared constant/icon modules
 *      (config/constants.js, components/icons.jsx) is imported wherever used.
 *
 * Usage: npm run check
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const EXT = new Set(['.jsx', '.js']);
const SHARED_MODULES = ['config/constants.js', 'components/icons.jsx'];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/** Names re-exported by a module, e.g. `export const PRICING = {...}`. */
function collectExports(file) {
  const text = fs.readFileSync(file, 'utf8');
  const names = new Set();
  const re = /export\s+(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return names;
}

/** Every name introduced by an import or a local declaration. */
function collectDefined(text) {
  const defined = new Set();

  // Side-effect-only imports (`import './App.css';`) have no binding and would
  // otherwise be mis-parsed as the clause of the following import.
  const withoutSideEffects = text.replace(/^\s*import\s*['"][^'"]+['"]\s*;?\s*$/gm, '');

  const importRe = /import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"]/g;
  let m;
  while ((m = importRe.exec(withoutSideEffects))) {
    const clause = m[1];
    const named = clause.match(/\{([\s\S]*?)\}/);
    if (named) {
      for (const part of named[1].split(',')) {
        const alias = part.split(/\s+as\s+/)[1] || part;
        const name = alias.replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (/^[A-Za-z_$][\w$]*$/.test(name)) defined.add(name);
      }
    }
    const rest = clause.replace(/\{[\s\S]*?\}/, '');
    for (const part of rest.split(',')) {
      const alias = part.split(/\s+as\s+/)[1] || part;
      const name = alias.replace(/\*/g, '').trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) defined.add(name);
    }
  }

  const declRe = /(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = declRe.exec(withoutSideEffects))) defined.add(m[1]);

  return defined;
}

/** Capitalised JSX tag names (component references). */
function findJsxTags(text) {
  const found = [];
  const tagRe = /<(\/?)([A-Z][\w.]*)/g;
  let m;
  while ((m = tagRe.exec(text))) {
    if (m[1] === '/') continue;
    found.push({ name: m[2].split('.')[0], line: text.slice(0, m.index).split('\n').length });
  }
  return found;
}

const watched = new Set();
for (const modulePath of SHARED_MODULES) {
  for (const name of collectExports(path.join(ROOT, modulePath))) watched.add(name);
}

const problems = [];

for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, 'utf8');
  const defined = collectDefined(text);
  const relative = path.relative(ROOT, file).replace(/\\/g, '/');

  // 1. JSX tags that were never imported or declared.
  for (const { name, line } of findJsxTags(text)) {
    if (!defined.has(name)) {
      problems.push({ relative, line, name, kind: 'component' });
    }
  }

  // 2. Shared constants/icons referenced without an import. The leading
  //    lookbehind skips string literals and member accesses such as
  //    `PRICING.MAX_QTY`, which keeps JSX copy like "Cash on Delivery (COD)" quiet.
  for (const name of watched) {
    if (defined.has(name)) continue;
    const re = new RegExp(`(?<![\\w.$'"])\\b${name}\\b`);
    const match = re.exec(text);
    if (match) {
      problems.push({
        relative,
        line: text.slice(0, match.index).split('\n').length,
        name,
        kind: 'shared export',
      });
    }
  }
}

if (problems.length) {
  console.error('\nUndefined references found (all of these throw at runtime):\n');
  for (const p of problems) {
    console.error(`  src/${p.relative}:${p.line}  ->  ${p.name} (${p.kind}) is not imported or declared`);
  }
  console.error(`\n${problems.length} problem(s).\n`);
  process.exit(1);
}

console.log(`OK: no undefined references (${watched.size} shared exports watched).`);