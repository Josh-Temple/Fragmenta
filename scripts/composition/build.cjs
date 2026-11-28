#!/usr/bin/env node
/*
 * Builds data/composition-guides.json from the authored sources in
 * scripts/composition/entries/*.cjs (text + figure functions).
 *
 *   node scripts/composition/build.cjs           # write the JSON
 *   node scripts/composition/build.cjs --check   # fail if the JSON is stale
 *
 * Entries keep their id, categoryId, sourceIds and relatedLegacyIds from the catalogue;
 * the authored module supplies the editorial text and the drawings.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const target = path.join(root, 'data/composition-guides.json');
const entriesDir = path.join(__dirname, 'entries');
const { flatten } = require('./lib.cjs');

const TEXT_FIELDS = ['definition', 'whyItWorks', 'example', 'contrast', 'changed', 'comparisonPoint', 'aiInstruction'];
const LIST_FIELDS = ['useCases', 'pitfalls'];

function loadEntries() {
  const out = new Map();
  if (!fs.existsSync(entriesDir)) return out;
  for (const file of fs.readdirSync(entriesDir).filter((f) => f.endsWith('.cjs')).sort()) {
    const full = path.join(entriesDir, file);
    delete require.cache[require.resolve(full)];
    const mod = require(full);
    for (const [id, entry] of Object.entries(mod)) {
      if (out.has(id)) throw Error('duplicate authored entry ' + id + ' in ' + file);
      out.set(id, { ...entry, __file: file });
    }
  }
  return out;
}

function materialise(id, entry) {
  for (const f of TEXT_FIELDS)
    if (typeof entry[f] !== 'string' || entry[f].trim().length < 8) throw Error(id + ': missing text field ' + f);
  for (const f of LIST_FIELDS)
    if (!Array.isArray(entry[f]) || entry[f].length < 2 || entry[f].some((s) => typeof s !== 'string' || s.length < 6))
      throw Error(id + ': ' + f + ' needs at least two sentences');
  if (typeof entry.figure !== 'function') throw Error(id + ': figure() missing');
  const fig = entry.figure();
  const example = flatten(fig.example);
  const comparison = flatten(fig.comparison);
  if (!example.length || !comparison.length) throw Error(id + ': empty figure');
  const guides = {
    example: flatten(fig.guides?.example ?? fig.guides ?? []),
    comparison: flatten(fig.guides?.comparison ?? fig.guides ?? []),
  };
  const diagram = { example, comparison, guides };
  if (fig.cover) diagram.cover = flatten(fig.cover);
  return diagram;
}

// Compact JSON: objects indented, arrays of primitives (shapes, string lists) on one line.
function serialise(value, indent = '') {
  const next = indent + '  ';
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== 'object')) return JSON.stringify(value);
    if (!value.length) return '[]';
    return '[\n' + value.map((v) => next + serialise(v, next)).join(',\n') + '\n' + indent + ']';
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).filter((k) => value[k] !== undefined);
    if (!keys.length) return '{}';
    return '{\n' + keys.map((k) => next + JSON.stringify(k) + ': ' + serialise(value[k], next)).join(',\n') + '\n' + indent + '}';
  }
  return JSON.stringify(value);
}

function build() {
  const catalog = JSON.parse(fs.readFileSync(target, 'utf8'));
  const authored = loadEntries();
  catalog.schemaVersion = 2;
  catalog.intro =
    '構図の120項目を、同じ場面で一つの条件だけを変えた比較図で解説する図鑑です。各項目に定義・効く理由・使いどころ・よくある失敗・AIへの指示例・比較図2点と構造補助線を収録しています。印象や効果は文脈で変わるため、完成案では目的と媒体に照らして確かめてください。';
  catalog.guides = catalog.guides.map((guide) => {
    const entry = authored.get(guide.id);
    if (!entry) return guide;
    const next = {
      id: guide.id,
      titleJa: entry.titleJa ?? guide.titleJa,
      categoryId: guide.categoryId,
      definition: entry.definition,
      whyItWorks: entry.whyItWorks,
      useCases: entry.useCases,
      pitfalls: entry.pitfalls,
      example: entry.example,
      contrast: entry.contrast,
      changed: entry.changed,
      comparisonPoint: entry.comparisonPoint,
      aiInstruction: entry.aiInstruction,
      diagram: materialise(guide.id, entry),
      relatedLegacyIds: guide.relatedLegacyIds,
      sourceIds: entry.sourceIds ?? guide.sourceIds,
      reviewStatus: guide.reviewStatus,
      evidenceStatus: guide.evidenceStatus,
    };
    const note = entry.diagramNote === undefined ? guide.diagramNote : entry.diagramNote;
    if (note) next.diagramNote = note;
    const sourceNote = entry.sourceNote === undefined ? guide.sourceNote : entry.sourceNote;
    if (sourceNote) next.sourceNote = sourceNote;
    return next;
  });
  return { text: serialise(catalog) + '\n', authored: authored.size };
}

if (require.main === module) {
  const { text, authored } = build();
  if (process.argv.includes('--check')) {
    const current = fs.readFileSync(target, 'utf8');
    if (current !== text) {
      console.error('Composition: data/composition-guides.json is stale. Run node scripts/composition/build.cjs');
      process.exit(1);
    }
    console.log('PASS composition sources → JSON up to date (' + authored + ' authored entries)');
  } else {
    fs.writeFileSync(target, text);
    console.log('Wrote data/composition-guides.json (' + authored + ' authored entries)');
  }
}
module.exports = { build, loadEntries, materialise, serialise };
