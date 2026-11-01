// Check semantic direction and deliberate retirements in the knowledge graph.
// Executable standalone: node scripts/check-knowledge-graph.cjs
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const { URL } = require('node:url');
const root = path.join(__dirname, '..');
const actual = JSON.parse(fs.readFileSync(path.join(root, 'data/content-ideas.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/knowledge-baseline.json'), 'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'scripts/knowledge-provenance-baseline.json'), 'utf8'));
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const digest = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const directional = new Set(['application', 'example', 'foundation']);
const symmetric = new Set(['similar', 'contrast', 'complement']);
// Fail closed on malformed sources; provenance checks alone do not make URLs safe.
function safeSourceUrl(value) {
  if (typeof value !== 'string' || value.trim() !== value || /[\u0000-\u001F\u007F]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      !!url.hostname && url.hostname !== 'localhost' && !url.hostname.endsWith('.localhost');
  } catch { return false; }
}
function validateUnchecked(catalog) {
  const errors = [];
  const assert = (ok, message) => { if (!ok) errors.push(message); };
  const items = new Map(catalog.ideas.map(i => [i.id, i]));
  assert(catalog.ideas.length === 180 && items.size === 180, '180 unique IDs');
  const categoryIds = new Set(catalog.categories.map(category => category.id));
  assert(catalog.categories.length === 15 && categoryIds.size === 15, '15 unique categories');
  const expectedIds = new Set(Object.keys(baseline.ideas));
  assert([...expectedIds].every(id => items.has(id)) && [...items.keys()].every(id => expectedIds.has(id)),
    'idea set changed without baseline review');
  for (const category of catalog.categories) {
    assert(catalog.ideas.filter(item => item.categoryId === category.id).length === 12,
      'category must retain 12 ideas: ' + category.id);
  }
  assert(catalog.sourceCatalog && Object.keys(catalog.sourceCatalog).length >= 21, 'at least 21 source references preserved');
  assert(catalog.relationSemantics?.reviewStatus === 'draft_unreviewed', 'relations must retain draft status');
  assert(catalog.retiredRelations?.length === 2, 'exactly two documented retirements');
  const retired = new Set();
  for (const r of catalog.retiredRelations ?? []) {
    assert(r.ids?.length === 2 && r.status === 'removed_unreviewed' && r.reasonJa?.length > 24, 'retirement provenance required');
    if (r.ids?.length === 2) {
      const pair = [...r.ids].sort().join('|');
      retired.add(pair);
      assert(!items.get(r.ids[0])?.relatedIdeaIds.includes(r.ids[1]) &&
             !items.get(r.ids[1])?.relatedIdeaIds.includes(r.ids[0]), 'retired link still active: '+pair);
    }
  }
  assert(retired.size === 2, 'retirement records unique');
  const approved = new Set(['idea-components-03|idea-forms-02', 'idea-data-viz-07|idea-motion-07']);
  assert([...retired].every(pair => approved.has(pair)) && [...approved].every(pair => retired.has(pair)),
    'only the two documented weak links may be retired');
  const expectedPairs = new Set(baseline.relations.map(pair => [...pair].sort().join('|')));
  assert(expectedPairs.size === baseline.relations.length, 'baseline contains duplicate pairs');
  const allPairs = new Set();
  const directionalPairs = new Set();
  const typedPairs = new Set();
  for (const item of catalog.ideas) {
    assert(item.status === 'proposal' && item.editorial?.reviewStatus === 'draft_unreviewed' &&
           item.editorial?.evidenceStatus === 'not_checked', 'unreviewed editorial state: '+item.id);
    assert(categoryIds.has(item.categoryId) && item.id === 'idea-' + item.categoryId + '-' + String(item.sequence).padStart(2, '0'),
      'invalid category/sequence or ID: ' + item.id);
    const sourceIds = item.editorial?.sourceIds ?? [];
    assert(Array.isArray(sourceIds) && sourceIds.length === new Set(sourceIds).size, 'duplicate source IDs: ' + item.id);
    assert(item.editorial?.sourceStatus === (sourceIds.length ? 'partial' : 'not_checked') &&
      item.editorial?.sourceCoverage === (sourceIds.length ? 'partial' : 'not_checked'),
      'source coverage must remain partial or not_checked: ' + item.id);
    for (const sourceId of sourceIds) {
      assert(Object.hasOwn(catalog.sourceCatalog ?? {}, sourceId), 'unknown editorial source: ' + item.id + '/' + sourceId);
    }
    const ids = item.relatedIdeaIds;
    assert(ids.length === new Set(ids).size, 'duplicate links: '+item.id);
    const related = item.relations ?? [];
    assert(ids.length === related.length, 'every active link must have exactly one typed relation: '+item.id);
    assert(related.length === new Set(related.map(r => r.targetId)).size, 'duplicated typed target: '+item.id);
    for (const id of ids) {
      const pair = [item.id, id].sort().join('|');
      allPairs.add(pair);
      assert(id !== item.id && items.has(id), 'self or unknown related idea: ' + item.id + '/' + id);
      assert(items.get(id)?.relatedIdeaIds.includes(item.id), 'nonreciprocal link: '+item.id+'/'+id);
      assert(!retired.has(pair), 'removed pair was reintroduced: '+pair);
    }
    for (const rel of related) {
      const pair = [item.id, rel.targetId].sort().join('|');
      typedPairs.add(pair);
      assert(ids.includes(rel.targetId) && rel.reasonJa?.length >= 12, 'unlinked or unexplained relation: '+item.id);
      const reverse = items.get(rel.targetId)?.relations?.find(r => r.targetId === item.id);
      assert(reverse && reverse.type === rel.type && reverse.reasonJa === rel.reasonJa, 'type/reason mismatch: '+pair);
      if (directional.has(rel.type)) {
        directionalPairs.add(pair);
        assert(rel.fromId !== rel.toId && new Set([rel.fromId, rel.toId]).size === 2 &&
               [rel.fromId, rel.toId].every(id => id === item.id || id === rel.targetId),
               'invalid directed endpoints: '+pair);
        assert(rel.directionReviewStatus === 'draft_unreviewed', 'direction review flag missing: '+pair);
        assert(reverse?.fromId === rel.fromId && reverse?.toId === rel.toId &&
               reverse?.directionReviewStatus === rel.directionReviewStatus, 'reverse direction mismatch: '+pair);
      } else {
        assert(symmetric.has(rel.type), 'unknown type: '+rel.type);
        assert(!('fromId' in rel) && !('toId' in rel) && !('directionReviewStatus' in rel),
          'symmetric relation must not have directed endpoints: '+pair);
      }
    }
  }
  assert(allPairs.size === typedPairs.size, 'all active pairs typed');
  assert(allPairs.size === expectedPairs.size && [...allPairs].every(pair => expectedPairs.has(pair)) &&
         [...expectedPairs].every(pair => allPairs.has(pair)),
    'active graph differs from reviewed relation baseline; update baseline only after explicit review');
  assert(directionalPairs.size === provenance.directedCount, 'directed pair count differs from recorded candidate');
  const pairMap = new Map();
  for (const item of catalog.ideas) for (const rel of item.relations ?? []) {
    const pair = [item.id, rel.targetId].sort().join('|');
    if (!pairMap.has(pair)) pairMap.set(pair, {pair, type:rel.type, fromId:rel.fromId ?? null,
      toId:rel.toId ?? null, reasonJa:rel.reasonJa});
  }
  const records = [...pairMap.values()].sort((a, b) => a.pair.localeCompare(b.pair, 'en'));
  // Avoid locale-dependent ordering for stable cross-environment reproducibility.
  records.sort((a,b) => a.pair < b.pair ? -1 : a.pair > b.pair ? 1 : 0);
  const assignment = catalog.ideas.map(item => ({id:item.id, sourceIds:[...(item.editorial?.sourceIds ?? [])].sort()}))
    .sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  assert(pairMap.size === provenance.relationCount && digest(records) === provenance.relationDigest,
    'relation provenance changed without baseline review');
  assert(Object.keys(catalog.sourceCatalog ?? {}).length === provenance.sourceCatalogCount &&
    digest(catalog.sourceCatalog) === provenance.sourceCatalogDigest,
    'source catalog provenance changed without baseline review');
  assert(assignment.filter(item => item.sourceIds.length).length === provenance.sourcedIdeaCount &&
    digest(assignment) === provenance.sourceAssignmentsDigest,
    'source assignments provenance changed without baseline review');
  for (const [sourceId, source] of Object.entries(catalog.sourceCatalog ?? {})) {
    assert(Boolean(source.title && source.publisher && safeSourceUrl(source.url) &&
      /^\d{4}-\d{2}-\d{2}$/.test(source.checkedOn) && source.scope && source.rights),
      'invalid source metadata: ' + sourceId);
  }
  return {errors,summary:{ideas:items.size,activePairs:allPairs.size,directedPairs:directionalPairs.size,
    symmetricPairs:allPairs.size-directionalPairs.size,retiredPairs:retired.size}};
}
function validate(catalog) {
  try { return validateUnchecked(catalog); }
  catch (error) { return {errors: ['invalid catalog shape: ' + String(error?.message ?? error)], summary:null}; }
}
if (require.main === module) {
 const result = validate(actual);
 if (result.errors.length) { console.error(result.errors.join('\n')); process.exit(1); }
 console.log('PASS ' + JSON.stringify(result.summary));
}
module.exports = {validate, safeSourceUrl};
